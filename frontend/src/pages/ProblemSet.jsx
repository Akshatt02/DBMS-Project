import React, { useEffect, useState, useContext } from 'react';
import api from '../api';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function ProblemSet() {
  const { token } = useContext(AuthContext);
  const [problems, setProblems] = useState([]);
  const [q, setQ] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const params = {};
      if (q) params.q = q;
      if (difficulty) params.difficulty = difficulty;
      if (tags) params.tags = tags;
      const res = await api.fetchProblems(token, params);
      setProblems(res.data || []);
    } catch (err) {
      setError(err?.message || JSON.stringify(err));
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const submitFilter = (e) => { e.preventDefault(); load(); };

  return (
    <div>
      <div className="card mb-4">
        <form onSubmit={submitFilter} className="flex gap-3 flex-wrap items-end">
          <div className="flex-1">
            <label className="muted">Search</label>
            <input value={q} onChange={e=>setQ(e.target.value)} className="w-full p-2 rounded bg-transparent border border-white/5" placeholder="search title or statement" />
          </div>
          <div>
            <label className="muted">Difficulty</label>
            <select value={difficulty} onChange={e=>setDifficulty(e.target.value)} className="p-2 rounded bg-transparent border border-white/5">
              <option value="">Any</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="muted">Tags (comma separated)</label>
            <input value={tags} onChange={e=>setTags(e.target.value)} className="w-full p-2 rounded bg-transparent border border-white/5" placeholder="math,dp,graphs" />
          </div>
          <div>
            <button className="btn btn-primary">Filter</button>
          </div>
        </form>
      </div>

      {loading && <div className="card">Loading...</div>}
      {error && <div className="card text-red-400">{error}</div>}

      <div className="grid md:grid-cols-2 gap-4">
        {problems.map(p => (
          <div key={p.id} className="card">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg">{p.title}</h3>
                <div className="muted text-sm">Difficulty: {p.difficulty} • AC%: {p.ac_percent ?? 0}</div>
              </div>
              <div className="flex flex-col gap-2">
                <Link to={`/problems/${p.id}`} state={{ problem: p }} className="btn btn-ghost">View</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
