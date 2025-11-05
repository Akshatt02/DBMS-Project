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
  const [batchStats, setBatchStats] = useState([]);
  const [departmentStats, setDepartmentStats] = useState([]);
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
        setBatchStats(res.batchStats || []);
        setDepartmentStats(res.departmentStats || []);
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

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Batch-wise Summary</h3>
          <button
            className="btn btn-sm"
            onClick={async () => {
              try {
                const blob = await api.downloadAdminAnalytics(token);
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'admin_batch_stats.csv';
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
              } catch (err) {
                console.error(err);
                alert('Failed to download CSV');
              }
            }}
          >
            Download CSV
          </button>
        </div>
        {batchStats && batchStats.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Batch</th>
                  <th>Users</th>
                  <th>Highest Rating</th>
                  <th>Highest Solved</th>
                  <th>Avg Rating</th>
                  <th>Avg Solved</th>
                </tr>
              </thead>
              <tbody>
                {batchStats.map(b => (
                  <tr key={b.batch} className="hover:bg-gray-800/50">
                    <td className="py-2">{b.batch}</td>
                    <td>{b.users_count}</td>
                    <td>{b.highest_rating ?? 0}</td>
                    <td>{b.highest_solved ?? 0}</td>
                    <td>{Number(b.avg_rating || 0).toFixed(2)}</td>
                    <td>{Number(b.avg_solved || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-gray-500">No batch stats available</div>
        )}
      </div>
      
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Department-wise Summary</h3>
        </div>
        {departmentStats && departmentStats.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Department</th>
                  <th>Users</th>
                  <th>Highest Rating</th>
                  <th>Highest Solved</th>
                  <th>Avg Rating</th>
                  <th>Avg Solved</th>
                </tr>
              </thead>
              <tbody>
                {departmentStats.map(d => (
                  <tr key={d.department} className="hover:bg-gray-800/50">
                    <td className="py-2">{d.department}</td>
                    <td>{d.users_count}</td>
                    <td>{d.highest_rating ?? 0}</td>
                    <td>{d.highest_solved ?? 0}</td>
                    <td>{Number(d.avg_rating || 0).toFixed(2)}</td>
                    <td>{Number(d.avg_solved || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-gray-500">No department stats available</div>
        )}
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
