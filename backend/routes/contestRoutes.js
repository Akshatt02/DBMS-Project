import express from 'express';
import { createContest, getContests, addProblemToContest, getContestProblems, registerParticipant, getLeaderboard } from '../controllers/contestController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

export const contestRouter = express.Router();

contestRouter.post('/', authenticate, requireAdmin, createContest);
contestRouter.get('/', getContests);
contestRouter.post('/:id/problems', authenticate, requireAdmin, addProblemToContest);
contestRouter.get('/:id/problems', getContestProblems);
contestRouter.post('/:id/register', authenticate, registerParticipant);
contestRouter.get('/:id/leaderboard', getLeaderboard);
