import React, { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'
import ExerciseModal from '../components/ExerciseModal.jsx'
import './PublicPage.css'

// Hook: esconde a barra de filtros ao rolar para baixo, mostra ao rolar para cima
function useScrollHide(threshold = 60) {
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    function onScroll() {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        const currentY = window.scrollY
        if (currentY > lastY.current + threshold) {
          setHidden(true)
        } else if (currentY < lastY.current - 10) {
          setHidden(false)
        }
        lastY.current = currentY
        ticking.current = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return hidden
}

const ACTIVATION_COLORS = {
  'Muito Alta': { bg: '#4a0000', border: '#ef4444', text: '#fca5a5', dot: '#ef4444' },
  'Alta':       { bg: '#4a2000', border: '#f97316', text: '#fdba74', dot: '#f97316' },
  'Moderada':   { bg: '#3a3000', border: '#eab308', text: '#fde047', dot: '#eab308' },
  'Baixa':      { bg: '#0a2a0a', border: '#22c55e', text: '#86efac', dot: '#22c55e' },
}

function getActivationLevel(pct) {
  if (pct >= 80) return 'Muito Alta'
  if (pct >= 60) return 'Alta'
  if (pct >= 40) return 'Moderada'
  return 'Baixa'
}

function ActivationBadge({ pct }) {
  const level = getActivationLevel(pct)
  const colors = ACTIVATION_COLORS[level]
  return (
    <span className="activation-badge" style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text }}>
      <span className="dot" style={{ background: colors.dot }} />
      {level} · {pct}%
    </span>
  )
}

