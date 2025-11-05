import React, { useEffect, useState, useContext } from 'react';
import api from '../api';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function AdminContests() {
  const { token } = useContext(AuthContext);
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminContests = async () => {
      try {
        const res = await api.fetchAdminContests(token);
        setContests(res);
      } catch (err) {
        console.error('Failed to fetch admin contests:', err);
        setError('Failed to load contests');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchAdminContests();
  }, [token]);

  if (loading) return <p className="text-gray-400">Loading...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-white">All Contests (Admin)</h2>

      {contests.length === 0 ? (
        <p className="text-gray-400">No contests found.</p>
      ) : (
        <ul className="space-y-3">
          {contests.map((c) => (
            <li
              key={c.id}
              className="p-4 bg-gray-800 rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-medium text-white">{c.title}</h3>
                <p className="text-sm text-gray-400">
                  {new Date(c.start_time).toLocaleString()} →{' '}
                  {new Date(c.end_time).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-4">
                {new Date() <= new Date(c.end_time) ? (
                  <Link
                    to={`/admin/contest/${c.id}/edit`}
                    className="text-blue-400 hover:underline"
                  >
                    Edit
                  </Link>
                ) : (
                  <span className="text-gray-500">Edit (locked)</span>
                )}
                <Link
                  to={`/contests/${c.id}`}
                  className="text-green-400 hover:underline"
                >
                  View
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
