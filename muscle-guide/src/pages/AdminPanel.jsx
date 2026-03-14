import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import './AdminPanel.css'

function GroupForm({ group, onSave, onCancel }) {
  const [form, setForm] = useState(group || { name: '', emoji: '💪', description: '', sort_order: 0 })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    if (form.id) {
      await supabase.from('muscle_groups').update(form).eq('id', form.id)
    } else {
      await supabase.from('muscle_groups').insert(form)
    }
    setSaving(false)
    onSave()
  }

  return (
    <div className="form-card">
      <h3>{form.id ? 'Editar Grupo' : 'Novo Grupo'}</h3>
      <div className="form-grid">
        <div className="form-field">
          <label>Emoji</label>
          <input value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} placeholder="💪" />
        </div>
        <div className="form-field">
          <label>Nome</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: Glúteo Máximo" />
        </div>
        <div className="form-field full">
          <label>Descrição</label>
          <textarea value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Descrição científica do grupo muscular..." />
        </div>
        <div className="form-field">
          <label>Ordem</label>
          <input type="number" value={form.sort_order || 0} onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))} />
        </div>
      </div>
      <div className="form-actions">
        <button className="btn-secondary" onClick={onCancel}>Cancelar</button>
        <button className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
      </div>
    </div>
  )
}

function ExerciseForm({ exercise, groups, onSave, onCancel }) {
  const [form, setForm] = useState(exercise || {
    name: '', muscle_group_id: groups[0]?.id || '',
    activation_pct: 70, secondary_muscles: '',
    scientific_note: '', reference: '',
    media_url: '', video_url: ''
  })
  const [saving, setSaving] = useState(false)
  const [uploadingMedia, setUploadingMedia] = useState(false)

  const handleSave = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    if (form.id) {
      await supabase.from('exercises').update(form).eq('id', form.id)
    } else {
      await supabase.from('exercises').insert(form)
    }
    setSaving(false)
    onSave()
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingMedia(true)
    const ext = file.name.split('.').pop()
    const path = `exercises/${Date.now()}.${ext}`
    const { data, error } = await supabase.storage.from('media').upload(path, file, { upsert: true })
    if (!error) {
      const { data: urlData } = supabase.storage.from('media').getPublicUrl(path)
      const isVideo = file.type.startsWith('video/')
      if (isVideo) {
        setForm(f => ({ ...f, video_url: urlData.publicUrl }))
      } else {
        setForm(f => ({ ...f, media_url: urlData.publicUrl }))
      }
    }
    setUploadingMedia(false)
  }

  const removeMedia = () => setForm(f => ({ ...f, media_url: '', video_url: '' }))

  return (
    <div className="form-card">
      <h3>{form.id ? 'Editar Exercício' : 'Novo Exercício'}</h3>
      <div className="form-grid">
        <div className="form-field full">
          <label>Nome do Exercício</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: Hip Thrust" />
        </div>
        <div className="form-field">
          <label>Grupo Muscular</label>
          <select value={form.muscle_group_id} onChange={e => setForm(f => ({ ...f, muscle_group_id: e.target.value }))}>
            {groups.map(g => <option key={g.id} value={g.id}>{g.emoji} {g.name}</option>)}
          </select>
        </div>
        <div className="form-field">
          <label>Ativação EMG (%)</label>
          <input type="number" min="1" max="100" value={form.activation_pct} onChange={e => setForm(f => ({ ...f, activation_pct: Number(e.target.value) }))} />
        </div>
        <div className="form-field full">
          <label>Músculos Secundários</label>
          <input value={form.secondary_muscles || ''} onChange={e => setForm(f => ({ ...f, secondary_muscles: e.target.value }))} placeholder="Ex: Isquiotibiais, Eretores" />
        </div>
        <div className="form-field full">
          <label>Observação Científica</label>
          <textarea value={form.scientific_note || ''} onChange={e => setForm(f => ({ ...f, scientific_note: e.target.value }))} rows={3} placeholder="Observação prática sobre o exercício..." />
        </div>
        <div className="form-field full">
          <label>Referência Científica</label>
          <input value={form.reference || ''} onChange={e => setForm(f => ({ ...f, reference: e.target.value }))} placeholder="Ex: Contreras et al. (2015) — J Strength Cond Res" />
        </div>
        <div className="form-field full">
          <label>URL do Vídeo (YouTube ou link direto)</label>
          <input value={form.video_url || ''} onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))} placeholder="https://youtube.com/watch?v=..." />
        </div>

        {/* Upload */}
        <div className="form-field full">
          <label>Ou fazer upload de foto/vídeo</label>
          <div className="upload-area">
            <label className="upload-btn">
              {uploadingMedia ? 'Enviando...' : '📁 Escolher arquivo'}
              <input type="file" accept="image/*,video/*" onChange={handleFileUpload} hidden disabled={uploadingMedia} />
            </label>
            {(form.media_url || form.video_url) && (
              <div className="upload-preview">
                {form.video_url && !form.video_url.includes('youtube') ? (
                  <video src={form.video_url} className="preview-media" controls />
                ) : form.media_url ? (
                  <img src={form.media_url} alt="preview" className="preview-media" />
                ) : (
                  <span className="preview-url">🎬 {form.video_url?.slice(0, 60)}...</span>
                )}
                <button className="btn-remove" onClick={removeMedia}>✕ Remover</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="form-actions">
        <button className="btn-secondary" onClick={onCancel}>Cancelar</button>
        <button className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
      </div>
    </div>
  )
}