function ExerciseRow({ exercise, onClick }) {
  const [hovered, setHovered] = useState(false)
  const tooltipRef = useRef(null)

  return (
    <div
      className={`exercise-row ${hovered ? 'hovered' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(exercise)}
    >
      <div className="exercise-left">
        <span className="exercise-number">
          {exercise.rank ? String(exercise.rank).padStart(2, '0') : '—'}
        </span>
        <div className="exercise-info">
          <span className="exercise-name">{exercise.name}</span>
          {hovered && (
            <div className="exercise-tooltip scale-in">
              <div className="tooltip-row">
                <span className="tooltip-label">Ativação</span>
                <ActivationBadge pct={exercise.activation_pct} />
              </div>
              {exercise.secondary_muscles && (
                <div className="tooltip-row">
                  <span className="tooltip-label">Secundários</span>
                  <span className="tooltip-value">{exercise.secondary_muscles}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="exercise-right">
        <span className="exercise-comment">{exercise.scientific_note}</span>
        <div className="exercise-meta">
          <ActivationBadge pct={exercise.activation_pct} />
          {(exercise.media_url || exercise.video_url) && (
            <span className="media-indicator">
              {exercise.video_url ? '▶ Vídeo' : '📷 Foto'}
            </span>
          )}
          <span className="click-hint">clique para ver →</span>
        </div>
      </div>
    </div>
  )
}

function MuscleGroup({ group, exercises }) {
  const [open, setOpen] = useState(true)
  const [selected, setSelected] = useState(null)

  const sorted = [...exercises].sort((a, b) => (b.activation_pct || 0) - (a.activation_pct || 0))
    .map((ex, i) => ({ ...ex, rank: i + 1 }))

  return (
    <section className="muscle-group fade-in">
      <div className="group-header" onClick={() => setOpen(o => !o)}>
        <div className="group-title-area">
          <span className="group-emoji">{group.emoji || '💪'}</span>
          <div>
            <h2 className="group-name">{group.name}</h2>
            {group.description && <p className="group-desc">{group.description}</p>}
          </div>
        </div>
        <div className="group-meta">
          <span className="exercise-count">{exercises.length} exercícios</span>
          <span className={`chevron ${open ? 'open' : ''}`}>▾</span>
        </div>
      </div>

      {open && (
        <div className="group-body fade-in">
          <div className="exercises-header">
            <span>Exercício</span>
            <span>Observação Científica · Ativação</span>
          </div>
          {sorted.map(ex => (
            <ExerciseRow key={ex.id} exercise={ex} onClick={setSelected} />
          ))}
        </div>
      )}

      {selected && (
        <ExerciseModal exercise={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  )
}

export default function PublicPage() {
  const controlsHidden = useScrollHide(80)
  const [groups, setGroups] = useState([])
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeGroup, setActiveGroup] = useState(null)

  useEffect(() => {
    async function load() {
      const [{ data: g }, { data: e }] = await Promise.all([
        supabase.from('muscle_groups').select('*').order('sort_order'),
        supabase.from('exercises').select('*').order('activation_pct', { ascending: false })
      ])
      setGroups(g || [])
      setExercises(e || [])
      setLoading(false)
    }
    load()
  }, [])

  const filteredGroups = groups.filter(g =>
    !activeGroup || g.id === activeGroup
  )

  const getExercises = (groupId) => {
    return exercises.filter(e => e.muscle_group_id === groupId && (
      !search || e.name.toLowerCase().includes(search.toLowerCase())
    ))
  }

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-logo">BERTOLDO<span>PERFORMANCE</span></div>
      <div className="loading-bar"><div className="loading-fill" /></div>
      <p>Carregando guia muscular...</p>
    </div>
  )

  return (
    <div className="public-page">
      {/* Header */}
      <header className="site-header">
        <div className="container">
          <div className="header-inner">
            <div className="logo">
              <span className="logo-main">BERTOLDO</span>
              <span className="logo-sub">PERFORMANCE</span>
            </div>
            <div className="header-right">
              <a href="/admin/login" className="admin-link">⚙ Admin</a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="hero">
        <div className="container">
          <div className="hero-label">BASE CIENTÍFICA · EMG</div>
          <h1 className="hero-title">GUIA DE<br /><span className="hero-accent">ATIVAÇÃO MUSCULAR</span></h1>
          <p className="hero-subtitle">Os exercícios com maior ativação por eletromiografia, organizados por grupo muscular</p>
        </div>
        <div className="hero-stripe" />
      </div>

      {/* Controls */}
      <div className={`controls-bar${controlsHidden ? " controls-bar--hidden" : ""}`}>
        <div className="container controls-inner">
          <input
            className="search-input"
            placeholder="🔍  Buscar exercício..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="group-pills">
            <button
              className={`pill ${!activeGroup ? 'active' : ''}`}
              onClick={() => setActiveGroup(null)}
            >Todos</button>
            {groups.map(g => (
              <button
                key={g.id}
                className={`pill ${activeGroup === g.id ? 'active' : ''}`}
                onClick={() => setActiveGroup(g.id)}
              >{g.emoji} {g.name}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Legenda */}
      <div className="container">
        <div className="legend">
          {Object.entries(ACTIVATION_COLORS).map(([level, colors]) => (
            <span key={level} className="legend-item">
              <span className="legend-dot" style={{ background: colors.dot }} />
              {level}
              {level === 'Muito Alta' && ' ≥80%'}
              {level === 'Alta' && ' 60–79%'}
              {level === 'Moderada' && ' 40–59%'}
              {level === 'Baixa' && ' <40%'}
            </span>
          ))}
          <span className="legend-note">% = Contração Voluntária Máxima (EMG)</span>
        </div>
      </div>

      {/* Content */}
      <main className="container main-content">
        {filteredGroups.map(g => {
          const exs = getExercises(g.id)
          if (search && exs.length === 0) return null
          return <MuscleGroup key={g.id} group={g} exercises={exs} />
        })}
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>© 2025 Bertoldo Performance · Base científica: EMG studies — Contreras, Escamilla, Cools, McGill et al.</p>
        </div>
      </footer>
    </div>
  )
}
