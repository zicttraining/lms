import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../../lib/AuthContext'
import { supabase } from '../../lib/supabase'
import AppLayout from '../../components/layout/AppLayout'
import { getWeekByNum, getWeekStatus, getSessionsByWeek } from '../../lib/programData'

export default function WeekView() {
  const { weekNum } = useParams()
  const wn = parseInt(weekNum)
  const { profile } = useAuth()
  const week = getWeekByNum(profile?.program, wn)
  const [progress, setProgress] = useState([])
  const [allProgress, setAllProgress] = useState([])
  const sessions = getSessionsByWeek(profile?.program, wn)

  useEffect(() => {
    if (!profile?.id) return
    supabase.from('progress').select('*').eq('user_id', profile.id).then(({ data }) => {
      setAllProgress(data || [])
      setProgress((data || []).filter(p => p.week_num === wn))
    })
  }, [profile?.id, wn])

  if (!week) return null
  const status = getWeekStatus(wn, allProgress)
  const done = progress.filter(p => p.completed).length

  return (
    <AppLayout>
      <div style={{maxWidth:900,margin:'0 auto',padding:'1.5rem'}}>
        <Link to="/program" style={{fontSize:'0.78rem',color:'var(--muted)',textDecoration:'none',display:'block',marginBottom:'1rem'}}>← Program</Link>
        <div className="card" style={{padding:'1.5rem',marginBottom:'1.25rem',borderTop:`3px solid ${week.color}`}}>
          <span className={`badge badge-l${week.level}`} style={{marginBottom:8,display:'inline-block'}}>{week.levelLabel}</span>
          <h1 style={{fontWeight:800,fontSize:'clamp(1.2rem,3vw,1.7rem)',marginBottom:6}}>Week {wn}: {week.title}</h1>
          <div style={{fontSize:'0.78rem',color:'var(--muted)'}}>{week.sessions} instructor-led sessions · {week.labCount} labs · {done}/{week.labCount} complete</div>
          <div className="progress-bar" style={{marginTop:10}}><div className="progress-fill" style={{width:`${Math.round(done/week.labCount*100)}%`,background:week.color}} /></div>
        </div>
        <div className="section-label">Labs</div>
        <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:'1.5rem'}}>
          {week.labs.map(lab => {
            const labProg = progress.find(p => p.lab_num === lab.num)
            const isComplete = labProg?.completed
            return (
              <Link key={lab.num} to={`/program/week/${wn}/lab/${lab.num}`} style={{textDecoration:'none'}}>
                <div className="card card-hover" style={{padding:'1rem',display:'flex',alignItems:'center',gap:12,borderLeft:`3px solid ${isComplete ? week.color : 'transparent'}`}}>
                  <div style={{width:28,height:28,borderRadius:'50%',background:isComplete?week.color:'var(--s3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.7rem',fontWeight:700,color:isComplete?'#0C0F14':'var(--muted)',flexShrink:0}}>{isComplete?'✓':lab.num}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:'0.86rem',marginBottom:2}}>{lab.title}</div>
                    <div style={{fontSize:'0.72rem',color:'var(--muted)'}}>{lab.day}{lab.isApplied?' · ★ Applied Lab':''}</div>
                  </div>
                  {labProg?.grade && <span className={`badge grade-${labProg.grade}`}>{labProg.grade}</span>}
                  <span style={{color:'var(--muted)',fontSize:'0.8rem'}}>→</span>
                </div>
              </Link>
            )
          })}
        </div>
        {sessions.length > 0 && (
          <>
            <div className="section-label">Sessions This Week</div>
            <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:'1.5rem'}}>
              {sessions.map((s,i) => (
                <div key={i} className="card" style={{padding:'0.9rem 1.1rem'}}>
                  <div style={{fontFamily:'DM Mono',fontSize:'0.65rem',color:'var(--muted)',marginBottom:4}}>{s.id} · {s.day}</div>
                  <div style={{fontWeight:600,fontSize:'0.86rem',marginBottom:3}}>{s.title}</div>
                  <div style={{fontSize:'0.76rem',color:'var(--text2)'}}>{s.objective}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Career context card ── */}
        {week.careerContext && <CareerContextCard ctx={week.careerContext} color={week.color} />}
      </div>
    </AppLayout>
  )
}

