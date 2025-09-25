import prisma from '../config/db.js';
import hederaService from '../services/hederaService.js';
import ipfsService from '../services/ipfsService.js';

const doctorController = {
  async getPatientRecords(req, res) {
    try {
      const { patientDid } = req.params;
      const doctorId = req.user.doctor.id;

      // Verify consent for this doctor-patient relationship
      const consent = await prisma.consent.findFirst({
        where: {
          patient: { did: patientDid },
          doctorId: doctorId,
          isActive: true,
          expiryDate: { gt: new Date() }
        },
        include: {
          record: true
        }
      });

      if (!consent) {
        return res.status(403).json({ error: 'No valid consent found for this patient' });
      }

      const records = await prisma.medicalRecord.findMany({
        where: {
          patient: { did: patientDid },
          consents: {
            some: {
              doctorId: doctorId,
              isActive: true,
              expiryDate: { gt: new Date() }
            }
          }
        },
        include: {
          patient: {
            include: {
              user: {
                select: { name: true, did: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json(records);
    } catch (error) {
      console.error('Error fetching patient records:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async requestAccess(req, res) {
    try {
      const { patientDid, purpose, durationDays = 30 } = req.body;
      const doctorId = req.user.doctor.id;

      const patient = await prisma.patient.findFirst({
        where: { user: { did: patientDid } },
        include: { user: true }
      });

      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }

      // Create access request
      const accessRequest = await prisma.accessRequest.create({
        data: {
          patientId: patient.id,
          doctorId: doctorId,
          purpose: purpose,
          status: 'PENDING',
          expiresAt: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000)
        },
        include: {
          patient: {
            include: {
              user: {
                select: { name: true, did: true }
              }
            }
          },
          doctor: {
            include: {
              user: {
                select: { name: true, specialization: true }
              }
            }
          }
        }
      });

      // Log the request on Hedera
      await hederaService.submitAuditMessage(process.env.HEDERA_AUDIT_TOPIC, {
        event: 'access_requested',
        patientDid: patientDid,
        doctorDid: req.user.did,
        purpose: purpose,
        requestId: accessRequest.id,
        timestamp: new Date().toISOString()
      });

      // TODO: Send notification to patient

      res.status(201).json({
        message: 'Access request sent successfully',
        request: accessRequest
      });
    } catch (error) {
      console.error('Error requesting access:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async uploadRecord(req, res) {
    try {
      const { patientDid, title, description, recordType } = req.body;
      const file = req.file;
      const doctorId = req.user.doctor.id;

      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const patient = await prisma.patient.findFirst({
        where: { user: { did: patientDid } }
      });

      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }

      // Upload to IPFS
      const ipfsResult = await ipfsService.uploadFile(file);
      if (!ipfsResult.success) {
        return res.status(500).json({ error: 'Failed to upload to IPFS' });
      }

      // Create record hash
      const recordHash = require('crypto')
        .createHash('sha256')
        .update(file.buffer)
        .digest('hex');

      // Anchor to Hedera
      const hederaResult = await hederaService.submitAuditMessage(
        process.env.HEDERA_RECORD_TOPIC,
        {
          event: 'record_created',
          patientDid: patientDid,
          doctorDid: req.user.did,
          cid: ipfsResult.cid,
          recordHash: recordHash,
          recordType: recordType,
          timestamp: new Date().toISOString()
        }
      );

      // Save to database
      const record = await prisma.medicalRecord.create({
        data: {
          patientId: patient.id,
          cid: ipfsResult.cid,
          recordHash: recordHash,
          recordType: recordType,
          title: title,
          description: description,
          fileSize: file.size,
          mimeType: file.mimetype,
          uploadedBy: req.user.id,
          hcsTxId: hederaResult.sequenceNumber
        }
      });

      res.status(201).json({
        message: 'Record uploaded successfully',
        record: record
      });
    } catch (error) {
      console.error('Error uploading record:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export default doctorController;