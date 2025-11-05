import pool from '../config/db.js';

/** GET /api/admin/analytics
 * Query params: batch (optional), department (optional), search (optional)
 * Returns: { users: [...], stats: {...} }
 */
export const getAdminAnalytics = async (req, res) => {
  try {
    const { batch, department, search } = req.query;

    let sql = `SELECT u.id, u.name, u.email, u.rating, u.batch, d.name AS department
               FROM users u
               LEFT JOIN departments d ON u.department_id = d.id
               WHERE u.role = 'user'`;
    const params = [];

    if (batch) {
      sql += ' AND u.batch = ?';
      params.push(batch);
    }
    if (department) {
      sql += ' AND d.name = ?';
      params.push(department);
    }
    if (search) {
      sql += ' AND (u.name LIKE ? OR u.email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY u.rating DESC LIMIT 1000';

    const [users] = await pool.query(sql, params);

    // stats
    const [[totalUsers]] = await pool.query("SELECT COUNT(*) AS count FROM users WHERE role = 'user'");
    const [[totalFaculty]] = await pool.query("SELECT COUNT(*) AS count FROM users WHERE role = 'faculty'");
    const [[totalAdmins]] = await pool.query("SELECT COUNT(*) AS count FROM users WHERE role = 'admin'");
    const [[totalProblems]] = await pool.query('SELECT COUNT(*) AS count FROM problems');
    const [[totalContests]] = await pool.query('SELECT COUNT(*) AS count FROM contests');
    const [[totalSubmissions]] = await pool.query('SELECT COUNT(*) AS count FROM submissions');

    const stats = {
      users: totalUsers.count,
      faculty: totalFaculty.count,
      admins: totalAdmins.count,
      problems: totalProblems.count,
      contests: totalContests.count,
      submissions: totalSubmissions.count,
    };

    res.json({ users, stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
};
