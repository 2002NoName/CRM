import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import ClientsPage from './pages/ClientsPage';
import ClientDetails from './pages/ClientDetails';
import Dashboard from './pages/Dashboard';
import SalesPage from './pages/SalesPage';
import UsersPage from './pages/UsersPage';

export default function App() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/*Main route – redirect based on login status*/}
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          }
        />

        {/* Login Page*/}
        <Route path="/login" element={<LoginPage />} />

        {/* Secured Clients Page */}
        <Route
          path="/clients"
          element={isLoggedIn ? <ClientsPage /> : <Navigate to="/login" replace />}
        />

        {/* Secured Client Details Page */}
        <Route
          path="/clients/:clientId"
          element={isLoggedIn ? <ClientDetails /> : <Navigate to="/login" replace />}
        />

        {/* Secured Dashboard Page */}
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />}
        />

        {/* Secured Sales Page */}
        <Route
          path="/sales"
          element={isLoggedIn ? <SalesPage /> : <Navigate to="/login" replace />}
        />

        {/* Secured Users Page */}
        <Route
          path="/users"
          element={isLoggedIn ? <UsersPage /> : <Navigate to="/login" replace />}
        />


        {/* Default route – redirect to home if no match */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
