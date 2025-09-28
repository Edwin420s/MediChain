import express from 'express';
import patientController from '../controllers/patientController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { uploadLimiter } from '../middleware/rateLimit.js';
import multer from 'multer';
import { validateRecordUpload, validateConsent } from '../utils/validator.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// Apply authentication to all routes
router.use(authMiddleware);
router.use(roleMiddleware(['PATIENT']));

// Records management
router.get('/records', 
  patientController.getRecords
);

router.get('/records/:id',
  patientController.getRecord
);

router.post('/records',
  uploadLimiter,
  upload.single('file'),
  validateRecordUpload,
  patientController.uploadRecord
);

router.delete('/records/:id',
  patientController.deleteRecord
);

// Consent management
router.get('/consents',
  patientController.getConsents
);

router.post('/consent',
  validateConsent,
  patientController.grantConsent
);

router.put('/consent/:consentId',
  patientController.updateConsent
);

router.delete('/consent/:consentId',
  patientController.revokeConsent
);

// Access requests
router.get('/access-requests',
  patientController.getAccessRequests
);

router.put('/access-requests/:requestId',
  patientController.respondToAccessRequest
);

// Audit logs
router.get('/audit-logs',
  patientController.getAuditLogs
);

// Emergency access
router.post('/emergency-qr',
  patientController.generateEmergencyQR
);

router.get('/emergency-info',
  patientController.getEmergencyInfo
);

// Profile management
router.get('/profile',
  patientController.getPatientProfile
);

router.put('/profile',
  patientController.updatePatientProfile
);

export default router;