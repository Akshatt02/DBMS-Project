// src/components/NavBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const { isLoggedIn, isAdmin, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-slate-900 to-gray-800 text-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-2xl font-bold tracking-tight text-teal-300">CodeArena</Link>
          <Link to="/problems" className="text-sm text-slate-200 hover:text-white">Problems</Link>
          <Link to="/contests" className="text-sm text-slate-200 hover:text-white">Contests</Link>
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="text-sm text-slate-200 hover:text-white mr-3">Profile</Link>
              <button onClick={logout} className="text-sm bg-teal-500 hover:bg-teal-400 text-white px-3 py-1 rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-slate-200 hover:text-white mr-3">Login</Link>
              <Link to="/register" className="text-sm bg-teal-500 hover:bg-teal-400 text-white px-3 py-1 rounded">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;