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
import Landing from './pages/Landing';
import FacultyLogin from './pages/FacultyLogin';
import FacultyRegister from './pages/FacultyRegister';
import FacultyAnalytics from './pages/FacultyAnalytics';
import FacultyContestCreate from './pages/FacultyContestCreate';
import FacultyContestEdit from './pages/FacultyContestEdit';
import FacultyMyContests from './pages/FacultyMyContests';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <NavBar />
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Landing />} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Landing />} />

            {/* Faculty */}
            <Route path="/faculty/login" element={<FacultyLogin />} />
            <Route path="/faculty/register" element={<FacultyRegister />} />
            <Route path="/faculty/analytics" element={<FacultyAnalytics />} />
            <Route path="/faculty/create-contest" element={<FacultyContestCreate />} />
            <Route path="/faculty/contest/:id/edit" element={<FacultyContestEdit />} />
            <Route path="/faculty/my-contests" element={<FacultyMyContests />} />

            {/* Problems */}
            <Route path="/problems" element={<ProblemSet />} />
            <Route path="/problems/:id" element={<ProblemDetail />} />

            {/* Submissions */}
            <Route path="/submissions" element={<Submissions />} />

            {/* Contests */}
            <Route path="/contests" element={<Contests />} />
            {/* Contest detail: uses query ?tab=leaderboard or ?tab=submissions or shows problems by default */}
            <Route path="/contests/:id" element={<ContestDetail />} />

            {/* Profile */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:id" element={<Profile />} />

            {/* Fallback */}
            <Route path="*" element={<div className="card">Page not found</div>} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}
