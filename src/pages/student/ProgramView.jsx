import { Link } from 'react-router-dom'
import { useAuth } from '../../lib/AuthContext'
import AppLayout from '../../components/layout/AppLayout'
import { getWeeksByProgram, getProgramById } from '../../lib/programData'
export default function ProgramView() {
  const { profile } = useAuth()
  const myProgram = profile?.program || 'applied_ai'
  const programMeta = getProgramById(myProgram)
  const weeks = getWeeksByProgram(myProgram)
  return (
    <AppLayout>
      <div style={{maxWidth:900,margin:'0 auto',padding:'1.5rem'}}>
        <div style={{marginBottom:'1.25rem'}}>
          <h1 style={{fontWeight:800,fontSize:'1.4rem',marginBottom:4}}>{programMeta.icon} {programMeta.label}</h1>
          <div style={{fontSize:'0.76rem',color:'var(--muted)'}}>{weeks.length} weeks · {weeks.reduce((s,w)=>s+w.labCount,0)} labs</div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {weeks.map(w => (
            <Link key={w.num} to={`/program/week/${w.num}`} style={{textDecoration:'none'}}>
              <div className="card card-hover" style={{padding:'1rem 1.25rem',borderLeft:`4px solid ${w.color}`,display:'flex',alignItems:'center',gap:14}}>
                <span className={`badge badge-l${w.level}`}>{w.levelLabel}</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:'0.9rem'}}>Week {w.num}: {w.title}</div>
                  <div style={{fontSize:'0.72rem',color:'var(--muted)'}}>
                    {w.sessions} sessions · {w.labCount} labs{w.cert ? ` · 🎓 ${w.cert.title}` : ''}
                  </div>
                </div>
                <span style={{fontSize:'0.8rem',color:'var(--muted)'}}>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
