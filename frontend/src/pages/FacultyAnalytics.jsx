// src/pages/FacultyAnalytics.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import AuthContext from '../context/AuthContext';

export default function FacultyAnalytics() {
  const { token, user } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
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
