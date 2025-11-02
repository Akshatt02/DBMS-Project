import pool from '../config/db.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
    try {
        const { name, email, password, role = 'user', department_id = null, batch = null } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ message: 'Missing fields' });

        const [exists] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (exists.length)
            return res.status(400).json({ message: 'Email already registered' });

        // No hashing here (for testing only)
        const [result] = await pool.query(
            `INSERT INTO users (name, email, password, role, department_id, batch) VALUES (?, ?, ?, ?, ?, ?)`,
            [name, email, password, role, department_id, batch]
        );

        const userId = result.insertId;
        const token = jwt.sign(
            { id: userId, role, email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: { id: userId, name, email, role, department_id, batch, rating: 1000 },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: 'Missing fields' });

        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (!rows.length)
            return res.status(400).json({ message: 'Invalid credentials' });

        const user = rows[0];

        if (user.password !== password)
            return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email, department_id: user.department_id },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                department_id: user.department_id,
                rating: user.rating,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
