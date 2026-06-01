import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { getWeeksByProgram, getTotalLabsByProgram } from '../../lib/programData'

export default function AdminAnalytics() {
  const [students, setStudents] = useState([])
  const [allProgress, setAllProgress] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    const [{ data: profs }, { data: prog }] = await Promise.all([
      supabase.from('profiles').select('*').eq('role', 'student'),
      supabase.from('progress').select('*')
    ])
    setStudents(profs || [])
    setAllProgress(prog || [])
    setLoading(false)
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="loader" /></div>

  const n = students.length || 1
  const now = Date.now()

  // Per-lab stats across all students
  function labStats(wn, ln) {
    const entries = allProgress.filter(p => p.week_num === wn && p.lab_num === ln)
    const submitted = entries.filter(p => p.completed).length
    const passed = entries.filter(p => p.grade === 'pass').length
    const failed = entries.filter(p => p.grade === 'fail').length
    const completionRate = submitted / n
    const failRate = submitted > 0 ? failed / submitted : 0
    const passRate = submitted > 0 ? passed / submitted : 0
    // Weighted: fail rate matters more than incompletion
    const struggleScore = failRate * 0.6 + (1 - completionRate) * 0.4
    return { submitted, passed, failed, completionRate, failRate, passRate, struggleScore }
  }

  // Build all-lab ranking (across all programs)
  const allLabStats = []
  const ALL_WEEKS = ['applied_ai','aws','cybersecurity','ai_ml','mentorship'].flatMap(p => getWeeksByProgram(p))
  ALL_WEEKS.forEach(w => {
    w.labs.forEach(lab => {
      const stats = labStats(w.num, lab.num)
      allLabStats.push({ week: w, lab, ...stats })
    })
  })
  const hardestLabs = [...allLabStats]
    .filter(l => l.submitted > 0)
    .sort((a, b) => b.struggleScore - a.struggleScore)
    .slice(0, 10)

  const avgPassRate = allLabStats.filter(l => l.submitted > 0).length > 0
    ? Math.round(allLabStats.filter(l => l.submitted > 0).reduce((s, l) => s + l.passRate, 0) / allLabStats.filter(l => l.submitted > 0).length * 100)
    : 0
  const hardLabsCount = allLabStats.filter(l => l.struggleScore > 0.5 && l.submitted > 0).length

  // Per-student risk signals
  const studentRisk = students.map(st => {
    const prog = allProgress.filter(p => p.user_id === st.id)
    const completed = prog.filter(p => p.completed)
    const failedLabs = prog.filter(p => p.grade === 'fail')
    const totalLabs = getTotalLabsByProgram(st.program) || 52
    const completionPct = Math.round((completed.length / totalLabs) * 100)
    const lastSubmitTs = completed.length > 0
      ? Math.max(...completed.map(p => new Date(p.completed_at).getTime()))
      : (st.enrolled_at ? new Date(st.enrolled_at).getTime() : now - 14 * 86400000)
    const daysInactive = Math.floor((now - lastSubmitTs) / 86400000)
    const riskLevel =
      ((daysInactive >= 7 && completionPct < 60) || failedLabs.length >= 3) ? 'high'
      : (daysInactive >= 5 || failedLabs.length >= 2 || (completionPct < 20 && daysInactive >= 3)) ? 'medium'
      : 'low'
    return { ...st, completionPct, daysInactive, failedLabs, failCount: failedLabs.length, riskLevel }
  }).sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.riskLevel] - { high: 0, medium: 1, low: 2 }[b.riskLevel]))

  const atRisk = studentRisk.filter(s => s.riskLevel !== 'low')

  const struggleColor = (score, hasData) => {
    if (!hasData) return 'var(--s3)'
    if (score > 0.65) return '#EF4444'
    if (score > 0.4) return '#EAB308'
    if (score > 0.15) return '#22C55E'
    return '#22C55E'
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.62rem', color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 4 }}>Admin · Analytics</div>
        <h1 style={{ fontWeight: 800, fontSize: '1.4rem' }}>Struggle Analysis</h1>
        <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: 4 }}>Where students are getting stuck — by lab, by week, and individually.</p>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 10, marginBottom: '1.75rem' }}>
        {[
          { n: atRisk.filter(s => s.riskLevel === 'high').length, l: 'High-Risk', c: '#EF4444', i: '🔴', sub: 'need immediate attention' },
          { n: atRisk.filter(s => s.riskLevel === 'medium').length, l: 'Watch List', c: 'var(--yellow)', i: '🟡', sub: 'early warning signals' },
          { n: hardLabsCount, l: 'Hard Labs', c: 'var(--orange)', i: '⚠', sub: 'struggle score > 50%' },
          { n: `${avgPassRate}%`, l: 'Avg Pass Rate', c: avgPassRate >= 70 ? 'var(--green)' : avgPassRate >= 50 ? 'var(--yellow)' : '#EF4444', i: '📊', sub: 'across graded submissions' },
        ].map((k, i) => (
          <div key={i} className="stat-card" style={{ borderLeft: `3px solid ${k.c}` }}>
            <div style={{ fontSize: '1.1rem', marginBottom: 4 }}>{k.i}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: k.c, lineHeight: 1, marginBottom: 2 }}>{k.n}</div>
            <div className="stat-label">{k.l}</div>
            <div style={{ fontSize: '0.63rem', color: 'var(--muted)', marginTop: 2 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>

        {/* Hardest labs */}
        <div className="card card-p">
          <div className="section-label" style={{ marginBottom: '0.75rem' }}>Hardest Labs — Ranked by Struggle Score</div>
          {hardestLabs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--muted)', fontSize: '0.8rem' }}>No graded submissions yet</div>
          ) : hardestLabs.map((entry, i) => {
            const color = struggleColor(entry.struggleScore, true)
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 24, height: 24, borderRadius: 5, background: color, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.58rem', fontWeight: 800, color: 'rgba(0,0,0,0.7)' }}>#{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    W{entry.week.num} L{entry.lab.num}: {entry.lab.title}
                  </div>
                  <div style={{ fontSize: '0.67rem', color: 'var(--muted)', marginTop: 2, display: 'flex', gap: 10 }}>
                    <span>{Math.round(entry.completionRate * 100)}% completed</span>
                    <span style={{ color: entry.failRate > 0.3 ? '#EF4444' : 'var(--muted)' }}>❌ {Math.round(entry.failRate * 100)}% fail rate</span>
                    <span>{entry.submitted} submitted</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color }}>{Math.round(entry.struggleScore * 100)}%</div>
                  <div style={{ fontSize: '0.6rem', color: 'var(--muted)' }}>struggle</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* At-risk students */}
        <div className="card card-p">
          <div className="section-label" style={{ marginBottom: '0.75rem' }}>At-Risk Students</div>
          {atRisk.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--muted)', fontSize: '0.8rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>🎉</div>
              No students flagged — cohort is on track!
            </div>
          ) : atRisk.map(st => (
            <div key={st.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: st.riskLevel === 'high' ? '#EF4444' : 'var(--yellow)', marginTop: 5, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.83rem' }}>{st.full_name}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--muted)', marginTop: 3, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {st.daysInactive >= 5 && (
                    <span style={{ color: st.daysInactive >= 7 ? '#EF4444' : 'var(--yellow)' }}>⏱ {st.daysInactive}d no submission</span>
                  )}
                  {st.failCount > 0 && (
                    <span style={{ color: '#EF4444' }}>❌ {st.failCount} failed lab{st.failCount > 1 ? 's' : ''}</span>
                  )}
                  <span>📋 {st.completionPct}% complete</span>
                </div>
                {st.failedLabs.length > 0 && (
                  <div style={{ fontSize: '0.65rem', color: '#EF4444', marginTop: 4 }}>
                    Failing: {st.failedLabs.slice(0, 4).map(l => `W${l.week_num}L${l.lab_num}`).join(', ')}
                    {st.failedLabs.length > 4 ? ` +${st.failedLabs.length - 4} more` : ''}
                  </div>
                )}
              </div>
              <Link to={`/admin/students/${st.id}`} className="btn btn-ghost btn-sm" style={{ fontSize: '0.68rem', flexShrink: 0 }}>View →</Link>
            </div>
          ))}
        </div>
      </div>

      {/* Cohort heat map */}
      <div className="card card-p">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: 8 }}>
          <div className="section-label">Lab Completion Heat Map — {n} Student{n !== 1 ? 's' : ''}</div>
          <div style={{ display: 'flex', gap: 12, fontSize: '0.64rem', color: 'var(--muted)', alignItems: 'center', flexWrap: 'wrap' }}>
            {[['#22C55E', 'Good (≤15% struggle)'], ['#EAB308', 'Moderate'], ['#EF4444', 'Hard (>65%)'], ['var(--s3)', 'No submissions']].map(([c, l]) => (
              <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: c, display: 'inline-block' }} />{l}
              </span>
            ))}
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', color: 'var(--muted)', fontWeight: 600, fontSize: '0.65rem', padding: '4px 10px 10px 0', minWidth: 100 }}>Week</th>
                {Array.from({ length: 7 }, (_, i) => (
                  <th key={i} style={{ textAlign: 'center', color: 'var(--muted)', fontWeight: 600, fontSize: '0.65rem', padding: '4px 3px 10px', minWidth: 46 }}>Lab {i + 1}</th>
                ))}
                <th style={{ textAlign: 'center', color: 'var(--muted)', fontWeight: 600, fontSize: '0.65rem', padding: '4px 3px 10px', minWidth: 90 }}>Week avg</th>
              </tr>
            </thead>
            <tbody>
              {ALL_WEEKS.map(w => {
                const weekSubmitted = allProgress.filter(p => p.week_num === w.num && p.completed).length
                const weekPct = Math.round(weekSubmitted / (n * w.labCount) * 100)
                return (
                  <tr key={w.num} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '8px 10px 8px 0' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.75rem', color: w.color }}>W{w.num}</div>
                      <div style={{ fontSize: '0.6rem', color: 'var(--muted)', marginTop: 1 }}>{w.title.split(' ').slice(0, 3).join(' ')}</div>
                    </td>
                    {w.labs.map(lab => {
                      const stats = labStats(w.num, lab.num)
                      const hasData = stats.submitted > 0
                      const color = struggleColor(stats.struggleScore, hasData)
                      const tooltip = `W${w.num} L${lab.num}: ${lab.title}\n${Math.round(stats.completionRate * 100)}% submitted · ${Math.round(stats.failRate * 100)}% fail rate · ${stats.submitted}/${n} students`
                      return (
                        <td key={lab.num} style={{ textAlign: 'center', padding: 3 }}>
                          <div
                            title={tooltip}
                            style={{
                              width: 36, height: 36, borderRadius: 7,
                              background: color,
                              opacity: hasData ? 1 : 0.3,
                              margin: '0 auto',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '0.58rem', fontWeight: 700,
                              color: hasData ? 'rgba(0,0,0,0.75)' : 'var(--muted)',
                              cursor: 'default',
                            }}
                          >
                            {hasData ? `${Math.round(stats.completionRate * 100)}%` : '—'}
                          </div>
                        </td>
                      )
                    })}
                    {/* pad to 7 columns */}
                    {Array.from({ length: 7 - w.labs.length }, (_, i) => <td key={`p${i}`} />)}
                    <td style={{ textAlign: 'center', padding: '8px 4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center' }}>
                        <div style={{ width: 52, height: 5, borderRadius: 3, background: 'var(--s3)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${weekPct}%`, background: w.color, borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: '0.66rem', color: 'var(--muted)', minWidth: 26 }}>{weekPct}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Student row breakdown */}
        {students.length > 0 && (
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
            <div className="section-label" style={{ marginBottom: '0.75rem' }}>Per-Student Progress</div>
            {studentRisk.map(st => {
              const riskColor = st.riskLevel === 'high' ? '#EF4444' : st.riskLevel === 'medium' ? 'var(--yellow)' : 'var(--green)'
              return (
                <div key={st.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
                  <div style={{ width: 130, minWidth: 130 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: riskColor, flexShrink: 0, display: 'inline-block' }} />
                      {st.full_name?.split(' ')[0]}
                    </div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--muted)', marginTop: 1 }}>{st.completionPct}% done</div>
                  </div>
                  <div style={{ display: 'flex', gap: 3, flex: 1, flexWrap: 'wrap' }}>
                    {ALL_WEEKS.map(w => {
                      const wDone = allProgress.filter(p => p.user_id === st.id && p.week_num === w.num && p.completed).length
                      const wFail = allProgress.filter(p => p.user_id === st.id && p.week_num === w.num && p.grade === 'fail').length
                      const pct = Math.round(wDone / w.labCount * 100)
                      const bg = wFail > 0 ? '#EF444433' : pct === 100 ? `${w.color}33` : pct > 0 ? `${w.color}18` : 'var(--s2)'
                      const border = wFail > 0 ? '1px solid #EF444466' : pct === 100 ? `1px solid ${w.color}55` : '1px solid var(--border)'
                      return (
                        <div key={w.num} title={`W${w.num}: ${wDone}/${w.labCount} labs${wFail > 0 ? ` · ${wFail} failed` : ''}`}
                          style={{ width: 36, height: 28, borderRadius: 5, background: bg, border, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.58rem', fontWeight: 700, color: pct === 100 ? w.color : wFail > 0 ? '#EF4444' : 'var(--muted)', cursor: 'default' }}>
                          {pct > 0 ? `${pct}%` : '—'}
                        </div>
                      )
                    })}
                  </div>
                  <Link to={`/admin/students/${st.id}`} className="btn btn-ghost btn-sm" style={{ fontSize: '0.68rem', flexShrink: 0 }}>View →</Link>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
