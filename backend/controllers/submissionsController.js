// src/controllers/submissionsController.js
import pool from '../config/db.js';

export const createSubmission = async (req, res) => {
    try {
        const { problem_id, contest_id = null, verdict } = req.body;
        const userId = req.user.id;
        if (!problem_id || !verdict) return res.status(400).json({ message: 'Missing fields' });

        // Basic validation: ensure problem exists
        const [pRows] = await pool.query('SELECT id FROM problems WHERE id = ?', [problem_id]);
        if (!pRows.length) return res.status(404).json({ message: 'Problem not found' });

        await pool.query(
            `INSERT INTO submissions (user_id, contest_id, problem_id, verdict) VALUES (?, ?, ?, ?)`,
            [userId, contest_id, problem_id, verdict]
        );
        return res.json({ message: 'Submission saved' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUserSubmissions = async (req, res) => {
    try {
        const userId = req.user.id;
        const [rows] = await pool.query(
            `SELECT s.*, p.title FROM submissions s JOIN problems p ON p.id = s.problem_id WHERE s.user_id = ? ORDER BY s.created_at DESC LIMIT 200`,
            [userId]
        );
        res.json({ data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
