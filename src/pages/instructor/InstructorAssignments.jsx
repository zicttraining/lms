// InstructorAssignments.jsx — Teachers create, edit, and manage homework assignments
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/AuthContext'

const EMPTY_FORM = {
  title: '', description: '', due_date: '', type: 'homework', instructions: '',
  week_context: '', points: 100, allow_late: true,
}

export default function InstructorAssignments() {
  const { profile } = useAuth()
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('list')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase.from('homework_assignments').select('*').order('due_date', { ascending: true })
    setAssignments(data || [])
    setLoading(false)
  }

  function startNew() {
    setForm(EMPTY_FORM)
    setEditing('new')
    setTab('create')
    setMsg('')
  }

  function startEdit(a) {
    setForm(a)
    setEditing(a.id)
    setTab('create')
    setMsg('')
  }

  async function save(e) {
    e.preventDefault()
    if (!form.title.trim()) { setMsg('Title is required'); return }
    setSaving(true); setMsg('')
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      due_date: form.due_date || null,
      type: form.type,
      instructions: form.instructions.trim() || null,
      week_context: form.week_context ? parseInt(form.week_context) : null,
      points: parseInt(form.points) || 100,
      allow_late: form.allow_late,
      created_by: profile.id,
      updated_at: new Date().toISOString(),
    }

    let error
    if (editing === 'new') {
      ({ error } = await supabase.from('homework_assignments').insert(payload))
    } else {
      ({ error } = await supabase.from('homework_assignments').update(payload).eq('id', editing))
    }

    if (error) {
      setMsg(`Error: ${error.message}`)
    } else {
      setMsg(editing === 'new' ? '✅ Assignment created!' : '✅ Saved!')
      setEditing(null)
      setForm(EMPTY_FORM)
      load()
      setTimeout(() => setTab('list'), 800)
    }
    setSaving(false)
  }

  async function deleteAssignment(id) {
    if (!confirm('Delete this assignment? Students may have already started.')) return
    await supabase.from('homework_assignments').delete().eq('id', id)
    load()
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="loader" /></div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: '1.2rem' }}>Assignments</h2>
          <div style={{ fontSize: '0.74rem', color: 'var(--muted)', marginTop: 2 }}>Create homework and quick assignments for your class</div>
        </div>
        <button onClick={startNew} className="btn btn-primary btn-sm">+ New Assignment</button>
      </div>

      {tab === 'list' && (
        <div>
          {assignments.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>📝</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>No assignments yet</div>
              <div style={{ fontSize: '0.78rem' }}>Create your first assignment to get started</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {assignments.map(a => {
                const dueDate = a.due_date ? new Date(a.due_date) : null
                const isPast = dueDate && dueDate < new Date()
                return (
                  <div key={a.id} className="card" style={{ padding: '1.25rem', borderLeft: `3px solid ${isPast ? 'var(--muted)' : 'var(--orange)'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{a.title}</div>
                        {a.description && <div style={{ fontSize: '0.78rem', color: 'var(--text2)', marginBottom: 6, lineHeight: 1.5 }}>{a.description}</div>}
                        <div style={{ display: 'flex', gap: 12, fontSize: '0.72rem', color: 'var(--muted)', flexWrap: 'wrap' }}>
                          {a.type && <span>📌 {a.type}</span>}
                          {a.due_date && <span>📅 Due {new Date(a.due_date).toLocaleDateString()}</span>}
                          {a.points && <span>⭐ {a.points} points</span>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                        <button onClick={() => startEdit(a)} className="btn btn-ghost btn-sm" style={{ fontSize: '0.72rem' }}>Edit</button>
                        <button onClick={() => deleteAssignment(a.id)} className="btn btn-danger btn-sm" style={{ fontSize: '0.72rem' }}>Delete</button>
                      </div>
                    </div>
                    {a.instructions && (
                      <div style={{ padding: '10px 12px', background: 'var(--s2)', borderRadius: 8, fontSize: '0.76rem', color: 'var(--text2)', lineHeight: 1.6, marginBottom: 10 }}>
                        {a.instructions}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 8, fontSize: '0.68rem' }}>
                      <span style={{ background: 'var(--s2)', color: 'var(--muted)', padding: '2px 8px', borderRadius: 4 }}>Late: {a.allow_late ? '✅ Allowed' : '❌ Not allowed'}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'create' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>
            {editing === 'new' ? 'Create Assignment' : 'Edit Assignment'}
          </div>
          <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className="input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Assignment title" />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="input" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What students should know..." />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="input select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  <option value="homework">Homework</option>
                  <option value="quiz">Quick Quiz</option>
                  <option value="discussion">Discussion</option>
                  <option value="project">Project</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input className="input" type="datetime-local" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Points</label>
                <input className="input" type="number" value={form.points} onChange={e => setForm(f => ({ ...f, points: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Week (context)</label>
                <input className="input" type="number" value={form.week_context} onChange={e => setForm(f => ({ ...f, week_context: e.target.value }))} placeholder="e.g. 3" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Instructions</label>
              <textarea className="input" rows={4} value={form.instructions} onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))} placeholder="Detailed instructions for the assignment..." />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.allow_late} onChange={e => setForm(f => ({ ...f, allow_late: e.target.checked }))} />
                Allow late submissions
              </label>
            </div>
            {msg && <div style={{ padding: '10px 14px', background: msg.includes('✅') ? 'var(--green-d)' : 'rgba(239,68,68,0.08)', border: msg.includes('✅') ? '1px solid var(--green-b)' : '1px solid rgba(239,68,68,0.2)', borderRadius: 8, fontSize: '0.78rem', color: msg.includes('✅') ? 'var(--green)' : 'var(--danger)' }}>{msg}</div>}
            <div style={{ display: 'flex', gap: 8, marginTop: '1rem' }}>
              <button type="submit" disabled={saving} className="btn btn-primary" style={{ flex: 1 }}>
                {saving ? 'Saving...' : 'Save Assignment'}
              </button>
              <button type="button" onClick={() => { setTab('list'); setEditing(null); setForm(EMPTY_FORM) }} className="btn btn-ghost">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
