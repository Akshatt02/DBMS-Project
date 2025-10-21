// src/pages/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="site-wrap">
      <div className="site-container">
        <div className="hero mb-4">
          <h1 className="text-3xl font-bold">Welcome to CodeArena</h1>
          <p className="muted mt-3">Practice problems, join contests, and track your progress.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/problems" className="card hover:shadow-lg">
            <h3 className="font-semibold">Problems</h3>
            <p className="muted">Browse problems, filter by tags & difficulty.</p>
          </Link>

          <Link to="/contests" className="card hover:shadow-lg">
            <h3 className="font-semibold">Contests</h3>
            <p className="muted">View upcoming contests and leaderboards.</p>
          </Link>

          <Link to="/profile" className="card hover:shadow-lg">
            <h3 className="font-semibold">Profile</h3>
            <p className="muted">View your stats and topic-wise performance.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
