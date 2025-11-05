import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../api';

export default function AdminAnalytics() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [batchFilter, setBatchFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const deps = await api.fetchDepartments();
        setDepartments(deps.map(d => d.name));

        const res = await api.fetchAdminAnalytics(token);
        setUsers(res.users || []);
        setFiltered(res.users || []);
        setStats(res.stats || {});
      } catch (err) {
        console.error(err);
        setError('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    if (token) load();
  }, [token]);

  useEffect(() => {
    let result = users;
    if (batchFilter !== 'all') result = result.filter(u => u.batch === batchFilter);
    if (deptFilter !== 'all') result = result.filter(u => u.department === deptFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    setFiltered(result);
  }, [users, batchFilter, deptFilter, search]);

  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  const batches = Array.from(new Set(users.map(u => u.batch))).sort();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Platform Analytics (Admin)</h2>
        <div className="flex gap-3">
          <div className="text-sm text-gray-400">
            Users: <strong className="text-white">{stats.users ?? 0}</strong>
            {' '}| Faculty: <strong className="text-white">{stats.faculty ?? 0}</strong>
            {' '}| Problems: <strong className="text-white">{stats.problems ?? 0}</strong>
            {' '}| Contests: <strong className="text-white">{stats.contests ?? 0}</strong>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <input type="text" placeholder="Search by name/email" value={search} onChange={e => setSearch(e.target.value)} className="input px-3 py-1 rounded bg-gray-800 text-white" />
        <select value={batchFilter} onChange={e => setBatchFilter(e.target.value)} className="input px-3 py-1 rounded bg-gray-800 text-white">
          <option value="all">All Batches</option>
          {batches.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="input px-3 py-1 rounded bg-gray-800 text-white">
          <option value="all">All Departments</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="card">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2">Name</th>
              <th>Department</th>
              <th>Batch</th>
              <th>Rating</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr
                key={u.id}
                onClick={() => navigate(`/profile/${u.id}`)}
                className="cursor-pointer hover:bg-gray-800/60 transition"
              >
                <td className="py-2">{u.name}</td>
                <td>{u.department || '—'}</td>
                <td>{u.batch}</td>
                <td className="font-semibold text-yellow-400">{u.rating}</td>
                <td className="text-gray-400">{u.email}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-gray-400 py-3">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
