import express from 'express';
import pool from '../config/db.js';
import { authenticateFaculty } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name FROM departments');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/department/:dept', authenticateFaculty, async (req, res) => {
  try {
    const dept = req.params.dept;
    console.log("Fetching users for department:", dept);
    const [rows] = await pool.query(
      `SELECT id, name, email, rating, batch
       FROM users
       WHERE department_id = ? AND role = 'user'`,
      [dept]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching department users' });
  }
});

export default router;
