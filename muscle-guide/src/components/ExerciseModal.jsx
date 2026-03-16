import React, { useEffect, useRef } from 'react'
import './ExerciseModal.css'

export default function ExerciseModal({ exercise, onClose }) {
  const boxRef = useRef(null)

  useEffect(() => {
    // Fechar com Escape
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)

    // Salvar posição do scroll da página
    const scrollY = window.scrollY
    // Travar body mas manter a posição — evita "salto" ao abrir/fechar
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'

    return () => {
      window.removeEventListener('keydown', onKey)
      // Restaurar scroll exato ao fechar
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      window.scrollTo(0, scrollY)
    }
  }, [onClose])

  const level = exercise.activation_pct >= 80 ? 'Muito Alta' :
                exercise.activation_pct >= 60 ? 'Alta' :
                exercise.activation_pct >= 40 ? 'Moderada' : 'Baixa'

  const levelColors = {
    'Muito Alta': '#ef4444',
    'Alta':       '#f97316',
    'Moderada':   '#eab308',
    'Baixa':      '#22c55e',
  }
  const color = levelColors[level]

  const getEmbedUrl = (url) => {
    if (!url) return null
    const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0`
    if (url.match(/youtube\.com\/embed\//)) return url
    return null
  }

  const embedUrl   = getEmbedUrl(exercise.video_url)
  const directVideo = exercise.video_url && !embedUrl

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={boxRef}
        className="modal-box scale-in"
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>✕</button>

        {/* Mídia */}
        <div className="modal-media">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={exercise.name}
              frameBorder="0"
              allow="fullscreen"
              allowFullScreen
              className="modal-video"
            />
          ) : directVideo ? (
            <video src={exercise.video_url} controls className="modal-video" />
          ) : exercise.media_url ? (
            <img src={exercise.media_url} alt={exercise.name} className="modal-image" />
          ) : (
            <div className="modal-no-media">
              <span>💪</span>
              <p>Sem mídia cadastrada</p>
              <small>O administrador pode adicionar foto ou vídeo</small>
            </div>
          )}
        </div>

        {/* Informações */}
        <div className="modal-body">
          <div className="modal-header-info">
            <h2 className="modal-title">{exercise.name}</h2>
            <span
              className="modal-badge"
              style={{ background: `${color}22`, border: `1px solid ${color}`, color }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block', marginRight: 6 }} />
              {level} · {exercise.activation_pct}% EMG
            </span>
          </div>

          <div className="modal-grid">
            {exercise.secondary_muscles && (
              <div className="modal-info-block">
                <span className="modal-label">Músculos Secundários</span>
                <span className="modal-value">{exercise.secondary_muscles}</span>
              </div>
            )}
            {exercise.scientific_note && (
              <div className="modal-info-block full">
                <span className="modal-label">Observação Científica</span>
                <span className="modal-value">{exercise.scientific_note}</span>
              </div>
            )}
            {exercise.reference && (
              <div className="modal-info-block full">
                <span className="modal-label">📚 Referência</span>
                <span className="modal-value ref">{exercise.reference}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
