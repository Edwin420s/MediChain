import prisma from '../config/db.js';
import hederaService from '../services/hederaService.js';
import { Client, PrivateKey, AccountCreateTransaction, Hbar } from '@hashgraph/sdk';

const adminController = {
  async createDepartment(req, res) {
    try {
      const { name, description } = req.body;
      const adminId = req.user.id;

      const department = await prisma.department.create({
        data: {
          name: name,
          description: description,
          createdBy: adminId
        }
      });

      // Log department creation on Hedera
      await hederaService.submitAuditMessage(process.env.HEDERA_AUDIT_TOPIC, {
        event: 'department_created',
        departmentId: department.id,
        name: name,
        adminDid: req.user.did,
        timestamp: new Date().toISOString()
      });

      res.status(201).json({
        message: 'Department created successfully',
        department: department
      });
    } catch (error) {
      console.error('Error creating department:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async approveDoctor(req, res) {
    try {
      const { doctorId } = req.params;
      const adminId = req.user.id;

      const doctor = await prisma.doctor.update({
        where: { id: doctorId },
        data: {
          isVerified: true,
          verifiedBy: adminId,
          verifiedAt: new Date()
        },
        include: {
          user: {
            select: { name: true, email: true, did: true }
          },
          department: true
        }
      });

      // Create Hedera account for doctor if doesn't exist
      if (!doctor.user.did) {
        const privateKey = PrivateKey.generate();
        const publicKey = privateKey.publicKey;

        const transaction = await new AccountCreateTransaction()
          .setKey(publicKey)
          .setInitialBalance(new Hbar(10)) // 10 HBAR
          .execute(hederaService.client);

        const receipt = await transaction.getReceipt(hederaService.client);
        const accountId = receipt.accountId.toString();

        // Update user with Hedera DID
        await prisma.user.update({
          where: { id: doctor.userId },
          data: {
            did: `did:hedera:testnet:${accountId}_0.0.1`,
            publicKey: publicKey.toString()
          }
        });

        // Store private key securely (in production, use KMS)
        console.log('Doctor private key:', privateKey.toString());
      }

      // Log approval on Hedera
      await hederaService.submitAuditMessage(process.env.HEDERA_AUDIT_TOPIC, {
        event: 'doctor_approved',
        doctorId: doctor.id,
        doctorDid: doctor.user.did,
        adminDid: req.user.did,
        timestamp: new Date().toISOString()
      });

      res.json({
        message: 'Doctor approved successfully',
        doctor: doctor
      });
    } catch (error) {
      console.error('Error approving doctor:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getSystemStats(req, res) {
    try {
      const [
        totalPatients,
        totalDoctors,
        totalRecords,
        pendingApprovals,
        departments
      ] = await Promise.all([
        prisma.patient.count(),
        prisma.doctor.count({ where: { isVerified: true } }),
        prisma.medicalRecord.count(),
        prisma.doctor.count({ where: { isVerified: false } }),
        prisma.department.findMany({
          include: {
            _count: {
              select: { doctors: true }
            }
          }
        })
      ]);

      res.json({
        stats: {
          totalPatients,
          totalDoctors,
          totalRecords,
          pendingApprovals,
          departments: departments.length
        },
        departments: departments.map(dept => ({
          id: dept.id,
          name: dept.name,
          doctorCount: dept._count.doctors
        }))
      });
    } catch (error) {
      console.error('Error fetching system stats:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async registerPatient(req, res) {
    try {
      const { name, email, dateOfBirth, bloodType, allergies } = req.body;
      const adminId = req.user.id;

      // Check if user exists
      let user = await prisma.user.findUnique({ where: { email } });
      
      if (!user) {
        // Create Hedera account for patient
        const privateKey = PrivateKey.generate();
        const publicKey = privateKey.publicKey;

        const transaction = await new AccountCreateTransaction()
          .setKey(publicKey)
          .setInitialBalance(new Hbar(10))
          .execute(hederaService.client);

        const receipt = await transaction.getReceipt(hederaService.client);
        const accountId = receipt.accountId.toString();

        user = await prisma.user.create({
          data: {
            email: email,
            name: name,
            role: 'PATIENT',
            did: `did:hedera:testnet:${accountId}_0.0.1`,
            publicKey: publicKey.toString()
          }
        });

        // Store private key securely
        console.log('Patient private key:', privateKey.toString());
      }

      // Create patient record
      const patient = await prisma.patient.create({
        data: {
          userId: user.id,
          dateOfBirth: new Date(dateOfBirth),
          bloodType: bloodType,
          allergies: allergies
        },
        include: {
          user: {
            select: { name: true, email: true, did: true }
          }
        }
      });

      // Log registration on Hedera
      await hederaService.submitAuditMessage(process.env.HEDERA_AUDIT_TOPIC, {
        event: 'patient_registered',
        patientId: patient.id,
        patientDid: user.did,
        adminDid: req.user.did,
        timestamp: new Date().toISOString()
      });

      res.status(201).json({
        message: 'Patient registered successfully',
        patient: patient
      });
    } catch (error) {
      console.error('Error registering patient:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export default adminController;