// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../apiClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [institution, setInstitution] = useState('');
  const [err, setErr] = useState(null);
  const nav = useNavigate();

  const { login } = useAuth();
  const { push } = useToast();

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      const res = await api('/users/register', { method: 'POST', body: { username, email, password, institution } });
      login(res.token);
      push('Registered and logged in', 'info');
      nav('/');
    } catch (e) {
      setErr(e.message || 'Registration failed');
      push(e.message || 'Registration failed', 'error');
    }
  };

  return (
    <div className="site-wrap">
      <div className="site-container">
        <div className="card max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Register</h2>
          {err && <div className="bg-red-600 text-white p-2 rounded mb-3">{err}</div>}
          <form onSubmit={submit} className="space-y-3">
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="username" className="w-full border p-2 rounded"/>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email" className="w-full border p-2 rounded"/>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" className="w-full border p-2 rounded"/>
            <input type="text" value={institution} onChange={e => setInstitution(e.target.value)} placeholder="institution" className="w-full border p-2 rounded"/>
            <button className="w-full btn btn-primary">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
}
