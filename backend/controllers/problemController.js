import { pool } from '../db/connection.js';

export const createProblem = async (req, res) => {
    try {
        const { title, difficulty, tags, statement } = req.body;
        const sql = 'INSERT INTO problems (title, difficulty, tags, statement) VALUES (?, ?, ?, ?)';
        const [result] = await pool.execute(sql, [title, difficulty, tags, statement]);
        res.json({ message: 'Problem created', problem_id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create problem' });
    }
};

export const getProblems = async (req, res) => {
    try {
        const { tag, difficulty, sortBy, q } = req.query;
        let sql = 'SELECT * FROM problems WHERE 1=1';
        const params = [];
        if (difficulty) {
            sql += ' AND difficulty = ?';
            params.push(difficulty);
        }
        if (tag) {
            sql += ' AND FIND_IN_SET(?, tags)';
            params.push(tag);
        }
        if (q) {
            sql += ' AND (title LIKE ? OR statement LIKE ?)';
            params.push(`%${q}%`, `%${q}%`);
        }
        if (sortBy === 'popularity') sql += ' ORDER BY total_submissions DESC';
        else if (sortBy === 'accuracy') sql += ' ORDER BY (total_ac/NULLIF(total_submissions,0)) DESC';
        else sql += ' ORDER BY created_at DESC';
        const [rows] = await pool.execute(sql, params);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch problems' });
    }
};

export const getProblemById = async (req, res) => {
    try {
        const id = req.params.id;
        const [rows] = await pool.execute('SELECT * FROM problems WHERE problem_id = ?', [id]);
        if (!rows.length) return res.status(404).json({ message: 'Problem not found' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed' });
    }
};

export const updateProblem = async (req, res) => {
    try {
        const id = req.params.id;
        const { title, difficulty, tags, statement } = req.body;
        await pool.execute('UPDATE problems SET title=?, difficulty=?, tags=?, statement=? WHERE problem_id=?', [title, difficulty, tags, statement, id]);
        res.json({ message: 'Problem updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update' });
    }
};

export const deleteProblem = async (req, res) => {
    try {
        const id = req.params.id;
        await pool.execute('DELETE FROM problems WHERE problem_id = ?', [id]);
        res.json({ message: 'Problem deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Delete failed' });
    }
};
