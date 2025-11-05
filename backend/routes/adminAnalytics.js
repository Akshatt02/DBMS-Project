import express from 'express';
import { authenticateAdmin } from '../middleware/auth.js';
import { getAdminAnalytics } from '../controllers/adminAnalyticsController.js';

const router = express.Router();

router.get('/', authenticateAdmin, getAdminAnalytics);

export default router;
