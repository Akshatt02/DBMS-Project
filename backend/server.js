import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { pool } from './db/connection.js';

import { userRouter } from './routes/userRoutes.js';
import { problemRouter } from './routes/problemRoutes.js';
import { contestRouter } from './routes/contestRoutes.js';
import { submissionRouter } from './routes/submissionRoutes.js';
import { analyticsRouter } from './routes/analyticsRoutes.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

(async () => {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log('Connected to MySQL Database!');
  } catch (err) {
    console.error('MySQL connection failed:', err.message);
  }
})();

app.use('/api/users', userRouter);
app.use('/api/problems', problemRouter);
app.use('/api/contests', contestRouter);
app.use('/api/submissions', submissionRouter);
app.use('/api/analytics', analyticsRouter);

app.get('/', (req, res) => {
  res.send('CPMS Backend running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
