import express from 'express';
import { createProblem, getProblems, getProblemById, updateProblem, deleteProblem } from '../controllers/problemController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

export const problemRouter = express.Router();

problemRouter.post('/', authenticate, requireAdmin, createProblem);
problemRouter.get('/', getProblems);
problemRouter.get('/:id', getProblemById);
problemRouter.put('/:id', authenticate, requireAdmin, updateProblem);
problemRouter.delete('/:id', authenticate, requireAdmin, deleteProblem);
