import { pool } from '../db/connection.js';

export const createContest = async (req, res) => {
  try {
    const { contest_name, start_time, end_time, description, contest_type } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO contests (contest_name, start_time, end_time, description, contest_type) VALUES (?, ?, ?, ?, ?)',
      [contest_name, start_time, end_time, description, contest_type || 'Individual']
    );
    res.json({ message: 'Contest created', contest_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Create contest failed' });
  }
};

export const getContests = async (req, res) => {
  try {
    const { status } = req.query;
    let sql = 'SELECT *, (CASE WHEN NOW() BETWEEN start_time AND end_time THEN "ongoing" WHEN NOW() < start_time THEN "upcoming" ELSE "past" END) as status FROM contests';
    const params = [];
    if (status) {
      sql += ' HAVING status = ?';
      params.push(status);
    }
    sql += ' ORDER BY start_time DESC';
    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch contests' });
  }
};

export const addProblemToContest = async (req, res) => {
  try {
    const contest_id = req.params.id;
    const { problem_id } = req.body;
    await pool.execute('INSERT INTO contest_problems (contest_id, problem_id) VALUES (?, ?)', [contest_id, problem_id]);
    res.json({ message: 'Problem added to contest' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add problem' });
  }
};

export const getContestProblems = async (req, res) => {
  try {
    const contest_id = req.params.id;
    const [rows] = await pool.execute(
      `SELECT p.* FROM problems p
       JOIN contest_problems cp ON p.problem_id = cp.problem_id
       WHERE cp.contest_id = ?`, [contest_id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed' });
  }
};

export const registerParticipant = async (req, res) => {
  try {
    const contest_id = req.params.id;
    const user_id = req.user.user_id;
    await pool.execute('INSERT INTO contest_participants (contest_id, user_id) VALUES (?, ?)', [contest_id, user_id]);
    res.json({ message: 'Registered for contest' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Already registered' });
    console.error(err);
    res.status(500).json({ message: 'Registration failed' });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const contest_id = req.params.id;
    const sql = `
      SELECT u.user_id, u.username, COUNT(DISTINCT s.problem_id) AS solved
      FROM users u
      LEFT JOIN submissions s ON u.user_id = s.user_id AND s.contest_id = ? AND s.verdict = 'Accepted'
      JOIN contest_participants cp ON cp.user_id = u.user_id AND cp.contest_id = ?
      GROUP BY u.user_id
      ORDER BY solved DESC
      LIMIT 100;
    `;
    const [rows] = await pool.execute(sql, [contest_id, contest_id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get leaderboard' });
  }
};
