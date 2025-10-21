import express from 'express';
import { register, login, getAllUsers, getUserById, updateProfile, deleteAccount, getProfile } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

export const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);

userRouter.get('/me', authenticate, getProfile);
userRouter.put('/me', authenticate, (req, res) => updateProfile({ ...req, params: { id: req.user.user_id } }, res));
userRouter.get('/', authenticate, getAllUsers);
userRouter.get('/:id', authenticate, getUserById);
userRouter.put('/:id', authenticate, updateProfile);
userRouter.delete('/:id', authenticate, deleteAccount);
