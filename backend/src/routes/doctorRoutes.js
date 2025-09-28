import express from 'express';
import doctorController from '../controllers/doctorController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { uploadLimiter } from '../middleware/rateLimit.js';
import multer from 'multer';
import { validateAccessRequest } from '../utils/validator.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Apply authentication and role check
router.use(authMiddleware);
router.use(roleMiddleware(['DOCTOR']));

// Patient management
router.get('/patients',
  doctorController.getPatients
);

router.get('/patients/:patientDid',
  doctorController.getPatientProfile
);

router.get('/patients/:patientDid/records',
  doctorController.getPatientRecords
);

// Access requests
router.post('/access-requests',
  validateAccessRequest,
  doctorController.requestAccess
);

router.get('/access-requests',
  doctorController.getAccessRequests
);

// Record management
router.post('/records',
  uploadLimiter,
  upload.single('file'),
  doctorController.uploadRecord
);

// Consent management
router.get('/consents',
  doctorController.getConsents
);

// Audit logs
router.get('/audit-logs',
  doctorController.getAuditLogs
);

// Dashboard stats
router.get('/dashboard',
  doctorController.getDashboardStats
);

// Profile management
router.get('/profile',
  doctorController.getDoctorProfile
);

router.put('/profile',
  doctorController.updateDoctorProfile
);

export default router;