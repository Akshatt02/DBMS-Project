import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import AuthContext from '../context/AuthContext';

export default function Profile() {
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = id ? await api.fetchProfileById(token, id) : await api.fetchProfile(token);
        setProfile(data);
      } catch (err) {
        setError(err?.message || 'Failed to load profile');
      }
    };
    if (token) load();
  }, [token, id]);

  if (error) return <div className="text-red-400">{error}</div>;
  if (!profile) return <div>Loading...</div>;

  const { user, stats, weak_topics } = profile;

  const difficultyCounts = profile.difficulty_counts || [];
  const tagCounts = profile.tag_counts || [];
  const contestsCount = profile.contests_count || 0;
  const contestHistory = profile.contest_history || [];
  // filter weak topics with >= 40% wrong rate
  const weakFiltered = (weak_topics || []).filter(t => Number(t.wrong_percent) >= 40);

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold">{user.name}</h2>
        <p className="text-gray-400">
          {user.department || 'General'} • Batch {user.batch || '-'}
        </p>
        <div className="mt-2">
          <span className="badge bg-yellow-400 text-black">
            Rating: {user.rating}
          </span>
          <span className="ml-3 badge">
            Role: {user.role}
          </span>
        </div>
      </div>

      <div className="card">
        <h3 className="text-xl mb-2 font-semibold">Submission Stats</h3>
        <div>Total Submissions: {stats.total}</div>
        <div>Accepted: {stats.ac}</div>
        <div>Accuracy: {stats.ac_percent}%</div>
      </div>

      <div className="card">
        <h3 className="text-xl mb-2 font-semibold">Difficulty Breakdown</h3>
        <div className="flex gap-4">
          {['easy','medium','hard'].map(d => {
            const row = difficultyCounts.find(r => (r.difficulty || '').toLowerCase() === d) || { attempted: 0, solved: 0 };
            return (
              <div key={d} className="p-3 bg-base-200 rounded">
                <div className="text-sm text-gray-400">{d.charAt(0).toUpperCase()+d.slice(1)}</div>
                <div className="text-lg font-medium">{row.attempted || 0} attempted</div>
                <div className="text-sm text-green-400">{row.solved || 0} solved</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <h3 className="text-xl mb-3 font-semibold">Weak Topics</h3>
        {weakFiltered.length === 0 ? (
          <div className="text-green-400">Great going — keep practicing!</div>
        ) : (
          <>
            <div className="text-sm text-yellow-300 mb-2">Focus on these tags to improve accuracy</div>
            {weakFiltered.map((t, i) => (
              <div key={i} className="flex justify-between border-b border-white/10 py-1">
                <span>{t.name}</span>
                <span className="text-red-400">{t.wrong_percent}% wrong</span>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="card">
        <h3 className="text-xl mb-2 font-semibold">Tag-wise Problem Counts</h3>
        {tagCounts.length === 0 ? (
          <div className="text-gray-400">No tag data available</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Tag</th>
                  <th>Attempted</th>
                  <th>Solved</th>
                </tr>
              </thead>
              <tbody>
                {tagCounts.map(t => (
                  <tr key={t.name} className="hover:bg-gray-800/40">
                    <td className="py-2">{t.name}</td>
                    <td>{t.attempted}</td>
                    <td>{t.solved}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Contests</h3>
          <div className="text-sm text-gray-400">Contests given</div>
          <div className="text-2xl font-bold">+{contestsCount}</div>
        </div>
        <div className="text-sm text-gray-400">Recent contests</div>
      </div>

      <div className="card">
        <h3 className="text-xl mb-2 font-semibold">Contest History</h3>
        {contestHistory.length === 0 ? (
          <div className="text-gray-400">No contest history</div>
        ) : (
          <div className="space-y-2">
            {contestHistory.map(c => (
              <div key={c.id} className="flex justify-between border-b border-white/10 py-2">
                <div>
                  <div className="font-medium">{c.title}</div>
                  <div className="text-sm text-gray-400">{new Date(c.start_time).toLocaleDateString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-green-400">Solved: {c.solved_count}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
