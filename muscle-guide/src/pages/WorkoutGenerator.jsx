import React, { useState } from 'react'
import { gerarTreino } from '../lib/workoutGenerator.js'
import { gerarPDFTreino } from '../lib/workoutPDF.js'
import './WorkoutGenerator.css'

const NIVEIS = [
  { id: 'iniciante', label: 'Iniciante', desc: 'Até 6 meses de treino' },
  { id: 'intermediario', label: 'Intermediário', desc: '6 meses a 2 anos' },
  { id: 'avancado', label: 'Avançado', desc: 'Acima de 2 anos' },
]

const DIAS = [2, 3, 4, 5]

const FOCOS = [
  { id: 'inferiores', label: 'Membros Inferiores', emoji: '🦵', desc: 'Glúteo, Quadríceps, Isquiotibiais, Panturrilha' },
  { id: 'inferiores_gluteo', label: 'Inferiores — Ênfase Glúteo', emoji: '🍑', desc: 'Foco máximo em glúteo com suporte de quadríceps e isquiotibiais' },
  { id: 'inferiores_perna', label: 'Inferiores — Ênfase Perna', emoji: '⚡', desc: 'Quadríceps (anterior) e Isquiotibiais (posterior) equilibrados' },
  { id: 'superiores', label: 'Membros Superiores', emoji: '💪', desc: 'Peito, Costas, Ombros, Bíceps, Tríceps' },
  { id: 'superiores_biceps', label: 'Superiores — Ênfase Bíceps', emoji: '🔝', desc: 'Bíceps como foco principal com costas como suporte' },
  { id: 'superiores_triceps', label: 'Superiores — Ênfase Tríceps', emoji: '🔱', desc: 'Tríceps como foco com peito como suporte' },
  { id: 'superiores_peito', label: 'Superiores — Ênfase Peito', emoji: '🏋️', desc: 'Peitoral com suporte de tríceps e deltóide anterior' },
  { id: 'superiores_costas', label: 'Superiores — Ênfase Costas', emoji: '🏊', desc: 'Dorsal e trapézio com suporte de bíceps e rombóides' },
  { id: 'superior_ombro', label: 'Superiores — Ênfase Ombro', emoji: '🎽', desc: 'Deltóide completo (anterior, médio e posterior) para corrigir proporção' },
  { id: 'full_gluteo', label: 'Superior + Inferior — Glúteo', emoji: '🍑💪', desc: 'Combina superior e inferior com ênfase em glúteo' },
  { id: 'full_perna', label: 'Superior + Inferior — Perna', emoji: '🦵💪', desc: 'Combina superior e inferior com ênfase em perna' },
  { id: 'full_biceps', label: 'Superior + Inferior — Bíceps', emoji: '🔝🦵', desc: 'Combina superior e inferior com ênfase em bíceps' },
  { id: 'full_triceps', label: 'Superior + Inferior — Tríceps', emoji: '🔱🦵', desc: 'Combina superior e inferior com ênfase em tríceps' },
  { id: 'full_peito', label: 'Superior + Inferior — Peito', emoji: '🏋️🦵', desc: 'Combina superior e inferior com ênfase em peitoral' },
  { id: 'full_costas', label: 'Superior + Inferior — Costas', emoji: '🏊🦵', desc: 'Combina superior e inferior com ênfase em costas' },
  { id: 'full_ombro', label: 'Superior + Inferior — Ombro', emoji: '🎽🦵', desc: 'Combina superior e inferior com ênfase em ombro' },
  { id: 'full_inferior', label: 'Superior + Inferior — Foco Inferior', emoji: '🦵🦵', desc: 'Maior volume em inferior com sessões de superior como suporte' },
  { id: 'full_superior', label: 'Superior + Inferior — Foco Superior', emoji: '💪💪', desc: 'Maior volume em superior com sessões de inferior como suporte' },
]

