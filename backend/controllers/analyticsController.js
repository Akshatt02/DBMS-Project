// controllers/analyticsController.js
import { pool } from '../db/connection.js';

/**
 * GET /api/analytics/problem/:id
 * Returns: total_submissions, total_ac, accuracy %
 */
export const getProblemStats = async (req, res) => {
  try {
    const problemId = req.params.id;
    const [rows] = await pool.execute('SELECT problem_id, title, total_submissions, total_ac FROM problems WHERE problem_id = ?', [problemId]);
    if (!rows.length) return res.status(404).json({ message: 'Problem not found' });
    const r = rows[0];
    const accuracy = r.total_submissions > 0 ? (r.total_ac / r.total_submissions) * 100 : 0;
    res.json({
      problem_id: r.problem_id,
      title: r.title,
      total_submissions: r.total_submissions,
      total_ac: r.total_ac,
      accuracy: Number(accuracy.toFixed(2))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed' });
  }
};

/**
 * GET /api/analytics/user/:id
 * Returns per-user stats (protected)
 */
export const getUserStats = async (req, res) => {
  try {
    const userId = req.params.id;
    // allow only self or admin
    if (Number(req.user.user_id) !== Number(userId) && !req.user.is_admin) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const [uRows] = await pool.execute('SELECT user_id, username, rating, total_submissions, created_at FROM users WHERE user_id = ?', [userId]);
    if (!uRows.length) return res.status(404).json({ message: 'User not found' });
    const user = uRows[0];

    const [accRows] = await pool.execute('SELECT COUNT(*) AS accepted_count, COUNT(DISTINCT problem_id) AS solved_count FROM submissions WHERE user_id = ? AND verdict = "Accepted"', [userId]);
    const accepted_count = accRows[0].accepted_count || 0;
    const solved_count = accRows[0].solved_count || 0;
    const total = user.total_submissions || 0;
    const accuracy = total > 0 ? (accepted_count / total) * 100 : 0;

    const [rankRows] = await pool.execute('SELECT COUNT(*) + 1 AS rank FROM users WHERE rating > ?', [user.rating]);
    const rank = rankRows[0].rank || 1;

    res.json({
      user_id: user.user_id,
      username: user.username,
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
    res.status(500).json({ message: 'Failed' });
  }
};

/**
 * GET /api/analytics/topic-performance/:userId
 * Returns an array of { tag, accepted_count, attempts } for the user.
 * Implementation note: we pull all distinct tags in JS then run a small query per tag using FIND_IN_SET.
 */
export const getTopicPerformance = async (req, res) => {
  try {
    const userId = req.params.userId;
    // allow only self or admin
    if (Number(req.user.user_id) !== Number(userId) && !req.user.is_admin) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // fetch all tags from problems
    const [pRows] = await pool.execute('SELECT DISTINCT tags FROM problems WHERE tags IS NOT NULL AND tags <> ""');
    const tagSet = new Set();
    pRows.forEach(r => {
      const tagStr = r.tags || '';
      tagStr.split(',').map(t => t.trim()).filter(Boolean).forEach(t => tagSet.add(t));
    });
    const tags = Array.from(tagSet);
    const results = [];

    // for each tag compute accepted_count and attempts for this user
    for (const tag of tags) {
      const [acc] = await pool.execute(
        `SELECT COUNT(*) AS accepted_count
         FROM submissions s
         JOIN problems p ON s.problem_id = p.problem_id
         WHERE s.user_id = ? AND s.verdict = 'Accepted' AND FIND_IN_SET(?, p.tags)`,
        [userId, tag]
      );
      const [att] = await pool.execute(
        `SELECT COUNT(*) AS attempts
         FROM submissions s
         JOIN problems p ON s.problem_id = p.problem_id
         WHERE s.user_id = ? AND FIND_IN_SET(?, p.tags)`,
        [userId, tag]
      );
      results.push({
        tag,
        accepted_count: acc[0].accepted_count || 0,
        attempts: att[0].attempts || 0,
        accuracy: (att[0].attempts || 0) > 0 ? Number(((acc[0].accepted_count || 0) / (att[0].attempts || 0) * 100).toFixed(2)) : 0
      });
    }

    res.json({ user_id: userId, topic_performance: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed' });
  }
};
