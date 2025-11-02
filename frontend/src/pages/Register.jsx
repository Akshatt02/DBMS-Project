import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../api';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    batch: ''
  });
  const [error, setError] = useState(null);
  const { setToken, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.register(formData);
      setToken(res.token);
      setUser(res.user);
      navigate('/problems');
    } catch (err) {
      setError(err?.message || JSON.stringify(err));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="card p-6 bg-gray-800 rounded-2xl shadow-lg">
        <h2 className="text-2xl mb-4 font-semibold text-center">Register</h2>
        {error && <div className="mb-3 text-red-400 text-center">{error}</div>}
        <form onSubmit={submit} className="flex flex-col gap-4">
          <input
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="p-2 rounded bg-transparent border border-white/10"
          />
          <input
            required
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="p-2 rounded bg-transparent border border-white/10"
          />
          <input
            required
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="p-2 rounded bg-transparent border border-white/10"
          />
          <select
            required
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="p-2 rounded bg-transparent border border-white/10"
          >
            <option value="" disabled>Select Department</option>
            <option value="CSE">CSE</option>
            <option value="AIDS">AIDS</option>
            <option value="ECE">ECE</option>
            <option value="MECH">MECH</option>
          </select>
          <input
            required
            name="batch"
            value={formData.batch}
            onChange={handleChange}
            placeholder="Batch (e.g., 2022)"
            className="p-2 rounded bg-transparent border border-white/10"
          />
          <div className="flex justify-end">
            <button className="btn btn-primary">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
}
