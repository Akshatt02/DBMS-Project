import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-[#061423] border-b border-white/5">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-xl font-semibold accent">MiniJudge</Link>
        
        <nav className="flex items-center gap-4">
          {user && (user.role === 'admin' || user.role === 'faculty') ? (
            <>
              <Link to="/problems" className="muted hover:accent">Problems</Link>
              <Link to="/contests" className="muted hover:accent">Contests</Link>
              <Link to={user.role === 'admin' ? '/admin/analytics' : '/faculty/analytics'} className="muted hover:accent">Analytics</Link>
              <div className="flex items-center gap-3">
                <span className="badge">{user.name}</span>
                <button onClick={logout} className="btn btn-ghost">Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/problems" className="muted hover:accent">Problems</Link>
              <Link to="/contests" className="muted hover:accent">Contests</Link>

              {user && <Link to="/submissions" className="muted hover:accent">My Submissions</Link>}
              {user && <Link to="/profile" className="muted hover:accent">Profile</Link>}

              {!user && <Link to="/login" className="muted hover:accent">Login</Link>}
              {!user && <Link to="/register" className="muted hover:accent">Register</Link>}
              
              {user && (
                <div className="flex items-center gap-3">
                  <span className="badge">{user.name}</span>
                  <button onClick={logout} className="btn btn-ghost">Logout</button>
                </div>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
