// AdminGrading.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { WEEKS } from '../../lib/programData'

export function AdminGrading() {
  const [queue, setQueue] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [grading, setGrading] = useState(null)
  const [notes, setNotes] = useState('')

  useEffect(() => { loadQueue() }, [])

  async function loadQueue() {
    const [{ data: prog }, { data: profs }] = await Promise.all([
      supabase.from('progress').select('*').eq('grade', 'pending').order('completed_at'),
      supabase.from('profiles').select('id,full_name,email').eq('role', 'student')
    ])
    setQueue(prog || [])
    setStudents(profs || [])
    setLoading(false)
  }

  async function grade(id, result, studentId, weekNum, labNum) {
    await supabase.from('progress').update({ grade: result, grade_notes: notes, graded_at: new Date().toISOString() }).eq('id', id)
    await supabase.from('notifications').insert({
      user_id: studentId, title: `Lab graded: Week ${weekNum} Lab ${labNum}`,
      body: result === 'pass' ? `✅ Passed! ${notes || 'Great work.'}` : `📝 Needs revision: ${notes || 'Please review and resubmit.'}`,
      type: 'grade', link: `/program/week/${weekNum}/lab/${labNum}`
    })
    setGrading(null); setNotes('')
    loadQueue()
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="loader" /></div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ fontWeight: 800, fontSize: '1.2rem' }}>Grading Queue <span style={{ color: 'var(--yellow)', marginLeft: 8 }}>{queue.length}</span></h2>
      </div>
      {queue.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🎉</div>All labs graded — queue is empty!
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 10, padding: '10px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)', fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            <div>Student</div><div>Week · Lab</div><div>Submitted</div><div>Submission</div><div>Action</div>
          </div>
          {queue.map(item => {
            const student = students.find(s => s.id === item.user_id)
            const week = WEEKS[item.week_num - 1]
            const lab = week?.labs[item.lab_num - 1]
            return (
              <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 10, padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{student?.full_name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{student?.email}</div>
                </div>
                <div style={{ fontSize: '0.8rem' }}>W{item.week_num} · L{item.lab_num}<div style={{ fontSize: '0.68rem', color: 'var(--muted)', marginTop: 2 }}>{lab?.title}</div></div>
                <div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>{new Date(item.completed_at).toLocaleDateString()}</div>
                <div>
                  {item.submission_url && <a href={item.submission_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ fontSize: '0.7rem' }}>View ↗</a>}
                  {item.submission_text && <div style={{ fontSize: '0.72rem', color: 'var(--text2)', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.submission_text}</div>}
                </div>
                <div style={{ display: 'flex', gap: 5 }}>
                  {grading === item.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, minWidth: 200 }}>
                      <input className="input" style={{ padding: '4px 8px', fontSize: '0.74rem' }} placeholder="Instructor notes (optional)…" value={notes} onChange={e => setNotes(e.target.value)} />
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-success btn-sm" style={{ flex: 1 }} onClick={() => grade(item.id, 'pass', item.user_id, item.week_num, item.lab_num)}>✅ Pass</button>
                        <button className="btn btn-danger btn-sm" style={{ flex: 1 }} onClick={() => grade(item.id, 'fail', item.user_id, item.week_num, item.lab_num)}>❌ Revise</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setGrading(null)}>✕</button>
                      </div>
                    </div>
                  ) : (
                    <button className="btn btn-secondary btn-sm" onClick={() => { setGrading(item.id); setNotes('') }}>Grade</button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
export default AdminGrading

// AdminStudents.jsx placeholder
export function AdminStudents() {
  const [students, setStudents] = useState([])
  const [allProgress, setAllProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const [inviteForm, setInviteForm] = useState({ full_name: '', email: '', password: '' })
  const [inviting, setInviting] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => { loadAll() }, [])
  async function loadAll() {
    const [{ data: profs }, { data: prog }] = await Promise.all([
      supabase.from('profiles').select('*').eq('role', 'student').order('enrolled_at'),
      supabase.from('progress').select('*')
    ])
    setStudents(profs || [])
    setAllProgress(prog || [])
    setLoading(false)
  }

  async function createStudent(e) {
    e.preventDefault(); setInviting(true); setMsg('')
    const { error } = await supabase.auth.signUp({ email: inviteForm.email, password: inviteForm.password, options: { data: { full_name: inviteForm.full_name, role: 'student' } } })
    if (error) setMsg(`Error: ${error.message}`)
    else { setMsg(`✅ Account created for ${inviteForm.full_name}. Share credentials: ${inviteForm.email} / ${inviteForm.password}`); setInviteForm({ full_name: '', email: '', password: '' }); loadAll() }
    setInviting(false)
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="loader" /></div>

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.25rem' }}>
      <div>
        <h2 style={{ fontWeight: 800, marginBottom: '1rem' }}>Students ({students.length})</h2>
        <div className="card" style={{ overflow: 'hidden' }}>
          {students.map(st => {
            const done = allProgress.filter(p => p.user_id === st.id && p.completed).length
            const pct = Math.round((done / 52) * 100)
            return (
              <div key={st.id} style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--orange-d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--orange)', flexShrink: 0 }}>
                  {st.full_name?.slice(0, 1).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{st.full_name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{st.email} · {st.language?.toUpperCase()}</div>
                </div>
                <div style={{ width: 120 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', marginBottom: 3 }}>
                    <span style={{ color: 'var(--muted)' }}>{done}/52</span>
                    <span style={{ color: 'var(--orange)' }}>{pct}%</span>
                  </div>
                  <div className="progress-bar progress-bar-sm"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
                </div>
                <Link to={`/admin/students/${st.id}`} className="btn btn-ghost btn-sm">View →</Link>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem' }}>Add Student</h3>
        <div className="card card-p">
          <form onSubmit={createStudent} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="form-group"><label className="form-label">Full Name</label><input className="input" required value={inviteForm.full_name} onChange={e => setInviteForm({ ...inviteForm, full_name: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Email</label><input type="email" className="input" required value={inviteForm.email} onChange={e => setInviteForm({ ...inviteForm, email: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Temporary Password</label><input className="input" required minLength={8} value={inviteForm.password} onChange={e => setInviteForm({ ...inviteForm, password: e.target.value })} placeholder="Min 8 characters" /></div>
            <button type="submit" className="btn btn-primary" disabled={inviting}>{inviting ? 'Creating…' : 'Create Account'}</button>
          </form>
          {msg && <div style={{ marginTop: 10, padding: '10px 12px', background: msg.startsWith('✅') ? 'var(--green-d)' : 'rgba(239,68,68,0.1)', border: `1px solid ${msg.startsWith('✅') ? 'var(--green-b)' : 'rgba(239,68,68,0.2)'}`, borderRadius: 8, fontSize: '0.76rem', color: msg.startsWith('✅') ? 'var(--green)' : 'var(--danger)', lineHeight: 1.6 }}>{msg}</div>}
        </div>
      </div>
    </div>
  )
}

// Stub pages
export function AdminStudentDetail() { return <div style={{ padding: '1rem', color: 'var(--muted)' }}>Student detail view — select from Students tab</div> }
export function AdminAttendance() {
  return (
    <div>
      <h2 style={{ fontWeight: 800, marginBottom: '1rem' }}>Attendance Tracking</h2>
      <div className="card card-p" style={{ borderLeft: '3px solid var(--orange)', marginBottom: '1rem' }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Class Session Attendance</div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.7 }}>Students check in to each live session from their Dashboard. Here you can view attendance records, mark students present or absent, and track overall attendance rates. Minimum 85% required for certificate eligibility.</p>
      </div>
      <div className="card card-p" style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
        <div style={{ fontSize: '2rem', marginBottom: 8 }}>✅</div>
        Create class sessions in Supabase → class_sessions table, then students can check in automatically when they log in on class days.
      </div>
    </div>
  )
}

export function AdminNotifications() {
  const [form, setForm] = useState({ title: '', body: '', type: 'info', audience: 'all' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  async function sendNotification() {
    setSending(true)
    const { data: students } = await supabase.from('profiles').select('id').eq('role', 'student')
    if (students?.length) {
      await supabase.from('notifications').insert(students.map(s => ({ user_id: s.id, ...form })))
    }
    setSent(true); setSending(false)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ fontWeight: 800, marginBottom: '1rem' }}>Send Notification</h2>
      <div className="card card-p">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="form-group"><label className="form-label">Title</label><input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Week 3 starts Monday!" /></div>
          <div className="form-group"><label className="form-label">Message</label><textarea className="input textarea" rows={4} value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} placeholder="Full notification message…" /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="input select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="info">ℹ Info</option>
                <option value="success">✅ Success</option>
                <option value="warning">⚠ Warning</option>
                <option value="alert">🚨 Alert</option>
                <option value="grade">📊 Grade</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Audience</label>
              <select className="input select" value={form.audience} onChange={e => setForm({ ...form, audience: e.target.value })}>
                <option value="all">All Students</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary" onClick={sendNotification} disabled={sending || !form.title || !form.body}>
            {sending ? 'Sending…' : sent ? '✅ Sent!' : '📣 Send to All Students'}
          </button>
        </div>
      </div>
    </div>
  )
}
