import prisma from '../config/db.js';
import { logger } from '../utils/logger.js';

const departmentController = {
  async getDepartmentDoctors(req, res) {
    try {
      const departmentId = req.user.admin.departmentId;

      const doctors = await prisma.doctor.findMany({
        where: { departmentId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              did: true,
              createdAt: true
            }
          }
        }
      });

      res.json(doctors);
    } catch (error) {
      logger.error('Error fetching department doctors:', error);
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
            select: {
              name: true,
              email: true,
              did: true
            }
          }
        }
      });

      // TODO: Send approval notification

      res.json({
        message: 'Doctor approved successfully',
        doctor
      });
    } catch (error) {
      logger.error('Error approving doctor:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async rejectDoctor(req, res) {
    try {
      const { doctorId } = req.params;

      await prisma.doctor.delete({
        where: { id: doctorId }
      });

      // TODO: Send rejection notification

      res.json({ message: 'Doctor application rejected' });
    } catch (error) {
      logger.error('Error rejecting doctor:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getDepartmentStats(req, res) {
    try {
      const departmentId = req.user.admin.departmentId;

      const [doctorCount, patientCount, recordCount] = await Promise.all([
        prisma.doctor.count({ where: { departmentId, isVerified: true } }),
        prisma.patient.count(),
        prisma.medicalRecord.count()
      ]);

      res.json({
        doctorCount,
        patientCount,
        recordCount
      });
    } catch (error) {
      logger.error('Error fetching department stats:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export default departmentController;