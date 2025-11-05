import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
      <h1 className="text-4xl font-bold">Welcome to CodeArena 🏆</h1>
      <p className="text-gray-500 max-w-md">
        Compete, code, and climb the leaderboard. Join as a student or faculty to manage contests and problems.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link to="/login" className="btn btn-primary">Login</Link>
        <Link to="/register" className="btn btn-outline">Sign Up</Link>
        <Link to="/faculty/login" className="btn btn-accent">Faculty Login</Link>
        <Link to="/faculty/register" className="btn btn-outline btn-accent">Faculty Sign Up</Link>
      </div>
    </div>
  );
}
