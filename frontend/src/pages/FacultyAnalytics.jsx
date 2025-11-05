// src/pages/FacultyAnalytics.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import AuthContext from '../context/AuthContext';

export default function FacultyAnalytics() {
  const { token, user } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [batchStats, setBatchStats] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [batchFilter, setBatchFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.fetchDepartmentUsers(token, user.department_id);
        const sorted = res.sort((a, b) => b.rating - a.rating);
        setStudents(sorted);
        setFiltered(sorted);
        // fetch batch-wise aggregates for this department
        try {
          const bs = await api.fetchDepartmentBatchStats(token, user.department_id);
          setBatchStats(bs.batchStats || []);
        } catch (err) {
          console.warn('Failed to fetch department batch stats', err);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load department users');
      } finally {
        setLoading(false);
      }
    };

    if (token && user?.department_id) load();
  }, [token, user]);

  useEffect(() => {
    let result = students;

    if (batchFilter !== 'all') {
      result = result.filter(s => s.batch === batchFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        s =>
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
      );
    }

    setFiltered(result);
  }, [students, batchFilter, search]);

  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  const batches = Array.from(new Set(students.map(s => s.batch))).sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between">
        <h2 className="text-2xl font-bold">Department Analytics</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by name/email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input px-3 py-1 rounded bg-gray-800 text-white"
          />
          <select
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
            className="input px-3 py-1 rounded bg-gray-800 text-white"
          >
            <option value="all">All Batches</option>
            {batches.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Batch-wise Summary</h3>
          <button className="btn btn-sm" onClick={async () => {
            try {
              const blob = await api.downloadDepartmentBatchStats(token, user.department_id);
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `department_${user.department_id}_batch_stats.csv`;
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(url);
            } catch (err) {
              console.error(err);
              alert('Failed to download CSV');
            }
          }}>Download CSV</button>
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

      <div className="card">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2">Name</th>
              <th>Batch</th>
              <th>Rating</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr
                key={s.id}
                onClick={() => navigate(`/profile/${s.id}`)}
                className="cursor-pointer hover:bg-gray-800/60 transition"
              >
                <td className="py-2">{s.name}</td>
                <td>{s.batch}</td>
                <td className="font-semibold text-yellow-400">{s.rating}</td>
                <td className="text-gray-400">{s.email}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-gray-400 py-3">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
