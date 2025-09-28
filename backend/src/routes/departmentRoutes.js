import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import departmentController from '../controllers/departmentController.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get department doctors
router.get('/doctors', 
  roleMiddleware(['ADMIN']), 
  departmentController.getDepartmentDoctors
);

// Approve doctor
router.post('/doctors/:doctorId/approve',
  roleMiddleware(['ADMIN']),
  departmentController.approveDoctor
);

// Reject doctor
router.post('/doctors/:doctorId/reject',
  roleMiddleware(['ADMIN']),
  departmentController.rejectDoctor
);

// Get department stats
router.get('/stats',
  roleMiddleware(['ADMIN']),
  departmentController.getDepartmentStats
);

export default router;