// src/pages/ContestDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';
import { getToken } from '../auth';

export default function ContestDetails() {
  const { id } = useParams();
  const [problems, setProblems] = useState([]);
  const [contest, setContest] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  const load = async () => {
    const c = await api(`/contests`);
    // find the contest locally
    const found = c.find(x => String(x.contest_id) === String(id));
    setContest(found || null);

    const p = await api(`/contests/${id}/problems`);
    setProblems(p);

    try {
      const token = getToken() || null;
      const board = await api(`/contests/${id}/leaderboard`, { token });
      setLeaderboard(board);
    } catch (e) {
      setLeaderboard([]);
    }
  };

  useEffect(() => { load(); }, [id]);

  const register = async () => {
    try {
      const token = getToken();
      await api(`/contests/${id}/register`, { method: 'POST', token });
      alert('Registered');
      load();
    } catch (e) {
      alert(e.message || 'Register failed');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-3">Contest</h2>
      {contest && (
        <div className="bg-white p-4 rounded mb-4">
          <div className="font-bold">{contest.contest_name}</div>
          <div className="text-sm text-gray-500">{new Date(contest.start_time).toLocaleString()} — {new Date(contest.end_time).toLocaleString()}</div>
          <div className="mt-2">{contest.description}</div>
          <div className="mt-3">
            <button onClick={register} className="bg-indigo-600 text-white px-3 py-1 rounded">Register</button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Problems</h3>
          {problems.map(p => (
            <div key={p.problem_id} className="py-2 border-b">
              <div className="font-medium text-indigo-600">{p.title}</div>
              <div className="text-sm text-gray-500">{p.difficulty} • {p.tags}</div>
            </div>
          ))}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Leaderboard</h3>
          <ol className="list-decimal pl-5">
            {leaderboard.map(row => (
              <li key={row.user_id} className="py-1">
                {row.username} — {row.solved} solved
              </li>
            ))}
            {leaderboard.length === 0 && <div className="text-gray-500">No entries</div>}
          </ol>
        </div>
      </div>
    </div>
  );
}
