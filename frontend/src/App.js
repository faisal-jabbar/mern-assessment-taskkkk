// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './styles/animations.css';

import Login from './pages/Login';
import Register from './pages/Register';
import TaskDashboard from './pages/TaskDashboard';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/tasks"
            element={
              <PrivateRoute>
                <TaskDashboard />
              </PrivateRoute>
            }
          />

          {/* Catch-All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>

      {/* ✅ Toast Container for all alerts */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
