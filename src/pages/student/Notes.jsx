// Notes.jsx — In-app note-taking and notebook for students
import { useState, useEffect } from 'react'
import { useAuth } from '../../lib/AuthContext'
import { supabase } from '../../lib/supabase'
import AppLayout from '../../components/layout/AppLayout'

export default function Notes() {
  const { profile } = useAuth()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ title: '', content: '', color: 'blue', tags: '' })
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [filterColor, setFilterColor] = useState('all')

  useEffect(() => { load() }, [profile?.id])

  async function load() {
    const { data } = await supabase.from('student_notes').select('*').eq('user_id', profile.id).order('updated_at', { ascending: false })
    setNotes(data || [])
    setLoading(false)
  }

  function startNew() {
    setForm({ title: '', content: '', color: 'blue', tags: '' })
    setSelected('new')
  }

  function selectNote(n) {
    setForm({ title: n.title, content: n.content, color: n.color || 'blue', tags: n.tags || '' })
    setSelected(n.id)
  }

  async function save() {
    if (!form.title.trim()) return
    setSaving(true)
    const payload = {
      user_id: profile.id,
      title: form.title.trim(),
      content: form.content.trim(),
      color: form.color,
      tags: form.tags.trim() ? form.tags.split(',').map(t => t.trim()) : [],
      updated_at: new Date().toISOString(),
    }

    if (selected === 'new') {
      await supabase.from('student_notes').insert({ ...payload, created_at: new Date().toISOString() })
    } else {
      await supabase.from('student_notes').update(payload).eq('id', selected)
    }
    setSaving(false)
    load()
    setSelected(null)
    setForm({ title: '', content: '', color: 'blue', tags: '' })
  }

  async function deleteNote(id) {
    if (!confirm('Delete this note?')) return
    await supabase.from('student_notes').delete().eq('id', id)
    load()
    setSelected(null)
  }

  if (loading) return <AppLayout><div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="loader" /></div></AppLayout>

  const colors = {
    blue: { bg: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', accent: '#3B82F6' },
    orange: { bg: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', accent: '#F97316' },
    green: { bg: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', accent: '#22C55E' },
    purple: { bg: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', accent: '#8B5CF6' },
  }

  const filtered = notes.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase())
    const matchesColor = filterColor === 'all' || n.color === filterColor
    return matchesSearch && matchesColor
  })

  return (
    <AppLayout>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1.5rem', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem', minHeight: '80vh' }}>
        {/* Sidebar */}
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <button onClick={startNew} className="btn btn-primary" style={{ width: '100%', marginBottom: '0.75rem' }}>+ New Note</button>
            <input type="text" className="input" placeholder="Search notes..." value={search} onChange={e => setSearch(e.target.value)} style={{ fontSize: '0.75rem' }} />
          </div>

          {/* Color filter */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Filter by color</div>
            {['all', 'blue', 'orange', 'green', 'purple'].map(c => (
              <button key={c} onClick={() => setFilterColor(c)} style={{ width: '100%', padding: '6px 10px', marginBottom: 4, textAlign: 'left', fontSize: '0.76rem', fontWeight: filterColor === c ? 700 : 400, color: filterColor === c ? 'var(--orange)' : 'var(--text2)', background: filterColor === c ? 'var(--s2)' : 'transparent', border: `1px solid ${filterColor === c ? 'var(--orange)' : 'var(--border)'}`, borderRadius: 6, cursor: 'pointer' }}>
                {c === 'all' ? '🔍 All Notes' : `🔹 ${c.charAt(0).toUpperCase() + c.slice(1)}`}
              </button>
            ))}
          </div>

          {/* Notes list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.72rem' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>📝</div>
                No notes yet
              </div>
            ) : (
              filtered.map(n => (
                <button key={n.id} onClick={() => selectNote(n)} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '0.75rem', fontWeight: selected === n.id ? 700 : 500, color: selected === n.id ? 'var(--orange)' : 'var(--text2)', background: selected === n.id ? 'var(--s2)' : 'transparent', border: `1px solid ${selected === n.id ? 'var(--border2)' : 'var(--border)'}`, borderRadius: 6, cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {n.title || '(Untitled)'}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {selected ? (
            <div className="card" style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: 8 }}>
                <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>
                  {selected === 'new' ? 'New Note' : 'Edit Note'}
                </h2>
                <div style={{ display: 'flex', gap: 6 }}>
                  {selected !== 'new' && <button onClick={() => deleteNote(selected)} className="btn btn-danger btn-sm" style={{ fontSize: '0.72rem' }}>Delete</button>}
                  <button onClick={() => { setSelected(null); setForm({ title: '', content: '', color: 'blue', tags: '' }) }} className="btn btn-ghost btn-sm" style={{ fontSize: '0.72rem' }}>Close</button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, marginBottom: '1rem', alignItems: 'flex-start' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <input className="input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Note title..." style={{ fontWeight: 700, fontSize: '0.95rem' }} />
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {Object.keys(colors).map(c => (
                    <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))} style={{ width: 28, height: 28, borderRadius: 6, background: colors[c].bg, border: form.color === c ? `2px solid ${colors[c].accent}` : `1px solid ${colors[c].accent}30`, cursor: 'pointer' }} title={c} />
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <textarea className="input" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Write your notes here..." style={{ flex: 1, minHeight: 300, resize: 'vertical', fontFamily: '"Plus Jakarta Sans", sans-serif' }} />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Tags (comma separated)</label>
                <input className="input" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="e.g. Week 3, Important, Review" style={{ fontSize: '0.8rem' }} />
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={save} disabled={saving || !form.title.trim()} className="btn btn-primary" style={{ flex: 1 }}>
                  {saving ? 'Saving...' : 'Save Note'}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--muted)', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>📓</div>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>No note selected</div>
                <div style={{ fontSize: '0.78rem' }}>Click a note on the left or create a new one to start</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
