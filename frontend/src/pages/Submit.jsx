// src/pages/Submit.jsx
import React, { useState } from 'react';
import { api } from '../api';
import { getToken } from '../auth';

export default function Submit() {
  const [problemId, setProblemId] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [verdict, setVerdict] = useState('Accepted');
  const [message, setMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      const body = { problem_id: Number(problemId), contest_id: null, language, verdict, runtime: 0.0 };
      const res = await api('/submissions', { method: 'POST', body, token });
      setMessage('Submission recorded: #' + res.submission_id);
    } catch (e) {
      setMessage(e.message || 'Submit failed');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4">Submit Solution</h2>
      {message && <div className="mb-3 text-sm">{message}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input value={problemId} onChange={e=>setProblemId(e.target.value)} placeholder="Problem ID" className="w-full border p-2 rounded" />
        <select value={language} onChange={e=>setLanguage(e.target.value)} className="w-full border p-2 rounded">
          <option value="cpp">C++</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
        <select value={verdict} onChange={e=>setVerdict(e.target.value)} className="w-full border p-2 rounded">
          <option>Accepted</option>
          <option>Wrong Answer</option>
          <option>TLE</option>
          <option>Runtime Error</option>
        </select>
        <button className="w-full bg-indigo-600 text-white py-2 rounded">Submit</button>
      </form>
    </div>
  );
}
