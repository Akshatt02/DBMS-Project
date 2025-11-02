import React, { useEffect, useState, useContext } from 'react';
import api from '../api';
import AuthContext from '../context/AuthContext';

export default function Contests() {
  const { token } = useContext(AuthContext);
  const [contests, setContests] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.fetchContests(token);
        if (Array.isArray(data)) setContests(data);
        else console.warn('Unexpected response format:', data);
      } catch (e) {
        console.error('Failed to load contests:', e);
      }
    };
    if (token) load();
  }, [token]);


  const now = new Date();

  const categorize = (contest) => {
    const start = new Date(contest.start_time);
    const end = new Date(contest.end_time);
    if (now < start) return 'Upcoming';
    if (now > end) return 'Past';
    return 'Ongoing';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Contests</h1>
      {contests.length === 0 && <div>No contests found</div>}
      {contests.map(c => (
        <div key={c.id} className="card">
          <h2 className="text-xl">{c.title}</h2>
          <div className="text-sm text-gray-400">
            {c.department_name ? `${c.department_name} Department` : 'College-wide'}
          </div>
          <div className="mt-1">
            {new Date(c.start_time).toLocaleString()} → {new Date(c.end_time).toLocaleString()}
          </div>
          <div className="mt-2">
            <span className="badge">{categorize(c)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
