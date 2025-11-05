import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import * as api from '../api';
import { useNavigate } from 'react-router-dom';

export default function AdminContestCreate() {
  const { token } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [message, setMessage] = useState('');
  const [contestId, setContestId] = useState(null);
  const navigate = useNavigate();

  const handleContest = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!title || !startTime || !endTime) return setMessage('Please fill in all fields.');
    if (new Date(endTime) <= new Date(startTime)) return setMessage('End time must be after start time.');
    try {
      const res = await api.createAdminContest(token, { title, start_time: startTime, end_time: endTime });
      setMessage(`✅ Contest created successfully (ID: ${res.contestId})`);
      setContestId(res.contestId);
    } catch (err) {
      setMessage(err.message || 'Error creating contest');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="card p-6 shadow-md bg-gray-800 rounded-2xl">
        <h2 className="text-2xl mb-4 font-semibold text-white">Create College-wide Contest</h2>
        <form onSubmit={handleContest} className="space-y-3">
          <input className="input w-full" placeholder="Contest Title" value={title} required onChange={e => setTitle(e.target.value)} />
          <div className="flex gap-2">
            <input type="datetime-local" className="input flex-1" required value={startTime} onChange={e => setStartTime(e.target.value)} />
            <input type="datetime-local" className="input flex-1" required value={endTime} onChange={e => setEndTime(e.target.value)} />
          </div>
          <button className="btn btn-primary w-full" type="submit">Create Contest</button>
        </form>
      </div>

      {contestId && (
        <div className="card p-6 shadow-md bg-gray-800 rounded-2xl">
          <h2 className="text-xl mb-3 font-semibold text-white">Contest #{contestId} created</h2>
          <button className="btn btn-secondary w-full" onClick={() => navigate(`/admin/contest/${contestId}/edit`)}>Edit Contest →</button>
        </div>
      )}

      {message && <div className="text-green-400 font-medium text-center">{message}</div>}
    </div>
  );
}
