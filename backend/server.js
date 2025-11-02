import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/auth.js';
import problemsRoutes from './routes/problems.js';
import submissionsRoutes from './routes/submissions.js';
import contestRoutes from './routes/contests.js';
import profileRoutes from './routes/profile.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/problems', problemsRoutes);
app.use('/api/submissions', submissionsRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/profile', profileRoutes);

app.get('/', (req, res) => res.send({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
