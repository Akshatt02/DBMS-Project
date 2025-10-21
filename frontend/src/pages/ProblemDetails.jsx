// src/pages/ProblemDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../apiClient';

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
    <div className="site-wrap">
      <div className="site-container">
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold">{p.title}</h2>
          <div className="text-sm text-gray-500 mt-1">{p.difficulty}</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">{p.accepted_count || 0} AC</div>
          <Link to="/submit" className="bg-indigo-600 text-white px-3 py-2 rounded">Submit</Link>
        </div>
      </div>

  <div className="mb-4">
        {p.tags && p.tags.split(',').map(t=>t.trim()).filter(Boolean).map(tag=> (
          <span key={tag} className="inline-block mr-2 mb-2 px-2 py-1 bg-gray-100 text-sm text-gray-700 rounded">{tag}</span>
        ))}
      </div>

      <div className="prose mb-6">{p.statement}</div>

      <div className="flex gap-2">
        <Link to="/" className="text-sm muted">Back</Link>
      </div>
    </div>
    </div>
    </div>
  );
}
