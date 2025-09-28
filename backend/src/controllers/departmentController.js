import prisma from '../config/db.js';
import hederaService from '../services/hederaService.js';
import { logger } from '../utils/logger.js';

const departmentController = {
  async getDepartments(req, res) {
    try {
      const departments = await prisma.department.findMany({
        include: {
          _count: {
            select: {
              doctors: true
            }
          }
        },
        orderBy: { name: 'asc' }
      });

      res.json({
        success: true,
        departments: departments.map(dept => ({
          ...dept,
          doctorCount: dept._count.doctors
        }))
      });

    } catch (error) {
      logger.error('Get departments error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch departments'
      });
    }
  },

  async createDepartment(req, res) {
    try {
      const { name, description } = req.body;
      const adminId = req.user.id;

      // Check if department already exists
      const existingDept = await prisma.department.findUnique({
        where: { name }
      });

      if (existingDept) {
        return res.status(400).json({
          success: false,
          error: 'Department with this name already exists'
        });
      }

      const department = await prisma.department.create({
        data: {
          name,
          description,
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

      logger.auditLog('DEPARTMENT_CREATED', req.user.id, {
        departmentId: department.id,
        departmentName: name
      });

      res.status(201).json({
        success: true,
        message: 'Department created successfully',
        department
      });

    } catch (error) {
      logger.error('Create department error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create department'
      });
    }
  },

  async updateDepartment(req, res) {
    try {
      const { departmentId } = req.params;
      const { name, description } = req.body;

      const department = await prisma.department.findUnique({
        where: { id: departmentId }
      });

      if (!department) {
        return res.status(404).json({
          success: false,
          error: 'Department not found'
        });
      }

      const updatedDepartment = await prisma.department.update({
        where: { id: departmentId },
        data: {
          ...(name && { name }),
          ...(description && { description })
        }
      });

      logger.auditLog('DEPARTMENT_UPDATED', req.user.id, {
        departmentId,
        updates: { name, description }
      });

      res.json({
        success: true,
        message: 'Department updated successfully',
        department: updatedDepartment
      });

    } catch (error) {
      logger.error('Update department error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update department'
      });
    }
  },

  async deleteDepartment(req, res) {
    try {
      const { departmentId } = req.params;

      const department = await prisma.department.findUnique({
        where: { id: departmentId },
        include: {
          _count: {
            select: {
              doctors: true
            }
          }
        }
      });

      if (!department) {
        return res.status(404).json({
          success: false,
          error: 'Department not found'
        });
      }

      if (department._count.doctors > 0) {
        return res.status(400).json({
          success: false,
          error: 'Cannot delete department with assigned doctors'
        });
      }

      await prisma.department.delete({
        where: { id: departmentId }
      });

      logger.auditLog('DEPARTMENT_DELETED', req.user.id, { departmentId });

      res.json({
        success: true,
        message: 'Department deleted successfully'
      });

    } catch (error) {
      logger.error('Delete department error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete department'
      });
    }
  },

  async getDepartmentStats(req, res) {
    try {
      const { departmentId } = req.params;

      const stats = await prisma.department.findUnique({
        where: { id: departmentId },
        include: {
          _count: {
            select: {
              doctors: {
                where: { isVerified: true }
              }
            }
          },
          doctors: {
            include: {
              _count: {
                select: {
                  consents: {
                    where: {
                      isActive: true,
                      expiryDate: { gt: new Date() }
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (!stats) {
        return res.status(404).json({
          success: false,
          error: 'Department not found'
        });
      }

      const totalActiveConsents = stats.doctors.reduce(
        (sum, doctor) => sum + doctor._count.consents, 0
      );

      res.json({
        success: true,
        stats: {
          totalDoctors: stats._count.doctors,
          totalActiveConsents,
          createdAt: stats.createdAt
        }
      });

    } catch (error) {
      logger.error('Get department stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch department statistics'
      });
    }
  },

  async getDepartmentDoctors(req, res) {
    try {
      const { departmentId } = req.params;
      const { status = 'all' } = req.query;

      const where = { departmentId };
      if (status === 'verified') {
        where.isVerified = true;
      } else if (status === 'pending') {
        where.isVerified = false;
      }

      const doctors = await prisma.doctor.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              email: true,
              did: true,
              createdAt: true
            }
          },
          _count: {
            select: {
              consents: {
                where: {
                  isActive: true,
                  expiryDate: { gt: new Date() }
                }
              }
            }
          }
        },
        orderBy: {
          user: { name: 'asc' }
        }
      });

      res.json({
        success: true,
        doctors: doctors.map(doctor => ({
          ...doctor,
          activeConsents: doctor._count.consents
        }))
      });

    } catch (error) {
      logger.error('Get department doctors error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch department doctors'
      });
    }
  }
};

export default departmentController;