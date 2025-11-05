import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../api';

export default function Login() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // if already logged in, redirect away from login page
  React.useEffect(() => {
    if (user) navigate('/contests');
  }, [user, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState(null);
  const { setToken, setUser } = useContext(AuthContext);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.login(email, password, role);
      setToken(res.token);
      setUser(res.user);
      navigate('/contests');
    } catch (err) {
      setError(err?.message || JSON.stringify(err));
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h2 className="text-2xl mb-3">Login</h2>
        {error && <div className="mb-3 text-red-400">{error}</div>}
        <form onSubmit={submit} className="flex flex-col gap-3">
          <input required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="p-2 rounded bg-transparent border border-white/5" />
          <input required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="p-2 rounded bg-transparent border border-white/5" />
          <select value={role} onChange={e => setRole(e.target.value)} className="p-2 rounded bg-transparent border border-white/5">
            <option value="user">Student</option>
            <option value="faculty">Faculty</option>
            <option value="admin">Admin</option>
          </select>
          <div className="flex justify-end"><button className="btn btn-primary">Login</button></div>
        </form>
      </div>
    </div>
  );
}
