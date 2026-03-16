import React, { useEffect, useRef } from 'react'
import './ExerciseModal.css'

export default function ExerciseModal({ exercise, onClose }) {
  const boxRef = useRef(null)

  useEffect(() => {
    // Fechar com Escape
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)

    // NÃO travar o body — o box rola por conta própria
    // Só prevenir scroll do body quando o toque começa FORA do box
    const preventBodyScroll = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        e.preventDefault()
      }
    }
    document.addEventListener('touchmove', preventBodyScroll, { passive: false })

    return () => {
      window.removeEventListener('keydown', handler)
      document.removeEventListener('touchmove', preventBodyScroll)
    }
  }, [onClose])

  const level = exercise.activation_pct >= 80 ? 'Muito Alta' :
                exercise.activation_pct >= 60 ? 'Alta' :
                exercise.activation_pct >= 40 ? 'Moderada' : 'Baixa'

  const levelColors = {
    'Muito Alta': '#ef4444', 'Alta': '#f97316',
    'Moderada': '#eab308', 'Baixa': '#22c55e'
  }
  const color = levelColors[level]

  const getEmbedUrl = (url) => {
    if (!url) return null
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`
    const ytEmbed = url.match(/youtube\.com\/embed\/([^&\n?#]+)/)
    if (ytEmbed) return url
    return null
  }

  const embedUrl = getEmbedUrl(exercise.video_url)
  const isDirectVideo = exercise.video_url && !embedUrl

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
          ) : isDirectVideo ? (
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
            <span className="modal-badge" style={{ background: `${color}22`, border: `1px solid ${color}`, color }}>
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
