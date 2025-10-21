// src/pages/ContestDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../apiClient';
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
    <div className="site-wrap">
      <div className="site-container">
        <h2 className="text-2xl font-semibold mb-3">Contest</h2>
        {contest && (
          <div className="card mb-4">
            <div className="font-bold accent">{contest.contest_name}</div>
            <div className="muted">{new Date(contest.start_time).toLocaleString()} — {new Date(contest.end_time).toLocaleString()}</div>
            <div className="mt-2 muted">{contest.description}</div>
            <div className="mt-3">
              <button onClick={register} className="btn btn-primary">Register</button>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div className="card">
            <h3 className="font-semibold mb-2">Problems</h3>
            {problems.map(p => (
              <div key={p.problem_id} className="py-2 border-b">
                <div className="font-medium accent">{p.title}</div>
                <div className="muted">{p.difficulty} • {p.tags}</div>
              </div>
            ))}
          </div>

          <div className="card">
            <h3 className="font-semibold mb-2">Leaderboard</h3>
            <ol className="list-decimal pl-5">
              {leaderboard.map(row => (
                <li key={row.user_id} className="py-1">
                  {row.username} — {row.solved} solved
                </li>
              ))}
              {leaderboard.length === 0 && <div className="muted">No entries</div>}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
