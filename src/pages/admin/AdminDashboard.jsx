import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { WEEKS, getCertStatus, getWeeksByProgram, CAREER_TRACKS } from '../../lib/programData'
import { TRACK_INTEL } from '../../lib/careerIntel'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function AdminDashboard() {
  const [students, setStudents] = useState([])
  const [allProgress, setAllProgress] = useState([])
  const [asmtSubs, setAsmtSubs] = useState([])
  const [surveyData, setSurveyData] = useState([])
  const [timeData, setTimeData] = useState([])
  const [loading, setLoading] = useState(true)
  const [focusTab, setFocusTab] = useState('alerts')

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    const [{ data: profs }, { data: prog }, { data: time }, { data: subs }, { data: surveys }] = await Promise.all([
      supabase.from('profiles').select('*').eq('role', 'student').order('enrolled_at'),
      supabase.from('progress').select('*'),
      supabase.from('time_tracking').select('user_id, duration_seconds').not('duration_seconds', 'is', null),
      supabase.from('assessment_submissions').select('*'),
      supabase.from('survey_responses').select('user_id, total_quiz_score, computed_skill_level, career_track_goal, cyber_score, ai_quiz_score'),
    ])
    setStudents(profs || [])
    setAllProgress(prog || [])
    setTimeData(time || [])
    setAsmtSubs(subs || [])
    setSurveyData(surveys || [])
    setLoading(false)
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="loader" /></div>

  const totalLabs = 52
  const submitted = allProgress.filter(p => p.completed).length
  const pending = allProgress.filter(p => p.grade === 'pending').length
  const pendingAsmt = asmtSubs.filter(s => s.grade === 'pending').length
  const avgPct = students.length ? Math.round(students.reduce((sum, st) => {
    const done = allProgress.filter(p => p.user_id === st.id && p.completed).length
    return sum + (done / totalLabs) * 100
  }, 0) / students.length) : 0
  const certCounts = [1, 2, 3].map(l => students.filter(st => getCertStatus(allProgress.filter(p => p.user_id === st.id)).includes(l)).length)
  const totalTimeHours = Math.round(timeData.reduce((s, t) => s + (t.duration_seconds || 0), 0) / 3600)

  // ── Intelligence: Build per-student stats ────────────────────
  const studentStats = students.map(st => {
    const myProg = allProgress.filter(p => p.user_id === st.id)
    const mySubs = asmtSubs.filter(s => s.user_id === st.id)
    const myTime = timeData.filter(t => t.user_id === st.id)
    const mySurvey = surveyData.find(s => s.user_id === st.id)
    const done = myProg.filter(p => p.completed).length
    const fails = myProg.filter(p => p.grade === 'fail').length
    const asmtFails = mySubs.filter(s => s.grade === 'fail').length
    const asmtPasses = mySubs.filter(s => s.grade === 'pass').length
    const totalScore = mySubs.filter(s => s.grade === 'pass').reduce((sum, s) => sum + (s.score || 0), 0)
    const timeHours = myTime.reduce((s, t) => s + (t.duration_seconds || 0), 0) / 3600
    const lastActivity = myProg.reduce((latest, p) => {
      const d = new Date(p.completed_at || 0)
      return d > latest ? d : latest
    }, new Date(0))
    const daysSinceActivity = Math.floor((Date.now() - lastActivity.getTime()) / 86400000)
    return {
      ...st,
      done, fails, asmtFails, asmtPasses, totalScore,
      timeHours: Math.round(timeHours * 10) / 10,
      daysSinceActivity: lastActivity.getTime() === 0 ? 999 : daysSinceActivity,
      quizScore: mySurvey?.total_quiz_score ?? null,
      surveyDone: !!mySurvey,
    }
  })

  // ── Focus alerts ─────────────────────────────────────────────
  const noSurvey = studentStats.filter(s => !s.surveyDone)
  const inactive3d = studentStats.filter(s => s.daysSinceActivity >= 3 && s.daysSinceActivity < 999)
  const neverSubmitted = studentStats.filter(s => s.done === 0)
  const multipleFailStudents = studentStats.filter(s => s.fails + s.asmtFails >= 2)
  const lowTime = studentStats.filter(s => s.timeHours < 1 && s.done > 0)

  // ── Track analytics ──────────────────────────────────────────
  const trackStats = CAREER_TRACKS.map(track => {
    const trackStudents = students.filter(s => s.career_track === track.id)
    if (!trackStudents.length) return null
    const trackSubs = asmtSubs.filter(s => trackStudents.some(st => st.id === s.user_id))
    const passes = trackSubs.filter(s => s.grade === 'pass').length
    const total = trackSubs.filter(s => s.grade !== 'pending').length
    const passRate = total > 0 ? Math.round((passes / total) * 100) : null
    const avgScore = passes > 0 ? Math.round(trackSubs.filter(s => s.grade === 'pass').reduce((sum, s) => sum + (s.score || 0), 0) / passes) : 0
    return { ...track, count: trackStudents.length, passRate, avgScore, flagged: passRate !== null && passRate < 60 }
  }).filter(Boolean)

  // ── Suggested instructor actions ─────────────────────────────
  const suggestions = []
  if (noSurvey.length > 0) suggestions.push({ priority: 'high', icon: '📋', text: `${noSurvey.length} student${noSurvey.length > 1 ? 's' : ''} haven't completed the intake survey — they have no career track or skill level set.`, action: 'Remind them', link: '/admin/notifications' })
  if (neverSubmitted.length > 0) suggestions.push({ priority: 'high', icon: '🚨', text: `${neverSubmitted.length} student${neverSubmitted.length > 1 ? 's' : ''} have not submitted a single lab or assessment yet. Reach out this week.`, action: 'Send nudge', link: '/admin/notifications' })
  if (multipleFailStudents.length > 0) suggestions.push({ priority: 'medium', icon: '📝', text: `${multipleFailStudents.length} student${multipleFailStudents.length > 1 ? 's' : ''} have 2+ fails. Consider a 1:1 check-in or revisiting the relevant material.`, action: 'View students', link: '/admin/students' })
  if (inactive3d.length > 0) suggestions.push({ priority: 'medium', icon: '⏱', text: `${inactive3d.length} student${inactive3d.length > 1 ? 's' : ''} have been inactive for 3+ days. A check-in message often reignites engagement.`, action: 'Send reminder', link: '/admin/notifications' })
  const lowPassTracks = trackStats.filter(t => t.flagged)
  if (lowPassTracks.length > 0) suggestions.push({ priority: 'medium', icon: '📊', text: `${lowPassTracks.map(t => t.label).join(', ')} track${lowPassTracks.length > 1 ? 's have' : ' has'} below 60% pass rate. Review assessment difficulty or schedule a focused session.`, action: 'View assessments', link: '/admin/assessments' })
  if (lowTime.length > 0) suggestions.push({ priority: 'low', icon: '⏰', text: `${lowTime.length} student${lowTime.length > 1 ? 's' : ''} are submitting labs with very little time in the portal. Quality may suffer — encourage them to take more time.`, action: null, link: null })
  if (pending + pendingAsmt > 8) suggestions.push({ priority: 'high', icon: '⏳', text: `${pending + pendingAsmt} submissions pending grade. Students are waiting for feedback.`, action: 'Grade now', link: '/admin/grading' })

  // ── Chart ────────────────────────────────────────────────────
  const allProgramWeeks = ['applied_ai', 'aws'].flatMap(p => getWeeksByProgram(p))
  const weekChartData = allProgramWeeks
    .map(w => ({ name: `${w.program === 'aws' ? 'AWS' : 'AI'} W${w.num}`, submissions: allProgress.filter(p => p.week_num === w.num && p.completed).length, color: w.color }))
    .filter(d => d.submissions > 0)

  const priorityColor = { high: 'var(--danger)', medium: 'var(--yellow)', low: 'var(--muted)' }
  const priorityBg = { high: 'rgba(239,68,68,0.08)', medium: 'var(--yellow-d)', low: 'var(--s2)' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.62rem', color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 4 }}>Administrator</div>
          <h1 style={{ fontWeight: 800, fontSize: '1.5rem' }}>Cohort Overview</h1>
        </div>
        <Link to="/admin/notifications" className="btn btn-primary btn-sm">📣 Send Notification</Link>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 10, marginBottom: '1.75rem' }}>
        {[
          { n: students.length, l: 'Students', c: 'var(--orange)', i: '👥' },
          { n: `${avgPct}%`, l: 'Avg Progress', c: avgPct >= 50 ? 'var(--green)' : 'var(--yellow)', i: '📈' },
          { n: submitted, l: 'Labs Submitted', c: 'var(--orange)', i: '📤' },
          { n: pending + pendingAsmt, l: 'Pending Grade', c: (pending + pendingAsmt) > 0 ? 'var(--yellow)' : 'var(--green)', i: '⏳' },
          { n: asmtSubs.filter(s => s.grade === 'pass').length, l: 'Assessments Passed', c: 'var(--green)', i: '🏆' },
          { n: certCounts[0], l: 'L1 Certs', c: 'var(--l1)', i: '🔵' },
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
          {/* ── Instructor Intelligence Panel ── */}
          <div className="card" style={{ marginBottom: '1.25rem', overflow: 'hidden', border: `1px solid ${suggestions.some(s => s.priority === 'high') ? 'rgba(239,68,68,0.2)' : 'var(--border)'}` }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>🎯 Instructor Focus Panel</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {['alerts', 'tracks', 'roster'].map(t => (
                  <button key={t} onClick={() => setFocusTab(t)}
                    className={`btn btn-sm ${focusTab === t ? 'btn-secondary' : 'btn-ghost'}`}
                    style={{ fontSize: '0.68rem', textTransform: 'capitalize' }}>
                    {t === 'alerts' ? '🚨 Alerts' : t === 'tracks' ? '📊 By Track' : '👥 Roster'}
                  </button>
                ))}
              </div>
            </div>

            {focusTab === 'alerts' && (
              <div>
                {suggestions.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.82rem' }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>✅</div>All good — no urgent focus items right now.
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
            )}

            {focusTab === 'tracks' && (
              <div>
                {trackStats.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.82rem' }}>No students with career tracks set yet. Complete intake surveys first.</div>
                ) : trackStats.map(t => (
                  <div key={t.id} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '1.1rem' }}>{TRACK_INTEL[t.id]?.icon || '🎯'}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{t.label}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--muted)', marginTop: 2 }}>{t.count} student{t.count > 1 ? 's' : ''} · Avg assessment score: {t.avgScore || 0}pts</div>
                    </div>
                    {t.passRate !== null ? (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: t.flagged ? 'var(--danger)' : 'var(--green)' }}>{t.passRate}%</div>
                        <div style={{ fontSize: '0.6rem', color: 'var(--muted)' }}>pass rate</div>
                        {t.flagged && <div style={{ fontSize: '0.6rem', color: 'var(--danger)', fontWeight: 700 }}>⚠ Review</div>}
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>No grades yet</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {focusTab === 'roster' && (
              <div style={{ overflowX: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', gap: 8, padding: '8px 16px', background: 'rgba(255,255,255,0.03)', fontSize: '0.6rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em', minWidth: 540 }}>
                  <div>Student</div><div>Track</div><div>Score</div><div>Quiz</div><div>Time</div><div>Status</div>
                </div>
                {studentStats.map(st => {
                  const track = CAREER_TRACKS.find(t => t.id === st.career_track)
                  const status = st.daysSinceActivity >= 7 ? { label: '🔴 Inactive', color: 'var(--danger)' }
                    : st.daysSinceActivity >= 3 ? { label: '🟡 Slow', color: 'var(--yellow)' }
                    : st.done > 0 ? { label: '🟢 Active', color: 'var(--green)' }
                    : { label: '⚪ Not started', color: 'var(--muted)' }
                  return (
                    <div key={st.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', gap: 8, padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'center', fontSize: '0.74rem', minWidth: 540 }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{st.full_name}</div>
                        <div style={{ fontSize: '0.66rem', color: 'var(--muted)' }}>{st.done} labs · {st.asmtPasses} assessments</div>
                      </div>
                      <div style={{ fontSize: '0.68rem', color: track ? 'var(--orange)' : 'var(--muted)' }}>{track?.label || (st.surveyDone ? '—' : '⚠ No survey')}</div>
                      <div style={{ fontWeight: 700, color: 'var(--orange)' }}>{st.totalScore}pts</div>
                      <div style={{ color: 'var(--muted)' }}>{st.quizScore !== null ? `${st.quizScore}/9` : '—'}</div>
                      <div style={{ color: 'var(--muted)' }}>{st.timeHours}h</div>
                      <div style={{ fontSize: '0.68rem', fontWeight: 600, color: status.color }}>{status.label}</div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Chart */}
          <div className="card card-p">
            <div className="section-label">Lab Submissions by Week</div>
            {weekChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={weekChartData} barSize={24}>
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6B7A96' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#6B7A96' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--s2)', border: '1px solid var(--border2)', borderRadius: 8, fontSize: 11 }} />
                  <Bar dataKey="submissions" radius={[4, 4, 0, 0]}>
                    {weekChartData.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.85} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--muted)', fontSize: '0.78rem' }}>No lab submissions yet</div>}
          </div>
        </div>

        <div>
          {/* Grade queue */}
          <div className="card card-p" style={{ marginBottom: '1rem' }}>
            <div className="section-label">Grading Queue</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '0.5rem 0 1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: pending > 0 ? 'var(--yellow)' : 'var(--green)' }}>{pending}</div>
                <div style={{ fontSize: '0.64rem', color: 'var(--muted)' }}>labs pending</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: pendingAsmt > 0 ? 'var(--yellow)' : 'var(--green)' }}>{pendingAsmt}</div>
                <div style={{ fontSize: '0.64rem', color: 'var(--muted)' }}>assessments pending</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <Link to="/admin/grading" className="btn btn-primary btn-sm" style={{ flex: 1, textAlign: 'center' }}>Labs</Link>
              <Link to="/admin/assessments" className="btn btn-secondary btn-sm" style={{ flex: 1, textAlign: 'center' }}>Assessments</Link>
            </div>
          </div>

          {/* Survey completion */}
          <div className="card card-p" style={{ marginBottom: '1rem' }}>
            <div className="section-label">Intake Survey Status</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text2)' }}>{surveyData.length} / {students.length} completed</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: noSurvey.length > 0 ? 'var(--yellow)' : 'var(--green)' }}>
                {noSurvey.length > 0 ? `⚠ ${noSurvey.length} missing` : '✅ All done'}
              </span>
            </div>
            <div style={{ height: 6, background: 'var(--s3)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${students.length ? (surveyData.length / students.length) * 100 : 0}%`, background: 'var(--orange)', borderRadius: 3 }} />
            </div>
            {surveyData.length > 0 && (
              <div style={{ marginTop: 10, fontSize: '0.72rem', color: 'var(--muted)' }}>
                Avg quiz score: <strong style={{ color: 'var(--orange)' }}>{Math.round(surveyData.reduce((s, d) => s + (d.total_quiz_score || 0), 0) / surveyData.length)}/9</strong> ·
                Cyber: <strong>{Math.round(surveyData.reduce((s, d) => s + (d.cyber_score || 0), 0) / surveyData.length)}/4</strong> ·
                AI: <strong>{Math.round(surveyData.reduce((s, d) => s + (d.ai_quiz_score || 0), 0) / surveyData.length)}/5</strong>
              </div>
            )}
          </div>

          {/* Recent activity */}
          <div className="card card-p">
            <div className="section-label">Recent Submissions</div>
            {allProgress.filter(p => p.completed && p.grade === 'pending').slice(0, 5).map((p, i) => {
              const student = students.find(s => s.id === p.user_id)
              return (
                <div key={i} style={{ padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: '0.76rem' }}>
                  <div style={{ fontWeight: 600 }}>{student?.full_name || 'Student'}</div>
                  <div style={{ color: 'var(--muted)' }}>Week {p.week_num} · Lab {p.lab_num} · {new Date(p.completed_at).toLocaleDateString()}</div>
                </div>
              )
            })}
            {allProgress.filter(p => p.grade === 'pending').length === 0 && (
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', textAlign: 'center', padding: '1rem' }}>All caught up! 🎉</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
