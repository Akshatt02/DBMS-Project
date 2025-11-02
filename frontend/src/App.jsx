// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Register from './pages/Register';
import ProblemSet from './pages/ProblemSet';
import ProblemDetail from './pages/ProblemDetail';
import Submissions from './pages/Submissions';
import Contests from './pages/Contests';
import ContestDetail from './pages/ContestDetail';
import Profile from './pages/Profile';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <NavBar />
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/problems" replace />} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Problems */}
            <Route path="/problems" element={<ProblemSet />} />
            <Route path="/problems/:id" element={<ProblemDetail />} />

            {/* Submissions */}
            <Route path="/submissions" element={<Submissions />} />

            {/* Contests */}
            <Route path="/contests" element={<Contests />} />
            {/* Contest detail: uses query ?tab=leaderboard or ?tab=submissions or shows problems by default */}
            <Route path="/contests/:id" element={<ContestDetail />} />
            {/* Keep direct shortcut routes (optional) — they render the same ContestDetail which will read the tab from the URL or query param */}
            <Route path="/contests/:id/leaderboard" element={<ContestDetail />} />
            <Route path="/contests/:id/submissions" element={<ContestDetail />} />

            {/* Profile */}
            <Route path="/profile" element={<Profile />} />

            {/* Fallback */}
            <Route path="*" element={<div className="card">Page not found</div>} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}
