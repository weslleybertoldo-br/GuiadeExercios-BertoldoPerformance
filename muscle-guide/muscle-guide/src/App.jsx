import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import PublicPage from './pages/PublicPage.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminPanel from './pages/AdminPanel.jsx'

export default function App() {
  const [adminAuth, setAdminAuth] = useState(() => {
    return sessionStorage.getItem('admin_auth') === 'true'
  })

  const login = (pwd) => {
    const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'bertoldo2025'
    if (pwd === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true')
      setAdminAuth(true)
      return true
    }
    return false
  }

  const logout = () => {
    sessionStorage.removeItem('admin_auth')
    setAdminAuth(false)
  }

  return (
    <Routes>
      <Route path="/" element={<PublicPage />} />
      <Route path="/admin/login" element={
        adminAuth ? <Navigate to="/admin" /> : <AdminLogin onLogin={login} />
      } />
      <Route path="/admin" element={
        adminAuth ? <AdminPanel onLogout={logout} /> : <Navigate to="/admin/login" />
      } />
    </Routes>
  )
}
