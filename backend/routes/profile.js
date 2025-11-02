// routes/profileRoutes.js
import express from 'express';
import { getProfile } from '../controllers/profileController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', authMiddleware, getProfile);

export default router;
