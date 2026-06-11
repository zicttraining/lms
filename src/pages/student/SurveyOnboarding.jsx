// SurveyOnboarding.jsx — Intake survey: sets career_track, skill_level, language, scores MCQ knowledge
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/AuthContext'
import { supabase } from '../../lib/supabase'
import { scoreSurvey, CAREER_TRACK_FROM_GOAL } from '../../lib/careerIntel'

const STEPS = ['welcome', 'identity', 'digital_skills', 'ai_knowledge', 'automation', 'career', 'done']

const CAREER_GOALS = [
  'IT & AI Support', 'Business Operations', 'Healthcare / Gov / Edu / Legal',
  'Data & Analytics', 'Automation & Workflow Management', 'Marketing, Communications & Content',
  'Administrative & Office Technology', 'Customer Service & Client Relations',
  'Human Resources & People Ops', 'Sales & Business Development',
]

const WHY_OPTIONS = [
  'New job in tech or AI', 'Advance in current job', 'Start or grow a business',
  'Learn AI for personal growth', 'Career change', 'Other',
]

const EMPLOYMENT_OPTIONS = [
  'Student', 'Full-time employed', 'Part-time employed',
  'Self-employed', 'Unemployed, looking', 'Other',
]

const SKILL_LEVELS = [
  'Beginner — never used AI',
  'Casual — tried ChatGPT but no training',
  'Intermediate — use AI, no formal training',
  'Advanced — regular, skilled AI user',
]

const TOOLS_OPTIONS = [
  'Gmail / Outlook', 'Google Docs / Word', 'Google Sheets / Excel',
  'Zoom or Teams', 'Slack', 'Google Drive / OneDrive', 'Notion', 'Trello / Asana',
]

const AUTOMATION_TOOLS = [
  'Zapier', 'Make.com', 'Power Automate', 'n8n', 'IFTTT', 'Airtable', 'None',
]

const CERT_OPTIONS = [
  'Google AI Essentials Certificate', 'Microsoft AI fundamentals Certification',
  'AWS AI Cloud Practitioner', 'Google Data Analytics Certificate',
  'CompTIA A+', 'Salesforce Associate', 'Other', 'Not sure yet',
]

const LEARNING_STYLES = [
  'Videos and demos', 'Hands-on labs', 'Reading and notes',
  'Live instruction and Q&A', 'Mix of everything',
]

const STUDY_HOURS = ['Under 2 hours', '2–4 hours', '4–6 hours', 'Over 6 hours']

