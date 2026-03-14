import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminLogin.css'

export default function AdminLogin({ onLogin }) {
  const [pwd, setPwd] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      const ok = onLogin(pwd)
      if (ok) { navigate('/admin') }
      else { setError('Senha incorreta'); setLoading(false) }
    }, 400)
  }

  return (
    <div className="login-page">
      <div className="login-box scale-in">
        <div className="login-logo">
          <span className="login-logo-main">BERTOLDO</span>
          <span className="login-logo-sub">PERFORMANCE · ADMIN</span>
        </div>
        <h2 className="login-title">Acesso Administrativo</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label>Senha</label>
            <input
              type="password"
              value={pwd}
              onChange={e => { setPwd(e.target.value); setError('') }}
              placeholder="••••••••"
              autoFocus
            />
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>
        <a href="/" className="login-back">← Voltar ao guia</a>
      </div>
    </div>
  )
}
