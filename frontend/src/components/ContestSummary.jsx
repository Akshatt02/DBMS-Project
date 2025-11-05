import React, { useEffect, useState } from 'react';
import api from '../api';

export default function ContestSummary({ contest, token }) {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [solversCount, setSolversCount] = useState(0);
  const [percentSolvers, setPercentSolvers] = useState(0);
  const [hardest, setHardest] = useState(null);
  const [easiest, setEasiest] = useState(null);

  useEffect(() => {
    if (!contest || !token) return;
    let mounted = true;
    setLoading(true);
    api.fetchContestSummary(token, contest.id)
      .then((res) => {
        if (!mounted) return;
        setSummary(res?.summary || []);
        setParticipantsCount(res?.participantsCount || 0);
        setSolversCount(res?.solversCount || 0);
        setPercentSolvers(res?.percent_solvers || 0);
        setHardest(res?.hardestProblem || null);
        setEasiest(res?.easiestProblem || null);
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
      <div className="mb-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-base-200 rounded">
          <div className="text-sm text-gray-500">Participants</div>
          <div className="text-xl font-medium">{participantsCount}</div>
        </div>
        <div className="p-3 bg-base-200 rounded">
          <div className="text-sm text-gray-500">Solved ≥1</div>
          <div className="text-xl font-medium">{solversCount} <span className="text-sm text-gray-500">({percentSolvers.toFixed(1)}%)</span></div>
        </div>
        <div className="p-3 bg-base-200 rounded">
          <div className="text-sm text-gray-500">Hardest / Easiest</div>
          <div className="text-sm">
            {hardest ? (<div className="font-medium">{hardest.problem_title} <span className="text-gray-500">({(hardest.success_rate*100).toFixed(1)}%)</span></div>) : <div className="text-gray-500">-</div>}
            {easiest ? (<div className="font-medium">{easiest.problem_title} <span className="text-gray-500">({(easiest.success_rate*100).toFixed(1)}%)</span></div>) : null}
          </div>
        </div>
      </div>

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
                <th className="px-3 py-2 text-center">Avg submissions to AC</th>
                <th className="px-3 py-2 text-center">Success Rate</th>
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
                  <td className="px-3 py-2 text-center">{s.avg_submissions_to_ac ? s.avg_submissions_to_ac.toFixed(2) : '-'}</td>
                  <td className="px-3 py-2 text-center">{(s.success_rate*100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
