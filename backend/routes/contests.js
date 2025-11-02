import express from 'express';
import { getContests } from '../controllers/contestController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, getContests);

export default router;
