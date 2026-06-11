// SurveyOnboarding.jsx — Program-aware intake survey
// Loads the correct questions and career tracks based on profile.program
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/AuthContext'
import { supabase } from '../../lib/supabase'
import { PROGRAM_SURVEYS, scoreProgramSurvey, careerTrackFromGoal } from '../../lib/surveyData'

const EMPLOYMENT_OPTIONS = [
  'Student', 'Full-time employed', 'Part-time employed',
  'Self-employed', 'Unemployed, looking', 'Other',
]
const SKILL_LEVELS = [
  'Complete beginner — never done this before',
  'Some exposure but no formal training',
  'Intermediate — have used these skills occasionally',
  'Advanced — regularly use these skills',
]
const LEARNING_STYLES = [
  'Videos and demos', 'Hands-on labs', 'Reading and notes',
  'Live instruction and Q&A', 'Mix of everything',
]
const STUDY_HOURS = ['Under 2 hours', '2–4 hours', '4–6 hours', 'Over 6 hours']
const RESUME_STATUSES = ['No resume yet', 'Have a draft', 'Updated last 3 months', 'Updated 3–12 months ago', 'Over a year old']
const LINKEDIN_USES = ['No account', 'Account but no content', 'Have profile, rarely use it', 'Active profile, use regularly']

