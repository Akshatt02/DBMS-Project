import express from 'express';
import { register, login, getAllUsers, getUserById, updateProfile, deleteAccount, getProfile } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

export const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);

userRouter.get('/me', authenticate, getProfile);
userRouter.put('/me', authenticate, (req, res) => {r
	req.params = req.params || {};
	req.params.id = req.user.user_id;
	return updateProfile(req, res);
});
userRouter.get('/', authenticate, getAllUsers);
userRouter.get('/:id', authenticate, getUserById);
userRouter.put('/:id', authenticate, updateProfile);
userRouter.delete('/:id', authenticate, deleteAccount);