export default function AdminPanel({ onLogout }) {
  const [tab, setTab] = useState('exercises')
  const [groups, setGroups] = useState([])
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [editGroup, setEditGroup] = useState(null)
  const [editExercise, setEditExercise] = useState(null)
  const [showGroupForm, setShowGroupForm] = useState(false)
  const [showExForm, setShowExForm] = useState(false)
  const [filterGroup, setFilterGroup] = useState('all')
  const [search, setSearch] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)

  const load = async () => {
    setLoading(true)
    const [{ data: g }, { data: e }] = await Promise.all([
      supabase.from('muscle_groups').select('*').order('sort_order'),
      supabase.from('exercises').select('*').order('name')
    ])
    setGroups(g || [])
    setExercises(e || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const deleteGroup = async (id) => {
    await supabase.from('exercises').delete().eq('muscle_group_id', id)
    await supabase.from('muscle_groups').delete().eq('id', id)
    setConfirmDelete(null)
    load()
  }

  const deleteExercise = async (id) => {
    await supabase.from('exercises').delete().eq('id', id)
    setConfirmDelete(null)
    load()
  }

  const filteredEx = exercises.filter(e =>
    (filterGroup === 'all' || e.muscle_group_id === filterGroup) &&
    (!search || e.name.toLowerCase().includes(search.toLowerCase()))
  )

  const groupName = (id) => groups.find(g => g.id === id)?.name || '—'

  return (
    <div className="admin-page">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-logo">
          <span>BERTOLDO</span>
          <span className="admin-logo-sub">ADMIN</span>
        </div>
        <div className="admin-nav">
          <button className={`admin-tab ${tab === 'exercises' ? 'active' : ''}`} onClick={() => setTab('exercises')}>Exercícios</button>
          <button className={`admin-tab ${tab === 'groups' ? 'active' : ''}`} onClick={() => setTab('groups')}>Grupos</button>
          <a href="/" className="admin-tab view-link" target="_blank">Ver Site ↗</a>
        </div>
        <button className="btn-logout" onClick={onLogout}>Sair</button>
      </header>

      <div className="admin-content">
        {loading ? (
          <div className="admin-loading">Carregando...</div>
        ) : tab === 'groups' ? (
          /* GROUPS TAB */
          <div>
            <div className="section-header">
              <h2>Grupos Musculares <span className="count">{groups.length}</span></h2>
              <button className="btn-primary" onClick={() => { setEditGroup(null); setShowGroupForm(true) }}>+ Novo Grupo</button>
            </div>
            {showGroupForm && (
              <GroupForm group={editGroup} onSave={() => { setShowGroupForm(false); setEditGroup(null); load() }} onCancel={() => { setShowGroupForm(false); setEditGroup(null) }} />
            )}
            <div className="items-list">
              {groups.map(g => (
                <div key={g.id} className="item-card">
                  <div className="item-main">
                    <span className="item-emoji">{g.emoji}</span>
                    <div>
                      <div className="item-name">{g.name}</div>
                      <div className="item-meta">{g.description?.slice(0, 80)}...</div>
                    </div>
                  </div>
                  <div className="item-actions">
                    <span className="item-badge">{exercises.filter(e => e.muscle_group_id === g.id).length} exercícios</span>
                    <button className="btn-edit" onClick={() => { setEditGroup(g); setShowGroupForm(true) }}>✏ Editar</button>
                    <button className="btn-delete" onClick={() => setConfirmDelete({ type: 'group', id: g.id, name: g.name })}>🗑</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* EXERCISES TAB */
          <div>
            <div className="section-header">
              <h2>Exercícios <span className="count">{filteredEx.length}</span></h2>
              <button className="btn-primary" onClick={() => { setEditExercise(null); setShowExForm(true) }}>+ Novo Exercício</button>
            </div>
            {showExForm && (
              <ExerciseForm exercise={editExercise} groups={groups} onSave={() => { setShowExForm(false); setEditExercise(null); load() }} onCancel={() => { setShowExForm(false); setEditExercise(null) }} />
            )}
            <div className="filter-bar">
              <input className="admin-search" placeholder="🔍 Buscar..." value={search} onChange={e => setSearch(e.target.value)} />
              <select className="admin-select" value={filterGroup} onChange={e => setFilterGroup(e.target.value)}>
                <option value="all">Todos os grupos</option>
                {groups.map(g => <option key={g.id} value={g.id}>{g.emoji} {g.name}</option>)}
              </select>
            </div>
            <div className="items-list">
              {filteredEx.map(ex => (
                <div key={ex.id} className="item-card">
                  <div className="item-main">
                    <div className={`activation-dot ${ex.activation_pct >= 80 ? 'red' : ex.activation_pct >= 60 ? 'orange' : ex.activation_pct >= 40 ? 'yellow' : 'green'}`} />
                    <div>
                      <div className="item-name">{ex.name}</div>
                      <div className="item-meta">{groupName(ex.muscle_group_id)} · {ex.activation_pct}% EMG {ex.video_url ? '· 🎬' : ex.media_url ? '· 📷' : ''}</div>
                    </div>
                  </div>
                  <div className="item-actions">
                    <button className="btn-edit" onClick={() => { setEditExercise(ex); setShowExForm(true) }}>✏ Editar</button>
                    <button className="btn-delete" onClick={() => setConfirmDelete({ type: 'exercise', id: ex.id, name: ex.name })}>🗑</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="confirm-box scale-in" onClick={e => e.stopPropagation()}>
            <h3>Confirmar exclusão</h3>
            <p>Excluir <strong>{confirmDelete.name}</strong>?{confirmDelete.type === 'group' ? ' Todos os exercícios deste grupo também serão excluídos.' : ''}</p>
            <div className="confirm-actions">
              <button className="btn-secondary" onClick={() => setConfirmDelete(null)}>Cancelar</button>
              <button className="btn-danger" onClick={() => confirmDelete.type === 'group' ? deleteGroup(confirmDelete.id) : deleteExercise(confirmDelete.id)}>Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
