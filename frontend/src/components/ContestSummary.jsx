import React, { useEffect, useState } from 'react';
import api from '../api';

export default function ContestSummary({ contest, token }) {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!contest || !token) return;
    let mounted = true;
    setLoading(true);
    api.fetchContestSummary(token, contest.id)
      .then((res) => {
        if (!mounted) return;
        setSummary(res?.summary || []);
      })
      .catch((err) => setError(err?.message || 'Failed to load summary'))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [contest, token]);

  if (loading) return <div className="card p-4">Loading summary...</div>;
  if (error) return <div className="card p-4 text-red-500">{error}</div>;

  return (
    <div className="card p-4">
      <h3 className="text-lg font-semibold mb-3">Contest Summary</h3>
      {summary.length === 0 ? (
        <div className="text-gray-500">No problems or submissions yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-auto w-full">
            <thead className="bg-base-200">
              <tr>
                <th className="px-3 py-2 text-left">#</th>
                <th className="px-3 py-2 text-left">Problem</th>
                <th className="px-3 py-2 text-center">Submissions</th>
                <th className="px-3 py-2 text-center">AC</th>
                <th className="px-3 py-2 text-center">Unique Solvers</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((s, idx) => (
                <tr key={s.problem_id} className="border-t hover:bg-base-200/40">
                  <td className="px-3 py-2">{idx + 1}</td>
                  <td className="px-3 py-2">{s.problem_title}</td>
                  <td className="px-3 py-2 text-center">{Number(s.submissions) || 0}</td>
                  <td className="px-3 py-2 text-center">{Number(s.ac_count) || 0}</td>
                  <td className="px-3 py-2 text-center">{Number(s.unique_solvers) || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
