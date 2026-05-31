import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../../lib/AuthContext'
import { supabase } from '../../lib/supabase'
import AppLayout from '../../components/layout/AppLayout'
import { WEEKS, getWeekStatus, WEEK_SESSIONS } from '../../lib/programData'

export default function WeekView() {
  const { weekNum } = useParams()
  const wn = parseInt(weekNum)
  const week = WEEKS[wn-1]
  const { profile } = useAuth()
  const [progress, setProgress] = useState([])
  const [allProgress, setAllProgress] = useState([])
  const sessions = WEEK_SESSIONS[wn] || []

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
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
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
      </div>
    </AppLayout>
  )
}