function CareerContextCard({ ctx, color }) {
  const hasBusiness = !!(ctx.businessUse)
  // Default to 'business' tab if business context exists, otherwise 'jobs'
  const [activeView, setActiveView] = useState(hasBusiness ? 'business' : 'jobs')
  const [expanded, setExpanded] = useState(false)

  const q = encodeURIComponent(ctx.searchQuery)
  const loc = encodeURIComponent('Denver, CO')
  const jobLinks = [
    { label: 'LinkedIn',    href: `https://www.linkedin.com/jobs/search/?keywords=${q}&location=${loc}&f_E=1,2`, color: '#0A66C2' },
    { label: 'Google Jobs', href: `https://www.google.com/search?q=${q}+jobs&ibp=htl;jobs`,                    color: '#EA4335' },
    { label: 'Indeed',      href: `https://www.indeed.com/jobs?q=${q}&l=${loc}`,                               color: '#003A9B' },
    { label: 'Glassdoor',   href: `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${q}&locT=C&locId=1148170`, color: '#0CAA41' },
  ]

  const views = [
    hasBusiness && { id: 'business', label: '🏢 Business Owner' },
    hasBusiness && { id: 'employee', label: '👔 Employee' },
    { id: 'jobs', label: '💼 Job Seeker' },
  ].filter(Boolean)

  return (
    <div className="card" style={{borderTop:`3px solid ${color}`,padding:'1.25rem',marginBottom:'1rem'}}>
      <div style={{fontWeight:700,fontSize:'0.9rem',color:'var(--white)',marginBottom:'0.875rem'}}>
        🎯 How This Week Applies to Real Life
      </div>

      {/* Audience tabs */}
      {views.length > 1 && (
        <div style={{display:'flex',gap:0,borderBottom:'1px solid var(--border)',marginBottom:'1rem'}}>
          {views.map(v => (
            <button
              key={v.id}
              onClick={() => setActiveView(v.id)}
              style={{
                padding:'6px 12px', fontSize:'0.72rem', fontWeight:600,
                color: activeView === v.id ? color : 'var(--muted)',
                background:'none', border:'none',
                borderBottom: activeView === v.id ? `2px solid ${color}` : '2px solid transparent',
                cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap',
                transition:'color 0.15s', marginBottom:-1,
              }}
            >{v.label}</button>
          ))}
        </div>
      )}

      {/* Business Owner view */}
      {activeView === 'business' && ctx.businessUse && (
        <div>
          <p style={{fontSize:'0.82rem',color:'var(--text2)',lineHeight:1.7,marginBottom:'1rem'}}>{ctx.businessUse}</p>
          {ctx.roi && (
            <div style={{padding:'8px 14px',background:'var(--green-d)',border:'1px solid var(--green-b)',borderRadius:8,fontSize:'0.76rem',color:'var(--green)',fontWeight:600,lineHeight:1.6,marginBottom:'1rem'}}>
              💰 ROI: {ctx.roi}
            </div>
          )}
          {ctx.businessExamples?.length > 0 && (
            <>
              <div style={{fontSize:'0.68rem',color:'var(--muted)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:8}}>Real business examples</div>
              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                {ctx.businessExamples.map((ex,i) => (
                  <div key={i} style={{display:'flex',gap:10,fontSize:'0.78rem',color:'var(--text2)',lineHeight:1.6,padding:'8px 12px',background:'var(--s2)',borderRadius:6,borderLeft:`2px solid ${color}`}}>
                    <span style={{flexShrink:0,marginTop:1}}>✓</span>
                    <span>{ex}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Employee view */}
      {activeView === 'employee' && ctx.employeeUse && (
        <div>
          <p style={{fontSize:'0.82rem',color:'var(--text2)',lineHeight:1.7,marginBottom:'1rem'}}>{ctx.employeeUse}</p>
          <div style={{padding:'10px 14px',background:'var(--orange-d)',border:'1px solid var(--orange-b)',borderRadius:8,fontSize:'0.78rem',color:'var(--orange)',lineHeight:1.6}}>
            🚀 Level up: {ctx.levelUp}
          </div>
        </div>
      )}

      {/* Job Seeker view */}
      {activeView === 'jobs' && (
        <div>
          <p style={{fontSize:'0.82rem',color:'var(--text2)',lineHeight:1.7,marginBottom:'1rem'}}>{ctx.whyItMatters}</p>

          {/* Job titles + salary */}
          <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:'1rem'}}>
            {ctx.jobTitles.map((t,i) => (
              <span key={i} style={{fontSize:'0.72rem',fontWeight:600,padding:'4px 12px',borderRadius:20,background:'var(--s3)',border:`1px solid ${color}40`,color:'var(--text)'}}>
                {t}
              </span>
            ))}
            <span style={{fontSize:'0.72rem',fontWeight:700,padding:'4px 12px',borderRadius:20,background:'var(--green-d)',border:'1px solid var(--green-b)',color:'var(--green)'}}>
              {ctx.salaryRange}
            </span>
          </div>

          {/* Skills */}
          <button onClick={()=>setExpanded(e=>!e)} style={{background:'none',border:'none',color:'var(--muted)',cursor:'pointer',fontSize:'0.72rem',padding:0,marginBottom:expanded?'0.75rem':0}}>
            {expanded ? '▲ Hide skills' : '▼ Skills you\'re building'}
          </button>
          {expanded && (
            <div style={{display:'flex',flexWrap:'wrap',gap:5,margin:'0.5rem 0 1rem'}}>
              {ctx.skills.map((s,i) => (
                <span key={i} style={{fontSize:'0.7rem',padding:'2px 10px',borderRadius:20,background:'var(--s2)',border:'1px solid var(--border2)',color:'var(--text2)'}}>{s}</span>
              ))}
            </div>
          )}

          {/* Job search links */}
          <div style={{fontSize:'0.7rem',color:'var(--muted)',marginBottom:6,marginTop:'1rem'}}>Find these roles now →</div>
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            {jobLinks.map(({label,href,color:lc}) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                style={{fontSize:'0.68rem',fontWeight:700,color:lc,background:`${lc}15`,padding:'4px 12px',borderRadius:8,textDecoration:'none',border:`1px solid ${lc}25`}}>
                {label} ↗
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
