// src/pages/Contests.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../apiClient';

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
    <div className="site-wrap">
      <div className="site-container">
        <h2 className="text-2xl font-semibold mb-4">Contests</h2>
        <div className="mb-4 flex gap-2">
          <select value={status} onChange={e=>setStatus(e.target.value)} className="border p-2 rounded">
            <option value="">All</option>
            <option value="ongoing">Ongoing</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
          <button onClick={fetch} className="btn btn-primary">Apply</button>
        </div>

        <div className="space-y-3">
          {contests.map(c => (
            <div key={c.contest_id} className="card flex justify-between items-center">
              <div>
                <div className="font-semibold accent">{c.contest_name}</div>
                <div className="muted">{new Date(c.start_time).toLocaleString()} — {new Date(c.end_time).toLocaleString()}</div>
              </div>
              <div>
                <Link to={`/contests/${c.contest_id}`} className="btn btn-primary">Open</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
