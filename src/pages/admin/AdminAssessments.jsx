// AdminAssessments.jsx — Create, manage, and grade project-based assessments
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { CAREER_TRACKS } from '../../lib/programData'

const DIFFICULTY_COLORS = {
  beginner: { bg: 'rgba(34,197,94,0.12)', color: '#22C55E' },
  intermediate: { bg: 'rgba(249,115,22,0.12)', color: '#F97316' },
  advanced: { bg: 'rgba(239,68,68,0.12)', color: '#EF4444' },
}
const TYPE_ICONS = { project: '🔨', reflection: '💭', portfolio: '📁', case_study: '📊' }
const EMPTY_FORM = {
  title: '', description: '', deliverable: '', estimated_hours: 2,
  difficulty: 'intermediate', type: 'project', week_context: '',
  specialization: [], instructions: [], rubric: [],
  active: true,
}

export default function AdminAssessments() {
  const [tab, setTab] = useState('library')
  const [assessments, setAssessments] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterTrack, setFilterTrack] = useState('all')
  const [editing, setEditing] = useState(null) // assessment id being edited, or 'new'
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [gradingId, setGradingId] = useState(null)
  const [gradeNotes, setGradeNotes] = useState('')
  const [gradeScore, setGradeScore] = useState(75)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    setLoading(true)
    const [{ data: asmt }, { data: subs }, { data: profs }] = await Promise.all([
      supabase.from('assessments').select('*').order('created_at', { ascending: false }),
      supabase.from('assessment_submissions').select('*').eq('grade', 'pending').order('submitted_at'),
      supabase.from('profiles').select('id,full_name,email,career_track').eq('role', 'student'),
    ])
    setAssessments(asmt || [])
    setSubmissions(subs || [])
    setStudents(profs || [])
    setLoading(false)
  }

  // ── Library helpers ──────────────────────────────────────────
  const filteredAssessments = assessments.filter(a =>
    filterTrack === 'all'
      ? true
      : filterTrack === 'general'
        ? (!a.specialization || a.specialization.length === 0)
        : (a.specialization || []).includes(filterTrack)
  )

  async function toggleActive(a) {
    await supabase.from('assessments').update({ active: !a.active }).eq('id', a.id)
    setAssessments(prev => prev.map(x => x.id === a.id ? { ...x, active: !a.active } : x))
  }

  function startEdit(a) {
    setForm({
      title: a.title || '', description: a.description || '', deliverable: a.deliverable || '',
      estimated_hours: a.estimated_hours || 2, difficulty: a.difficulty || 'intermediate',
      type: a.type || 'project', week_context: a.week_context || '',
      specialization: a.specialization || [], instructions: a.instructions || [], rubric: a.rubric || [],
      active: a.active !== false,
    })
    setEditing(a.id)
    setTab('create')
    setMsg('')
  }

  function startNew() {
    setForm(EMPTY_FORM)
    setEditing('new')
    setTab('create')
    setMsg('')
  }

  // ── Form helpers ─────────────────────────────────────────────
  function toggleTrack(id) {
    setForm(f => ({
      ...f,
      specialization: f.specialization.includes(id)
        ? f.specialization.filter(t => t !== id)
        : [...f.specialization, id]
    }))
  }

  function addStep() {
    setForm(f => ({ ...f, instructions: [...f.instructions, { action: '', detail: '', tip: '', warn: '' }] }))
  }
  function updateStep(i, field, val) {
    setForm(f => {
      const steps = [...f.instructions]
      steps[i] = { ...steps[i], [field]: val }
      return { ...f, instructions: steps }
    })
  }
  function removeStep(i) {
    setForm(f => ({ ...f, instructions: f.instructions.filter((_, idx) => idx !== i) }))
  }

  function addCriterion() {
    setForm(f => ({ ...f, rubric: [...f.rubric, { criterion: '', description: '' }] }))
  }
  function updateCriterion(i, field, val) {
    setForm(f => {
      const rubric = [...f.rubric]
      rubric[i] = { ...rubric[i], [field]: val }
      return { ...f, rubric }
    })
  }
  function removeCriterion(i) {
    setForm(f => ({ ...f, rubric: f.rubric.filter((_, idx) => idx !== i) }))
  }

  async function saveAssessment(e) {
    e.preventDefault()
    if (!form.title.trim()) { setMsg('Title is required.'); return }
    setSaving(true); setMsg('')
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      deliverable: form.deliverable.trim() || null,
      estimated_hours: parseFloat(form.estimated_hours) || 2,
      difficulty: form.difficulty,
      type: form.type,
      week_context: form.week_context ? parseInt(form.week_context) : null,
      specialization: form.specialization.length > 0 ? form.specialization : null,
      instructions: form.instructions.filter(s => s.action.trim()),
      rubric: form.rubric.filter(r => r.criterion.trim()),
      active: form.active,
      updated_at: new Date().toISOString(),
    }
    let error
    if (editing === 'new') {
      ;({ error } = await supabase.from('assessments').insert(payload))
    } else {
      ;({ error } = await supabase.from('assessments').update(payload).eq('id', editing))
    }
    if (error) {
      setMsg(`Error: ${error.message}`)
    } else {
      setMsg(editing === 'new' ? '✅ Assessment created!' : '✅ Saved!')
      setEditing(null)
      setForm(EMPTY_FORM)
      loadAll()
      setTimeout(() => setTab('library'), 800)
    }
    setSaving(false)
  }

  // ── Grading ──────────────────────────────────────────────────
  async function gradeSubmission(sub) {
    const score = parseInt(gradeScore) || 0
    const result = score >= 70 ? 'pass' : 'fail'
    const maxScore = assessments.find(a => a.id === sub.assessment_id)?.max_score || 100
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('assessment_submissions').update({
      grade: result, score: Math.min(score, maxScore), grade_notes: gradeNotes,
      graded_by: user?.id, graded_at: new Date().toISOString(),
    }).eq('id', sub.id)
    const assessment = assessments.find(a => a.id === sub.assessment_id)
    await supabase.from('notifications').insert({
      user_id: sub.user_id,
      title: `Assessment graded: ${assessment?.title || 'Project'}`,
      body: result === 'pass'
        ? `✅ Passed! ${gradeNotes || 'Great work.'}`
        : `📝 Needs revision: ${gradeNotes || 'Please review and resubmit.'}`,
      type: 'grade',
      link: '/assessments',
    })
    setGradingId(null); setGradeNotes(''); setGradeScore(75)
    loadAll()
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="loader" /></div>

  const tabs = [
    { id: 'library', label: '📚 Library' },
    { id: 'create', label: editing === 'new' ? '✏️ New Assessment' : editing ? '✏️ Edit Assessment' : '✏️ Create' },
    { id: 'grading', label: `📋 Grade Queue${submissions.length > 0 ? ` (${submissions.length})` : ''}` },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: '1.2rem' }}>Project Assessments</h2>
          <div style={{ fontSize: '0.74rem', color: 'var(--muted)', marginTop: 2 }}>Applied, track-specific projects students submit for grading</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={startNew}>+ New Assessment</button>
      </div>

      {/* Tabs */}
      <div className="tab-bar admin-tabs" style={{ top: 110, marginBottom: 0, borderRadius: 'var(--r) var(--r) 0 0' }}>
        {tabs.map(t => (
          <button key={t.id} className={`tab-btn ${tab === t.id ? 'active' : ''}`} onClick={() => { setTab(t.id); if (t.id !== 'create') { setEditing(null); setForm(EMPTY_FORM) } }}>{t.label}</button>
        ))}
      </div>

      <div className="card" style={{ borderRadius: '0 0 var(--r-lg) var(--r-lg)', padding: '1.5rem' }}>

        {/* ── Library ── */}
        {tab === 'library' && (
          <div>
            {/* Filter bar */}
            <div style={{ display: 'flex', gap: 8, marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>Filter:</span>
              {[{ id: 'all', label: 'All' }, { id: 'general', label: 'General' }, ...CAREER_TRACKS].map(t => (
                <button key={t.id} onClick={() => setFilterTrack(t.id)}
                  className={`btn btn-sm ${filterTrack === t.id ? 'btn-secondary' : 'btn-ghost'}`}
                  style={{ fontSize: '0.72rem' }}>
                  {t.label}
                </button>
              ))}
            </div>

            {filteredAssessments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>📝</div>
                No assessments yet. <button className="btn btn-ghost btn-sm" onClick={startNew}>Create one</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filteredAssessments.map(a => {
                  const dc = DIFFICULTY_COLORS[a.difficulty] || DIFFICULTY_COLORS.intermediate
                  const isGeneral = !a.specialization || a.specialization.length === 0
                  const tracks = isGeneral ? [] : CAREER_TRACKS.filter(t => (a.specialization || []).includes(t.id))
                  return (
                    <div key={a.id} style={{ padding: '14px 16px', background: 'var(--s2)', borderRadius: 'var(--r)', border: '1px solid var(--border)', opacity: a.active ? 1 : 0.5 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
                            <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>{TYPE_ICONS[a.type]} {a.title}</span>
                            <span style={{ ...dc, padding: '2px 8px', borderRadius: 10, fontSize: '0.64rem', fontWeight: 700, textTransform: 'capitalize' }}>{a.difficulty}</span>
                            {isGeneral
                              ? <span style={{ background: 'rgba(59,130,246,0.12)', color: '#3B82F6', padding: '2px 8px', borderRadius: 10, fontSize: '0.64rem', fontWeight: 700 }}>General</span>
                              : tracks.map(t => <span key={t.id} style={{ background: 'rgba(249,115,22,0.1)', color: 'var(--orange)', padding: '2px 8px', borderRadius: 10, fontSize: '0.64rem', fontWeight: 600 }}>{t.label}</span>)
                            }
                            {!a.active && <span style={{ background: 'rgba(100,100,100,0.2)', color: 'var(--muted)', padding: '2px 8px', borderRadius: 10, fontSize: '0.64rem' }}>Inactive</span>}
                          </div>
                          {a.description && <div style={{ fontSize: '0.76rem', color: 'var(--text2)', lineHeight: 1.5, marginBottom: 4 }}>{a.description}</div>}
                          <div style={{ display: 'flex', gap: 16, fontSize: '0.68rem', color: 'var(--muted)', marginTop: 4 }}>
                            {a.week_context && <span>Week {a.week_context}</span>}
                            <span>~{a.estimated_hours}h</span>
                            <span>{(a.instructions || []).length} steps</span>
                            <span>{(a.rubric || []).length} rubric criteria</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => startEdit(a)} style={{ fontSize: '0.72rem' }}>Edit</button>
                          <button className="btn btn-ghost btn-sm" onClick={() => toggleActive(a)} style={{ fontSize: '0.72rem' }}>
                            {a.active ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Create / Edit ── */}
        {tab === 'create' && (
          <form onSubmit={saveAssessment}>
            {/* Basic info */}
            <div className="section-label" style={{ marginBottom: '0.75rem' }}>Basic Info</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Assessment Title *</label>
                <input className="input" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. AI Productivity Blueprint" />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Description</label>
                <textarea className="input textarea" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What will students learn and build in this assessment?" />
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="input select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option value="project">🔨 Project</option>
                  <option value="reflection">💭 Reflection</option>
                  <option value="portfolio">📁 Portfolio</option>
                  <option value="case_study">📊 Case Study</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Difficulty</label>
                <select className="input select" value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Estimated Hours</label>
                <input className="input" type="number" min={0.5} max={20} step={0.5} value={form.estimated_hours} onChange={e => setForm({ ...form, estimated_hours: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Week Context (optional)</label>
                <input className="input" type="number" min={1} max={8} placeholder="1–8" value={form.week_context} onChange={e => setForm({ ...form, week_context: e.target.value })} />
              </div>
            </div>

            {/* Track targeting */}
            <div className="section-label" style={{ margin: '1.25rem 0 0.5rem' }}>Target Career Tracks</div>
            <div style={{ padding: '12px', background: 'var(--s2)', borderRadius: 'var(--r)', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text2)', marginBottom: 10 }}>
                Leave all unchecked to make this a <strong style={{ color: 'var(--orange)' }}>General</strong> assessment (visible to all students). Select specific tracks to target only those students.
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {CAREER_TRACKS.map(t => (
                  <button key={t.id} type="button"
                    onClick={() => toggleTrack(t.id)}
                    className={`btn btn-sm ${form.specialization.includes(t.id) ? 'btn-secondary' : 'btn-ghost'}`}
                    style={{ fontSize: '0.72rem' }}>
                    {form.specialization.includes(t.id) ? '✓ ' : ''}{t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Deliverable */}
            <div className="section-label" style={{ margin: '1.25rem 0 0.5rem' }}>Submission Requirements</div>
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label className="form-label">What to Submit (deliverable)</label>
              <textarea className="input textarea" rows={3} value={form.deliverable} onChange={e => setForm({ ...form, deliverable: e.target.value })} placeholder="e.g. Submit a Google Doc titled 'Project — [Your Name]' with all sections. Set sharing to Anyone with link can view." />
            </div>

            {/* Instructions (step-by-step) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1.25rem 0 0.5rem' }}>
              <div className="section-label">Step-by-Step Instructions</div>
              <button type="button" className="btn btn-ghost btn-sm" onClick={addStep} style={{ fontSize: '0.72rem' }}>+ Add Step</button>
            </div>
            {form.instructions.length === 0 && (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--muted)', fontSize: '0.78rem', background: 'var(--s2)', borderRadius: 'var(--r)' }}>
                No steps yet. Click "+ Add Step" to guide students through the project.
              </div>
            )}
            {form.instructions.map((step, i) => (
              <div key={i} style={{ padding: '12px 14px', background: 'var(--s2)', borderRadius: 'var(--r)', marginBottom: 8, borderLeft: '3px solid var(--border2)' }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'center' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--s3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 700, color: 'var(--orange)', flexShrink: 0 }}>{i + 1}</div>
                  <input className="input" style={{ flex: 1, padding: '5px 10px', fontSize: '0.8rem' }} placeholder="Step action (e.g. Identify your top 3 tasks)" value={step.action} onChange={e => updateStep(i, 'action', e.target.value)} />
                  <button type="button" onClick={() => removeStep(i)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: '4px 6px', fontSize: '0.8rem' }}>✕</button>
                </div>
                <textarea className="input textarea" rows={2} style={{ fontSize: '0.78rem', marginBottom: 6 }} placeholder="Detailed instructions for this step…" value={step.detail} onChange={e => updateStep(i, 'detail', e.target.value)} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  <input className="input" style={{ padding: '5px 10px', fontSize: '0.74rem' }} placeholder="💡 Tip (optional)" value={step.tip || ''} onChange={e => updateStep(i, 'tip', e.target.value)} />
                  <input className="input" style={{ padding: '5px 10px', fontSize: '0.74rem' }} placeholder="⚠ Warning (optional)" value={step.warn || ''} onChange={e => updateStep(i, 'warn', e.target.value)} />
                </div>
              </div>
            ))}

            {/* Rubric */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1.25rem 0 0.5rem' }}>
              <div className="section-label">Grading Rubric</div>
              <button type="button" className="btn btn-ghost btn-sm" onClick={addCriterion} style={{ fontSize: '0.72rem' }}>+ Add Criterion</button>
            </div>
            {form.rubric.length === 0 && (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--muted)', fontSize: '0.78rem', background: 'var(--s2)', borderRadius: 'var(--r)' }}>
                No rubric criteria yet. Add what you will look for when grading.
              </div>
            )}
            {form.rubric.map((r, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 28px', gap: 8, marginBottom: 8, alignItems: 'start' }}>
                <input className="input" style={{ padding: '6px 10px', fontSize: '0.78rem' }} placeholder="Criterion name" value={r.criterion} onChange={e => updateCriterion(i, 'criterion', e.target.value)} />
                <input className="input" style={{ padding: '6px 10px', fontSize: '0.78rem' }} placeholder="What you're looking for…" value={r.description} onChange={e => updateCriterion(i, 'description', e.target.value)} />
                <button type="button" onClick={() => removeCriterion(i)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: '8px 4px', fontSize: '0.8rem', alignSelf: 'center' }}>✕</button>
              </div>
            ))}

            {/* Active toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: '1.25rem', padding: '10px 14px', background: 'var(--s2)', borderRadius: 'var(--r)' }}>
              <input type="checkbox" id="active-toggle" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} style={{ width: 16, height: 16 }} />
              <label htmlFor="active-toggle" style={{ fontSize: '0.8rem', color: 'var(--text2)', cursor: 'pointer' }}>Active — students can see and submit this assessment</label>
            </div>

            {msg && <div style={{ marginTop: '0.75rem', padding: '8px 12px', background: msg.startsWith('✅') ? 'var(--green-d)' : 'rgba(239,68,68,0.1)', border: `1px solid ${msg.startsWith('✅') ? 'var(--green-b)' : 'rgba(239,68,68,0.2)'}`, borderRadius: 8, fontSize: '0.78rem', color: msg.startsWith('✅') ? 'var(--green)' : 'var(--danger)' }}>{msg}</div>}

            <div style={{ display: 'flex', gap: 8, marginTop: '1.25rem' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : editing === 'new' ? '✅ Create Assessment' : '✅ Save Changes'}</button>
              <button type="button" className="btn btn-ghost" onClick={() => { setEditing(null); setForm(EMPTY_FORM); setTab('library') }}>Cancel</button>
            </div>
          </form>
        )}

        {/* ── Grade Queue ── */}
        {tab === 'grading' && (
          <div>
            {submissions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🎉</div>All assessment submissions graded!
              </div>
            ) : (
              <div className="grid-table">
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', gap: 10, padding: '10px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)', fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  <div>Student</div><div>Assessment</div><div>Submitted</div><div>Submission</div><div>Action</div>
                </div>
                {submissions.map(sub => {
                  const student = students.find(s => s.id === sub.user_id)
                  const assessment = assessments.find(a => a.id === sub.assessment_id)
                  const track = CAREER_TRACKS.find(t => t.id === student?.career_track)
                  return (
                    <div key={sub.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', gap: 10, padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{student?.full_name}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>
                          {student?.email}
                          {track && <span style={{ color: 'var(--orange)', marginLeft: 6 }}>{track.label}</span>}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{assessment?.title}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--muted)', marginTop: 2 }}>{TYPE_ICONS[assessment?.type]} {assessment?.type}</div>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>{new Date(sub.submitted_at).toLocaleDateString()}</div>
                      <div>
                        {sub.submission_url && <a href={sub.submission_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ fontSize: '0.7rem' }}>View ↗</a>}
                        {sub.submission_text && <div style={{ fontSize: '0.72rem', color: 'var(--text2)', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub.submission_text}</div>}
                      </div>
                      <div>
                        {gradingId === sub.id ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, minWidth: 220 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <label style={{ fontSize: '0.68rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>Score (0–100)</label>
                              <input className="input" type="number" min={0} max={100} style={{ flex: 1, padding: '4px 8px', fontSize: '0.82rem', fontWeight: 700 }} value={gradeScore} onChange={e => setGradeScore(e.target.value)} />
                              <span style={{ fontSize: '0.68rem', color: parseInt(gradeScore) >= 70 ? 'var(--green)' : 'var(--danger)', fontWeight: 700, whiteSpace: 'nowrap' }}>{parseInt(gradeScore) >= 70 ? '✅ Pass' : '❌ Fail'}</span>
                            </div>
                            <input className="input" style={{ padding: '4px 8px', fontSize: '0.74rem' }} placeholder="Feedback notes (optional)…" value={gradeNotes} onChange={e => setGradeNotes(e.target.value)} />
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => gradeSubmission(sub)}>Submit Grade</button>
                              <button className="btn btn-ghost btn-sm" onClick={() => { setGradingId(null); setGradeScore(75) }}>✕</button>
                            </div>
                          </div>
                        ) : (
                          <button className="btn btn-secondary btn-sm" onClick={() => { setGradingId(sub.id); setGradeNotes(''); setGradeScore(75) }}>Grade</button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
