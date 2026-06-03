import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import DashboardLayout from './components/DashboardLayout'
import DashboardPage from './pages/DashboardPage'
import AIAssistancePage from './pages/AIAssistancePage'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Navigate to="/api/v1/auth/register" replace />} />
        <Route path="/api/v1/auth/register" element={<AuthPage isLoginRoute={false} />} />
        <Route path="/api/v1/auth/login" element={<AuthPage isLoginRoute={true} />} />
        
        {/* Protected Dashboard Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="ai-assistance" element={<AIAssistancePage />} />
          {/* Add more nested routes for /dashboard/crop here later */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Redirect unknown routes to auth */}
        <Route path="*" element={<Navigate to="/api/v1/auth/register" replace />} />
      </Routes>
    </Router>
  )
}

export default App
