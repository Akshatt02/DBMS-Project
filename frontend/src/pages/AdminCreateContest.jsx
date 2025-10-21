import React, { useState } from 'react';
import { api } from '../api';
import { getToken } from '../auth';

export default function AdminCreateContest() {
  const [name, setName] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [desc, setDesc] = useState('');
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      await api('/contests', { method: 'POST', body: { contest_name: name, start_time: start, end_time: end, description: desc }, token });
      setMsg('Contest created');
      setName(''); setStart(''); setEnd(''); setDesc('');
    } catch (err) {
      setMsg(err.message || 'Failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4">Create Contest</h2>
      {msg && <div className="mb-3">{msg}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Contest name" className="w-full border p-2 rounded" />
        <input value={start} onChange={e=>setStart(e.target.value)} placeholder="Start time (YYYY-MM-DD HH:mm:ss)" className="w-full border p-2 rounded" />
        <input value={end} onChange={e=>setEnd(e.target.value)} placeholder="End time (YYYY-MM-DD HH:mm:ss)" className="w-full border p-2 rounded" />
        <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description" className="w-full border p-2 rounded" />
        <button className="w-full bg-indigo-600 text-white py-2 rounded">Create</button>
      </form>
    </div>
  );
}
