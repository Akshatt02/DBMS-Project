import React, { useEffect, useState } from 'react';
import api from '../api';

export default function ContestSubmissions({ contest, token }) {
  const [submissions, setSubmissions] = useState([]);
  const [filters, setFilters] = useState({
    user_name: '',
    verdict: '',
    problem_title: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      // API should accept `user_name`, `verdict`, `problem_title` as query params
      const data = await api.fetchContestSubmissions(token, contest.id, filters);
      setSubmissions(data.submissions || []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && contest?.id) load();
  }, [token, contest?.id]);

  const apply = async (e) => {
    e?.preventDefault();
    await load();
  };

  const reset = async () => {
    setFilters({ user_name: '', verdict: '', problem_title: '' });
    await load();
  };

  return (
    <div className="card">
      <h3 className="text-lg mb-2 font-semibold">Submissions (inside contest time only)</h3>

      <form onSubmit={apply} className="flex flex-wrap gap-2 items-end mb-4">
        <input
          placeholder="Search by user name"
          value={filters.user_name}
          onChange={e => setFilters({ ...filters, user_name: e.target.value })}
          className="p-2 rounded border bg-gray-900 text-white"
        />
        <select
          value={filters.verdict}
          onChange={e => setFilters({ ...filters, verdict: e.target.value })}
          className="p-2 rounded border bg-gray-900 text-white"
        >
          <option value="">All verdicts</option>
          <option value="AC">AC</option>
          <option value="WA">WA</option>
          <option value="TLE">TLE</option>
          <option value="RE">RE</option>
          <option value="CE">CE</option>
        </select>
        <input
          placeholder="Search by problem title"
          value={filters.problem_title}
          onChange={e => setFilters({ ...filters, problem_title: e.target.value })}
          className="p-2 rounded border bg-gray-900 text-white"
        />

        <button className="btn btn-primary" type="submit">Filter</button>
        <button type="button" className="btn" onClick={reset}>Reset</button>
      </form>

      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading && <div>Loading submissions...</div>}

      {!loading && submissions.length === 0 && (
        <div className="text-gray-400">No submissions found.</div>
      )}

      {!loading && submissions.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="py-2 px-3">#</th>
                <th className="py-2 px-3">User</th>
                <th className="py-2 px-3">Problem</th>
                <th className="py-2 px-3">Verdict</th>
                <th className="py-2 px-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s, idx) => (
                <tr key={s.id} className="border-b border-gray-800 hover:bg-gray-900">
                  <td className="py-2 px-3 text-gray-400">{idx + 1}</td>
                  <td className="py-2 px-3">{s.user_name}</td>
                  <td className="py-2 px-3">{s.problem_title}</td>
                  <td className="py-2 px-3 font-semibold">{s.verdict}</td>
                  <td className="py-2 px-3">{new Date(s.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
