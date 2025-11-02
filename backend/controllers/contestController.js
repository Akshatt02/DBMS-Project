import pool from '../config/db.js';

export const getContests = async (req, res) => {
  try {
    const { department_id } = req.user;
    const [rows] = await pool.query(
      `SELECT c.*, d.name AS department_name
       FROM contests c
       LEFT JOIN departments d ON c.department_id = d.id
       WHERE c.department_id IS NULL OR c.department_id = ?
       ORDER BY c.start_time DESC`,
      [department_id]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch contests' });
  }
};
