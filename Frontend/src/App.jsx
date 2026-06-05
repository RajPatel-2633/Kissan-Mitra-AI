import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AuthPage from './pages/AuthPage'
import DashboardLayout from './components/DashboardLayout'
import DashboardPage from './pages/DashboardPage'
import AIAssistancePage from './pages/AIAssistancePage'
import HistoryPage from './pages/HistoryPage'
import SettingsPage from './pages/SettingsPage'
import ProtectedRoute from './components/ProtectedRoute'
import useAuthStore from './store/authStore'
import './App.css'

function App() {
  const { checkAuth, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Note: Since checkAuth is async, we might want to return a loading spinner here 
  // if we add a global isLoading state, but for now we'll just let it render.

  return (
    <>
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            borderRadius: '12px',
            background: '#333',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: { style: { background: '#2b9365', color: '#fff' } },
          error: { style: { background: '#ef4444', color: '#fff' } },
        }} 
      />
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route path="/register" element={<AuthPage isLoginRoute={false} />} />
          <Route path="/login" element={<AuthPage isLoginRoute={true} />} />
          
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
            <Route path="history" element={<HistoryPage />} />
            <Route path="settings" element={<SettingsPage />} />
            {/* Add more nested routes for /dashboard/crop here later */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>

          {/* Redirect unknown routes to auth */}
          <Route path="*" element={<Navigate to="/register" replace />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
