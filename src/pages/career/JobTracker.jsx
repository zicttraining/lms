import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../lib/AuthContext'
import { supabase } from '../../lib/supabase'
import AppLayout from '../../components/layout/AppLayout'

const STATUSES = [
  { id: 'saved', label: 'Saved', icon: '🔖', color: 'var(--muted)' },
  { id: 'applied', label: 'Applied', icon: '📤', color: 'var(--blue)' },
  { id: 'phone_screen', label: 'Phone Screen', icon: '📞', color: 'var(--yellow)' },
  { id: 'interview', label: 'Interview', icon: '🎤', color: 'var(--orange)' },
  { id: 'offer', label: 'Offer', icon: '🎉', color: 'var(--green)' },
  { id: 'rejected', label: 'Rejected', icon: '❌', color: 'var(--danger)' },
]

export default function JobTracker() {
  const { profile } = useAuth()
  const { t } = useTranslation()
  const [jobs, setJobs] = useState([])
  const [view, setView] = useState('kanban')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ company: '', title: '', location: '', salary_range: '', status: 'saved', job_url: '', contact_name: '', contact_email: '', notes: '' })
  const [saving, setSaving] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')

  useEffect(() => { loadJobs() }, [profile?.id])

  async function loadJobs() {
    const { data } = await supabase.from('job_applications').select('*').eq('user_id', profile.id).order('created_at', { ascending: false })
    setJobs(data || [])
  }

  async function saveJob() {
    setSaving(true)
    const payload = { ...form, user_id: profile.id }
    if (editing) await supabase.from('job_applications').update(payload).eq('id', editing)
    else await supabase.from('job_applications').insert(payload)
    loadJobs(); setModalOpen(false); setEditing(null); setForm({ company: '', title: '', location: '', salary_range: '', status: 'saved', job_url: '', contact_name: '', contact_email: '', notes: '' })
    setSaving(false)
  }

  async function updateStatus(id, status) {
    await supabase.from('job_applications').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
    loadJobs()
  }

  function openEdit(job) { setForm(job); setEditing(job.id); setModalOpen(true) }

  const statusCounts = STATUSES.reduce((acc, s) => { acc[s.id] = jobs.filter(j => j.status === s.id).length; return acc }, {})

  return (
    <AppLayout>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1.5rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: 4 }}>{t('jobTracker')} 💼</h1>
            <p style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>{jobs.length} applications tracked</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className={`btn btn-sm ${view === 'kanban' ? 'btn-secondary' : 'btn-ghost'}`} onClick={() => setView('kanban')}>⊞ Kanban</button>
            <button className={`btn btn-sm ${view === 'list' ? 'btn-secondary' : 'btn-ghost'}`} onClick={() => setView('list')}>☰ List</button>
            <button className="btn btn-primary btn-sm" onClick={() => { setEditing(null); setModalOpen(true) }}>+ {t('addJob')}</button>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {STATUSES.map(s => (
            <div key={s.id} style={{ padding: '6px 14px', background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 20, fontSize: '0.76rem', color: statusCounts[s.id] > 0 ? s.color : 'var(--muted)' }}>
              {s.icon} {s.label}: <strong>{statusCounts[s.id]}</strong>
            </div>
          ))}
        </div>

        {/* AI research prompt */}
        <div className="card card-p" style={{ marginBottom: '1.5rem', borderLeft: '3px solid var(--orange)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--orange)', fontWeight: 700, marginBottom: 6 }}>🤖 AI Research Help</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="input" placeholder='e.g. "Research [Company Name] — culture, tech stack, AI tools used, recent news"' value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} style={{ flex: 1 }} />
            <a href={`https://perplexity.ai/?q=${encodeURIComponent(aiPrompt)}`} target="_blank" rel="noopener noreferrer" className={`btn btn-primary btn-sm ${!aiPrompt ? 'btn-ghost' : ''}`} style={{ flexShrink: 0 }}>Research →</a>
          </div>
        </div>

        {/* Kanban view */}
        {view === 'kanban' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', overflowX: 'auto' }}>
            {STATUSES.map(status => (
              <div key={status.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, padding: '4px 0' }}>
                  <span>{status.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.8rem', color: status.color }}>{status.label}</span>
                  <span style={{ marginLeft: 'auto', background: 'var(--s3)', color: 'var(--muted)', fontSize: '0.65rem', padding: '1px 6px', borderRadius: 10 }}>{statusCounts[status.id]}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 80 }}>
                  {jobs.filter(j => j.status === status.id).map(job => (
                    <div key={job.id} className="card" style={{ padding: '10px 12px', cursor: 'pointer', borderLeft: `3px solid ${status.color}` }} onClick={() => openEdit(job)}>
                      <div style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: 2 }}>{job.title}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text2)' }}>{job.company}</div>
                      {job.location && <div style={{ fontSize: '0.68rem', color: 'var(--muted)', marginTop: 3 }}>📍 {job.location}</div>}
                      {job.salary_range && <div style={{ fontSize: '0.68rem', color: 'var(--green)', marginTop: 2 }}>💰 {job.salary_range}</div>}
                      {job.applied_date && <div style={{ fontSize: '0.66rem', color: 'var(--muted)', marginTop: 3 }}>Applied: {new Date(job.applied_date).toLocaleDateString()}</div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List view */}
        {view === 'list' && (
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 100px 80px', gap: 10, padding: '10px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)', fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              <div>Position</div><div>Company</div><div>Status</div><div>Salary</div><div>Applied</div><div></div>
            </div>
            {jobs.map(job => {
              const s = STATUSES.find(s => s.id === job.status)
              return (
                <div key={job.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 100px 80px', gap: 10, padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{job.title}</div>
                    {job.location && <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{job.location}</div>}
                  </div>
                  <div style={{ fontSize: '0.82rem' }}>{job.company}</div>
                  <div><span className={`badge status-${job.status}`} style={{ background: 'transparent', border: `1px solid ${s?.color}`, color: s?.color }}>{s?.icon} {s?.label}</span></div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--green)' }}>{job.salary_range || '—'}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>{job.applied_date ? new Date(job.applied_date).toLocaleDateString() : '—'}</div>
                  <button className="btn btn-ghost btn-sm" onClick={() => openEdit(job)}>Edit</button>
                </div>
              )
            })}
            {jobs.length === 0 && (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)' }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>💼</div>
                No applications yet. Click "+ Add Application" to get started.
              </div>
            )}
          </div>
        )}

        {/* Modal */}
        {modalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div className="card fade-up" style={{ width: "100%", maxWidth: 560, maxHeight: "90vh", overflow: "auto", padding: "1.5rem" }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontWeight: 700 }}>{editing ? 'Edit Application' : t('addJob')}</h3>
                <button className="btn btn-ghost btn-sm" onClick={() => setModalOpen(false)}>✕</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group"><label className="form-label">{t('company')} *</label><input className="input" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label">{t('jobTitle')} *</label><input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group"><label className="form-label">Location</label><input className="input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Denver, CO / Remote" /></div>
                  <div className="form-group"><label className="form-label">Salary Range</label><input className="input" value={form.salary_range} onChange={e => setForm({ ...form, salary_range: e.target.value })} placeholder="$50K–$65K" /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">{t('status')}</label>
                    <select className="input select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                      {STATUSES.map(s => <option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label className="form-label">Date Applied</label><input type="date" className="input" value={form.applied_date || ''} onChange={e => setForm({ ...form, applied_date: e.target.value })} /></div>
                </div>
                <div className="form-group"><label className="form-label">Job URL</label><input type="url" className="input" value={form.job_url} onChange={e => setForm({ ...form, job_url: e.target.value })} placeholder="https://linkedin.com/jobs/…" /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group"><label className="form-label">Contact Name</label><input className="input" value={form.contact_name} onChange={e => setForm({ ...form, contact_name: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label">Contact Email</label><input type="email" className="input" value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} /></div>
                </div>
                <div className="form-group"><label className="form-label">Notes</label><textarea className="input textarea" rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Interview prep notes, follow-up reminders…" /></div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: '1.25rem' }}>
                <button className="btn btn-primary" onClick={saveJob} disabled={saving || !form.company || !form.title} style={{ flex: 1 }}>{saving ? 'Saving…' : editing ? 'Update Application' : 'Add Application'}</button>
                <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
