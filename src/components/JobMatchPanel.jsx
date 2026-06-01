import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'
import { getWeeksByProgram, getProgramById, getCertStatus } from '../lib/programData'

// ── Job search URL builders ──────────────────────────────────
function searchLinks(query) {
  const q = encodeURIComponent(query)
  const loc = encodeURIComponent('Denver, CO')
  return {
    linkedin:  `https://www.linkedin.com/jobs/search/?keywords=${q}&location=${loc}&f_E=1,2`,
    google:    `https://www.google.com/search?q=${q}+jobs&ibp=htl;jobs`,
    indeed:    `https://www.indeed.com/jobs?q=${q}&l=${loc}`,
    glassdoor: `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${q}&locT=C&locId=1148170`,
  }
}

// ── Match jobs to student progress ──────────────────────────
function getJobMatches(program, progress, programWeeks) {
  const certsEarned = getCertStatus(progress, program)
  const completedWeekNums = [...new Set((progress || []).filter(p => p.completed).map(p => p.week_num))]
  const maxWeek = completedWeekNums.length > 0 ? Math.max(...completedWeekNums) : 0

  // Collect careerContext from all weeks student has touched or is on
  const relevantWeeks = programWeeks.filter(w => w.num <= Math.max(maxWeek + 1, 1) && w.careerContext)
  if (!relevantWeeks.length) return []

  // Build de-duped job matches with the most advanced week's data prominently
  const matched = []
  const seenTitles = new Set()

  // Most advanced first
  const sorted = [...relevantWeeks].sort((a, b) => b.num - a.num)
  sorted.forEach(week => {
    const ctx = week.careerContext
    ctx.jobTitles.forEach(title => {
      if (!seenTitles.has(title)) {
        seenTitles.add(title)
        matched.push({
          title,
          salary: ctx.salaryRange,
          skills: ctx.skills,
          searchQuery: ctx.searchQuery,
          weekNum: week.num,
          weekTitle: week.title,
          color: week.color,
          levelUp: ctx.levelUp,
          whyItMatters: ctx.whyItMatters,
          businessUse: ctx.businessUse || null,
          employeeUse: ctx.employeeUse || null,
          roi: ctx.roi || null,
        })
      }
    })
  })

  return matched.slice(0, 6)
}

