import express from 'express';
import { submitSolution, getSubmissionsByUser, getSubmissionsByProblem, getAllSubmissions } from '../controllers/submissionController.js';
import { authenticate } from '../middleware/auth.js';

export const submissionRouter = express.Router();

submissionRouter.post('/', authenticate, submitSolution);
submissionRouter.get('/user/:userId', authenticate, getSubmissionsByUser);
submissionRouter.get('/problem/:problemId', authenticate, getSubmissionsByProblem);
submissionRouter.get('/', authenticate, getAllSubmissions);