export default function WorkoutGenerator() {
  const [nivel, setNivel] = useState('intermediario')
  const [foco, setFoco] = useState('inferiores')
  const [dias, setDias] = useState(4)
  const [nomeAluno, setNomeAluno] = useState('')
  const [treino, setTreino] = useState(null)
  const [gerado, setGerado] = useState(false)

  const handleGerar = () => {
    if (!nomeAluno.trim()) {
      alert('Por favor, insira o nome do aluno.')
      return
    }
    const resultado = gerarTreino({ nivel, foco, dias, nomeAluno: nomeAluno.trim() })
    setTreino(resultado)
    setGerado(true)
  }

  const handlePDF = () => {
    if (treino) gerarPDFTreino(treino)
  }

  const handleNovo = () => {
    setTreino(null)
    setGerado(false)
    setNomeAluno('')
  }

  return (
    <div className="wg-page">
      {!gerado ? (
        <div className="wg-form">
          <div className="wg-form-header">
            <h2 className="wg-title">🏋️ CRIAR TREINO SEMANAL</h2>
            <p className="wg-subtitle">Gere um treino personalizado baseado em evidências científicas de hipertrofia</p>
          </div>

          {/* Nome do aluno */}
          <div className="wg-section">
            <label className="wg-label">👤 Nome do Aluno</label>
            <input
              className="wg-input"
              placeholder="Ex: João Silva"
              value={nomeAluno}
              onChange={e => setNomeAluno(e.target.value)}
            />
          </div>

          {/* Nível */}
          <div className="wg-section">
            <label className="wg-label">📊 Nível de Experiência</label>
            <div className="wg-cards">
              {NIVEIS.map(n => (
                <div
                  key={n.id}
                  className={`wg-card ${nivel === n.id ? 'active' : ''}`}
                  onClick={() => setNivel(n.id)}
                >
                  <span className="wg-card-title">{n.label}</span>
                  <span className="wg-card-desc">{n.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dias */}
          <div className="wg-section">
            <label className="wg-label">📅 Dias por Semana</label>
            <div className="wg-pills">
              {DIAS.map(d => (
                <button
                  key={d}
                  className={`wg-pill ${dias === d ? 'active' : ''}`}
                  onClick={() => setDias(d)}
                >
                  {d} dias
                </button>
              ))}
            </div>
          </div>

          {/* Foco */}
          <div className="wg-section">
            <label className="wg-label">🎯 Foco Muscular</label>
            <div className="wg-focos">
              {FOCOS.map(f => (
                <div
                  key={f.id}
                  className={`wg-foco ${foco === f.id ? 'active' : ''}`}
                  onClick={() => setFoco(f.id)}
                >
                  <span className="wg-foco-emoji">{f.emoji}</span>
                  <div>
                    <div className="wg-foco-label">{f.label}</div>
                    <div className="wg-foco-desc">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="wg-btn-gerar" onClick={handleGerar}>
            ⚡ GERAR TREINO SEMANAL
          </button>
        </div>
      ) : (
        <div className="wg-resultado">
          <div className="wg-resultado-header">
            <div>
              <h2 className="wg-title">✅ TREINO GERADO</h2>
              <p className="wg-subtitle">{treino.nomeAluno} · {treino.nivelLabel} · {treino.focoLabel} · {treino.dias} dias/semana</p>
            </div>
            <div className="wg-resultado-actions">
              <button className="wg-btn-pdf" onClick={handlePDF}>📄 Exportar PDF</button>
              <button className="wg-btn-novo" onClick={handleNovo}>+ Novo Treino</button>
            </div>
          </div>

          {/* Resumo científico */}
          <div className="wg-ciencia">
            <div className="wg-ciencia-icon">📚</div>
            <div>
              <div className="wg-ciencia-titulo">Base Científica — Hipertrofia</div>
              <div className="wg-ciencia-texto">{treino.baseciencia}</div>
            </div>
          </div>

          {/* Dias de treino */}
          {treino.semana.map((dia, i) => (
            <div key={i} className="wg-dia">
              <div className="wg-dia-header">
                <span className="wg-dia-numero">DIA {dia.dia}</span>
                <span className="wg-dia-nome">{dia.nome}</span>
                <span className="wg-dia-grupos">{dia.grupos}</span>
              </div>
              <div className="wg-exercicios-header">
                <span>Exercício</span>
                <span>Séries × Reps</span>
                <span>Método</span>
                <span>Descanso</span>
              </div>
              {dia.exercicios.map((ex, j) => (
                <div key={j} className={`wg-exercicio ${ex.destaque ? 'destaque' : ''}`}>
                  <div className="wg-ex-nome">
                    <span>{ex.nome}</span>
                    {ex.principal && <span className="wg-badge-principal">Principal</span>}
                  </div>
                  <span className="wg-ex-series">{ex.series}×{ex.reps}</span>
                  <span className="wg-ex-metodo">{ex.metodo}</span>
                  <span className="wg-ex-descanso">{ex.descanso}</span>
                </div>
              ))}
              {dia.obs && <div className="wg-dia-obs">💡 {dia.obs}</div>}
            </div>
          ))}

          <div className="wg-referencias">
            <div className="wg-ref-titulo">📚 Referências Científicas</div>
            {treino.referencias.map((r, i) => (
              <div key={i} className="wg-ref-item">• {r}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
