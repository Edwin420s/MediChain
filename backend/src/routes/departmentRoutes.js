import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { createDepartment, getDepartments } from '../controllers/departmentController.js';

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['ADMIN']), createDepartment);
router.get('/', authMiddleware, getDepartments);

export default router;