import { pool } from '../db/connection.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const register = async (req, res) => {
    try {
        const { username, email, password, institution, bio, preferred_languages } = req.body;
        if (!username || !email || !password) return res.status(400).json({ message: 'Missing fields' });

        const hashed = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO users (username, email, password, institution, bio, preferred_languages) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await pool.execute(sql, [username, email, hashed, institution || null, bio || null, preferred_languages || null]);
        const userId = result.insertId;

        const token = jwt.sign({ user_id: userId, username, is_admin: 0 }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.json({ message: 'Registered', token });
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Username or email already exists' });
        res.status(500).json({ message: 'Registration failed' });
    }
};

export const login = async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;
        if (!usernameOrEmail || !password) return res.status(400).json({ message: 'Missing fields' });

        const sql = 'SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1';
        const [rows] = await pool.execute(sql, [usernameOrEmail, usernameOrEmail]);
        if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' });

        const user = rows[0];
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ user_id: user.user_id, username: user.username, is_admin: user.is_admin }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.json({ message: 'Logged in', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Login failed' });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT user_id, username, email, institution, rating, total_submissions, created_at FROM users');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};

export const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const [rows] = await pool.execute('SELECT user_id, username, email, institution, bio, preferred_languages, rating, total_submissions, created_at FROM users WHERE user_id = ?', [id]);
        if (!rows.length) return res.status(404).json({ message: 'User not found' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const id = req.params.id;
        const { institution, bio, preferred_languages } = req.body;
        if (Number(req.user.user_id) !== Number(id) && !req.user.is_admin) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        await pool.execute('UPDATE users SET institution = ?, bio = ?, preferred_languages = ? WHERE user_id = ?', [institution || null, bio || null, preferred_languages || null, id]);
        res.json({ message: 'Profile updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Update failed' });
    }
};

export const deleteAccount = async (req, res) => {
    try {
        const id = req.params.id;
        if (Number(req.user.user_id) !== Number(id) && !req.user.is_admin) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        await pool.execute('DELETE FROM users WHERE user_id = ?', [id]);
        res.json({ message: 'Account deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Delete failed' });
    }
};

export const getProfile = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const [uRows] = await pool.execute('SELECT user_id, username, email, institution, bio, preferred_languages, rating, total_submissions, created_at FROM users WHERE user_id = ?', [userId]);
        if (!uRows.length) return res.status(404).json({ message: 'User not found' });
        const user = uRows[0];

        const [accRows] = await pool.execute('SELECT COUNT(*) AS accepted_count, COUNT(DISTINCT problem_id) AS solved_count FROM submissions WHERE user_id = ? AND verdict = "Accepted"', [userId]);
        const accepted_count = accRows[0].accepted_count || 0;
        const solved_count = accRows[0].solved_count || 0;

        const total = user.total_submissions || 0;
        const accuracy = total > 0 ? (accepted_count / total) * 100 : 0;

    const [rankRows] = await pool.execute('SELECT COUNT(*) + 1 AS `user_rank` FROM users WHERE rating > ?', [user.rating]);
    const rank = rankRows[0]?.user_rank || 1;

        res.json({
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            institution: user.institution,
            bio: user.bio,
            preferred_languages: user.preferred_languages,
            rating: user.rating,
            total_submissions: total,
            accepted_count,
            solved_count,
            accuracy: Number(accuracy.toFixed(2)),
            rank,
            created_at: user.created_at
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch profile' });
    }
};
