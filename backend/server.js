import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { pool } from './db/connection.js';
import bcrypt from 'bcryptjs';

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
    try {
      const adminUser = process.env.ADMIN_USERNAME;
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;
      const [rows] = await pool.execute('SELECT user_id FROM users WHERE username = ? OR email = ? LIMIT 1', [adminUser, adminEmail]);
      if (!rows.length) {
        const hashed = await bcrypt.hash(adminPassword, 10);
        await pool.execute('INSERT INTO users (username, email, password, institution, rating, is_admin) VALUES (?, ?, ?, ?, ?, ?)', [adminUser, adminEmail, hashed, process.env.ADMIN_INSTITUTION || null, 2000, 1]);
        console.log('Admin user created:', adminUser);
      } else {
        console.log('Admin user already exists');
      }
    } catch (err) {
      console.error('Failed to ensure admin user exists:', err.message);
    }
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
