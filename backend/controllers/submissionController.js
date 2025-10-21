import { pool } from '../db/connection.js';

export const submitSolution = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const { problem_id, contest_id = null, language, verdict = 'Wrong Answer', runtime = null, score = 0 } = req.body;
        const user_id = req.user.user_id;
        await conn.beginTransaction();

        const [ins] = await conn.execute(
            `INSERT INTO submissions (user_id, problem_id, contest_id, verdict, language, runtime, score)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [user_id, problem_id, contest_id, verdict, language, runtime, score]
        );
        await conn.execute('UPDATE problems SET total_submissions = total_submissions + 1 WHERE problem_id = ?', [problem_id]);
        if (verdict === 'Accepted') {
            await conn.execute('UPDATE problems SET total_ac = total_ac + 1 WHERE problem_id = ?', [problem_id]);
        }
        await conn.execute('UPDATE users SET total_submissions = total_submissions + 1 WHERE user_id = ?', [user_id]);
        await conn.commit();
        res.json({ message: 'Submission recorded', submission_id: ins.insertId });
    } catch (err) {
        await conn.rollback();
        console.error(err);
        res.status(500).json({ message: 'Submission failed' });
    } finally {
        conn.release();
    }
};

export const getSubmissionsByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (Number(req.user.user_id) !== Number(userId) && !req.user.is_admin) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const [rows] = await pool.execute('SELECT * FROM submissions WHERE user_id = ? ORDER BY submitted_at DESC', [userId]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch' });
    }
};

export const getSubmissionsByProblem = async (req, res) => {
    try {
        const problemId = req.params.problemId;
        const [rows] = await pool.execute('SELECT s.*, u.username FROM submissions s LEFT JOIN users u ON s.user_id = u.user_id WHERE problem_id = ? ORDER BY submitted_at DESC', [problemId]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch' });
    }
};

export const getAllSubmissions = async (req, res) => {
    try {
        if (!req.user.is_admin) return res.status(403).json({ message: 'Admin only' });
        const [rows] = await pool.execute('SELECT s.*, u.username, p.title FROM submissions s LEFT JOIN users u ON s.user_id = u.user_id LEFT JOIN problems p ON s.problem_id = p.problem_id ORDER BY submitted_at DESC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed' });
    }
};
