import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { WEEKS, getCertStatus, getWeeksByProgram } from '../../lib/programData'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function AdminDashboard() {
  const [students, setStudents] = useState([])
  const [allProgress, setAllProgress] = useState([])
  const [timeData, setTimeData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    const [{ data: profs }, { data: prog }, { data: time }] = await Promise.all([
      supabase.from('profiles').select('*').eq('role', 'student').order('enrolled_at'),
      supabase.from('progress').select('*'),
      supabase.from('time_tracking').select('user_id, duration_seconds').not('duration_seconds', 'is', null)
    ])
    setStudents(profs || [])
    setAllProgress(prog || [])
    setTimeData(time || [])
    setLoading(false)
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="loader" /></div>

  const totalLabs = 52
  const submitted = allProgress.filter(p => p.completed).length
  const graded = allProgress.filter(p => p.grade === 'pass' || p.grade === 'fail').length
  const pending = allProgress.filter(p => p.grade === 'pending').length
  const avgPct = students.length ? Math.round(students.reduce((sum, st) => { const done = allProgress.filter(p => p.user_id === st.id && p.completed).length; return sum + (done / totalLabs) * 100 }, 0) / students.length) : 0
  const certCounts = [1, 2, 3].map(l => students.filter(st => getCertStatus(allProgress.filter(p => p.user_id === st.id)).includes(l)).length)
  const totalTimeHours = Math.round(timeData.reduce((s, t) => s + (t.duration_seconds || 0), 0) / 3600)

  // Chart shows all weeks that have any submissions across all programs
  const allProgramWeeks = ['applied_ai','aws'].flatMap(p => getWeeksByProgram(p))
  const weekChartData = allProgramWeeks
    .map(w => ({ name: `${w.program === 'aws' ? 'AWS' : 'AI'} W${w.num}`, submissions: allProgress.filter(p => p.week_num === w.num && p.completed).length, color: w.color }))
    .filter(d => d.submissions > 0)

  const needsAttention = students.filter(st => {
    const done = allProgress.filter(p => p.user_id === st.id && p.completed).length
    return (done / totalLabs) * 100 < 25 && students.length > 0
  })

  return (
    <div>
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.62rem', color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 4 }}>Administrator</div>
          <h1 style={{ fontWeight: 800, fontSize: '1.6rem' }}>Cohort Overview</h1>
        </div>
        <Link to="/admin/notifications" className="btn btn-primary btn-sm">📣 Send Notification</Link>
      </div>

      {/* KPI grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 10, marginBottom: '1.75rem' }}>
        {[
          { n: students.length, l: 'Students', c: 'var(--orange)', i: '👥' },
          { n: `${avgPct}%`, l: 'Avg Progress', c: avgPct >= 50 ? 'var(--green)' : 'var(--yellow)', i: '📈' },
          { n: submitted, l: 'Labs Submitted', c: 'var(--orange)', i: '📤' },
          { n: pending, l: 'Pending Grade', c: pending > 0 ? 'var(--yellow)' : 'var(--green)', i: '⏳' },
          { n: certCounts[0], l: 'L1 Certs', c: 'var(--l1)', i: '🔵' },
          { n: certCounts[1], l: 'L2 Certs', c: 'var(--l2)', i: '🟡' },
          { n: certCounts[2], l: 'L3 Certs', c: 'var(--l3)', i: '🟢' },
          { n: `${totalTimeHours}h`, l: 'Total Time', c: 'var(--yellow)', i: '⏱' },
        ].map((k, i) => (
          <div key={i} className="stat-card">
            <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>{k.i}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: k.c, lineHeight: 1, marginBottom: 3 }}>{k.n}</div>
            <div className="stat-label">{k.l}</div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        <div>
          {/* Submissions by week chart */}
          <div className="card card-p" style={{ marginBottom: '1.25rem' }}>
            <div className="section-label">Lab Submissions by Week</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weekChartData} barSize={28}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B7A96' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7A96' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--s2)', border: '1px solid var(--border2)', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="submissions" radius={[4, 4, 0, 0]}>
                  {weekChartData.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.85} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Students needing attention */}
          {needsAttention.length > 0 && (
            <div className="card card-p" style={{ borderLeft: '3px solid var(--yellow)' }}>
              <div className="section-label" style={{ color: 'var(--yellow)' }}>⚠ Students Needing Attention</div>
              {needsAttention.map(st => {
                const done = allProgress.filter(p => p.user_id === st.id && p.completed).length
                return (
                  <div key={st.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{st.full_name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{done}/{totalLabs} labs · {st.email}</div>
                    </div>
                    <Link to={`/admin/students/${st.id}`} className="btn btn-sm btn-ghost">View</Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div>
          {/* Grade queue */}
          <div className="card card-p" style={{ marginBottom: '1rem' }}>
            <div className="section-label">Grading Queue</div>
            <div style={{ textAlign: 'center', padding: '0.75rem 0' }}>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: pending > 0 ? 'var(--yellow)' : 'var(--green)' }}>{pending}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>labs awaiting grade</div>
            </div>
            <Link to="/admin/grading" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>Open Grading Dashboard</Link>
          </div>

          {/* Recent activity */}
          <div className="card card-p">
            <div className="section-label">Recent Submissions</div>
            {allProgress.filter(p => p.completed && p.grade === 'pending').slice(0, 6).map((p, i) => {
              const student = students.find(s => s.id === p.user_id)
              return (
                <div key={i} style={{ padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: '0.76rem' }}>
                  <div style={{ fontWeight: 600 }}>{student?.full_name || 'Student'}</div>
                  <div style={{ color: 'var(--muted)' }}>Week {p.week_num} · Lab {p.lab_num} · {new Date(p.completed_at).toLocaleDateString()}</div>
                </div>
              )
            })}
            {allProgress.filter(p => p.grade === 'pending').length === 0 && <div style={{ fontSize: '0.8rem', color: 'var(--muted)', textAlign: 'center', padding: '1rem' }}>All caught up! 🎉</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
