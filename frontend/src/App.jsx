// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Problems from './pages/Problems';
import ProblemDetails from './pages/ProblemDetails';
import Contests from './pages/Contests';
import ContestDetails from './pages/ContestDetails';
import Submit from './pages/Submit';
import Profile from './pages/Profile';
import { getToken } from './auth';

const PrivateRoute = ({ children }) => {
  return getToken() ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/problems/:id" element={<ProblemDetails />} />
          <Route path="/contests" element={<Contests />} />
          <Route path="/contests/:id" element={
            <PrivateRoute><ContestDetails /></PrivateRoute>
          } />
          <Route path="/submit" element={
            <PrivateRoute><Submit /></PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute><Profile /></PrivateRoute>
          } />
          <Route path="*" element={<div className="text-center p-8">Page not found</div>} />
        </Routes>
      </main>
    </div>
  );
}
