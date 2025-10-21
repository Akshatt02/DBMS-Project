// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { setToken } from '../auth';

export default function Login() {
  const [usernameOrEmail, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      const res = await api('/users/login', { method: 'POST', body: { usernameOrEmail, password } });
      setToken(res.token);
      nav('/');
    } catch (e) {
      setErr(e.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      {err && <div className="bg-red-100 text-red-700 p-2 rounded mb-3">{err}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input type="text" value={usernameOrEmail} onChange={e => setUsername(e.target.value)} placeholder="username or email" className="w-full border p-2 rounded"/>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" className="w-full border p-2 rounded"/>
        <button className="w-full bg-indigo-600 text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
}
