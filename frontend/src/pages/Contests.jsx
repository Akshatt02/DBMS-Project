// src/pages/Contests.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export default function Contests() {
  const [contests, setContests] = useState([]);
  const [status, setStatus] = useState('');

  const fetch = async () => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    const rows = await api(`/contests?${params.toString()}`);
    setContests(rows);
  };

  useEffect(() => { fetch(); }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Contests</h2>
      <div className="mb-4 flex gap-2">
        <select value={status} onChange={e=>setStatus(e.target.value)} className="border p-2 rounded">
          <option value="">All</option>
          <option value="ongoing">Ongoing</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>
        <button onClick={fetch} className="bg-indigo-600 text-white px-3 py-2 rounded">Apply</button>
      </div>

      <div className="space-y-3">
        {contests.map(c => (
          <div key={c.contest_id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold text-indigo-600">{c.contest_name}</div>
              <div className="text-sm text-gray-500">{new Date(c.start_time).toLocaleString()} — {new Date(c.end_time).toLocaleString()}</div>
            </div>
            <div>
              <Link to={`/contests/${c.contest_id}`} className="bg-indigo-600 text-white px-3 py-1 rounded">Open</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
