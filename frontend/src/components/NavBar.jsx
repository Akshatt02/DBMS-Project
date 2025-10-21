// src/components/NavBar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getToken, clearToken } from '../auth';

const NavBar = () => {
  const navigate = useNavigate();
  const token = getToken();

  const logout = () => {
    clearToken();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-bold text-indigo-600">CodeArena</Link>
          <Link to="/problems" className="text-sm text-gray-600 hover:text-indigo-600">Problems</Link>
          <Link to="/contests" className="text-sm text-gray-600 hover:text-indigo-600">Contests</Link>
        </div>
        <div>
          {token ? (
            <>
              <Link to="/profile" className="mr-3 text-sm text-gray-600 hover:text-indigo-600">Profile</Link>
              <button onClick={logout} className="bg-indigo-600 text-white text-sm px-3 py-1 rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-3 text-sm text-gray-600 hover:text-indigo-600">Login</Link>
              <Link to="/register" className="bg-indigo-600 text-white text-sm px-3 py-1 rounded">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;