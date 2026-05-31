// CareerCenter.jsx - Hub
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import AppLayout from '../../components/layout/AppLayout'

export default function CareerCenter() {
  const { t } = useTranslation()
  const tools = [
    { to: '/career/jobs', icon: '💼', title: t('jobTracker'), desc: 'Track every application — saved, applied, interview, offer. AI match scoring included.', color: 'var(--orange)', badge: 'Phase 3' },
    { to: '/career/resume', icon: '📄', title: t('resumeBuilder'), desc: 'Build ATS-optimized resumes with AI. Multiple versions for different roles. Live ATS score.', color: 'var(--yellow)', badge: 'Phase 3' },
    { to: '/career/linkedin', icon: '🔗', title: t('linkedinTools'), desc: 'AI-powered headline, summary, and experience bullets. Weekly posting templates.', color: 'var(--green)', badge: 'Phase 3' },
  ]
  const resources = [
    { icon: '🔍', title: 'LinkedIn Jobs', url: 'https://linkedin.com/jobs', desc: 'Search AI + tech roles in your area' },
    { icon: '💻', title: 'Indeed', url: 'https://indeed.com', desc: 'Largest job board by volume' },
    { icon: '🏛️', title: 'USAJobs.gov', url: 'https://usajobs.gov', desc: 'Federal and government positions' },
    { icon: '📊', title: 'Glassdoor', url: 'https://glassdoor.com', desc: 'Salary research + company reviews' },
    { icon: '🤖', title: 'Perplexity AI', url: 'https://perplexity.ai', desc: 'AI-powered industry research' },
    { icon: '⚡', title: 'Zapier Jobs', url: 'https://zapier.com/jobs', desc: 'Automation specialist roles' },
    { icon: '📋', title: 'Robert Half', url: 'https://roberthalf.com', desc: 'Admin + tech staffing agency' },
    { icon: '👥', title: 'SHRM Career', url: 'https://shrm.org/career-center', desc: 'HR professional jobs + network' },
    { icon: '✍️', title: 'MediaBistro', url: 'https://mediabistro.com/jobs', desc: 'Marketing + content roles' },
    { icon: '🌐', title: 'Built In Colorado', url: 'https://builtin.com', desc: 'Colorado tech companies' },
  ]
  const weeklyItems = [
    { icon: '✉', text: 'Send 5+ personalized job applications', color: 'var(--orange)' },
    { icon: '🔗', text: 'Post 1 LinkedIn update using AI tools from class', color: 'var(--yellow)' },
    { icon: '👥', text: 'Connect with 3 new professionals in your industry', color: 'var(--green)' },
    { icon: '🔍', text: 'Research 2 target companies using Perplexity AI', color: 'var(--orange)' },
    { icon: '📄', text: 'Tailor your resume for at least 1 specific posting', color: 'var(--yellow)' },
  ]
  return (
    <AppLayout>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ background: 'linear-gradient(135deg, var(--s1), rgba(249,115,22,0.06))', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '2rem', marginBottom: '1.75rem' }}>
          <div style={{ fontSize: '0.62rem', color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 8 }}>Phase 3 — Career Development</div>
          <h1 style={{ fontWeight: 800, fontSize: 'clamp(1.4rem,3vw,2rem)', marginBottom: 8 }}>Career Center 🚀</h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text2)', lineHeight: 1.7, maxWidth: 620 }}>Your AI-powered launchpad to employment. Track applications, build ATS-ready resumes, optimize your LinkedIn, and use AI research tools to land your target role.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
          {tools.map(tool => (
            <Link key={tool.to} to={tool.to} style={{ textDecoration: 'none' }}>
              <div className="card card-hover" style={{ padding: '1.5rem', borderTop: `3px solid ${tool.color}`, cursor: 'pointer' }}>
                <div style={{ fontSize: '2rem', marginBottom: 10 }}>{tool.icon}</div>
                <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 6, color: 'var(--white)' }}>{tool.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text2)', lineHeight: 1.6 }}>{tool.desc}</div>
                <div style={{ marginTop: 12 }}><span className="badge badge-orange">{tool.badge}</span></div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div>
            <div className="section-label">Job Boards & Research Tools</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 8 }}>
              {resources.map(r => (
                <a key={r.title} href={r.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <div className="card card-hover" style={{ padding: '0.9rem 1rem', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{r.icon}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--white)', marginBottom: 2 }}>{r.title}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{r.desc}</div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
          <div>
            <div className="section-label">Weekly Career Goals</div>
            <div className="card card-p">
              <p style={{ fontSize: '0.76rem', color: 'var(--text2)', marginBottom: '1rem', lineHeight: 1.6 }}>Consistent weekly actions compound into opportunities. Aim to complete all 5 each week during and after the program.</p>
              {weeklyItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '1rem', flexShrink: 0 }}>{item.icon}</span>
                  <div style={{ fontSize: '0.78rem', lineHeight: 1.5 }}>{item.text}</div>
                </div>
              ))}
            </div>
            <div className="card card-p" style={{ marginTop: '1rem' }}>
              <div className="section-label">AI Research Prompts</div>
              {['"What AI skills are most in-demand for [your track] roles in Denver in 2025?"', '"Write a LinkedIn post about completing Week [X] of my AI training program at ZICT. Professional tone, 150 words."', '"Give me 10 interview questions for a [job title] role and suggested answers highlighting AI productivity skills."'].map((p, i) => (
                <div key={i} style={{ marginBottom: 10, padding: '8px 10px', background: 'var(--s2)', borderRadius: 'var(--r)', borderLeft: '2px solid var(--orange)', fontSize: '0.74rem', fontFamily: 'DM Mono', color: 'var(--text2)', lineHeight: 1.6 }}>{p}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