export default function JobMatchPanel({ progress = [] }) {
  const { profile } = useAuth()
  const [open, setOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)

  const myProgram = profile?.program || 'applied_ai'
  const programMeta = getProgramById(myProgram)
  const programWeeks = getWeeksByProgram(myProgram)
  const jobs = getJobMatches(myProgram, progress, programWeeks)

  const completedCount = (progress || []).filter(p => p.completed).length
  const totalLabs = programWeeks.reduce((s, w) => s + w.labCount, 0) || 1
  const pct = Math.round((completedCount / totalLabs) * 100)

  return (
    <>
      {/* ── Floating trigger button ── */}
      <button
        className="job-match-fab"
        onClick={() => { setOpen(true); setSelectedJob(null) }}
        aria-label="View job matches"
      >
        <span style={{ fontSize: '1.2rem' }}>💼</span>
        <span className="job-match-fab-label">Job Match</span>
        {jobs.length > 0 && <span className="job-match-fab-count">{jobs.length}</span>}
      </button>

      {/* ── Panel overlay ── */}
      {open && (
        <>
          <div className="job-panel-overlay" onClick={() => setOpen(false)} />
          <div className="job-panel">
            {/* Header */}
            <div className="job-panel-header">
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem' }}>💼 Your Job Matches</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 2 }}>
                  {programMeta.icon} {programMeta.label} · {pct}% complete
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '1.2rem', cursor: 'pointer', padding: 4 }}
              >✕</button>
            </div>

            {/* Progress bar */}
            <div style={{ padding: '0 1.25rem 1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', color: 'var(--muted)', marginBottom: 4 }}>
                <span>{completedCount} labs completed</span>
                <span style={{ color: 'var(--orange)' }}>{pct}%</span>
              </div>
              <div className="progress-bar progress-bar-sm">
                <div className="progress-fill progress-fill-gradient" style={{ width: `${pct}%` }} />
              </div>
            </div>

            <div className="job-panel-body">
              {!selectedJob ? (
                <>
                  <div className="section-label" style={{ padding: '0 1.25rem', marginBottom: '0.75rem' }}>
                    Roles you qualify for now
                  </div>

                  {jobs.length === 0 ? (
                    <div style={{ padding: '2rem 1.25rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.82rem' }}>
                      <div style={{ fontSize: '2rem', marginBottom: 8 }}>🔒</div>
                      Complete your first labs to unlock job matches.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '0 1rem' }}>
                      {jobs.map((job, i) => {
                        const links = searchLinks(job.searchQuery)
                        return (
                          <div
                            key={i}
                            className="job-card card-hover"
                            style={{ borderLeft: `3px solid ${job.color}` }}
                            onClick={() => setSelectedJob(job)}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                              <div>
                                <div style={{ fontWeight: 700, fontSize: '0.86rem', marginBottom: 2 }}>{job.title}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>from Week {job.weekNum}: {job.weekTitle}</div>
                              </div>
                              <span style={{ fontSize: '0.7rem', color: 'var(--green)', fontWeight: 700, background: 'var(--green-d)', padding: '2px 8px', borderRadius: 10, whiteSpace: 'nowrap', flexShrink: 0 }}>
                                {job.salary}
                              </span>
                            </div>
                            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                              {[
                                { label: 'LinkedIn', href: links.linkedin, color: '#0A66C2' },
                                { label: 'Indeed',   href: links.indeed,   color: '#003A9B' },
                                { label: 'Google',   href: links.google,   color: '#EA4335' },
                              ].map(({ label, href, color }) => (
                                <a
                                  key={label}
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={e => e.stopPropagation()}
                                  style={{ fontSize: '0.62rem', fontWeight: 700, color, background: `${color}18`, padding: '2px 8px', borderRadius: 8, textDecoration: 'none', border: `1px solid ${color}30`, transition: 'opacity 0.15s' }}
                                >
                                  {label} ↗
                                </a>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Glassdoor + salary link */}
                  {jobs.length > 0 && (
                    <div style={{ padding: '1rem 1.25rem 0', fontSize: '0.72rem', color: 'var(--muted)', textAlign: 'center' }}>
                      <a
                        href={searchLinks(jobs[0].searchQuery).glassdoor}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--orange)', textDecoration: 'none' }}
                      >
                        View salary data on Glassdoor ↗
                      </a>
                    </div>
                  )}
                </>
              ) : (
                /* ── Job detail view ── */
                <div style={{ padding: '0 1.25rem' }}>
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="btn btn-ghost btn-sm"
                    style={{ marginBottom: '1rem' }}
                  >← Back to matches</button>

                  <div style={{ borderLeft: `3px solid ${selectedJob.color}`, paddingLeft: '0.875rem', marginBottom: '1.25rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 2 }}>{selectedJob.title}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Week {selectedJob.weekNum}: {selectedJob.weekTitle}</div>
                  </div>

                  <div className="section-label" style={{ marginBottom: '0.5rem' }}>Salary range</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--green)', marginBottom: '1.25rem' }}>
                    {selectedJob.salary}
                  </div>

                  <div className="section-label" style={{ marginBottom: '0.5rem' }}>Why it matters — Job seeker</div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text2)', lineHeight: 1.7, marginBottom: selectedJob.businessUse ? '0.75rem' : '1.25rem' }}>
                    {selectedJob.whyItMatters}
                  </p>
                  {selectedJob.businessUse && (
                    <>
                      <div className="section-label" style={{ marginBottom: '0.5rem' }}>For business owners</div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text2)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                        {selectedJob.businessUse}
                      </p>
                      {selectedJob.roi && (
                        <div style={{ padding: '8px 12px', background: 'var(--green-d)', border: '1px solid var(--green-b)', borderRadius: 8, fontSize: '0.74rem', color: 'var(--green)', fontWeight: 600, marginBottom: '1.25rem' }}>
                          💰 {selectedJob.roi}
                        </div>
                      )}
                    </>
                  )}

                  <div className="section-label" style={{ marginBottom: '0.5rem' }}>Skills you've built</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1.25rem' }}>
                    {selectedJob.skills.map((s, i) => (
                      <span key={i} style={{ fontSize: '0.68rem', padding: '3px 10px', borderRadius: 20, background: 'var(--s3)', color: 'var(--text2)', border: '1px solid var(--border2)' }}>{s}</span>
                    ))}
                  </div>

                  <div className="section-label" style={{ marginBottom: '0.5rem' }}>Level up tip</div>
                  <div style={{ padding: '10px 14px', background: 'var(--orange-d)', border: '1px solid var(--orange-b)', borderRadius: 8, fontSize: '0.78rem', color: 'var(--orange)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    {selectedJob.levelUp}
                  </div>

                  <div className="section-label" style={{ marginBottom: '0.75rem' }}>Search this role</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { label: '🔵 LinkedIn Jobs', href: searchLinks(selectedJob.searchQuery).linkedin, desc: 'Best for networking & referrals' },
                      { label: '🔴 Google Jobs',  href: searchLinks(selectedJob.searchQuery).google,   desc: 'Aggregates all job boards' },
                      { label: '🔵 Indeed',       href: searchLinks(selectedJob.searchQuery).indeed,   desc: 'High volume, easy apply' },
                      { label: '🟢 Glassdoor',    href: searchLinks(selectedJob.searchQuery).glassdoor, desc: 'Salaries + company reviews' },
                    ].map(({ label, href, desc }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--s2)', borderRadius: 8, border: '1px solid var(--border)', textDecoration: 'none', transition: 'border-color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text)' }}>{label} ↗</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>{desc}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
