import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginFaculty } from '../api';
import AuthContext from '../context/AuthContext';

export default function FacultyLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginFaculty(email, password);
      console.log(data);
      login(data.token, data.user);
      navigate('/contests');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto card">
      <h2 className="text-2xl font-bold mb-4 text-center">Faculty Login</h2>
      {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          className="input w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="input w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn btn-primary w-full" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
