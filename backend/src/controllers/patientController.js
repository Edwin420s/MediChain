import prisma from '../config/db.js';
import hederaService from '../services/hederaService.js';
import ipfsService from '../services/ipfsService.js';
import emailService from '../services/emailService.js';
import { logger } from '../utils/logger.js';

const patientController = {
  async getRecords(req, res) {
    try {
      const patientId = req.user.patient.id;
      const { page = 1, limit = 10, recordType } = req.query;

      const where = { patientId };
      if (recordType) {
        where.recordType = recordType;
      }

      const records = await prisma.medicalRecord.findMany({
        where,
        include: {
          consents: {
            include: {
              doctor: {
                include: {
                  user: {
                    select: { name: true, email: true }
                  }
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: parseInt(limit)
      });

      const total = await prisma.medicalRecord.count({ where });

      res.json({
        success: true,
        records,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });

    } catch (error) {
      logger.error('Get records error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch records'
      });
    }
  },

  async getRecord(req, res) {
    try {
      const { id } = req.params;
      const patientId = req.user.patient.id;

      const record = await prisma.medicalRecord.findFirst({
        where: {
          id,
          patientId
        },
        include: {
          consents: {
            include: {
              doctor: {
                include: {
                  user: {
                    select: { name: true, email: true }
                  }
                }
              }
            }
          }
        }
      });

      if (!record) {
        return res.status(404).json({
          success: false,
          error: 'Record not found'
        });
      }

      res.json({
        success: true,
        record
      });

    } catch (error) {
      logger.error('Get record error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch record'
      });
    }
  },

  async uploadRecord(req, res) {
    try {
      const patientId = req.user.patient.id;
      const { title, description, recordType } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
      }

      // Upload to IPFS
      const ipfsResult = await ipfsService.uploadFile(file);
      if (!ipfsResult.success) {
        return res.status(500).json({
          success: false,
          error: 'Failed to upload file to IPFS'
        });
      }

      // Create record hash
      const crypto = await import('crypto');
      const recordHash = crypto.createHash('sha256')
        .update(file.buffer)
        .digest('hex');

      // Anchor to Hedera
      const hederaResult = await hederaService.submitAuditMessage(
        process.env.HEDERA_RECORD_TOPIC,
        {
          event: 'record_created',
          patientDid: req.user.did,
          recordType,
          cid: ipfsResult.cid,
          recordHash,
          timestamp: new Date().toISOString()
        }
      );

      if (!hederaResult.success) {
        return res.status(500).json({
          success: false,
          error: 'Failed to anchor record to blockchain'
        });
      }

      // Save to database
      const record = await prisma.medicalRecord.create({
        data: {
          patientId,
          cid: ipfsResult.cid,
          recordHash,
          recordType,
          title,
          description,
          fileSize: file.size,
          mimeType: file.mimetype,
          hcsTxId: hederaResult.sequenceNumber?.toString()
        },
        include: {
          consents: true
        }
      });

      logger.auditLog('RECORD_UPLOADED', req.user.id, {
        recordId: record.id,
        recordType,
        fileSize: file.size
      });

      res.status(201).json({
        success: true,
        message: 'Record uploaded successfully',
        record
      });

    } catch (error) {
      logger.error('Upload record error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload record'
      });
    }
  },

  async deleteRecord(req, res) {
    try {
      const { id } = req.params;
      const patientId = req.user.patient.id;

      const record = await prisma.medicalRecord.findFirst({
        where: { id, patientId }
      });

      if (!record) {
        return res.status(404).json({
          success: false,
          error: 'Record not found'
        });
      }

      // Delete from database (IPFS data remains for audit purposes)
      await prisma.medicalRecord.delete({
        where: { id }
      });

      // Log deletion on Hedera
      await hederaService.submitAuditMessage(
        process.env.HEDERA_AUDIT_TOPIC,
        {
          event: 'record_deleted',
          patientDid: req.user.did,
          recordId: id,
          timestamp: new Date().toISOString()
        }
      );

      logger.auditLog('RECORD_DELETED', req.user.id, { recordId: id });

      res.json({
        success: true,
        message: 'Record deleted successfully'
      });

    } catch (error) {
      logger.error('Delete record error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete record'
      });
    }
  },

  async grantConsent(req, res) {
    try {
      const patientId = req.user.patient.id;
      const { doctorDid, recordIds, purpose, expiryDate } = req.body;

      // Find doctor by DID
      const doctor = await prisma.user.findFirst({
        where: { did: doctorDid, role: 'DOCTOR' },
        include: { doctor: true }
      });

      if (!doctor || !doctor.doctor) {
        return res.status(404).json({
          success: false,
          error: 'Doctor not found'
        });
      }

      // Verify records belong to patient
      const records = await prisma.medicalRecord.findMany({
        where: {
          id: { in: recordIds },
          patientId
        }
      });

      if (records.length !== recordIds.length) {
        return res.status(400).json({
          success: false,
          error: 'Some records not found or access denied'
        });
      }

      const consents = [];

      for (const recordId of recordIds) {
        const consent = await prisma.consent.create({
          data: {
            recordId,
            patientId,
            doctorId: doctor.doctor.id,
            purpose,
            expiryDate: new Date(expiryDate)
          },
          include: {
            record: true,
            doctor: {
              include: {
                user: {
                  select: { name: true, email: true }
                }
              }
            }
          }
        });

        // Anchor consent to Hedera
        await hederaService.submitAuditMessage(
          process.env.HEDERA_CONSENT_TOPIC,
          {
            event: 'consent_granted',
            patientDid: req.user.did,
            doctorDid,
            recordId,
            purpose,
            expiryDate,
            timestamp: new Date().toISOString()
          }
        );

        consents.push(consent);
      }

      // Notify doctor
      await emailService.sendAccessGrantedEmail(
        doctor.email,
        req.user.name
      );

      logger.auditLog('CONSENT_GRANTED', req.user.id, {
        doctorId: doctor.doctor.id,
        recordCount: recordIds.length
      });

      res.status(201).json({
        success: true,
        message: 'Consent granted successfully',
        consents
      });

    } catch (error) {
      logger.error('Grant consent error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to grant consent'
      });
    }
  },

  async revokeConsent(req, res) {
    try {
      const { consentId } = req.params;
      const patientId = req.user.patient.id;

      const consent = await prisma.consent.findFirst({
        where: {
          id: consentId,
          patientId
        },
        include: {
          doctor: {
            include: {
              user: true
            }
          }
        }
      });

      if (!consent) {
        return res.status(404).json({
          success: false,
          error: 'Consent not found'
        });
      }

      // Revoke consent
      await prisma.consent.update({
        where: { id: consentId },
        data: { isActive: false }
      });

      // Anchor revocation to Hedera
      await hederaService.submitAuditMessage(
        process.env.HEDERA_CONSENT_TOPIC,
        {
          event: 'consent_revoked',
          patientDid: req.user.did,
          doctorDid: consent.doctor.user.did,
          recordId: consent.recordId,
          timestamp: new Date().toISOString()
        }
      );

      logger.auditLog('CONSENT_REVOKED', req.user.id, { consentId });

      res.json({
        success: true,
        message: 'Consent revoked successfully'
      });

    } catch (error) {
      logger.error('Revoke consent error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to revoke consent'
      });
    }
  },

  async getConsents(req, res) {
    try {
      const patientId = req.user.patient.id;

      const consents = await prisma.consent.findMany({
        where: { patientId },
        include: {
          record: true,
          doctor: {
            include: {
              user: {
                select: { name: true, email: true, did: true }
              },
              department: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json({
        success: true,
        consents
      });

    } catch (error) {
      logger.error('Get consents error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch consents'
      });
    }
  },

  async getAccessRequests(req, res) {
    try {
      const patientId = req.user.patient.id;

      const requests = await prisma.accessRequest.findMany({
        where: { patientId },
        include: {
          doctor: {
            include: {
              user: {
                select: { name: true, email: true, did: true }
              },
              department: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json({
        success: true,
        requests
      });

    } catch (error) {
      logger.error('Get access requests error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch access requests'
      });
    }
  },

  async respondToAccessRequest(req, res) {
    try {
      const { requestId } = req.params;
      const { action } = req.body; // 'APPROVE' or 'DENY'
      const patientId = req.user.patient.id;

      const request = await prisma.accessRequest.findFirst({
        where: {
          id: requestId,
          patientId
        },
        include: {
          doctor: {
            include: {
              user: true
            }
          }
        }
      });

      if (!request) {
        return res.status(404).json({
          success: false,
          error: 'Access request not found'
        });
      }

      if (action === 'APPROVE') {
        // Create consent
        await prisma.consent.create({
          data: {
            recordId: request.recordId,
            patientId,
            doctorId: request.doctorId,
            purpose: request.purpose,
            expiryDate: request.expiresAt
          }
        });

        // Notify doctor
        await emailService.sendAccessGrantedEmail(
          request.doctor.user.email,
          req.user.name
        );
      }

      // Update request status
      await prisma.accessRequest.update({
        where: { id: requestId },
        data: { status: action === 'APPROVE' ? 'APPROVED' : 'DENIED' }
      });

      logger.auditLog('ACCESS_REQUEST_RESPONDED', req.user.id, {
        requestId,
        action
      });

      res.json({
        success: true,
        message: `Access request ${action.toLowerCase()}d successfully`
      });

    } catch (error) {
      logger.error('Respond to access request error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process access request'
      });
    }
  },

  async getAuditLogs(req, res) {
    try {
      const patientId = req.user.patient.id;
      const { page = 1, limit = 20 } = req.query;

      const logs = await prisma.auditLog.findMany({
        where: {
          OR: [
            { actorId: req.user.id },
            { targetId: patientId }
          ]
        },
        include: {
          actor: {
            select: { name: true, role: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: parseInt(limit)
      });

      const total = await prisma.auditLog.count({
        where: {
          OR: [
            { actorId: req.user.id },
            { targetId: patientId }
          ]
        }
      });

      res.json({
        success: true,
        logs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });

    } catch (error) {
      logger.error('Get audit logs error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch audit logs'
      });
    }
  },

  async generateEmergencyQR(req, res) {
    try {
      const patientId = req.user.patient.id;

      const patient = await prisma.patient.findUnique({
        where: { id: patientId },
        include: {
          user: {
            select: { name: true, did: true }
          }
        }
      });

      // Create emergency access token (valid for 24 hours)
      const emergencyToken = jwt.sign(
        {
          patientDid: patient.user.did,
          type: 'emergency',
          scope: ['basic_info', 'allergies', 'blood_type']
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Create QR code data
      const qrData = {
        token: emergencyToken,
        patientName: patient.user.name,
        timestamp: new Date().toISOString()
      };

      // Anchor emergency access to Hedera
      await hederaService.submitAuditMessage(
        process.env.HEDERA_AUDIT_TOPIC,
        {
          event: 'emergency_qr_generated',
          patientDid: patient.user.did,
          timestamp: new Date().toISOString()
        }
      );

      logger.auditLog('EMERGENCY_QR_GENERATED', req.user.id);

      res.json({
        success: true,
        qrData: Buffer.from(JSON.stringify(qrData)).toString('base64'),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      });

    } catch (error) {
      logger.error('Generate emergency QR error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate emergency QR code'
      });
    }
  },

  async getEmergencyInfo(req, res) {
    try {
      const patientId = req.user.patient.id;

      const patient = await prisma.patient.findUnique({
        where: { id: patientId },
        include: {
          user: {
            select: { name: true }
          }
        }
      });

      const emergencyInfo = {
        patientName: patient.user.name,
        bloodType: patient.bloodType,
        allergies: patient.allergies,
        emergencyContact: patient.emergencyContact,
        timestamp: new Date().toISOString()
      };

      res.json({
        success: true,
        emergencyInfo
      });

    } catch (error) {
      logger.error('Get emergency info error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch emergency information'
      });
    }
  }
};

export default patientController;