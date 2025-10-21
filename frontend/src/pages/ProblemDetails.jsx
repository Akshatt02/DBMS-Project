// src/pages/ProblemDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';

export default function ProblemDetails() {
  const { id } = useParams();
  const [p, setP] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await api(`/problems/${id}`);
      setP(data);
    };
    load();
  }, [id]);

  if (!p) return <div>Loading...</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-2">{p.title}</h2>
      <div className="text-sm text-gray-500 mb-4">{p.difficulty} • {p.tags}</div>
      <div className="prose mb-6">{p.statement}</div>
      <div className="flex gap-2">
        <Link to="/submit" className="bg-indigo-600 text-white px-3 py-2 rounded">Submit Solution</Link>
        <Link to="/" className="text-sm text-gray-600">Back</Link>
      </div>
    </div>
  );
}
