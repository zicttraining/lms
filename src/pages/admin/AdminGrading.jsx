// AdminGrading.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { PROGRAMS, getWeeksByProgram, getWeekByNum } from '../../lib/programData'

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
          <div className="table-wrap">
          <div className="grid-table" style={{ minWidth: 620 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 10, padding: '10px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)', fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            <div>Student</div><div>Week · Lab</div><div>Submitted</div><div>Submission</div><div>Action</div>
          </div>
          {queue.map(item => {
            const student = students.find(s => s.id === item.user_id)
            const week = getWeekByNum(student?.program, item.week_num)
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
          </div>{/* grid-table */}
          </div>{/* table-wrap */}
        </div>
      )}
    </div>
  )
}
export default AdminGrading

// AdminStudents
export function AdminStudents() {
  const [students, setStudents] = useState([])
  const [allProgress, setAllProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const [inviteForm, setInviteForm] = useState({ full_name: '', email: '', password: '', program: 'applied_ai' })
  const [inviting, setInviting] = useState(false)
  const [msg, setMsg] = useState('')
  const [filterProgram, setFilterProgram] = useState('all')

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
    const { data, error } = await supabase.auth.signUp({
      email: inviteForm.email,
      password: inviteForm.password,
      options: { data: { full_name: inviteForm.full_name, role: 'student', program: inviteForm.program } }
    })
    if (error) {
      setMsg(`Error: ${error.message}`)
    } else {
      // Ensure program is written to profile (in case trigger doesn't copy it)
      if (data?.user?.id) {
        await supabase.from('profiles').update({ program: inviteForm.program }).eq('id', data.user.id)
      }
      setMsg(`✅ Account created for ${inviteForm.full_name}.\nProgram: ${PROGRAMS.find(p => p.id === inviteForm.program)?.label}\nCredentials: ${inviteForm.email} / ${inviteForm.password}`)
      setInviteForm({ full_name: '', email: '', password: '', program: 'applied_ai' })
      loadAll()
    }
    setInviting(false)
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="loader" /></div>

  const filtered = filterProgram === 'all' ? students : students.filter(s => (s.program || 'applied_ai') === filterProgram)

  return (
    <div className="dash-grid">
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: 8 }}>
          <h2 style={{ fontWeight: 800 }}>Students ({filtered.length}{filterProgram !== 'all' ? ` · ${PROGRAMS.find(p => p.id === filterProgram)?.label}` : ''})</h2>
          <select className="input select" value={filterProgram} onChange={e => setFilterProgram(e.target.value)} style={{ width: 'auto', fontSize: '0.78rem', padding: '6px 10px' }}>
            <option value="all">All Programs</option>
            {PROGRAMS.map(p => <option key={p.id} value={p.id}>{p.icon} {p.label}</option>)}
          </select>
        </div>
        <div className="card" style={{ overflow: 'hidden' }}>
          {filtered.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.82rem' }}>No students in this program yet.</div>}
          {filtered.map(st => {
            const prog = PROGRAMS.find(p => p.id === (st.program || 'applied_ai')) || PROGRAMS[0]
            const progWeeks = getWeeksByProgram(st.program)
            const totalLabs = progWeeks.reduce((s, w) => s + w.labCount, 0) || 52
            const done = allProgress.filter(p => p.user_id === st.id && p.completed).length
            const pct = Math.round((done / totalLabs) * 100)
            return (
              <div key={st.id} style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--orange-d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--orange)', flexShrink: 0 }}>
                  {st.full_name?.slice(0, 1).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{st.full_name}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span>{st.email}</span>
                    <span style={{ color: prog.color, background: `${prog.color}18`, padding: '1px 7px', borderRadius: 10, fontWeight: 600 }}>{prog.icon} {prog.label}</span>
                  </div>
                </div>
                <div style={{ width: 100, flexShrink: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', marginBottom: 3 }}>
                    <span style={{ color: 'var(--muted)' }}>{done}/{totalLabs}</span>
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
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="input" required value={inviteForm.full_name} onChange={e => setInviteForm({ ...inviteForm, full_name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="input" required value={inviteForm.email} onChange={e => setInviteForm({ ...inviteForm, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Temporary Password</label>
              <input className="input" required minLength={8} value={inviteForm.password} onChange={e => setInviteForm({ ...inviteForm, password: e.target.value })} placeholder="Min 8 characters" />
            </div>
            <div className="form-group">
              <label className="form-label">Program Enrolled</label>
              <select className="input select" value={inviteForm.program} onChange={e => setInviteForm({ ...inviteForm, program: e.target.value })}>
                {PROGRAMS.map(p => <option key={p.id} value={p.id}>{p.icon} {p.label}</option>)}
              </select>
            </div>
            <button type="submit" className="btn btn-primary" disabled={inviting}>{inviting ? 'Creating…' : 'Create Account'}</button>
          </form>
          {msg && <div style={{ marginTop: 10, padding: '10px 12px', background: msg.startsWith('✅') ? 'var(--green-d)' : 'rgba(239,68,68,0.1)', border: `1px solid ${msg.startsWith('✅') ? 'var(--green-b)' : 'rgba(239,68,68,0.2)'}`, borderRadius: 8, fontSize: '0.76rem', color: msg.startsWith('✅') ? 'var(--green)' : 'var(--danger)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{msg}</div>}
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
  const [tab, setTab] = useState('broadcast')
  // Broadcast state
  const [form, setForm] = useState({ title: '', body: '', type: 'info', program: 'all' })
  const [sending, setSending] = useState(false)
  const [broadcastResult, setBroadcastResult] = useState('')
  // Inactive students state
  const [inactiveDays, setInactiveDays] = useState(3)
  const [scanning, setScanning] = useState(false)
  const [inactiveList, setInactiveList] = useState([])
  const [reminderSent, setReminderSent] = useState(false)
  // Grade queue state
  const [pendingQueue, setPendingQueue] = useState(0)
  const [gradeThreshold, setGradeThreshold] = useState(5)
  // Weekly digest state
  const [digestSending, setDigestSending] = useState(false)
  const [digestResult, setDigestResult] = useState('')

  useEffect(() => {
    supabase.from('progress').select('id', { count: 'exact', head: true }).eq('grade', 'pending')
      .then(({ count }) => setPendingQueue(count || 0))
  }, [])

  // ── Broadcast ────────────────────────────────────────────
  async function sendBroadcast() {
    if (!form.title || !form.body) return
    setSending(true); setBroadcastResult('')
    let query = supabase.from('profiles').select('id').eq('role', 'student')
    if (form.program !== 'all') query = query.eq('program', form.program)
    const { data: students } = await query
    if (students?.length) {
      await supabase.from('notifications').insert(
        students.map(s => ({ user_id: s.id, title: form.title, body: form.body, type: form.type }))
      )
      setBroadcastResult(`✅ Sent to ${students.length} student${students.length !== 1 ? 's' : ''}.`)
      setForm({ title: '', body: '', type: 'info', program: 'all' })
    } else {
      setBroadcastResult('⚠ No students found for that audience.')
    }
    setSending(false)
  }

  // ── Inactive students ────────────────────────────────────
  async function scanInactive() {
    setScanning(true); setInactiveList([]); setReminderSent(false)
    const cutoff = new Date(Date.now() - inactiveDays * 86400000).toISOString()
    const { data: students } = await supabase.from('profiles').select('id,full_name,email,program').eq('role', 'student')
    const { data: recentProg } = await supabase.from('progress').select('user_id,completed_at')
      .eq('completed', true).gte('completed_at', cutoff)
    const recentIds = new Set((recentProg || []).map(p => p.user_id))
    const inactive = (students || []).filter(s => !recentIds.has(s.id))
    // Also flag students who have NEVER submitted
    const { data: anySub } = await supabase.from('progress').select('user_id').eq('completed', true)
    const hasSubmitted = new Set((anySub || []).map(p => p.user_id))
    const enriched = inactive.map(s => ({
      ...s,
      neverSubmitted: !hasSubmitted.has(s.id)
    }))
    setInactiveList(enriched)
    setScanning(false)
  }

  async function sendInactiveReminders() {
    if (!inactiveList.length) return
    setSending(true)
    await supabase.from('notifications').insert(
      inactiveList.map(s => ({
        user_id: s.id,
        title: s.neverSubmitted ? "Let's get started! 🚀" : `We miss you — it's been ${inactiveDays}+ days`,
        body: s.neverSubmitted
          ? 'You haven\'t submitted a lab yet. Open Week 1 and complete your first lab — it only takes 15 minutes!'
          : `You haven't submitted a lab in ${inactiveDays}+ days. Log in and keep your streak going — your next week is waiting!`,
        type: 'warning',
        link: '/program'
      }))
    )
    setReminderSent(true)
    setSending(false)
  }

  // ── Weekly digest ─────────────────────────────────────────
  async function sendWeeklyDigest() {
    setDigestSending(true); setDigestResult('')
    const { data: students } = await supabase.from('profiles').select('id,full_name').eq('role', 'student')
    const { data: allProg } = await supabase.from('progress').select('user_id,completed,grade')
    const notifications = (students || []).map(s => {
      const mine = (allProg || []).filter(p => p.user_id === s.id)
      const done = mine.filter(p => p.completed).length
      const passed = mine.filter(p => p.grade === 'pass').length
      const pending = mine.filter(p => p.grade === 'pending').length
      const firstName = s.full_name?.split(' ')[0] || 'Student'
      return {
        user_id: s.id,
        title: `Weekly Update — ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`,
        body: `${firstName}, you've completed ${done} labs total (${passed} passed${pending > 0 ? `, ${pending} awaiting grade` : ''}). ${done === 0 ? 'Start your first lab this week!' : done < 10 ? 'Keep going — you\'re building momentum!' : 'Great progress — keep the streak alive!'}`,
        type: 'info',
        link: '/dashboard'
      }
    })
    if (notifications.length) {
      await supabase.from('notifications').insert(notifications)
      setDigestResult(`✅ Weekly digest sent to ${notifications.length} students.`)
    } else {
      setDigestResult('⚠ No students found.')
    }
    setDigestSending(false)
  }

  const tabs = [
    { id: 'broadcast', label: '📣 Broadcast' },
    { id: 'inactive', label: '⏰ Inactive' },
    { id: 'queue', label: '📋 Grade Queue' },
    { id: 'digest', label: '📊 Weekly Digest' },
    { id: 'schedule', label: '🤖 Auto-Schedule' },
  ]

  return (
    <div>
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: '1.3rem' }}>Notifications & Reminders</h2>
          <div style={{ fontSize: '0.76rem', color: 'var(--muted)', marginTop: 2 }}>Broadcast messages, send reminders, and manage scheduled alerts</div>
        </div>
        {pendingQueue > 0 && (
          <div style={{ padding: '8px 14px', background: 'var(--yellow-d)', border: '1px solid var(--yellow-b)', borderRadius: 8, fontSize: '0.78rem', color: 'var(--yellow)', fontWeight: 600 }}>
            ⏳ {pendingQueue} labs awaiting grade
          </div>
        )}
      </div>

      {/* Tab bar */}
      <div className="tab-bar admin-tabs" style={{ top: 110, marginBottom: 0, borderRadius: 'var(--r) var(--r) 0 0' }}>
        {tabs.map(t => (
          <button key={t.id} className={`tab-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      <div className="card" style={{ borderRadius: '0 0 var(--r-lg) var(--r-lg)', padding: '1.5rem' }}>

        {/* ── Broadcast ── */}
        {tab === 'broadcast' && (
          <div style={{ maxWidth: 540 }}>
            <div className="section-label" style={{ marginBottom: '1rem' }}>Send a message to students</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Week 3 starts Monday!" />
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea className="input textarea" rows={4} value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} placeholder="Your message to students…" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select className="input select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option value="info">ℹ Info</option>
                    <option value="success">✅ Success</option>
                    <option value="warning">⚠ Warning</option>
                    <option value="alert">🚨 Alert</option>
                    <option value="grade">📊 Grade update</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Audience</label>
                  <select className="input select" value={form.program} onChange={e => setForm({ ...form, program: e.target.value })}>
                    <option value="all">All Students</option>
                    {PROGRAMS.map(p => <option key={p.id} value={p.id}>{p.icon} {p.label}</option>)}
                  </select>
                </div>
              </div>
              <button className="btn btn-primary" onClick={sendBroadcast} disabled={sending || !form.title || !form.body}>
                {sending ? 'Sending…' : '📣 Send Notification'}
              </button>
              {broadcastResult && <div style={{ padding: '8px 12px', background: broadcastResult.startsWith('✅') ? 'var(--green-d)' : 'var(--yellow-d)', borderRadius: 8, fontSize: '0.8rem', color: broadcastResult.startsWith('✅') ? 'var(--green)' : 'var(--yellow)' }}>{broadcastResult}</div>}
            </div>
          </div>
        )}

        {/* ── Inactive Students ── */}
        {tab === 'inactive' && (
          <div>
            <div className="section-label" style={{ marginBottom: '1rem' }}>Find students who haven't submitted recently</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <label style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>No submission in</label>
              <select className="input select" value={inactiveDays} onChange={e => setInactiveDays(Number(e.target.value))} style={{ width: 'auto', padding: '6px 10px' }}>
                <option value={2}>2 days</option>
                <option value={3}>3 days</option>
                <option value={5}>5 days</option>
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
              </select>
              <button className="btn btn-ghost" onClick={scanInactive} disabled={scanning}>{scanning ? '🔍 Scanning…' : '🔍 Scan Now'}</button>
            </div>

            {inactiveList.length > 0 && (
              <>
                <div style={{ marginBottom: '0.75rem', fontSize: '0.8rem', color: 'var(--text2)' }}>
                  Found <strong style={{ color: 'var(--orange)' }}>{inactiveList.length}</strong> inactive student{inactiveList.length !== 1 ? 's' : ''}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: '1rem' }}>
                  {inactiveList.map(s => {
                    const prog = PROGRAMS.find(p => p.id === (s.program || 'applied_ai')) || PROGRAMS[0]
                    return (
                      <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--s2)', borderRadius: 8, borderLeft: `3px solid ${s.neverSubmitted ? 'var(--danger)' : 'var(--yellow)'}` }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--orange-d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--orange)', fontSize: '0.75rem', flexShrink: 0 }}>
                          {s.full_name?.slice(0, 1).toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{s.full_name}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>{s.email} · <span style={{ color: prog.color }}>{prog.icon} {prog.label}</span></div>
                        </div>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: s.neverSubmitted ? 'var(--danger)' : 'var(--yellow)', background: s.neverSubmitted ? 'rgba(239,68,68,0.1)' : 'var(--yellow-d)', padding: '2px 8px', borderRadius: 10 }}>
                          {s.neverSubmitted ? '❌ Never submitted' : `⏱ ${inactiveDays}+ days idle`}
                        </span>
                      </div>
                    )
                  })}
                </div>
                {!reminderSent ? (
                  <button className="btn btn-primary" onClick={sendInactiveReminders} disabled={sending}>
                    {sending ? 'Sending…' : `⏰ Send Reminder to All ${inactiveList.length} Students`}
                  </button>
                ) : (
                  <div style={{ padding: '8px 12px', background: 'var(--green-d)', borderRadius: 8, fontSize: '0.8rem', color: 'var(--green)' }}>✅ Reminders sent to {inactiveList.length} students.</div>
                )}
              </>
            )}
            {inactiveList.length === 0 && !scanning && (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)', fontSize: '0.84rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>🔍</div>
                Click "Scan Now" to find students who haven't submitted recently.
              </div>
            )}
          </div>
        )}

        {/* ── Grade Queue ── */}
        {tab === 'queue' && (
          <div>
            <div className="section-label" style={{ marginBottom: '1rem' }}>Grade queue status & alerts</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 10, marginBottom: '1.5rem' }}>
              <div className="stat-card">
                <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>⏳</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: pendingQueue > gradeThreshold ? 'var(--danger)' : pendingQueue > 0 ? 'var(--yellow)' : 'var(--green)', lineHeight: 1 }}>{pendingQueue}</div>
                <div className="stat-label">Labs Awaiting Grade</div>
              </div>
              <div className="stat-card">
                <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>🚨</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--orange)', lineHeight: 1 }}>{gradeThreshold}</div>
                <div className="stat-label">Alert Threshold</div>
              </div>
            </div>

            {pendingQueue > gradeThreshold && (
              <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, fontSize: '0.82rem', color: 'var(--danger)', marginBottom: '1.25rem', fontWeight: 600 }}>
                🚨 Grade queue is above your threshold ({pendingQueue} pending). Open the Grading tab to review.
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem', flexWrap: 'wrap' }}>
              <label style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>Alert me when queue exceeds</label>
              <select className="input select" value={gradeThreshold} onChange={e => setGradeThreshold(Number(e.target.value))} style={{ width: 'auto', padding: '6px 10px' }}>
                {[3, 5, 10, 15, 20].map(n => <option key={n} value={n}>{n} labs</option>)}
              </select>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.7 }}>
              The grade queue alert appears automatically on the Admin Dashboard and at the top of this page when the pending count exceeds your threshold. To get it as an email too, set up the pg_cron SQL in the Auto-Schedule tab.
            </p>
          </div>
        )}

        {/* ── Weekly Digest ── */}
        {tab === 'digest' && (
          <div style={{ maxWidth: 540 }}>
            <div className="section-label" style={{ marginBottom: '1rem' }}>Send a weekly progress summary to all students</div>
            <div style={{ padding: '12px 16px', background: 'var(--s2)', borderRadius: 8, marginBottom: '1.25rem', fontSize: '0.8rem', color: 'var(--text2)', lineHeight: 1.7 }}>
              <strong style={{ color: 'var(--orange)' }}>What gets sent:</strong><br />
              Each student receives a personalised in-app notification showing:<br />
              • Total labs completed and grade breakdown<br />
              • A custom message based on their progress level<br />
              • A link back to their dashboard<br />
              <br />
              <strong style={{ color: 'var(--orange)' }}>When to send:</strong> Every Monday morning before class — or whenever you want to re-engage students.
            </div>
            <button className="btn btn-primary" onClick={sendWeeklyDigest} disabled={digestSending} style={{ marginBottom: '0.75rem' }}>
              {digestSending ? 'Sending digests…' : '📊 Send Weekly Digest to All Students'}
            </button>
            {digestResult && <div style={{ padding: '8px 12px', background: digestResult.startsWith('✅') ? 'var(--green-d)' : 'var(--yellow-d)', borderRadius: 8, fontSize: '0.8rem', color: digestResult.startsWith('✅') ? 'var(--green)' : 'var(--yellow)' }}>{digestResult}</div>}
          </div>
        )}

        {/* ── Auto-Schedule (SQL instructions) ── */}
        {tab === 'schedule' && (
          <div>
            <div className="section-label" style={{ marginBottom: '1rem' }}>Fully automated reminders via Supabase pg_cron</div>
            <div style={{ padding: '12px 16px', background: 'var(--yellow-d)', border: '1px solid var(--yellow-b)', borderRadius: 8, fontSize: '0.78rem', color: 'var(--yellow)', marginBottom: '1.25rem' }}>
              ⚠ pg_cron requires the Supabase Pro plan. Run the SQL file <code style={{ background: 'var(--s3)', padding: '1px 5px', borderRadius: 3 }}>supabase_scheduled_notifications.sql</code> in your Supabase SQL Editor to activate these schedules.
            </div>
            {[
              { icon: '⏰', title: 'Daily — Inactive student reminders (3-day threshold)', when: 'Every day at 9:00 AM UTC', desc: 'Finds students who haven\'t submitted in 3+ days and inserts a reminder notification in-app. Zero manual effort.' },
              { icon: '📋', title: 'Daily — Grade queue alert to instructors', when: 'Every day at 8:00 AM UTC', desc: 'If more than 5 labs are pending grade, sends an in-app alert to all admin/instructor accounts.' },
              { icon: '📊', title: 'Weekly — Progress digest to all students', when: 'Every Monday at 7:00 AM UTC', desc: 'Sends each student a personalised weekly summary with their completion count, grade breakdown, and motivational message.' },
              { icon: '🔓', title: 'Instant — Week unlock notification (trigger)', when: 'Fires on every row insert in progress table', desc: 'When a student reaches the minimum lab count to unlock the next week, they instantly receive an in-app "Week X is now unlocked!" notification.' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12 }}>
                <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.86rem', marginBottom: 2 }}>{item.title}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--orange)', fontFamily: 'DM Mono', marginBottom: 4 }}>{item.when}</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text2)', lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--s2)', borderRadius: 8, fontSize: '0.76rem', color: 'var(--text2)', lineHeight: 1.7 }}>
              📁 The full SQL is in <code style={{ background: 'var(--s3)', padding: '1px 5px', borderRadius: 3 }}>supabase_scheduled_notifications.sql</code> at the root of your project. Open Supabase → SQL Editor → paste and run it to activate all 4 schedules.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
