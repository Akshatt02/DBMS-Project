import React, { useEffect, useState, useContext } from 'react';
import api from '../api';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function FacultyMyContests() {
  const { token } = useContext(AuthContext);
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const res = await api.fetchFacultyContests(token);
        setContests(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, [token]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-white">My Created Contests</h2>
      {contests.length === 0 ? (
        <p className="text-gray-400">No contests created yet.</p>
      ) : (
        <ul className="space-y-3">
          {contests.map(c => (
            <li key={c.id} className="p-4 bg-gray-800 rounded-lg flex justify-between">
              <div>
                <h3 className="text-lg font-medium text-white">{c.title}</h3>
                <p className="text-sm text-gray-400">
                  {new Date(c.start_time).toLocaleString()} →{' '}
                  {new Date(c.end_time).toLocaleString()}
                </p>
              </div>
              <Link
                to={`/faculty/contest/${c.id}/edit`}
                className="text-blue-400 hover:underline"
              >
                Edit
              </Link>
              <Link
                to={`/contests/${c.id}`}
                className="text-green-400 hover:underline"
              >
                View
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
