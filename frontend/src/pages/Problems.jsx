// src/pages/Problems.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [q, setQ] = useState('');
  const [tag, setTag] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [sortBy, setSortBy] = useState('');

  const fetchProblems = async () => {
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    if (tag) params.append('tag', tag);
    if (difficulty) params.append('difficulty', difficulty);
    if (sortBy) params.append('sortBy', sortBy);
    const list = await api(`/problems?${params.toString()}`);
    setProblems(list);
  };

  useEffect(() => { fetchProblems(); }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Problems</h2>
      <div className="bg-white p-4 rounded mb-4 flex gap-2">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by title or statement" className="border p-2 rounded flex-1" />
        <input value={tag} onChange={e=>setTag(e.target.value)} placeholder="Tag (e.g., dp)" className="border p-2 rounded w-36" />
        <select value={difficulty} onChange={e=>setDifficulty(e.target.value)} className="border p-2 rounded w-36">
          <option value="">Any difficulty</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="border p-2 rounded w-40">
          <option value="">Newest</option>
          <option value="popularity">Popularity</option>
          <option value="accuracy">Accuracy</option>
        </select>
        <button onClick={fetchProblems} className="bg-indigo-600 text-white px-3 py-2 rounded">Apply</button>
      </div>

      <div className="grid gap-4">
        {problems.map(p => (
          <div key={p.problem_id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <Link to={`/problems/${p.problem_id}`} className="text-lg font-medium text-indigo-600">{p.title}</Link>
              <div className="text-sm text-gray-500">{p.difficulty} • {p.tags}</div>
            </div>
            <div>
              <Link to={`/problems/${p.problem_id}`} className="bg-indigo-600 text-white px-3 py-1 rounded">Open</Link>
            </div>
          </div>
        ))}
        {problems.length === 0 && <div className="text-center text-gray-500">No problems found</div>}
      </div>
    </div>
  );
}
