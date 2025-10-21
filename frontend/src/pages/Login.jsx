// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../apiClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const [usernameOrEmail, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const nav = useNavigate();

  const { login } = useAuth();
  const { push } = useToast();

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      const res = await api('/users/login', { method: 'POST', body: { usernameOrEmail, password } });
      login(res.token);
      push('Logged in', 'info');
      nav('/');
    } catch (e) {
      setErr(e.message || 'Login failed');
      push(e.message || 'Login failed', 'error');
    }
  };

  return (
    <div className="site-wrap">
      <div className="site-container">
        <div className="card max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Login</h2>
          {err && <div className="bg-red-600 text-white p-2 rounded mb-3">{err}</div>}
          <form onSubmit={submit} className="space-y-3">
            <input type="text" value={usernameOrEmail} onChange={e => setUsername(e.target.value)} placeholder="username or email" className="w-full border p-2 rounded"/>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" className="w-full border p-2 rounded"/>
            <button className="w-full btn btn-primary">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}
