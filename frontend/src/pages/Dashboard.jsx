// src/pages/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Welcome to CodeArena</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/problems" className="bg-white p-4 rounded shadow hover:shadow-md">
          <h3 className="font-semibold">Problems</h3>
          <p className="text-sm text-gray-500">Browse problems, filter by tags & difficulty.</p>
        </Link>

        <Link to="/contests" className="bg-white p-4 rounded shadow hover:shadow-md">
          <h3 className="font-semibold">Contests</h3>
          <p className="text-sm text-gray-500">View upcoming contests and leaderboards.</p>
        </Link>

        <Link to="/profile" className="bg-white p-4 rounded shadow hover:shadow-md">
          <h3 className="font-semibold">Profile</h3>
          <p className="text-sm text-gray-500">View your stats and topic-wise performance.</p>
        </Link>
      </div>
    </div>
  );
}
