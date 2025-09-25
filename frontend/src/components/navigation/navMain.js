// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavigationBar from './/NavigationBar';
import { AuthProvider } from '../context/AuthContext';
// Import pentru paginile tale (le vei crea mai târziu)
import Home from '../pages/home/Home';
import Map from '../pages/map/Map';
import Alert from '../pages/alert/Alert';
import Account from '../dashboard/UserDashboard';
import LoginForm from '../auth/LoginForm';
import RegisterForm from '../auth/RegisterForm';
import ProtectedRoute from '../auth/ProtectedRoute';
import UserDashboard from '../dashboard/UserDashboard';
import AdminDashboard from '../dashboard/AdminDashboard';
import AdminRoute from '../auth/AdminRoute';
import AI from '../AI/components/ai'


function App() {
  return (
        <AuthProvider>
    <Router>
      <div className="App">
        <NavigationBar />
        <main className="main-content">
          <Routes>
            {/* Redirect de la root la home */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            
      <Route path="/login" element={<LoginForm />} />
  <Route path="/register" element={<RegisterForm />} />
<Route path="/dashboard" element={
    <ProtectedRoute>
      <UserDashboard />
    </ProtectedRoute>
  } />

   <Route path="/admin/dashboard" element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  } />

<Route path="/ai" element={<AI />} />
        
        
            <Route path="/home" element={<Home />} />
            <Route path="/map" element={<Map />} />
            <Route path="/alert" element={<Alert />} />
            <Route path="/account" element={
  <ProtectedRoute>
    <Account />
  </ProtectedRoute>
} />
            

            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
        </AuthProvider>
  );
}

export default App;