export default function SurveyOnboarding() {
  const { profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    preferred_language: 'English',
    career_track_goal: '',
    why_joining: '',
    employment_status: '',
    // Cyber MCQ
    ans_mfa: '',
    ans_phishing: '',
    ans_wifi: '',
    ans_gdrive: '',
    // Workplace tools (not scored)
    google_confidence: 3,
    ms365_confidence: 3,
    tools_used: [],
    // AI MCQ
    ans_hallucination: '',
    ans_best_prompt: '',
    ans_rtft: '',
    ans_ai_search: '',
    ans_citations: '',
    // AI usage
    ai_frequency: '',
    self_skill_level: '',
    target_industries: '',
    // Automation
    ans_zapier: '',
    ans_trigger: '',
    automation_comfort: 3,
    automation_tools: [],
    // Career
    resume_status: '',
    interview_confidence: 3,
    linkedin_use: '',
    cert_goals: [],
    career_challenge: '',
    // Learning
    learning_style: '',
    study_hours: '',
  })

  const stepId = STEPS[step]

  function set(field, val) { setForm(f => ({ ...f, [field]: val })) }
  function toggleArr(field, val) {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(val) ? f[field].filter(x => x !== val) : [...f[field], val],
    }))
  }

  function canAdvance() {
    if (stepId === 'identity') return form.career_track_goal && form.why_joining && form.employment_status
    if (stepId === 'digital_skills') return form.ans_mfa && form.ans_phishing && form.ans_wifi && form.ans_gdrive
    if (stepId === 'ai_knowledge') return form.ans_hallucination && form.ans_best_prompt && form.ans_rtft && form.ans_ai_search && form.ans_citations && form.self_skill_level
    if (stepId === 'automation') return form.ans_zapier && form.ans_trigger
    if (stepId === 'career') return form.learning_style && form.study_hours
    return true
  }

  async function finishSurvey() {
    setSaving(true)
    const scores = scoreSurvey(form)
    const careerTrack = CAREER_TRACK_FROM_GOAL(form.career_track_goal)

    // Final skill level: quiz result takes precedence over self-report if there's a meaningful gap
    const selfLevel = form.self_skill_level.includes('never') ? 'beginner'
      : form.self_skill_level.includes('Casual') ? 'beginner'
      : form.self_skill_level.includes('Intermediate') ? 'intermediate'
      : 'advanced'
    // Use quiz result but don't over-inflate (cap at self-report + 1 level)
    const levelMap = { beginner: 0, intermediate: 1, advanced: 2 }
    const computedIdx = levelMap[scores.computedLevel]
    const selfIdx = levelMap[selfLevel]
    const finalLevelIdx = Math.min(computedIdx, selfIdx + 1)
    const finalLevel = ['beginner', 'intermediate', 'advanced'][finalLevelIdx]

    const langMap = { 'English': 'en', 'Arabic — العربية': 'ar', 'Persian — فارسی': 'fa' }
    const langCode = langMap[form.preferred_language] || 'en'

    const surveyPayload = {
      user_id: profile.id,
      preferred_language: form.preferred_language,
      career_track_goal: form.career_track_goal,
      why_joining: form.why_joining,
      employment_status: form.employment_status,
      ans_mfa: form.ans_mfa,
      ans_phishing: form.ans_phishing,
      ans_wifi: form.ans_wifi,
      ans_gdrive: form.ans_gdrive,
      cyber_score: scores.cyber,
      google_confidence: form.google_confidence,
      ms365_confidence: form.ms365_confidence,
      tools_used: form.tools_used,
      ans_hallucination: form.ans_hallucination,
      ans_best_prompt: form.ans_best_prompt,
      ans_rtft: form.ans_rtft,
      ans_ai_search: form.ans_ai_search,
      ans_citations: form.ans_citations,
      ai_quiz_score: scores.ai,
      ai_frequency: form.ai_frequency,
      self_skill_level: form.self_skill_level,
      target_industries: form.target_industries ? [form.target_industries] : [],
      ans_zapier: form.ans_zapier,
      ans_trigger: form.ans_trigger,
      automation_comfort: form.automation_comfort,
      automation_tools: form.automation_tools,
      resume_status: form.resume_status,
      interview_confidence: form.interview_confidence,
      linkedin_use: form.linkedin_use,
      cert_goals: form.cert_goals,
      career_challenge: form.career_challenge,
      learning_style: form.learning_style,
      study_hours: form.study_hours,
      total_quiz_score: scores.total,
      computed_skill_level: scores.computedLevel,
    }

    await supabase.from('survey_responses').upsert(surveyPayload)
    await supabase.from('profiles').update({
      career_track: careerTrack,
      skill_level: finalLevel,
      language: langCode,
      survey_completed: true,
      survey_score: scores.pct,
      career_goals: form.why_joining,
      learning_style: form.learning_style,
      study_hours: form.study_hours,
    }).eq('id', profile.id)

    // Send welcome notification with their results
    await supabase.from('notifications').insert({
      user_id: profile.id,
      title: '🎉 Welcome to ZICT — your profile is set!',
      body: `You scored ${scores.pct}% on the knowledge baseline (${scores.total}/9 correct). Your skill level is set to ${finalLevel}. Your career track: ${form.career_track_goal}. Head to Assessments to see your personalized projects!`,
      type: 'success',
      link: '/assessments',
    })

    // Notify instructor of new survey
    const { data: admins } = await supabase.from('profiles').select('id').in('role', ['admin', 'instructor'])
    if (admins?.length) {
      await supabase.from('notifications').insert(admins.map(a => ({
        user_id: a.id,
        title: `New intake survey: ${profile.full_name}`,
        body: `Track: ${form.career_track_goal} · Skill: ${finalLevel} · Quiz score: ${scores.pct}% (${scores.total}/9)`,
        type: 'info',
        link: '/admin/students',
      })))
    }

    if (refreshProfile) await refreshProfile()
    setSaving(false)
    setStep(STEPS.indexOf('done'))
  }

  // ── Progress bar ─────────────────────────────────────────────
  const progress = Math.round((step / (STEPS.length - 2)) * 100)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ width: '100%', maxWidth: 640, marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: '1rem' }}>Z</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>ZICT Learning Portal</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>Program Intake Survey</div>
          </div>
        </div>
        {stepId !== 'welcome' && stepId !== 'done' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--muted)', marginBottom: 4 }}>
              <span>Step {step} of {STEPS.length - 2}</span>
              <span>{progress}% complete</span>
            </div>
            <div style={{ height: 4, background: 'var(--s3)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'var(--orange)', borderRadius: 2, transition: 'width 0.3s' }} />
            </div>
          </div>
        )}
      </div>

      {/* Card */}
      <div className="card" style={{ width: '100%', maxWidth: 640, padding: '2rem' }}>

        {/* Welcome */}
        {stepId === 'welcome' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👋</div>
            <h1 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.75rem' }}>Welcome to ZICT Applied AI</h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--text2)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              This 5-minute intake survey helps us personalize your learning experience.<br />
              We'll identify your career track, skill level, and knowledge gaps — then show you exactly the right assessments and job opportunities.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: '1.5rem', textAlign: 'left' }}>
              {[
                ['🎯', 'Personalised career track', 'Assessments matched to your goals'],
                ['📊', 'Knowledge baseline', 'We score your current skills automatically'],
                ['💼', 'Job readiness score', 'See exactly what roles you qualify for'],
                ['🗺️', 'Learning roadmap', 'Step-by-step path to your target role'],
              ].map(([icon, title, desc]) => (
                <div key={title} style={{ padding: '12px', background: 'var(--s2)', borderRadius: 'var(--r)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>{icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.78rem', marginBottom: 2 }}>{title}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{desc}</div>
                </div>
              ))}
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setStep(1)}>Start Survey →</button>
          </div>
        )}

        {/* Identity */}
        {stepId === 'identity' && (
          <div>
            <div className="section-label" style={{ marginBottom: '1.25rem' }}>About You</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Preferred Language</label>
                <select className="input select" value={form.preferred_language} onChange={e => set('preferred_language', e.target.value)}>
                  <option>English</option>
                  <option>Arabic — العربية</option>
                  <option>Persian — فارسی</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Career Track Goal *</label>
                <select className="input select" value={form.career_track_goal} onChange={e => set('career_track_goal', e.target.value)}>
                  <option value="">Select your primary goal…</option>
                  {CAREER_GOALS.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Why are you joining? *</label>
                <select className="input select" value={form.why_joining} onChange={e => set('why_joining', e.target.value)}>
                  <option value="">Select…</option>
                  {WHY_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Employment Status *</label>
                <select className="input select" value={form.employment_status} onChange={e => set('employment_status', e.target.value)}>
                  <option value="">Select…</option>
                  {EMPLOYMENT_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Digital security quiz */}
        {stepId === 'digital_skills' && (
          <div>
            <div className="section-label" style={{ marginBottom: 4 }}>Digital Security Knowledge</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--muted)', marginBottom: '1.25rem' }}>These questions are scored — answer honestly. There are no penalties for wrong answers, only insights.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <MCQ label="What does MFA mean?" field="ans_mfa" value={form.ans_mfa} onChange={val => set('ans_mfa', val)}
                options={['A strong password type', 'A second login step like a phone code', 'A type of firewall', 'Multi-Factor Application']} />
              <MCQ label="An urgent bank email asks you to click a link. You:" field="ans_phishing" value={form.ans_phishing} onChange={val => set('ans_phishing', val)}
                options={["Go to the bank's official website", 'Click the link', 'Reply asking if it is real', 'Ignore it and do nothing']} />
              <MCQ label="Which Wi-Fi type is UNSAFE?" field="ans_wifi" value={form.ans_wifi} onChange={val => set('ans_wifi', val)}
                options={['WPA3', 'WPA2-Enterprise', 'WEP', 'HTTPS']} />
              <MCQ label="You share a Google Drive file but want them to READ only — not edit. What permission do you set?" field="ans_gdrive" value={form.ans_gdrive} onChange={val => set('ans_gdrive', val)}
                options={['Editor', 'Owner', 'Viewer', 'Commenter']} />
              <div>
                <label className="form-label">Google Workspace confidence (Docs, Sheets, Drive, Gmail)</label>
                <RatingSlider value={form.google_confidence} onChange={val => set('google_confidence', val)} />
              </div>
              <div>
                <label className="form-label">Microsoft 365 confidence (Word, Excel, Outlook, Teams)</label>
                <RatingSlider value={form.ms365_confidence} onChange={val => set('ms365_confidence', val)} />
              </div>
              <div>
                <label className="form-label">Tools you use professionally — select all that apply</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                  {TOOLS_OPTIONS.map(t => (
                    <button key={t} type="button" onClick={() => toggleArr('tools_used', t)}
                      className={`btn btn-sm ${form.tools_used.includes(t) ? 'btn-secondary' : 'btn-ghost'}`}
                      style={{ fontSize: '0.72rem' }}>{form.tools_used.includes(t) ? '✓ ' : ''}{t}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI knowledge quiz */}
        {stepId === 'ai_knowledge' && (
          <div>
            <div className="section-label" style={{ marginBottom: 4 }}>AI Knowledge</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--muted)', marginBottom: '1.25rem' }}>These 5 questions are also scored and help us set your starting level.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <MCQ label="AI 'hallucination' means:" field="ans_hallucination" value={form.ans_hallucination} onChange={val => set('ans_hallucination', val)}
                options={['AI refuses to answer', 'AI states false info as true', 'AI is confused by the prompt', 'AI generates images incorrectly']} />
              <MCQ label="Which is the best AI prompt?" field="ans_best_prompt" value={form.ans_best_prompt} onChange={val => set('ans_best_prompt', val)}
                options={[
                  'Help me write something',
                  'Write an email',
                  'You are a recruiter. Write a 5-sentence follow-up email after a first interview. Tone: warm. End with next steps.',
                  'Make an email about interview',
                ]} />
              <MCQ label="RTFT stands for:" field="ans_rtft" value={form.ans_rtft} onChange={val => set('ans_rtft', val)}
                options={['Real-Time Fine-Tuning', 'Random Task Format Test', 'Role, Task, Format, Tone', 'Research, Think, Focus, Try']} />
              <MCQ label="Which AI tool provides search results WITH cited sources?" field="ans_ai_search" value={form.ans_ai_search} onChange={val => set('ans_ai_search', val)}
                options={['ChatGPT', 'Google Gemini', 'Perplexity AI', 'Claude']} />
              <MCQ label="ChatGPT gives you 5 citations. You should:" field="ans_citations" value={form.ans_citations} onChange={val => set('ans_citations', val)}
                options={['Trust them all — AI is accurate', 'Verify each one — AI invents fake citations', 'Use them without checking', 'Ignore them and only use your own sources']} />
              <div className="form-group">
                <label className="form-label">Your current AI skill level *</label>
                <select className="input select" value={form.self_skill_level} onChange={e => set('self_skill_level', e.target.value)}>
                  <option value="">Select honestly…</option>
                  {SKILL_LEVELS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">How often do you currently use AI tools?</label>
                <select className="input select" value={form.ai_frequency} onChange={e => set('ai_frequency', e.target.value)}>
                  <option value="">Select…</option>
                  {['Never', 'A few times total', 'Monthly', 'Weekly', 'Daily'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Automation */}
        {stepId === 'automation' && (
          <div>
            <div className="section-label" style={{ marginBottom: 4 }}>Automation Knowledge</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <MCQ label="What does Zapier do?" field="ans_zapier" value={form.ans_zapier} onChange={val => set('ans_zapier', val)}
                options={['Connects apps and automates tasks without code', 'A CRM for sales teams', 'An AI chatbot', 'A project management tool']} />
              <MCQ label="In Zapier, a Trigger is:" field="ans_trigger" value={form.ans_trigger} onChange={val => set('ans_trigger', val)}
                options={['The action that completes the workflow', 'The event that starts the automation', 'A workflow error', 'A type of app connection']} />
              <div>
                <label className="form-label">How comfortable are you automating repetitive tasks?</label>
                <RatingSlider value={form.automation_comfort} onChange={val => set('automation_comfort', val)} labels={['Not at all', 'Very comfortable']} />
              </div>
              <div>
                <label className="form-label">Automation tools you've heard of or used</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                  {AUTOMATION_TOOLS.map(t => (
                    <button key={t} type="button" onClick={() => toggleArr('automation_tools', t)}
                      className={`btn btn-sm ${form.automation_tools.includes(t) ? 'btn-secondary' : 'btn-ghost'}`}
                      style={{ fontSize: '0.72rem' }}>{form.automation_tools.includes(t) ? '✓ ' : ''}{t}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Career readiness + learning */}
        {stepId === 'career' && (
          <div>
            <div className="section-label" style={{ marginBottom: '1.25rem' }}>Career Readiness & Learning</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Resume status</label>
                <select className="input select" value={form.resume_status} onChange={e => set('resume_status', e.target.value)}>
                  <option value="">Select…</option>
                  {['No resume yet', 'Have a draft', 'Updated last 3 months', 'Updated 3–12 months ago', 'Over a year old'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Interview confidence (1 = not at all, 5 = very confident)</label>
                <RatingSlider value={form.interview_confidence} onChange={val => set('interview_confidence', val)} />
              </div>
              <div className="form-group">
                <label className="form-label">LinkedIn use</label>
                <select className="input select" value={form.linkedin_use} onChange={e => set('linkedin_use', e.target.value)}>
                  <option value="">Select…</option>
                  {["No account", "Account but no content", "Have profile, rarely use it", "Active profile, use regularly"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Certificates you'd like to pursue (select all)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                  {CERT_OPTIONS.map(c => (
                    <button key={c} type="button" onClick={() => toggleArr('cert_goals', c)}
                      className={`btn btn-sm ${form.cert_goals.includes(c) ? 'btn-secondary' : 'btn-ghost'}`}
                      style={{ fontSize: '0.7rem' }}>{form.cert_goals.includes(c) ? '✓ ' : ''}{c}</button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Biggest career challenge right now</label>
                <textarea className="input" rows={2} value={form.career_challenge} onChange={e => set('career_challenge', e.target.value)} placeholder="Describe briefly…" />
              </div>
              <div className="form-group">
                <label className="form-label">How do you learn best? *</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                  {LEARNING_STYLES.map(s => (
                    <button key={s} type="button" onClick={() => set('learning_style', s)}
                      className={`btn btn-sm ${form.learning_style === s ? 'btn-secondary' : 'btn-ghost'}`}
                      style={{ fontSize: '0.72rem' }}>{s}</button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Study hours available per week outside class *</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                  {STUDY_HOURS.map(s => (
                    <button key={s} type="button" onClick={() => set('study_hours', s)}
                      className={`btn btn-sm ${form.study_hours === s ? 'btn-secondary' : 'btn-ghost'}`}
                      style={{ fontSize: '0.72rem' }}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Done */}
        {stepId === 'done' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
            <h2 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: '0.75rem' }}>Profile complete!</h2>
            {(() => {
              const scores = scoreSurvey(form)
              const track = CAREER_TRACK_FROM_GOAL(form.career_track_goal)
              return (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: '1.5rem' }}>
                    <div style={{ padding: '14px', background: 'var(--orange-d)', border: '1px solid var(--orange-b)', borderRadius: 'var(--r)' }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--orange)' }}>{scores.pct}%</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: 2 }}>Knowledge baseline ({scores.total}/9)</div>
                    </div>
                    <div style={{ padding: '14px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 'var(--r)' }}>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text)', textTransform: 'capitalize' }}>{scores.computedLevel}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: 2 }}>Computed skill level</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                    Your career track is set to <strong style={{ color: 'var(--orange)' }}>{form.career_track_goal}</strong>.<br />
                    You scored <strong>{scores.cyber}/4</strong> on digital security and <strong>{scores.ai}/5</strong> on AI knowledge.<br />
                    Your assessments and job suggestions are now personalized for you.
                  </div>
                  <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => navigate('/assessments')}>
                    View My Assessments →
                  </button>
                  <button className="btn btn-ghost" style={{ width: '100%', marginTop: 8 }} onClick={() => navigate('/dashboard')}>
                    Go to Dashboard
                  </button>
                </div>
              )
            })()}
          </div>
        )}

        {/* Nav buttons */}
        {stepId !== 'welcome' && stepId !== 'done' && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.75rem' }}>
            <button className="btn btn-ghost" onClick={() => setStep(s => s - 1)}>← Back</button>
            {stepId === 'career' ? (
              <button className="btn btn-primary" onClick={finishSurvey} disabled={!canAdvance() || saving}>
                {saving ? <><div className="loader-sm" /> Saving…</> : 'Complete Survey ✓'}
              </button>
            ) : (
              <button className="btn btn-primary" onClick={() => setStep(s => s + 1)} disabled={!canAdvance()}>
                Continue →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────
function MCQ({ label, options, value, onChange }) {
  return (
    <div>
      <label className="form-label" style={{ marginBottom: 8, display: 'block' }}>{label}</label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {options.map(opt => (
          <button key={opt} type="button" onClick={() => onChange(opt)}
            style={{ textAlign: 'left', padding: '10px 14px', borderRadius: 'var(--r)', border: `1px solid ${value === opt ? 'var(--orange)' : 'var(--border2)'}`, background: value === opt ? 'rgba(249,115,22,0.08)' : 'var(--s2)', color: value === opt ? 'var(--orange)' : 'var(--text2)', fontSize: '0.82rem', cursor: 'pointer', lineHeight: 1.4, fontWeight: value === opt ? 600 : 400 }}>
            {value === opt ? '● ' : '○ '}{opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function RatingSlider({ value, onChange, labels = ['1 — Not at all', '5 — Very confident'] }) {
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} type="button" onClick={() => onChange(n)}
            style={{ flex: 1, padding: '8px 0', borderRadius: 'var(--r)', border: `1px solid ${value === n ? 'var(--orange)' : 'var(--border2)'}`, background: value === n ? 'rgba(249,115,22,0.12)' : 'var(--s2)', color: value === n ? 'var(--orange)' : 'var(--muted)', fontWeight: value === n ? 800 : 400, fontSize: '0.9rem', cursor: 'pointer' }}>
            {n}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.64rem', color: 'var(--muted)', marginTop: 4 }}>
        <span>{labels[0]}</span><span>{labels[1] || '5 — Expert'}</span>
      </div>
    </div>
  )
}
