import React, { useState } from 'react';
import { api } from '../api';
import { getToken } from '../auth';

export default function AdminCreateProblem() {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [tags, setTags] = useState('');
  const [statement, setStatement] = useState('');
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      await api('/problems', { method: 'POST', body: { title, difficulty, tags, statement }, token });
      setMsg('Created');
      setTitle(''); setTags(''); setStatement(''); setDifficulty('Medium');
    } catch (err) {
      setMsg(err.message || 'Failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4">Create Problem</h2>
      {msg && <div className="mb-3">{msg}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full border p-2 rounded" />
        <select value={difficulty} onChange={e=>setDifficulty(e.target.value)} className="w-full border p-2 rounded">
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <input value={tags} onChange={e=>setTags(e.target.value)} placeholder="tags (comma separated)" className="w-full border p-2 rounded" />
        <textarea value={statement} onChange={e=>setStatement(e.target.value)} placeholder="Statement" className="w-full border p-2 rounded" />
        <button className="w-full bg-indigo-600 text-white py-2 rounded">Create</button>
      </form>
    </div>
  );
}
