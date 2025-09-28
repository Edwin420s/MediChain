import express from 'express';
import departmentController from '../controllers/departmentController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { validateDepartmentCreate } from '../utils/validator.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authMiddleware);

// Get all departments (accessible to all authenticated users)
router.get('/', departmentController.getDepartments);

// Department management (admin only)
router.post('/',
  roleMiddleware(['ADMIN', 'SUPER_ADMIN']),
  validateDepartmentCreate,
  departmentController.createDepartment
);

router.put('/:departmentId',
  roleMiddleware(['ADMIN', 'SUPER_ADMIN']),
  departmentController.updateDepartment
);

router.delete('/:departmentId',
  roleMiddleware(['SUPER_ADMIN']),
  departmentController.deleteDepartment
);

// Department statistics
router.get('/:departmentId/stats',
  departmentController.getDepartmentStats
);

// Department doctors
router.get('/:departmentId/doctors',
  departmentController.getDepartmentDoctors
);

export default router;