export default function SurveyOnboarding() {
  const { profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0) // 0=welcome, 1=identity, 2..N=quiz sections, N+1=career, N+2=done
  const [saving, setSaving] = useState(false)

  // Load config for this program
  const programId = profile?.program || 'applied_ai'
  const config = PROGRAM_SURVEYS[programId] || PROGRAM_SURVEYS.applied_ai

  // Build step list: welcome → identity → quiz sections → career → done
  const steps = ['welcome', 'identity', ...config.quizSections.map(s => s.id), 'career', 'done']
  const stepId = steps[step]
  const currentSection = config.quizSections.find(s => s.id === stepId)

  const [form, setForm] = useState({
    career_track_goal: '',
    why_joining: '',
    employment_status: '',
    self_skill_level: '',
    // quiz answers — keyed by question field name
    answers: {},
    // extra fields (Applied AI only)
    google_confidence: 3,
    ms365_confidence: 3,
    tools_used: [],
    automation_comfort: 3,
    automation_tools: [],
    // career
    resume_status: '',
    interview_confidence: 3,
    linkedin_use: '',
    cert_goals: '',
    career_challenge: '',
    learning_style: '',
    study_hours: '',
  })

  function set(field, val) { setForm(f => ({ ...f, [field]: val })) }
  function setAnswer(field, val) { setForm(f => ({ ...f, answers: { ...f.answers, [field]: val } })) }
  function toggleArr(field, val) {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(val) ? f[field].filter(x => x !== val) : [...f[field], val],
    }))
  }

  function canAdvance() {
    if (stepId === 'identity') return form.career_track_goal && form.why_joining && form.employment_status && form.self_skill_level
    if (currentSection) {
      return currentSection.questions.every(q => form.answers[q.field])
    }
    if (stepId === 'career') return form.learning_style && form.study_hours
    return true
  }

  const progress = step === 0 || stepId === 'done' ? 0 : Math.round((step / (steps.length - 2)) * 100)

  async function finishSurvey() {
    setSaving(true)
    const scores = scoreProgramSurvey(programId, form.answers)
    const careerTrack = careerTrackFromGoal(programId, form.career_track_goal)

    // Resolve skill level: blend self-report + quiz result
    const selfMap = {
      'Complete beginner — never done this before': 'beginner',
      'Some exposure but no formal training': 'beginner',
      'Intermediate — have used these skills occasionally': 'intermediate',
      'Advanced — regularly use these skills': 'advanced',
    }
    const selfLevel = selfMap[form.self_skill_level] || 'beginner'
    const levelIdx = { beginner: 0, intermediate: 1, advanced: 2 }
    const computedIdx = levelIdx[scores.computedLevel]
    const selfIdx = levelIdx[selfLevel]
    const finalLevel = ['beginner', 'intermediate', 'advanced'][Math.min(computedIdx, selfIdx + 1)]

    // Build survey_responses payload
    const surveyPayload = {
      user_id: profile.id,
      career_track_goal: form.career_track_goal,
      why_joining: form.why_joining,
      employment_status: form.employment_status,
      self_skill_level: form.self_skill_level,
      // Flatten quiz answers into individual fields
      ...form.answers,
      // Section scores stored in cyber/ai slots generically
      cyber_score: scores.sectionScores[config.quizSections[0]?.id] || 0,
      ai_quiz_score: scores.sectionScores[config.quizSections[1]?.id] || 0,
      // Extra fields
      google_confidence: form.google_confidence,
      ms365_confidence: form.ms365_confidence,
      tools_used: form.tools_used,
      automation_comfort: form.automation_comfort,
      automation_tools: form.automation_tools,
      // Career
      resume_status: form.resume_status,
      interview_confidence: form.interview_confidence,
      linkedin_use: form.linkedin_use,
      cert_goals: form.cert_goals ? [form.cert_goals] : [],
      career_challenge: form.career_challenge,
      learning_style: form.learning_style,
      study_hours: form.study_hours,
      // Computed
      total_quiz_score: scores.total,
      computed_skill_level: scores.computedLevel,
    }

    await supabase.from('survey_responses').upsert(surveyPayload)
    await supabase.from('profiles').update({
      career_track: careerTrack,
      skill_level: finalLevel,
      survey_completed: true,
      survey_score: scores.pct,
      career_goals: form.why_joining,
      learning_style: form.learning_style,
      study_hours: form.study_hours,
    }).eq('id', profile.id)

    // Welcome notification with results
    await supabase.from('notifications').insert({
      user_id: profile.id,
      title: `🎉 Profile complete — welcome to ${config.programLabel}!`,
      body: `Baseline score: ${scores.pct}% (${scores.total}/${scores.maxTotal}). Skill level: ${finalLevel}. Track: ${form.career_track_goal}. Head to Assessments to see your personalised projects!`,
      type: 'success',
      link: '/assessments',
    })

    // Notify instructors
    const { data: admins } = await supabase.from('profiles').select('id').in('role', ['admin', 'instructor'])
    if (admins?.length) {
      await supabase.from('notifications').insert(admins.map(a => ({
        user_id: a.id,
        title: `New intake: ${profile.full_name} (${config.programIcon} ${config.programLabel})`,
        body: `Track: ${form.career_track_goal} · Level: ${finalLevel} · Score: ${scores.pct}% (${scores.total}/${scores.maxTotal})`,
        type: 'info',
        link: '/admin/students',
      })))
    }

    if (refreshProfile) await refreshProfile()
    setSaving(false)
    setStep(steps.indexOf('done'))
  }

  // ── Render ─────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1rem' }}>

      {/* Header */}
      <div style={{ width: '100%', maxWidth: 640, marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: '1rem' }}>Z</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem' }}>ZICT Learning Portal</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>{config.programIcon} {config.programLabel} — Intake Survey</div>
          </div>
        </div>
        {step > 0 && stepId !== 'done' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--muted)', marginBottom: 4 }}>
              <span>Step {step} of {steps.length - 2}</span>
              <span>{progress}%</span>
            </div>
            <div style={{ height: 4, background: 'var(--s3)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'var(--orange)', borderRadius: 2, transition: 'width 0.3s' }} />
            </div>
          </div>
        )}
      </div>

      <div className="card" style={{ width: '100%', maxWidth: 640, padding: '2rem' }}>

        {/* ── Welcome ── */}
        {stepId === 'welcome' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{config.programIcon}</div>
            <h1 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: '0.75rem' }}>Welcome to {config.programLabel}</h1>
            <p style={{ fontSize: '0.86rem', color: 'var(--text2)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              {config.intro}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: '1.5rem', textAlign: 'left' }}>
              {[
                ['🎯', 'Career track set', 'Assessments matched to your specialisation'],
                ['📊', `${steps.filter(s => config.quizSections.some(q => q.id === s)).length} scored quiz sections`, 'Baseline knowledge measured automatically'],
                ['💼', 'Job readiness score', 'See what roles you qualify for at each level'],
                ['🗺️', 'Personalised roadmap', 'Your mentor or instructor knows exactly where to focus'],
              ].map(([icon, title, desc]) => (
                <div key={title} style={{ padding: '12px', background: 'var(--s2)', borderRadius: 'var(--r)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>{icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.76rem', marginBottom: 2 }}>{title}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>{desc}</div>
                </div>
              ))}
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setStep(1)}>
              Start Survey →
            </button>
          </div>
        )}

        {/* ── Identity ── */}
        {stepId === 'identity' && (
          <div>
            <div className="section-label" style={{ marginBottom: '1.25rem' }}>About You</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Career Track Goal *</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                  {config.careerTracks.map(t => (
                    <button key={t.id} type="button" onClick={() => set('career_track_goal', t.label)}
                      style={{ textAlign: 'left', padding: '10px 14px', borderRadius: 'var(--r)', border: `1px solid ${form.career_track_goal === t.label ? 'var(--orange)' : 'var(--border2)'}`, background: form.career_track_goal === t.label ? 'rgba(249,115,22,0.08)' : 'var(--s2)', color: form.career_track_goal === t.label ? 'var(--orange)' : 'var(--text2)', fontSize: '0.82rem', cursor: 'pointer', fontWeight: form.career_track_goal === t.label ? 600 : 400 }}>
                      {form.career_track_goal === t.label ? '● ' : '○ '}{t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Why are you joining? *</label>
                <select className="input select" value={form.why_joining} onChange={e => set('why_joining', e.target.value)}>
                  <option value="">Select…</option>
                  {config.whyJoiningOptions.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Employment Status *</label>
                <select className="input select" value={form.employment_status} onChange={e => set('employment_status', e.target.value)}>
                  <option value="">Select…</option>
                  {EMPLOYMENT_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Your current skill level in this subject area *</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                  {SKILL_LEVELS.map(s => (
                    <button key={s} type="button" onClick={() => set('self_skill_level', s)}
                      style={{ textAlign: 'left', padding: '9px 14px', borderRadius: 'var(--r)', border: `1px solid ${form.self_skill_level === s ? 'var(--orange)' : 'var(--border2)'}`, background: form.self_skill_level === s ? 'rgba(249,115,22,0.08)' : 'var(--s2)', color: form.self_skill_level === s ? 'var(--orange)' : 'var(--text2)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: form.self_skill_level === s ? 600 : 400 }}>
                      {form.self_skill_level === s ? '● ' : '○ '}{s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Quiz sections (each quizSection renders as one step) ── */}
        {currentSection && (
          <div>
            <div className="section-label" style={{ marginBottom: 4 }}>{currentSection.title}</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--muted)', marginBottom: '1.25rem' }}>{currentSection.subtitle}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {currentSection.questions.map(q => (
                <MCQ key={q.field} label={q.label} options={q.options} value={form.answers[q.field] || ''}
                  onChange={val => setAnswer(q.field, val)} />
              ))}

              {/* Applied AI extras — confidence + tools on first quiz section */}
              {config.extraSections?.tools && stepId === config.quizSections[0]?.id && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Google Workspace confidence (Docs, Sheets, Drive)</label>
                    <RatingSlider value={form.google_confidence} onChange={val => set('google_confidence', val)} />
                  </div>
                  <div>
                    <label className="form-label">Microsoft 365 confidence (Word, Excel, Teams)</label>
                    <RatingSlider value={form.ms365_confidence} onChange={val => set('ms365_confidence', val)} />
                  </div>
                </div>
              )}

              {/* Applied AI extras — automation tools on last quiz section */}
              {config.extraSections?.automationTools && stepId === config.quizSections[config.quizSections.length - 1]?.id && (
                <div>
                  <label className="form-label" style={{ marginBottom: 8, display: 'block' }}>Automation tools you've heard of or used</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {['Zapier', 'Make.com', 'Power Automate', 'n8n', 'IFTTT', 'Airtable', 'None'].map(t => (
                      <button key={t} type="button" onClick={() => toggleArr('automation_tools', t)}
                        className={`btn btn-sm ${form.automation_tools.includes(t) ? 'btn-secondary' : 'btn-ghost'}`}
                        style={{ fontSize: '0.72rem' }}>{form.automation_tools.includes(t) ? '✓ ' : ''}{t}</button>
                    ))}
                  </div>
                  {config.extraSections?.automationComfort && (
                    <div style={{ marginTop: '1rem' }}>
                      <label className="form-label">Comfort level automating repetitive tasks</label>
                      <RatingSlider value={form.automation_comfort} onChange={val => set('automation_comfort', val)} labels={['Not at all', 'Very comfortable']} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Career & Learning ── */}
        {stepId === 'career' && (
          <div>
            <div className="section-label" style={{ marginBottom: '1.25rem' }}>Career Readiness & Learning</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Resume status</label>
                <select className="input select" value={form.resume_status} onChange={e => set('resume_status', e.target.value)}>
                  <option value="">Select…</option>
                  {RESUME_STATUSES.map(o => <option key={o}>{o}</option>)}
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
                  {LINKEDIN_USES.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Biggest career challenge right now (optional)</label>
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

        {/* ── Done ── */}
        {stepId === 'done' && (() => {
          const scores = scoreProgramSurvey(programId, form.answers)
          return (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
              <h2 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: '0.75rem' }}>Profile complete!</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: '1.5rem' }}>
                <div style={{ padding: '14px', background: 'var(--orange-d)', border: '1px solid var(--orange-b)', borderRadius: 'var(--r)' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--orange)' }}>{scores.pct}%</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: 2 }}>Baseline score ({scores.total}/{scores.maxTotal})</div>
                </div>
                <div style={{ padding: '14px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 'var(--r)' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text)', textTransform: 'capitalize' }}>{scores.computedLevel}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: 2 }}>Computed skill level</div>
                </div>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Career track: <strong style={{ color: 'var(--orange)' }}>{form.career_track_goal}</strong><br />
                {config.quizSections.map(s => (
                  <span key={s.id}>{s.title}: <strong>{scores.sectionScores[s.id] || 0}/{s.questions.length}</strong> &nbsp;</span>
                ))}
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

        {/* ── Navigation ── */}
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

function RatingSlider({ value, onChange, labels = ['1 — Low', '5 — High'] }) {
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
