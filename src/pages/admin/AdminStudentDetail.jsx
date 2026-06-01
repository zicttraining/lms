import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { PROGRAMS, getWeeksByProgram, getTotalLabsByProgram, getProgramById, getWeekByNum } from '../../lib/programData'

export default function AdminStudentDetail() {
  const { id } = useParams()
  const [student, setStudent] = useState(null)
  const [progress, setProgress] = useState([])
  const [cohortAvg, setCohortAvg] = useState(0)
  const [loading, setLoading] = useState(true)
  const [notifForm, setNotifForm] = useState({ title: '', body: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [changingProgram, setChangingProgram] = useState(false)
  const [newProgram, setNewProgram] = useState('')

  useEffect(() => { loadAll() }, [id])

  async function loadAll() {
    const [{ data: prof }, { data: prog }, { data: allProg }, { data: profs }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', id).single(),
      supabase.from('progress').select('*').eq('user_id', id),
      supabase.from('progress').select('user_id,completed').eq('completed', true),
      supabase.from('profiles').select('id').eq('role', 'student'),
    ])
    setStudent(prof)
    setProgress(prog || [])
    const totalStudents = profs?.length || 1
    const totalDone = allProg?.length || 0
    setCohortAvg(Math.round(totalDone / totalStudents))
    setLoading(false)
  }

  async function sendNotif() {
    if (!notifForm.title || !notifForm.body) return
    setSending(true)
    await supabase.from('notifications').insert({ user_id: id, ...notifForm, type: 'info' })
    setSent(true); setSending(false)
    setNotifForm({ title: '', body: '' })
    setTimeout(() => setSent(false), 3000)
  }

  async function saveProgram() {
    if (!newProgram || newProgram === student.program) { setChangingProgram(false); return }
    await supabase.from('profiles').update({ program: newProgram }).eq('id', id)
    setStudent(prev => ({ ...prev, program: newProgram }))
    setChangingProgram(false)
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="loader" /></div>
  if (!student) return <div style={{ padding: '2rem', color: 'var(--muted)' }}>Student not found.</div>

  const studentProgram = student.program || 'applied_ai'
  const programMeta = getProgramById(studentProgram)
  const programWeeks = getWeeksByProgram(studentProgram)
  const TOTAL_LABS = getTotalLabsByProgram(studentProgram) || 52

  const completed = progress.filter(p => p.completed)
  const failedLabs = progress.filter(p => p.grade === 'fail')
  const passedLabs = progress.filter(p => p.grade === 'pass')
  const pendingLabs = progress.filter(p => p.grade === 'pending')
  const completionPct = Math.round((completed.length / TOTAL_LABS) * 100)
  const now = Date.now()
  const lastSubmitTs = completed.length > 0
    ? Math.max(...completed.map(p => new Date(p.completed_at).getTime()))
    : null
  const daysInactive = lastSubmitTs ? Math.floor((now - lastSubmitTs) / 86400000) : null

  // Sort completed labs by date for timeline
  const timeline = [...completed].sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at)).slice(0, 10)

  // Risk signals
  const signals = []
  if (daysInactive !== null && daysInactive >= 7) signals.push({ label: `${daysInactive} days without a submission`, level: 'high' })
  else if (daysInactive !== null && daysInactive >= 5) signals.push({ label: `${daysInactive} days without a submission`, level: 'medium' })
  if (failedLabs.length >= 3) signals.push({ label: `${failedLabs.length} failed labs need revision`, level: 'high' })
  else if (failedLabs.length >= 1) signals.push({ label: `${failedLabs.length} lab${failedLabs.length > 1 ? 's' : ''} need${failedLabs.length === 1 ? 's' : ''} revision`, level: 'medium' })
  if (completionPct < 20 && (daysInactive === null || daysInactive >= 3)) signals.push({ label: 'Below 20% completion', level: 'medium' })
  if (completed.length > cohortAvg) signals.push({ label: `Ahead of cohort average (${cohortAvg} labs)`, level: 'good' })

  const signalColor = { high: '#EF4444', medium: 'var(--yellow)', good: 'var(--green)' }

  return (
    <div>
      {/* Back */}
      <Link to="/admin/students" style={{ fontSize: '0.75rem', color: 'var(--muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: '1rem' }}>← All Students</Link>

      {/* Student header */}
      <div className="card card-p" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--orange-d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.3rem', color: 'var(--orange)', flexShrink: 0 }}>
          {student.full_name?.slice(0, 1).toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: 4 }}>{student.full_name}</h2>
          <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: 6 }}>{student.email} · Enrolled {student.enrolled_at ? new Date(student.enrolled_at).toLocaleDateString() : 'unknown'}</div>
          {/* Program badge + change control */}
          {!changingProgram ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: programMeta.color, background: `${programMeta.color}18`, padding: '3px 10px', borderRadius: 20 }}>
                {programMeta.icon} {programMeta.label}
              </span>
              <button className="btn btn-ghost btn-sm" style={{ fontSize: '0.68rem', padding: '2px 8px' }} onClick={() => { setNewProgram(studentProgram); setChangingProgram(true) }}>Change</button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <select className="input select" value={newProgram} onChange={e => setNewProgram(e.target.value)} style={{ fontSize: '0.76rem', padding: '4px 8px', width: 'auto' }}>
                {PROGRAMS.map(p => <option key={p.id} value={p.id}>{p.icon} {p.label}</option>)}
              </select>
              <button className="btn btn-primary btn-sm" onClick={saveProgram}>Save</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setChangingProgram(false)}>Cancel</button>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {[
            { n: `${completionPct}%`, l: 'Complete', c: completionPct >= 70 ? 'var(--green)' : completionPct >= 40 ? 'var(--yellow)' : '#EF4444' },
            { n: passedLabs.length, l: 'Passed', c: 'var(--green)' },
            { n: failedLabs.length, l: 'Failed', c: failedLabs.length > 0 ? '#EF4444' : 'var(--muted)' },
            { n: pendingLabs.length, l: 'Pending', c: 'var(--yellow)' },
          ].map((k, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: k.c, lineHeight: 1 }}>{k.n}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--muted)', marginTop: 2 }}>{k.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="card card-p" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--muted)', marginBottom: 6 }}>
          <span>{completed.length} / {TOTAL_LABS} labs completed</span>
          <span>Cohort avg: {cohortAvg} labs</span>
        </div>
        <div className="progress-bar" style={{ height: 10, borderRadius: 5 }}>
          <div className="progress-fill" style={{ width: `${completionPct}%`, borderRadius: 5 }} />
        </div>
        {/* Cohort average marker */}
        <div style={{ position: 'relative', height: 0 }}>
          <div style={{ position: 'absolute', left: `${Math.min((cohortAvg / TOTAL_LABS) * 100, 100)}%`, top: -10, transform: 'translateX(-50%)' }}>
            <div style={{ width: 2, height: 10, background: 'var(--orange)', margin: '0 auto' }} />
            <div style={{ fontSize: '0.55rem', color: 'var(--orange)', whiteSpace: 'nowrap', textAlign: 'center', marginTop: 2 }}>avg</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.25rem' }}>
        <div>
          {/* Struggle signals */}
          {signals.length > 0 && (
            <div className="card card-p" style={{ marginBottom: '1.25rem', borderLeft: `3px solid ${signals[0].level === 'good' ? 'var(--green)' : signals[0].level === 'high' ? '#EF4444' : 'var(--yellow)'}` }}>
              <div className="section-label" style={{ marginBottom: '0.5rem' }}>Signals</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {signals.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem' }}>
                    <span style={{ color: signalColor[s.level], fontSize: '0.7rem' }}>{s.level === 'high' ? '🔴' : s.level === 'medium' ? '🟡' : '✅'}</span>
                    <span style={{ color: s.level === 'good' ? 'var(--green)' : 'var(--text2)' }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Per-week breakdown */}
          <div className="card card-p" style={{ marginBottom: '1.25rem' }}>
            <div className="section-label" style={{ marginBottom: '0.75rem' }}>Progress by Week</div>
            {programWeeks.map(w => {
              const wProg = progress.filter(p => p.week_num === w.num)
              const wDone = wProg.filter(p => p.completed).length
              const wFail = wProg.filter(p => p.grade === 'fail').length
              const wPass = wProg.filter(p => p.grade === 'pass').length
              const wPct = Math.round(wDone / w.labCount * 100)
              return (
                <div key={w.num} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span className={`badge badge-l${w.level}`} style={{ fontSize: '0.6rem' }}>L{w.level}</span>
                    <span style={{ fontWeight: 600, fontSize: '0.82rem', flex: 1 }}>Week {w.num}: {w.title}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{wDone}/{w.labCount}</span>
                    {wFail > 0 && <span style={{ fontSize: '0.65rem', color: '#EF4444' }}>❌ {wFail} failed</span>}
                    {wPct === 100 && <span style={{ fontSize: '0.65rem', color: 'var(--green)' }}>✅ Complete</span>}
                  </div>
                  {/* Lab-level dots */}
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 6 }}>
                    {w.labs.map(lab => {
                      const lp = wProg.find(p => p.lab_num === lab.num)
                      const bg = !lp?.completed ? 'var(--s3)'
                        : lp.grade === 'pass' ? '#22C55E'
                        : lp.grade === 'fail' ? '#EF4444'
                        : 'var(--yellow)'
                      const label = !lp?.completed ? '—'
                        : lp.grade === 'pass' ? '✓'
                        : lp.grade === 'fail' ? '✗'
                        : '⏳'
                      return (
                        <div key={lab.num} title={`L${lab.num}: ${lab.title}${lp?.grade_notes ? '\n' + lp.grade_notes : ''}`}
                          style={{ width: 28, height: 28, borderRadius: 6, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700, color: lp?.completed ? 'rgba(0,0,0,0.75)' : 'var(--muted)', cursor: 'default', opacity: lp?.completed ? 1 : 0.4 }}>
                          {label}
                        </div>
                      )
                    })}
                  </div>
                  <div className="progress-bar progress-bar-sm">
                    <div className="progress-fill" style={{ width: `${wPct}%`, background: wFail > 0 ? '#EF4444' : w.color }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Failed labs with instructor notes */}
          {failedLabs.length > 0 && (
            <div className="card card-p" style={{ borderLeft: '3px solid #EF4444' }}>
              <div className="section-label" style={{ marginBottom: '0.75rem', color: '#EF4444' }}>Labs Needing Revision</div>
              {failedLabs.map((p, i) => {
                const week = getWeekByNum(studentProgram, p.week_num)
                const lab = week?.labs[p.lab_num - 1]
                return (
                  <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>W{p.week_num} L{p.lab_num}: {lab?.title}</div>
                    {p.grade_notes && <div style={{ fontSize: '0.72rem', color: 'var(--text2)', marginTop: 3 }}>Instructor note: {p.grade_notes}</div>}
                    <div style={{ fontSize: '0.65rem', color: 'var(--muted)', marginTop: 3 }}>
                      Submitted {new Date(p.completed_at).toLocaleDateString()} · Graded {p.graded_at ? new Date(p.graded_at).toLocaleDateString() : '—'}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div>
          {/* Recent activity */}
          <div className="card card-p" style={{ marginBottom: '1rem' }}>
            <div className="section-label" style={{ marginBottom: '0.75rem' }}>Recent Submissions</div>
            {timeline.length === 0 ? (
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)', textAlign: 'center', padding: '1rem' }}>No submissions yet</div>
            ) : timeline.map((p, i) => {
              const week = getWeekByNum(studentProgram, p.week_num)
              const lab = week?.labs[p.lab_num - 1]
              const gradeColor = p.grade === 'pass' ? 'var(--green)' : p.grade === 'fail' ? '#EF4444' : 'var(--yellow)'
              return (
                <div key={i} style={{ padding: '7px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: '0.76rem', fontWeight: 600 }}>W{p.week_num} · L{p.lab_num}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>{lab?.title}</div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--muted)', marginTop: 1 }}>{new Date(p.completed_at).toLocaleDateString()}</div>
                  </div>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: gradeColor, flexShrink: 0 }}>
                    {p.grade === 'pass' ? '✅ Pass' : p.grade === 'fail' ? '❌ Fail' : '⏳ Pending'}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Send notification */}
          <div className="card card-p">
            <div className="section-label" style={{ marginBottom: '0.75rem' }}>Send Message</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <input className="input" placeholder="Title" value={notifForm.title} onChange={e => setNotifForm({ ...notifForm, title: e.target.value })} style={{ fontSize: '0.82rem' }} />
              <textarea className="input" placeholder="Message to student…" rows={3} value={notifForm.body} onChange={e => setNotifForm({ ...notifForm, body: e.target.value })} style={{ fontSize: '0.82rem' }} />
              <button className="btn btn-primary btn-sm" onClick={sendNotif} disabled={sending || !notifForm.title || !notifForm.body}>
                {sent ? '✅ Sent!' : sending ? 'Sending…' : `📣 Send to ${student.full_name?.split(' ')[0]}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
