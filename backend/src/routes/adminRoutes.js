import express from 'express';
import adminController from '../controllers/adminController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { validateDepartmentCreate, validatePatientRegister } from '../utils/validator.js';

const router = express.Router();

// Apply authentication and admin role check
router.use(authMiddleware);
router.use(roleMiddleware(['ADMIN', 'SUPER_ADMIN']));

// System overview
router.get('/stats',
  adminController.getSystemStats
);

// Department management
router.get('/departments',
  adminController.getDepartments
);

router.post('/departments',
  validateDepartmentCreate,
  adminController.createDepartment
);

router.put('/departments/:departmentId',
  adminController.updateDepartment
);

// Doctor management
router.get('/doctors',
  adminController.getDoctors
);

router.post('/doctors/:doctorId/approve',
  adminController.approveDoctor
);

router.post('/doctors/:doctorId/reject',
  adminController.rejectDoctor
);

router.put('/doctors/:doctorId',
  adminController.updateDoctor
);

// Patient management
router.get('/patients',
  adminController.getPatients
);

router.post('/patients',
  validatePatientRegister,
  adminController.registerPatient
);

router.put('/patients/:patientId',
  adminController.updatePatient
);

// User management
router.get('/users',
  roleMiddleware(['SUPER_ADMIN']),
  adminController.getUsers
);

router.put('/users/:userId/role',
  roleMiddleware(['SUPER_ADMIN']),
  adminController.updateUserRole
);

// System logs
router.get('/system-logs',
  adminController.getSystemLogs
);

// Hedera management
router.get('/hedera-status',
  adminController.getHederaStatus
);

router.post('/hedera-topup',
  roleMiddleware(['SUPER_ADMIN']),
  adminController.topupHederaAccount
);

export default router;