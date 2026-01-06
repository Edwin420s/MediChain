import express from 'express';
import authController from '../controllers/authController.js';
import { validateLogin, validateRegister } from '../utils/validator.js';
import { authLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

// Public routes
router.post('/register', 
  authLimiter,
  validateRegister, 
  authController.register
);

router.post('/login', 
  authLimiter,
  validateLogin, 
  authController.login
);

router.post('/refresh-token', 
  authController.refreshToken
);

// TODO: Implement forgot-password and reset-password functionality
// router.post('/forgot-password',
//   authLimiter,
//   authController.forgotPassword
// );

// router.post('/reset-password',
//   authLimiter,
//   authController.resetPassword
// );

// Protected routes
router.get('/profile',
  authController.authenticate,
  authController.getProfile
);

router.put('/profile',
  authController.authenticate,
  authController.updateProfile
);

router.post('/change-password',
  authController.authenticate,
  authController.changePassword
);

router.post('/logout',
  authController.authenticate,
  authController.logout
);

// Admin only routes
// TODO: Implement getUsers and updateUserStatus functionality
// router.get('/users',
//   authController.authenticate,
//   authController.requireRole(['ADMIN', 'SUPER_ADMIN']),
//   authController.getUsers
// );

// router.put('/users/:userId/status',
//   authController.authenticate,
//   authController.requireRole(['ADMIN', 'SUPER_ADMIN']),
//   authController.updateUserStatus
// );

export default router;
