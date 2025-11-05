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
        <h3 className="text-xl mb-3 font-semibold">Weak Topics</h3>
        {weak_topics.length === 0 && (
          <div className="text-gray-400">No weak topics yet</div>
        )}
        {weak_topics.map((t, i) => (
          <div key={i} className="flex justify-between border-b border-white/10 py-1">
            <span>{t.name}</span>
            <span className="text-red-400">{t.wrong_percent}% wrong</span>
          </div>
        ))}
      </div>
    </div>
  );
}
