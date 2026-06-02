import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* Directly redirect root to /auth */}
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        {/* Redirect unknown routes to /auth */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  )
}

export default App
