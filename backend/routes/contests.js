import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getContests, getContestById, getContestSubmissions, getContestLeaderboard, getContestProblems, getContestParticipants, registerForContest } from '../controllers/contestController.js';

const router = express.Router();

router.get('/', authMiddleware, getContests);
router.get('/:id', authMiddleware, getContestById);
router.get('/:id/submissions', authMiddleware, getContestSubmissions);
router.get('/:id/leaderboard', authMiddleware, getContestLeaderboard);
router.get('/:id/problems', authMiddleware, getContestProblems);
router.get('/:id/participants', authMiddleware, getContestParticipants);
router.post('/:id/register', authMiddleware, registerForContest);

export default router;
