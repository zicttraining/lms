// InstructorDashboard.jsx — Teacher overview with class alerts, student progress, and quick actions
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../lib/AuthContext'
import { supabase } from '../../lib/supabase'
import { getWeeksByProgram, CAREER_TRACKS, TRACK_INTEL } from '../../lib/programData'

export default function InstructorDashboard() {
  const { profile } = useAuth()
  const [students, setStudents] = useState([])
  const [progress, setProgress] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [focusTab, setFocusTab] = useState('alerts')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const [{ data: students }, { data: prog }, { data: subs }] = await Promise.all([
      supabase.from('profiles').select('*').eq('role', 'student'),
      supabase.from('progress').select('*'),
      supabase.from('assessment_submissions').select('*').eq('grade', 'pending'),
    ])
    setStudents(students || [])
    setProgress(prog || [])
    setSubmissions(subs || [])
    setLoading(false)
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="loader" /></div>

  const totalStudents = students.length
  const activeStudents = students.filter(s => {
    const lastActivity = progress
      .filter(p => p.user_id === s.id && p.completed)
      .map(p => new Date(p.completed_at).getTime())
      .reduce((max, t) => Math.max(max, t), 0)
    const daysSince = Math.floor((Date.now() - lastActivity) / 86400000)
    return daysSince < 7
  }).length

  const pendingGrades = progress.filter(p => p.grade === 'pending').length
  const pendingAssignments = submissions.length
  const avgCompletion = students.length > 0 ? Math.round(
    students.reduce((sum, s) => {
      const done = progress.filter(p => p.user_id === s.id && p.completed).length
      const total = 52 // approx labs per program
      return sum + Math.round((done / total) * 100)
    }, 0) / totalStudents
  ) : 0

  // Alert system
  const atRisk = students.filter(s => {
    const lastActivity = progress
      .filter(p => p.user_id === s.id && p.completed)
      .map(p => new Date(p.completed_at).getTime())
      .reduce((max, t) => Math.max(max, t), 0)
    const daysSince = Math.floor((Date.now() - lastActivity) / 86400000)
    const done = progress.filter(p => p.user_id === s.id && p.completed).length
    return daysSince >= 5 || done < 5
  })

  const suggestions = [
    ...(pendingGrades > 0 ? [{ priority: 'high', icon: '⏳', text: `${pendingGrades} labs waiting for grades. Students are waiting for feedback.`, action: 'Grade now', link: '/instructor/grading' }] : []),
    ...(pendingAssignments > 0 ? [{ priority: 'high', icon: '📤', text: `${pendingAssignments} assessment submissions to review.`, action: 'Review', link: '/instructor/grading' }] : []),
    ...(atRisk.length > 0 ? [{ priority: 'medium', icon: '🚨', text: `${atRisk.length} student${atRisk.length > 1 ? 's' : ''} inactive or behind. Check in with them.`, action: 'Message', link: '/instructor/notifications' }] : []),
  ]

  const priorityColor = { high: 'var(--danger)', medium: 'var(--yellow)', low: 'var(--muted)' }
  const priorityBg = { high: 'rgba(239,68,68,0.08)', medium: 'var(--yellow-d)', low: 'var(--s2)' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.62rem', color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 4 }}>Teacher</div>
          <h1 style={{ fontWeight: 800, fontSize: '1.5rem' }}>Class Overview</h1>
        </div>
        <Link to="/instructor/notifications" className="btn btn-primary btn-sm">📣 Send Message</Link>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 10, marginBottom: '1.75rem' }}>
        {[
          { n: totalStudents, l: 'Total Students', c: 'var(--orange)', i: '👥' },
          { n: activeStudents, l: 'Active This Week', c: 'var(--green)', i: '✅' },
          { n: `${avgCompletion}%`, l: 'Avg Progress', c: avgCompletion >= 50 ? 'var(--green)' : 'var(--yellow)', i: '📈' },
          { n: pendingGrades + pendingAssignments, l: 'Pending Review', c: (pendingGrades + pendingAssignments) > 0 ? 'var(--orange)' : 'var(--green)', i: '⏳' },
        ].map((k, i) => (
          <div key={i} className="stat-card">
            <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>{k.i}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: k.c, lineHeight: 1, marginBottom: 3 }}>{k.n}</div>
            <div className="stat-label">{k.l}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {/* Alerts panel */}
        <div className="card" style={{ overflow: 'hidden', border: `1px solid ${suggestions.some(s => s.priority === 'high') ? 'rgba(239,68,68,0.2)' : 'var(--border)'}` }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: '0.86rem' }}>🎯 Focus Items</div>
          {suggestions.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.82rem' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>✅</div>All caught up — no urgent items!
            </div>
          ) : suggestions.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '12px 16px', borderBottom: '1px solid var(--border)', background: priorityBg[s.priority] }}>
              <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{s.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text)', lineHeight: 1.5 }}>{s.text}</div>
                {s.action && <Link to={s.link} className="btn btn-ghost btn-sm" style={{ marginTop: 6, fontSize: '0.68rem' }}>{s.action} →</Link>}
              </div>
              <span style={{ fontSize: '0.6rem', fontWeight: 700, color: priorityColor[s.priority], background: priorityBg[s.priority], padding: '2px 6px', borderRadius: 6, alignSelf: 'flex-start', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{s.priority}</span>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: '0.86rem' }}>📌 Quick Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { icon: '📝', label: 'Create Assignment', to: '/instructor/assignments', desc: 'Post homework or project' },
              { icon: '📊', label: 'View Analytics', to: '/instructor/grading', desc: 'See class trends' },
              { icon: '👥', label: 'Manage Students', to: '/instructor/students', desc: 'View roster' },
              { icon: '🎬', label: 'Upload Class Video', to: '/instructor/class', desc: 'Record or link' },
            ].map((action, i) => (
              <Link key={i} to={action.to} style={{ padding: '12px 16px', textDecoration: 'none', borderBottom: i < 3 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', gap: 12, transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--s2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <span style={{ fontSize: '1.1rem' }}>{action.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--orange)' }}>{action.label}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>{action.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Student roster */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: '0.86rem' }}>📋 Student Roster</div>
        {students.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>No students enrolled yet</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 8, padding: '8px 16px', background: 'var(--s2)', fontSize: '0.6rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em', minWidth: 500 }}>
              <div>Name</div><div>Program</div><div>Progress</div><div>Status</div><div>Last Activity</div>
            </div>
            {students.slice(0, 10).map(st => {
              const studentProg = progress.filter(p => p.user_id === st.id && p.completed)
              const done = studentProg.length
              const pct = Math.round((done / 52) * 100)
              const lastActivity = studentProg
                .map(p => new Date(p.completed_at).getTime())
                .reduce((max, t) => Math.max(max, t), 0)
              const daysSince = Math.floor((Date.now() - lastActivity) / 86400000)
              const status = daysSince >= 7 ? '🔴 Inactive' : daysSince >= 3 ? '🟡 Slow' : '🟢 Active'
              return (
                <div key={st.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 8, padding: '10px 16px', borderBottom: '1px solid var(--border)', alignItems: 'center', fontSize: '0.74rem', minWidth: 500 }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{st.full_name}</div>
                    <div style={{ fontSize: '0.66rem', color: 'var(--muted)' }}>{st.email}</div>
                  </div>
                  <div style={{ fontSize: '0.72rem' }}>{st.program?.substring(0, 3) || 'N/A'}</div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: pct >= 75 ? 'var(--green)' : pct >= 50 ? 'var(--orange)' : 'var(--danger)' }}>{pct}%</div>
                  <div style={{ fontSize: '0.72rem' }}>{status}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>{daysSince}d ago</div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
