import prisma from '../config/db.js'
import hederaService from '../services/hederaService.js'
import ipfsService from '../services/ipfsService.js'

const patientController = {
  async getRecords(req, res) {
    try {
      const patientId = req.user.patient.id
      const records = await prisma.medicalRecord.findMany({
        where: { patientId },
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
        orderBy: { createdAt: 'desc' }
      })

      res.json(records)
    } catch (error) {
      console.error('Error fetching records:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  },

  async uploadRecord(req, res) {
    try {
      const patientId = req.user.patient.id
      const { title, description, recordType } = req.body
      const file = req.file

      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' })
      }

      // Upload to IPFS
      const ipfsResult = await ipfsService.uploadFile(file)
      if (!ipfsResult.success) {
        return res.status(500).json({ error: 'Failed to upload to IPFS' })
      }

      // Create record hash
      const recordHash = await hederaService.createRecordHash(file.buffer)

      // Store on Hedera
      const hederaResult = await hederaService.anchorRecord({
        patientDid: req.user.did,
        cid: ipfsResult.cid,
        recordHash,
        recordType
      })

      if (!hederaResult.success) {
        return res.status(500).json({ error: 'Failed to anchor record to Hedera' })
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
          hcsTxId: hederaResult.transactionId
        }
      })

      res.status(201).json({
        message: 'Record uploaded successfully',
        record
      })
    } catch (error) {
      console.error('Error uploading record:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  },

  async grantAccess(req, res) {
    try {
      const { recordId, doctorId, purpose, expiryDate } = req.body
      const patientId = req.user.patient.id

      // Verify record belongs to patient
      const record = await prisma.medicalRecord.findFirst({
        where: { id: recordId, patientId }
      })

      if (!record) {
        return res.status(404).json({ error: 'Record not found' })
      }

      // Create consent on Hedera
      const hederaResult = await hederaService.grantConsent({
        recordId: record.id,
        patientDid: req.user.did,
        doctorDid: doctorId,
        purpose,
        expiryDate
      })

      if (!hederaResult.success) {
        return res.status(500).json({ error: 'Failed to grant consent on Hedera' })
      }

      // Save consent to database
      const consent = await prisma.consent.create({
        data: {
          recordId,
          patientId,
          doctorId,
          purpose,
          expiryDate: new Date(expiryDate),
          hcsTxId: hederaResult.transactionId
        },
        include: {
          doctor: {
            include: {
              user: {
                select: { name: true, email: true }
              }
            }
          }
        }
      })

      res.status(201).json({
        message: 'Access granted successfully',
        consent
      })
    } catch (error) {
      console.error('Error granting access:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

export default patientController