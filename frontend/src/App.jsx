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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/problems" element={<ProblemSet />} />
            <Route path="/problems/:id" element={<ProblemDetail />} />
            <Route path="/submissions" element={<Submissions />} />
            <Route path="/contests" element={<Contests />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}
