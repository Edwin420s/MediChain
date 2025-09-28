import { logger } from '../utils/logger.js';

const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      // Check if user role is allowed
      if (!allowedRoles.includes(req.user.role)) {
        logger.warn('Unauthorized role access attempt', {
          userId: req.user.id,
          userRole: req.user.role,
          allowedRoles: allowedRoles,
          endpoint: req.originalUrl
        });

        return res.status(403).json({
          success: false,
          error: 'Insufficient permissions to access this resource'
        });
      }

      // For department admins, check if they have access to the department
      if (req.user.role === 'ADMIN' && req.user.admin) {
        const departmentId = req.params.departmentId || req.body.departmentId;
        
        if (departmentId && req.user.admin.department !== departmentId) {
          return res.status(403).json({
            success: false,
            error: 'Access restricted to your department only'
          });
        }
      }

      next();
    } catch (error) {
      logger.error('Role middleware error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };
};

// Special middleware for department-specific access
const departmentAccessMiddleware = (req, res, next) => {
  if (req.user.role === 'ADMIN' && req.user.admin) {
    // Department admins can only access their department's data
    req.departmentFilter = { departmentId: req.user.admin.department };
  }
  next();
};

// Middleware to check if user is verified (for doctors)
const verifiedDoctorMiddleware = (req, res, next) => {
  if (req.user.role === 'DOCTOR' && req.user.doctor && !req.user.doctor.isVerified) {
    return res.status(403).json({
      success: false,
      error: 'Doctor account not verified. Please wait for admin approval.'
    });
  }
  next();
};

export { roleMiddleware, departmentAccessMiddleware, verifiedDoctorMiddleware };
export default roleMiddleware;