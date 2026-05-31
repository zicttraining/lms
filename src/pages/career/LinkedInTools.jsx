// LinkedInTools.jsx
import { useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'

const POST_TEMPLATES = [
  { label: "Week completion post", prompt: `Write a LinkedIn post announcing I just completed Week [X] of the ZICT Applied AI & Digital Productivity program. I learned [topic]. Professional tone, 150 words, end with a question to engage comments. Add 3 relevant hashtags.` },
  { label: "New skill post", prompt: `Write a LinkedIn post about learning to use [AI tool] for [business task]. Share one specific result or insight. 120 words, professional but personal, end with a CTA to connect.` },
  { label: "Job search post", prompt: `Write a LinkedIn post announcing I'm open to new opportunities in [career track]. Highlight my AI skills from my recent certification program. 100 words, confident tone, ask connections to reach out or share.` },
  { label: "Capstone project post", prompt: `Write a LinkedIn post showcasing a project I built: [describe your capstone]. Include the problem it solves, the AI tools I used, and the business value. 160 words, include 3 hashtags.` },
  { label: "Certification announcement", prompt: `Write a LinkedIn post celebrating earning my [certification name]. Explain what I learned and how it will help me in my career. Tag ZICT if relevant. 130 words, excited but professional tone.` },
]
const HEADLINE_TIPS = [
  'Include your target role title + "AI-Powered" or "AI-Certified"',
  'Mention your strongest skill from your career track',
  'Add a result: "helping businesses save X hours/week with automation"',
  'Keep it under 220 characters',
  'Avoid buzzwords like "guru," "ninja," "rockstar"',
]
const ABOUT_STRUCTURE = ['Opening hook (1 sentence — what you do and for whom)', 'Your background and how you got here (2–3 sentences)', 'What you bring: your top 3 AI skills + how they help employers', 'Your ZICT certification and what it means', 'What you are looking for right now', 'Call to action: "Connect with me" or "Message me"']

export default function LinkedInTools() {
  const [copiedIdx, setCopiedIdx] = useState(null)
  const [profileUrl, setProfileUrl] = useState('')

  function copy(text, idx) {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  return (
    <AppLayout>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '1.5rem' }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: 4 }}>LinkedIn Tools 🔗</h1>
        <p style={{ fontSize: '0.82rem', color: 'var(--text2)', marginBottom: '1.75rem' }}>AI-powered templates and guidance to build your professional presence and attract recruiters.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {/* Profile checklist */}
          <div className="card card-p">
            <div className="section-label">Profile Optimization Checklist</div>
            {[['Professional headshot', 'Use a real photo — profiles with photos get 21x more views'], ['Custom headline', 'NOT "Student" — use your target role + AI skills'], ['About section', '2,000 characters — tell your story using the structure below'], ['Experience bullets', 'Start with action verbs, include AI tools used, quantify results'], ['Skills section', 'Add: ChatGPT, Google Workspace, Microsoft 365, Zapier, Prompt Engineering'], ['Certifications', 'Add all ZICT certificates as they are earned'], ['Custom URL', 'linkedin.com/in/yourname — easier to share on resume'], ['Open to Work', 'Enable "Open to Work" — set to recruiters only or public'], ['Creator Mode', 'Turn on if you plan to post weekly — boosts reach']].map(([item, hint], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
                <input type="checkbox" style={{ accentColor: 'var(--orange)', marginTop: 3, flexShrink: 0 }} />
                <div><div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{item}</div><div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{hint}</div></div>
              </div>
            ))}
          </div>

          {/* About structure */}
          <div className="card card-p">
            <div className="section-label">About Section Structure</div>
            {ABOUT_STRUCTURE.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--orange-d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: 'var(--orange)', flexShrink: 0 }}>{i + 1}</div>
                <div style={{ fontSize: '0.78rem', lineHeight: 1.5 }}>{s}</div>
              </div>
            ))}
            <div style={{ marginTop: '1rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.78rem', marginBottom: 6 }}>Headline Tips</div>
              {HEADLINE_TIPS.map((tip, i) => <div key={i} style={{ fontSize: '0.74rem', color: 'var(--text2)', padding: '3px 0' }}>• {tip}</div>)}
            </div>
          </div>
        </div>

        {/* Post templates */}
        <div className="section-label">Weekly Posting Templates — Use with ChatGPT</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: '1.5rem' }}>
          {POST_TEMPLATES.map((t, i) => (
            <div key={i} className="card" style={{ padding: '1rem', borderLeft: '3px solid var(--orange)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>{t.label}</div>
                <button className="btn btn-sm btn-ghost" onClick={() => copy(t.prompt, i)}>{copiedIdx === i ? '✓ Copied!' : 'Copy prompt'}</button>
              </div>
              <div style={{ fontFamily: 'DM Mono', fontSize: '0.74rem', color: 'var(--text2)', lineHeight: 1.6, background: 'var(--s2)', padding: '10px 12px', borderRadius: 7 }}>{t.prompt}</div>
            </div>
          ))}
        </div>

        {/* LinkedIn profile link */}
        <div className="card card-p" style={{ borderLeft: '3px solid var(--green)' }}>
          <div style={{ fontWeight: 700, fontSize: '0.84rem', marginBottom: 8 }}>Your LinkedIn Profile</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="input" placeholder="linkedin.com/in/yourname" value={profileUrl} onChange={e => setProfileUrl(e.target.value)} />
            {profileUrl && <a href={profileUrl.startsWith('http') ? profileUrl : `https://${profileUrl}`} target="_blank" rel="noopener noreferrer" className="btn btn-success btn-sm" style={{ flexShrink: 0 }}>View Profile ↗</a>}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
