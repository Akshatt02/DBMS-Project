// src/pages/Problems.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../apiClient';
import TagSelect from '../components/TagSelect';
import Pagination from '../components/Pagination';

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [q, setQ] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [difficulty, setDifficulty] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const [total, setTotal] = useState(0);

  const fetchProblems = async () => {
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    // backend supports a single 'tag' param; for multiple tags we'll filter client-side
    if (selectedTags.length === 1) params.append('tag', selectedTags[0]);
    if (difficulty) params.append('difficulty', difficulty);
    if (sortBy) params.append('sortBy', sortBy);

    const res = await api(`/problems?${params.toString()}`);
    const rows = res.rows || res || [];

    // derive tag list from returned problems if backend doesn't provide tags array
    const derivedTags = new Set(allTags);
    rows.forEach(r => {
      if (r.tags) {
        r.tags.split(',').map(t => t.trim()).forEach(t => { if (t) derivedTags.add(t); });
      }
    });
    setAllTags(Array.from(derivedTags).sort());

    // client-side filter for multiple selected tags
    let filtered = rows;
    if (selectedTags.length > 1) {
      filtered = rows.filter(r => {
        if (!r.tags) return false;
        const parts = r.tags.split(',').map(t => t.trim());
        return selectedTags.every(st => parts.includes(st));
      });
    }

    // set total and page results (client-side pagination)
    setTotal(filtered.length);
    const start = (page - 1) * pageSize;
    setProblems(filtered.slice(start, start + pageSize));
  };

  useEffect(() => { fetchProblems(); }, [page]);

  // refetch when filters change (reset to page 1)
  useEffect(() => {
    setPage(1);
    fetchProblems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTags, difficulty, sortBy, q]);

  return (
    <div className="site-wrap">
      <div className="site-container">
        <h2 className="text-2xl font-semibold mb-4">Problems</h2>
        <div className="card mb-4 flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex-1 flex gap-2">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by title or statement" className="border p-2 rounded flex-1" />
          <TagSelect tags={allTags} selected={selectedTags} onChange={setSelectedTags} />
        </div>

        <div className="flex items-center gap-2">
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
          <button onClick={() => { setPage(1); fetchProblems(); }} className="bg-indigo-600 text-white px-3 py-2 rounded">Apply</button>
        </div>
      </div>

  <div className="card">
        <div className="flex justify-between items-center mb-3">
          <div>
            <div className="text-sm text-gray-500">Showing</div>
            <div className="text-xl font-semibold">{total} Problems</div>
          </div>
          <div>
            <Pagination page={page} pageSize={pageSize} total={total} onPage={(p) => { setPage(p); window.scrollTo(0,0); }} />
          </div>
        </div>

  <div className="space-y-3">
          {problems.map(p => (
            <div key={p.problem_id} className="p-3 border rounded flex justify-between items-center">
              <div className="flex-1">
                <Link to={`/problems/${p.problem_id}`} className="text-lg font-medium text-indigo-600">{p.title}</Link>
                <div className="text-sm text-gray-500">{p.difficulty} • {p.tags}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600">{p.accepted_count || 0} AC</div>
                <Link to={`/problems/${p.problem_id}`} className="bg-indigo-600 text-white px-3 py-1 rounded">Open</Link>
              </div>
            </div>
          ))}
          {problems.length === 0 && <div className="text-center text-gray-500 p-4">No problems found</div>}
        </div>

        <div className="mt-4 flex justify-end">
          <Pagination page={page} pageSize={pageSize} total={total} onPage={(p) => setPage(p)} />
        </div>
      </div>
    </div>
  </div>
  );
}
