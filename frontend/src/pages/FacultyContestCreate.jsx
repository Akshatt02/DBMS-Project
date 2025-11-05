import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import * as api from '../api';
import { useNavigate } from 'react-router-dom';

export default function FacultyContestCreate() {
  const { token, user } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [message, setMessage] = useState('');
  const [problem, setProblem] = useState({ title: '', statement: '', difficulty: 'easy', tags: '' });
  const [contestId, setContestId] = useState(null);
  const navigate = useNavigate();

  const handleContest = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!title || !startTime || !endTime)
      return setMessage('Please fill in all fields.');

    if (new Date(endTime) <= new Date(startTime))
      return setMessage('End time must be after start time.');

    try {
      const res = await api.createContest(token, {
        title,
        start_time: startTime,
        end_time: endTime,
      });
      setMessage(`✅ Contest created successfully (ID: ${res.contestId})`);
      setContestId(res.contestId);
    } catch (err) {
      setMessage(err.message || 'Error creating contest');
    }
  };

  const handleProblem = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!problem.title || !problem.statement || !problem.tags)
      return setMessage('Please fill all problem fields.');

    try {
      const tags = problem.tags.split(',').map(t => t.trim()).filter(Boolean);
      const probRes = await api.createProblem(token, {
        title: problem.title,
        statement: problem.statement,
        difficulty: problem.difficulty,
        tags,
      });
      if (contestId) {
        await api.addProblemToContest(token, contestId, probRes.problemId);
      }
      setMessage('✅ Problem added successfully.');
      setProblem({ title: '', statement: '', difficulty: 'easy', tags: '' });
    } catch (err) {
      setMessage(err.message || 'Error adding problem');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="card p-6 shadow-md bg-gray-800 rounded-2xl">
        <h2 className="text-2xl mb-4 font-semibold text-white">Create Contest</h2>
        <form onSubmit={handleContest} className="space-y-3">
          <input
            className="input w-full"
            placeholder="Contest Title"
            value={title}
            required
            onChange={e => setTitle(e.target.value)}
          />
          <div className="flex gap-2">
            <input
              type="datetime-local"
              className="input flex-1"
              required
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
            />
            <input
              type="datetime-local"
              className="input flex-1"
              required
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
            />
          </div>
          <button className="btn btn-primary w-full" type="submit">
            Create Contest
          </button>
        </form>
      </div>

      {contestId && (
        <div className="card p-6 shadow-md bg-gray-800 rounded-2xl">
          <h2 className="text-xl mb-3 font-semibold text-white">
            Add Problem to Contest #{contestId}
          </h2>
          <form onSubmit={handleProblem} className="space-y-3">
            <input
              className="input w-full"
              placeholder="Problem Title"
              value={problem.title}
              required
              onChange={e => setProblem({ ...problem, title: e.target.value })}
            />
            <textarea
              className="input w-full"
              placeholder="Problem Statement"
              value={problem.statement}
              required
              onChange={e => setProblem({ ...problem, statement: e.target.value })}
            ></textarea>
            <select
              className="input w-full"
              value={problem.difficulty}
              onChange={e => setProblem({ ...problem, difficulty: e.target.value })}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <input
              className="input w-full"
              placeholder="Tags (comma separated)"
              required
              value={problem.tags}
              onChange={e => setProblem({ ...problem, tags: e.target.value })}
            />
            <button className="btn btn-secondary w-full" type="submit">
              Add Problem
            </button>
          </form>
        </div>
      )}

      {message && <div className="text-green-400 font-medium text-center">{message}</div>}

      <button
        onClick={() => navigate('/faculty/my-contests')}
        className="btn btn-outline w-full mt-4"
      >
        View My Contests →
      </button>
    </div>
  );
}
