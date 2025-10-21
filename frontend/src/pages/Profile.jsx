// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { getToken } from '../auth';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [institution, setInstitution] = useState('');
  const [bio, setBio] = useState('');

  const load = async () => {
    try {
      const token = getToken();
      const p = await api('/users/me', { token });
      setProfile(p);
      setInstitution(p.institution || '');
      setBio(p.bio || '');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    const token = getToken();
    await api(`/users/${profile.user_id}`, { method: 'PUT', token, body: { institution, bio } });
    alert('Saved');
    load();
  };

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>No profile</div>;

  return (
    <div className="max-w-2xl bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-3">{profile.username}</h2>
      <div className="mb-3">Rating: <strong>{profile.rating}</strong> • Rank: <strong>{profile.rank}</strong></div>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-600">Institution</label>
          <input value={institution} onChange={e => setInstitution(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="text-sm text-gray-600">Bio</label>
          <input value={bio} onChange={e => setBio(e.target.value)} className="w-full border p-2 rounded" />
        </div>
      </div>
      <div className="mb-4">
        <div>Accepted: <strong>{profile.accepted_count}</strong> • Solved: <strong>{profile.solved_count}</strong> • Accuracy: <strong>{profile.accuracy}%</strong></div>
      </div>
      <button className="bg-indigo-600 text-white px-4 py-2 rounded" onClick={save}>Save</button>

      <div className="mt-6">
        <h3 className="font-semibold">Topic-wise performance</h3>
        <TopicPerformance userId={profile.user_id} />
      </div>
    </div>
  );
}

function TopicPerformance({ userId }) {
  const [data, setData] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const token = getToken();
        const res = await api(`/analytics/topic-performance/${userId}`, { token });
        setData(res.topic_performance || []);
      } catch (e) {
        setData([]);
      }
    })();
  }, [userId]);

  return (
    <div className="mt-3">
      {data.length === 0 && <div className="text-sm text-gray-500">No data</div>}
      {data.map(t => (
        <div key={t.tag} className="flex justify-between py-2 border-b">
          <div>{t.tag}</div>
          <div>{t.accepted_count}/{t.attempts} • {t.accuracy}%</div>
        </div>
      ))}
    </div>
  );
}
