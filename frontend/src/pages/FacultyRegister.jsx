import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerFaculty, fetchDepartments } from '../api';

export default function FacultyRegister() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    department_id: '',
  });
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments()
      .then(setDepartments)
      .catch(() => setDepartments([]));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerFaculty(form);
      navigate('/faculty/login');
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto card">
      <h2 className="text-2xl font-bold mb-4 text-center">Faculty Registration</h2>
      {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="name"
          placeholder="Full Name"
          className="input w-full"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="input w-full"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="input w-full"
          onChange={handleChange}
          required
        />
        <select
          name="department_id"
          className="input w-full"
          value={form.department_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <button className="btn btn-primary w-full" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}
