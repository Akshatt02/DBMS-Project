import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
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
      <div className="grid gap-4">
        {contests.map(c => (
          <div key={c.id} className="card p-4 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">{c.title}</h2>
              <div className="text-sm text-gray-400">
                {c.department_name ? `${c.department_name} Department` : 'College-wide'}
              </div>
              <div className="mt-1 text-sm">
                {new Date(c.start_time).toLocaleString()} → {new Date(c.end_time).toLocaleString()}
              </div>
              <div className="mt-2">
                <span className="badge mr-2">{categorize(c)}</span>
              </div>
            </div>

            <div className="mt-4 md:mt-0 flex gap-2 items-center">
              {/* main contest page */}
              <Link
                to={`/contests/${c.id}`}
                className="btn btn-primary"
                aria-label={`Open contest ${c.title}`}
              >
                View Contest
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
