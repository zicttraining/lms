import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../lib/AuthContext'
import { supabase } from '../../lib/supabase'
import AppLayout from '../../components/layout/AppLayout'
import { getWeeksByProgram, getTotalLabsByProgram, getCertStatus, getWeekStatus, getProgramById } from '../../lib/programData'
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const { profile } = useAuth()
  const { t } = useTranslation()
  const [progress, setProgress] = useState([])
  const [timeData, setTimeData] = useState([])
  const [attendance, setAttendance] = useState({ total: 0, present: 0 })
  const [recentNotifs, setRecentNotifs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile?.id) loadAll()
  }, [profile?.id])

  async function loadAll() {
    const [{ data: prog }, { data: time }, { data: att }, { data: notifs }] = await Promise.all([
      supabase.from('progress').select('*').eq('user_id', profile.id),
      supabase.from('time_tracking').select('*').eq('user_id', profile.id).order('session_start', { ascending: false }).limit(14),
      supabase.from('attendance').select('session_id').eq('user_id', profile.id),
      supabase.from('notifications').select('*').eq('user_id', profile.id).eq('read', false).order('created_at', { ascending: false }).limit(5),
    ])
    setProgress(prog || [])
    const totalSessions = await supabase.from('class_sessions').select('*', { count: 'exact', head: true })
    setAttendance({ present: att?.length || 0, total: totalSessions.count || 0 })
    setRecentNotifs(notifs || [])
    // Build chart data
    const chartMap = {}
    ;(time || []).forEach(s => {
      const day = new Date(s.session_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      chartMap[day] = (chartMap[day] || 0) + Math.round((s.duration_seconds || 0) / 60)
    })
    setTimeData(Object.entries(chartMap).slice(-7).map(([date, mins]) => ({ date, mins })))
    setLoading(false)
  }

  const myProgram = profile?.program || 'applied_ai'
  const programMeta = getProgramById(myProgram)
  const WEEKS = getWeeksByProgram(myProgram)
  const totalLabs = getTotalLabsByProgram(myProgram) || 52

  const done = progress.filter(p => p.completed).length
  const pct = Math.round((done / totalLabs) * 100)
  const certs = getCertStatus(progress, myProgram)
  const weeksActive = [...new Set(progress.filter(p => p.completed).map(p => p.week_num))].length
  const totalMinutes = timeData.reduce((s, d) => s + d.mins, 0)
  const attRate = attendance.total > 0 ? Math.round((attendance.present / attendance.total) * 100) : 0

  const gradeMap = { pass: 0, fail: 0, pending: 0 }
  progress.forEach(p => { if (p.grade) gradeMap[p.grade] = (gradeMap[p.grade] || 0) + 1 })

  const hour = new Date().getHours()
  const greeting = hour < 12 ? t('goodMorning') : hour < 17 ? t('goodAfternoon') : t('goodEvening')
  const firstName = profile?.full_name?.split(' ')[0] || 'Student'

  if (loading) return <AppLayout><div className="loading-screen"><div className="loader" /></div></AppLayout>

  return (
    <AppLayout>
      <div style={{ padding: '0 0 3rem' }}>
        {/* Hero banner */}
        <div className="dash-hero" style={{ background: 'linear-gradient(135deg, var(--s1) 0%, rgba(249,115,22,0.06) 100%)', borderBottom: '1px solid var(--border)', padding: '2rem 1.5rem' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div className="fade-up">
                <div style={{ fontSize: '0.76rem', color: 'var(--muted)', marginBottom: 6 }}>{greeting},</div>
                <h1 style={{ fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: 8 }}>
                  <span style={{ color: 'var(--orange)' }}>{firstName}</span> 👋
                </h1>
                <div style={{ fontSize: '0.88rem', color: 'var(--text2)', marginBottom: '1.25rem' }}>
                  {pct === 0 ? "Let's get started — Week 1 is ready for you." : pct < 50 ? `You're ${pct}% through the program. Keep going!` : pct < 100 ? `Over halfway there — ${100 - pct}% remaining. You've got this.` : '🎓 Program complete — congratulations!'}
                </div>
                {/* Cert badges */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[1, 2, 3].map(l => (
                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, background: certs.includes(l) ? ['var(--l1-d)', 'var(--l2-d)', 'var(--l3-d)'][l - 1] : 'rgba(255,255,255,0.04)', border: `1px solid ${certs.includes(l) ? ['rgba(59,130,246,0.3)', 'rgba(234,179,8,0.3)', 'rgba(34,197,94,0.3)'][l - 1] : 'var(--border)'}` }}>
                      <span style={{ fontSize: '0.85rem' }}>{['🔵', '🟡', '🟢'][l - 1]}</span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: certs.includes(l) ? ['var(--l1)', 'var(--l2)', 'var(--l3)'][l - 1] : 'var(--muted)' }}>
                        Level {l}{certs.includes(l) ? ' ✓' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Big progress circle */}
              <div className="fade-up-2" style={{ textAlign: 'center', flexShrink: 0 }}>
                <svg width={110} height={110} viewBox="0 0 110 110">
                  <circle cx={55} cy={55} r={48} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
                  <circle cx={55} cy={55} r={48} fill="none" stroke="url(#grad)" strokeWidth={8}
                    strokeDasharray={`${2 * Math.PI * 48}`}
                    strokeDashoffset={`${2 * Math.PI * 48 * (1 - pct / 100)}`}
                    strokeLinecap="round" transform="rotate(-90 55 55)"
                    style={{ transition: 'stroke-dashoffset 1s ease' }} />
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#F97316" />
                      <stop offset="100%" stopColor="#EAB308" />
                    </linearGradient>
                  </defs>
                  <text x={55} y={50} textAnchor="middle" fill="white" fontSize={18} fontWeight={800} fontFamily="Plus Jakarta Sans">{pct}%</text>
                  <text x={55} y={66} textAnchor="middle" fill="#6B7A96" fontSize={9} fontFamily="Plus Jakarta Sans">COMPLETE</text>
                </svg>
                <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 4 }}>{done} / {totalLabs} labs</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '1.75rem 1.5rem' }}>
          {/* KPI row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10, marginBottom: '1.75rem' }} className="fade-up-2">
            <StatCard num={weeksActive} label="Weeks Active" icon="📅" color="var(--orange)" />
            <StatCard num={`${attRate}%`} label={t('attendanceRate')} icon="✅" color={attRate >= 85 ? 'var(--green)' : attRate >= 70 ? 'var(--yellow)' : 'var(--danger)'} />
            <StatCard num={`${Math.round(totalMinutes / 60)}h`} label={t('timeInPortal')} icon="⏱" color="var(--yellow)" />
            <StatCard num={gradeMap.pass} label="Labs Passed" icon="🎯" color="var(--green)" />
            <StatCard num={gradeMap.pending || 0} label="Awaiting Grade" icon="📋" color="var(--orange)" />
            <StatCard num={certs.length} label="Certs Earned" icon="🎓" color="var(--yellow)" />
          </div>

          <div className="dash-grid">
            <div>
              {/* Time chart */}
              {timeData.length > 0 && (
                <div className="card card-p fade-up-3" style={{ marginBottom: '1.25rem' }}>
                  <div className="section-label">Time Spent (minutes/day, last 7 days)</div>
                  <ResponsiveContainer width="100%" height={120}>
                    <AreaChart data={timeData}>
                      <defs>
                        <linearGradient id="timeGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F97316" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6B7A96' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: 'var(--s2)', border: '1px solid var(--border2)', borderRadius: 8, fontSize: 12 }} />
                      <Area type="monotone" dataKey="mins" stroke="#F97316" strokeWidth={2} fill="url(#timeGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Week cards */}
              <div className="section-label">Program Weeks</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
                {WEEKS.map((week, i) => {
                  const status = getWeekStatus(week.num, progress)
                  const weekDone = progress.filter(p => p.week_num === week.num && p.completed).length
                  const weekPct = Math.round((weekDone / week.labCount) * 100)
                  return (
                    <Link key={week.num} to={status === 'locked' ? '#' : `/program/week/${week.num}`}
                      className={`card card-hover fade-up-${Math.min(i + 1, 4)}`}
                      style={{ textDecoration: 'none', opacity: status === 'locked' ? 0.5 : 1, cursor: status === 'locked' ? 'not-allowed' : 'pointer', borderTop: `3px solid ${status === 'locked' ? 'transparent' : week.color}`, padding: '0.9rem 1rem', display: 'block' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span className={`badge badge-l${week.level}`}>{week.levelLabel}</span>
                        <span style={{ fontFamily: 'DM Mono', fontSize: '0.65rem', color: 'var(--muted)' }}>W{week.num}</span>
                      </div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, marginBottom: 2, lineHeight: 1.3, color: 'var(--text)' }}>{week.title}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: status === 'locked' ? 0 : 8 }}>{week.sessions} sessions · {week.labCount} labs</div>
                      {status !== 'locked' && (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', marginBottom: 4 }}>
                            <span style={{ color: 'var(--muted)' }}>{weekDone}/{week.labCount}</span>
                            <span style={{ color: week.color }}>{weekPct}%</span>
                          </div>
                          <div className="progress-bar progress-bar-sm">
                            <div className="progress-fill" style={{ width: `${weekPct}%`, background: week.color }} />
                          </div>
                        </>
                      )}
                      {status === 'locked' && <div style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>🔒 Locked</div>}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Notifications */}
              {recentNotifs.length > 0 && (
                <div className="card card-p fade-up-2">
                  <div className="section-label">New Notifications</div>
                  {recentNotifs.map(n => (
                    <div key={n.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', display: 'flex', gap: 8 }}>
                      <span style={{ fontSize: '0.9rem' }}>{{ info: 'ℹ', success: '✅', warning: '⚠', grade: '📊', message: '✉', alert: '🚨' }[n.type] || 'ℹ'}</span>
                      <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>{n.title}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text2)' }}>{n.body}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Grade summary */}
              <div className="card card-p fade-up-3">
                <div className="section-label">Grade Summary</div>
                <GradeBar label="Passed" count={gradeMap.pass} total={done} color="var(--green)" />
                <GradeBar label="Pending" count={gradeMap.pending || 0} total={done} color="var(--yellow)" />
                <GradeBar label="Needs Revision" count={gradeMap.fail || 0} total={done} color="var(--danger)" />
              </div>

              {/* Attendance */}
              <div className="card card-p fade-up-4">
                <div className="section-label">{t('attendance')}</div>
                <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
                  <div style={{ fontSize: '2.4rem', fontWeight: 800, color: attRate >= 85 ? 'var(--green)' : 'var(--orange)' }}>{attRate}%</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{attendance.present} / {attendance.total} sessions</div>
                  {attRate < 85 && <div style={{ fontSize: '0.72rem', color: 'var(--yellow)', marginTop: 6, padding: '4px 8px', background: 'var(--yellow-d)', borderRadius: 4 }}>⚠ Minimum 85% required</div>}
                </div>
              </div>

              {/* Quick links */}
              <div className="card card-p">
                <div className="section-label">Quick Access</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <Link to="/career/resume" className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start' }}>📄 Resume Builder</Link>
                  <Link to="/career/jobs" className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start' }}>💼 Job Tracker</Link>
                  <Link to="/messages?tab=support" className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start' }}>💬 Contact Support</Link>
                  <Link to="/career/linkedin" className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start' }}>🔗 LinkedIn Tools</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

function StatCard({ num, label, icon, color }) {
  return (
    <div className="stat-card">
      <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: '1.6rem', fontWeight: 800, color, lineHeight: 1, marginBottom: 3 }}>{num}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

function GradeBar({ label, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.74rem' }}>
        <span style={{ color: 'var(--text2)' }}>{label}</span>
        <span style={{ color, fontWeight: 600 }}>{count}</span>
      </div>
      <div className="progress-bar progress-bar-sm">
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}
