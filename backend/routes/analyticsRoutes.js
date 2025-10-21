// routes/analyticsRoutes.js
import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getProblemStats,
  getUserStats,
  getTopicPerformance
} from '../controllers/analyticsController.js';

export const analyticsRouter = express.Router();

// public problem stats
analyticsRouter.get('/problem/:id', getProblemStats);

// user stats (protected)
analyticsRouter.get('/user/:id', authenticate, getUserStats);

// topic-wise performance for a user (protected)
analyticsRouter.get('/topic-performance/:userId', authenticate, getTopicPerformance);
