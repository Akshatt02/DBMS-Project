import React, { useEffect, useState } from 'react';
import api from '../api';

export default function ContestLeaderboard({ contest, token }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.fetchContestLeaderboard(token, contest.id);
        setRows(data.leaderboard || []);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [contest.id]);

  return (
    <div className="card">
      <h3 className="text-lg mb-2">Leaderboard</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th>Rank</th><th>User</th><th>Solved</th><th>Penalty</th><th>Time Sum (min)</th><th>Wrong Before</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.user_id}>
                <td>{r.rank}</td>
                <td>{r.user_name}</td>
                <td>{r.solved_count}</td>
                <td>{r.penalty}</td>
                <td>{r.time_sum_minutes}</td>
                <td>{r.wrong_before_total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
