import React from 'react';
import { Link } from 'react-router-dom';

export default function Admin() {
  return (
    <div className="site-wrap">
      <div className="site-container">
        <div className="card max-w-3xl mx-auto">
          <h2 className="text-2xl mb-4">Admin Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/admin/create-problem" className="p-4 border rounded hover:bg-white/2">Create Problem</Link>
            <Link to="/admin/create-contest" className="p-4 border rounded hover:bg-white/2">Create Contest</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
