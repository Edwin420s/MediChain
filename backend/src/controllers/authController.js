import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import { logger } from '../utils/logger.js';
import { Client, PrivateKey, AccountCreateTransaction, Hbar } from '@hashgraph/sdk';
import hederaConfig from '../config/hedera.js';

const authController = {
  async register(req, res) {
    try {
      const { email, password, name, role, specialization, department, licenseNumber } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'User with this email already exists'
        });
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create Hedera account for the user
      const hederaAccount = await createHederaAccount();
      if (!hederaAccount.success) {
        throw new Error('Failed to create Hedera account');
      }

      // Create user in database
      const userData = {
        email,
        password: hashedPassword,
        name,
        role,
        did: hederaAccount.did,
        publicKey: hederaAccount.publicKey,
        status: 'ACTIVE'
      };

      const user = await prisma.user.create({
        data: userData,
        include: {
          patient: true,
          doctor: true,
          admin: true
        }
      });

      // Create role-specific records
      if (role === 'PATIENT') {
        await prisma.patient.create({
          data: {
            userId: user.id,
            bloodType: null,
            allergies: null
          }
        });
      } else if (role === 'DOCTOR') {
        await prisma.doctor.create({
          data: {
            userId: user.id,
            licenseNumber: licenseNumber,
            specialization: specialization,
            departmentId: department,
            isVerified: false // Requires admin approval
          }
        });
      } else if (role === 'ADMIN') {
        await prisma.admin.create({
          data: {
            userId: user.id,
            level: 'DEPARTMENT',
            department: department
          }
        });
      }

      // Generate JWT token
      const token = generateToken(user.id);

      // Log registration
      logger.auditLog('USER_REGISTERED', user.id, {
        role: user.role,
        did: user.did
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          did: user.did
        },
        token,
        hederaAccount: {
          accountId: hederaAccount.accountId,
          privateKey: hederaAccount.privateKey // Only returned once during registration
        }
      });

    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: 'Registration failed. Please try again.'
      });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          patient: true,
          doctor: true,
          admin: true
        }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password'
        });
      }

      // Check if account is active
      if (user.status !== 'ACTIVE') {
        return res.status(401).json({
          success: false,
          error: 'Account is not active. Please contact support.'
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password'
        });
      }

      // Generate JWT token
      const token = generateToken(user.id);

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });

      // Log login
      logger.auditLog('USER_LOGIN', user.id, {
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          did: user.did,
          patient: user.patient,
          doctor: user.doctor,
          admin: user.admin
        },
        token
      });

    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Login failed. Please try again.'
      });
    }
  },

  async getProfile(req, res) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: {
          patient: true,
          doctor: {
            include: {
              department: true
            }
          },
          admin: true
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          did: true,
          createdAt: true,
          lastLoginAt: true,
          patient: true,
          doctor: true,
          admin: true
        }
      });

      res.json({
        success: true,
        user
      });

    } catch (error) {
      logger.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch profile'
      });
    }
  },

  async updateProfile(req, res) {
    try {
      const { name, bloodType, allergies, specialization } = req.body;
      const userId = req.user.id;

      const updateData = {};
      if (name) updateData.name = name;

      // Update user
      const user = await prisma.user.update({
        where: { id: userId },
        data: updateData
      });

      // Update role-specific data
      if (req.user.role === 'PATIENT' && (bloodType || allergies)) {
        await prisma.patient.update({
          where: { userId },
          data: {
            ...(bloodType && { bloodType }),
            ...(allergies && { allergies })
          }
        });
      } else if (req.user.role === 'DOCTOR' && specialization) {
        await prisma.doctor.update({
          where: { userId },
          data: { specialization }
        });
      }

      logger.auditLog('PROFILE_UPDATED', userId);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user
      });

    } catch (error) {
      logger.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update profile'
      });
    }
  },

  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      // Get user with password
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          error: 'Current password is incorrect'
        });
      }

      // Hash new password
      const saltRounds = 12;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword }
      });

      logger.securityLog('PASSWORD_CHANGED', userId);

      res.json({
        success: true,
        message: 'Password changed successfully'
      });

    } catch (error) {
      logger.error('Change password error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to change password'
      });
    }
  },

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          error: 'Refresh token required'
        });
      }

      // Verify refresh token (implementation depends on your refresh token strategy)
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid refresh token'
        });
      }

      // Generate new access token
      const newToken = generateToken(user.id);

      res.json({
        success: true,
        token: newToken
      });

    } catch (error) {
      logger.error('Refresh token error:', error);
      res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }
  },

  async logout(req, res) {
    try {
      // In a real implementation, you might want to blacklist the token
      logger.auditLog('USER_LOGOUT', req.user.id);
      
      res.json({
        success: true,
        message: 'Logout successful'
      });

    } catch (error) {
      logger.error('Logout error:', error);
      res.status(500).json({
        success: false,
        error: 'Logout failed'
      });
    }
  },

  // Middleware function for authentication
  authenticate(req, res, next) {
    // This is already handled by the authMiddleware
    next();
  },

  // Middleware function for role-based access
  requireRole(roles) {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: 'Insufficient permissions'
        });
      }
      next();
    };
  }
};

// Helper function to create Hedera account
async function createHederaAccount() {
  try {
    const client = hederaConfig.getClient();
    const privateKey = PrivateKey.generate();
    const publicKey = privateKey.publicKey;

    const transaction = await new AccountCreateTransaction()
      .setKey(publicKey)
      .setInitialBalance(new Hbar(10)) // 10 HBAR initial balance
      .execute(client);

    const receipt = await transaction.getReceipt(client);
    const accountId = receipt.accountId.toString();

    const did = `did:hedera:${hederaConfig.network}:${accountId}_0.0.1`;

    return {
      success: true,
      accountId,
      privateKey: privateKey.toString(),
      publicKey: publicKey.toString(),
      did
    };

  } catch (error) {
    logger.error('Hedera account creation error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Helper function to generate JWT token
function generateToken(userId) {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
}

export default authController;