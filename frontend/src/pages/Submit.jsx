// src/pages/Submit.jsx
import React, { useState } from 'react';
import { api } from '../apiClient';
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
    <div className="site-wrap">
      <div className="site-container">
        <div className="card max-w-md mx-auto">
          <h2 className="text-2xl mb-4">Submit Solution</h2>
          {message && <div className="mb-3 text-sm muted">{message}</div>}
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
            <button className="w-full btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}
