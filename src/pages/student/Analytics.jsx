// Analytics.jsx — Student view of personal progress and weakness areas
import { useState, useEffect } from 'react'
import { useAuth } from '../../lib/AuthContext'
import { supabase } from '../../lib/supabase'
import { getWeeksByProgram, CAREER_TRACKS, getImprovementSuggestions } from '../../lib/programData'
import AppLayout from '../../components/layout/AppLayout'

export default function Analytics() {
  const { profile } = useAuth()
  const [progress, setProgress] = useState([])
  const [assessments, setAssessments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [profile?.id])

  async function load() {
    const [{ data: prog }, { data: asmt }] = await Promise.all([
      supabase.from('progress').select('*').eq('user_id', profile.id),
      supabase.from('assessment_submissions').select('*').eq('user_id', profile.id),
    ])
    setProgress(prog || [])
    setAssessments(asmt || [])
    setLoading(false)
  }

  if (loading) return <AppLayout><div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="loader" /></div></AppLayout>

  const weeks = getWeeksByProgram(profile?.program)
  const completed = progress.filter(p => p.completed).length
  const failed = progress.filter(p => p.grade === 'fail').length
  const passed = progress.filter(p => p.grade === 'pass').length
  const pending = progress.filter(p => p.grade === 'pending').length

  // Weakness scoring: labs taking multiple attempts or with fail grades
  const strugglingLabs = progress
    .filter(p => p.grade === 'fail' || p.grade === 'pending')
    .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))
    .slice(0, 5)

  // Assessment performance
  const asmtByDifficulty = {
    beginner: assessments.filter(a => a.difficulty === 'beginner'),
    intermediate: assessments.filter(a => a.difficulty === 'intermediate'),
    advanced: assessments.filter(a => a.difficulty === 'advanced'),
  }

  const passRateByDiff = Object.entries(asmtByDifficulty).reduce((acc, [diff, list]) => {
    const passes = list.filter(a => a.grade === 'pass').length
    return { ...acc, [diff]: list.length > 0 ? Math.round((passes / list.length) * 100) : 0 }
  }, {})

  const avgScore = assessments.filter(a => a.grade === 'pass').length > 0
    ? Math.round(assessments.filter(a => a.grade === 'pass').reduce((sum, a) => sum + (a.score || 0), 0) / assessments.filter(a => a.grade === 'pass').length)
    : 0

  // Labs by week performance
  const weekStats = weeks.map(w => {
    const weekLabs = progress.filter(p => p.week_num === w.num)
    const completed = weekLabs.filter(p => p.completed).length
    const total = w.labCount || 1
    return {
      num: w.num,
      title: w.title,
      completed,
      total,
      pct: total > 0 ? Math.round((completed / total) * 100) : 0,
      failed: weekLabs.filter(p => p.grade === 'fail').length,
      color: w.color,
    }
  })

  const hardestWeeks = weekStats.filter(w => w.failed > 0).sort((a, b) => b.failed - a.failed)

  return (
    <AppLayout>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: 4 }}>Your Progress & Insights</h1>
          <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>See where you're excelling and where to focus next</div>
        </div>

        {/* KPI cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: '1.5rem' }}>
          {[
            { label: 'Labs Completed', value: completed, color: 'var(--orange)', icon: '📤' },
            { label: 'Passed', value: passed, color: 'var(--green)', icon: '✅' },
            { label: 'Failed', value: failed, color: 'var(--danger)', icon: '❌' },
            { label: 'Pending Grade', value: pending, color: 'var(--yellow)', icon: '⏳' },
            { label: 'Avg Assessment', value: `${avgScore}pts`, color: 'var(--orange)', icon: '🎯' },
          ].map((k, i) => (
            <div key={i} className="card" style={{ padding: '1rem', textAlign: 'center', borderTop: `3px solid ${k.color}` }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{k.icon}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: k.color, lineHeight: 1 }}>{k.value}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* Insights grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
          {/* Struggling labs */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              🚨 Areas to Review
            </div>
            {strugglingLabs.length === 0 ? (
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)', padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>🎉</div>
                You're doing great! No pending grades or failures.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {strugglingLabs.map(lab => {
                  const week = weeks.find(w => w.num === lab.week_num)
                  return (
                    <div key={lab.id} style={{ padding: '10px 12px', background: lab.grade === 'fail' ? 'rgba(239,68,68,0.08)' : 'var(--yellow-d)', border: lab.grade === 'fail' ? '1px solid rgba(239,68,68,0.2)' : '1px solid var(--yellow-b)', borderRadius: 8, fontSize: '0.75rem' }}>
                      <div style={{ fontWeight: 600, color: lab.grade === 'fail' ? 'var(--danger)' : 'var(--yellow)', marginBottom: 2 }}>
                        W{lab.week_num} L{lab.lab_num}: {week?.title || 'Lab'}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text2)' }}>
                        {lab.grade === 'fail' ? '❌ Needs revision' : '⏳ Waiting for feedback'}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Assessment performance by difficulty */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              📊 Assessment Performance
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Beginner', color: '#22C55E', pass: passRateByDiff.beginner },
                { label: 'Intermediate', color: '#F97316', pass: passRateByDiff.intermediate },
                { label: 'Advanced', color: '#EF4444', pass: passRateByDiff.advanced },
              ].map((d, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.75rem' }}>
                    <span style={{ fontWeight: 600 }}>{d.label}</span>
                    <span style={{ color: d.color, fontWeight: 700 }}>{d.pass}% pass</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--s2)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${d.pass}%`, background: d.color, transition: 'width 0.3s' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Week-by-week breakdown */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            📈 Progress by Week
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
            {weekStats.map(w => (
              <div key={w.num} style={{ padding: '12px', background: 'var(--s2)', borderLeft: `3px solid ${w.color}`, borderRadius: 8 }}>
                <div style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: 6 }}>W{w.num}: {w.title}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: w.pct >= 75 ? 'var(--green)' : w.pct >= 50 ? 'var(--orange)' : 'var(--danger)' }}>{w.pct}%</div>
                    <div style={{ fontSize: '0.64rem', color: 'var(--muted)' }}>{w.completed}/{w.total} labs</div>
                  </div>
                  {w.failed > 0 && <div style={{ fontSize: '0.7rem', color: 'var(--danger)', fontWeight: 700 }}>❌ {w.failed}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hardest weeks */}
        {hardestWeeks.length > 0 && (
          <div className="card" style={{ padding: '1.25rem', marginTop: '1.25rem', borderLeft: '3px solid var(--orange)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              💡 Focus Areas
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {hardestWeeks.map(w => (
                <div key={w.num} style={{ padding: '10px 12px', background: 'var(--yellow-d)', border: '1px solid var(--yellow-b)', borderRadius: 8, fontSize: '0.76rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--yellow)', marginBottom: 2 }}>
                    Week {w.num}: {w.title}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text2)' }}>
                    {w.failed} labs didn't pass on first attempt. Review these and try again!
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="card" style={{ padding: '1.25rem', marginTop: '1.25rem', background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            🎯 Next Steps
          </div>
          <ul style={{ fontSize: '0.78rem', color: 'var(--text2)', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
            {completed < 26 && <li>Complete more labs in your current week to unlock advanced content</li>}
            {failed > 0 && <li>Revisit labs you didn't pass and resubmit—your instructor will re-grade them</li>}
            {passed < 3 && <li>Try more assessments to increase your score and unlock career recommendations</li>}
            {hardestWeeks.length > 0 && <li>Focus on the weeks with the most challenges—master these concepts</li>}
            <li>Message your instructor if you're stuck or need clarification on any concept</li>
          </ul>
        </div>
      </div>
    </AppLayout>
  )
}
