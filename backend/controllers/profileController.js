// controllers/profileController.js
import pool from '../config/db.js';

export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        // Basic user info + department name
        const [[user]] = await pool.query(
            `SELECT u.id, u.name, u.email, u.batch, u.rating, u.role,
              d.name AS department
       FROM users u
       LEFT JOIN departments d ON u.department_id = d.id
       WHERE u.id = ?`,
            [userId]
        );

        if (!user) return res.status(404).json({ message: 'User not found' });

        // Count submissions and verdict distribution
        const [stats] = await pool.query(
            `SELECT verdict, COUNT(*) AS count 
       FROM submissions 
       WHERE user_id = ? 
       GROUP BY verdict`,
            [userId]
        );

        const total = stats.reduce((a, s) => a + s.count, 0);
        const ac = stats.find(s => s.verdict === 'AC')?.count || 0;
        const ac_percent = total ? ((ac / total) * 100).toFixed(1) : 0;

        // Weak topics: most wrong submissions by tag
        const [weakTopics] = await pool.query(
            `SELECT t.name, 
              SUM(CASE WHEN s.verdict != 'AC' THEN 1 ELSE 0 END) AS wrong_count,
              COUNT(*) AS total_subs,
              ROUND(SUM(CASE WHEN s.verdict != 'AC' THEN 1 ELSE 0 END)/COUNT(*)*100, 1) AS wrong_percent
       FROM submissions s
       JOIN problems p ON s.problem_id = p.id
       JOIN problem_tags pt ON p.id = pt.problem_id
       JOIN tags t ON pt.tag_id = t.id
       WHERE s.user_id = ?
       GROUP BY t.id
       HAVING total_subs >= 2
       ORDER BY wrong_percent DESC
       LIMIT 5`,
            [userId]
        );

        res.json({
            user,
            stats: { total, ac, ac_percent },
            weak_topics: weakTopics,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to load profile' });
    }
};
