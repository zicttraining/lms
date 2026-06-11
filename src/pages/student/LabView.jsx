import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../lib/AuthContext'
import { supabase } from '../../lib/supabase'
import AppLayout from '../../components/layout/AppLayout'
import { getWeekByNum, getWeekStatus, getWeeksByProgram, LAB_DATA } from '../../lib/programData'

export default function LabView() {
  const { weekNum, labNum } = useParams()
  const wn = parseInt(weekNum), ln = parseInt(labNum)
  const { profile } = useAuth()
  const week = getWeekByNum(profile?.program, wn)
  const lab = week?.labs[ln - 1]
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [progress, setProgress] = useState(null)
  const [allProgress, setAllProgress] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState('')
  const [activeTab, setActiveTab] = useState('guide')
  const [videoUrl, setVideoUrl] = useState('')
  const [stepVideos, setStepVideos] = useState({})

  // Guided submission state — one entry per step
  const [stepResponses, setStepResponses] = useState([])
  const [overallNotes, setOverallNotes] = useState('')
  const [uploadingStep, setUploadingStep] = useState(null) // step index uploading
  // Fallback (no steps defined): simple URL + notes
  const [fallbackUrl, setFallbackUrl] = useState('')
  const [fallbackType, setFallbackType] = useState('url')

  const labPrefix = profile?.program && profile.program !== 'applied_ai' ? `${profile.program}_` : ''
  const labData = LAB_DATA[`${labPrefix}w${wn}l${ln}`] || {}
  const steps = labData.steps || []
  const hasSteps = steps.length > 0

  useEffect(() => {
    if (!week || !lab) { navigate('/program'); return }
    loadData()
  }, [wn, ln, profile?.id])

  async function loadData() {
    const { data: all } = await supabase.from('progress').select('*').eq('user_id', profile.id)
    setAllProgress(all || [])
    const status = getWeekStatus(wn, all || [])
    if (status === 'locked') { navigate(`/program/week/${wn}`); return }
    const existing = (all || []).find(p => p.week_num === wn && p.lab_num === ln)
    setProgress(existing || null)

    // Load step responses if exists
    if (existing?.step_responses && Array.isArray(existing.step_responses)) {
      setStepResponses(existing.step_responses)
    } else {
      // Init empty responses for each step
      setStepResponses(steps.map((s, i) => ({ num: i + 1, action: s.action, text: '', screenshot_url: '', screenshot_name: '' })))
    }
    if (existing?.submission_url && !hasSteps) setFallbackUrl(existing.submission_url)
    if (existing?.grade_notes) setOverallNotes(existing.grade_notes?.split('Notes:')[1]?.trim() || '')

    const { data: sess } = await supabase.from('class_sessions').select('recording_url').eq('week_num', wn).limit(1).single()
    if (sess?.recording_url) setVideoUrl(sess.recording_url)
    const { data: svData } = await supabase.from('step_videos').select('step_num,video_url').eq('week_num', wn).eq('lab_num', ln)
    if (svData?.length) {
      const map = {}
      svData.forEach(sv => { map[sv.step_num - 1] = sv.video_url })
      setStepVideos(map)
    }
  }

  function updateStepText(idx, text) {
    setStepResponses(prev => prev.map((s, i) => i === idx ? { ...s, text } : s))
  }

  async function uploadStepScreenshot(idx, file) {
    setUploadingStep(idx)
    const path = `${profile.id}/w${wn}l${ln}/step${idx + 1}/${file.name}`
    const { error } = await supabase.storage.from('submissions').upload(path, file, { upsert: true })
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('submissions').getPublicUrl(path)
      setStepResponses(prev => prev.map((s, i) => i === idx ? { ...s, screenshot_url: publicUrl, screenshot_name: file.name } : s))
      await supabase.from('file_uploads').insert({ user_id: profile.id, week_num: wn, lab_num: ln, file_name: file.name, file_url: publicUrl, file_size: file.size, file_type: file.type })
    }
    setUploadingStep(null)
  }

  function removeStepScreenshot(idx) {
    setStepResponses(prev => prev.map((s, i) => i === idx ? { ...s, screenshot_url: '', screenshot_name: '' } : s))
  }

  const completedSteps = stepResponses.filter(s => s.text.trim().length > 0).length
  const allStepsComplete = hasSteps ? completedSteps === steps.length : !!fallbackUrl

  async function handleSubmit() {
    if (!allStepsComplete) {
      setMsg(hasSteps ? `Please complete all ${steps.length} steps before submitting.` : 'Please add your submission link or file.')
      return
    }
    setSubmitting(true)
    const payload = {
      user_id: profile.id, week_num: wn, lab_num: ln,
      completed: true, completed_at: new Date().toISOString(),
      submission_type: hasSteps ? 'text' : fallbackType,
      submission_url: hasSteps ? null : (fallbackUrl || null),
      submission_text: hasSteps
        ? JSON.stringify({ format: 'stepped', steps: stepResponses, notes: overallNotes })
        : (overallNotes || null),
      step_responses: hasSteps ? stepResponses : null,
      grade: 'pending',
    }
    const { error } = progress
      ? await supabase.from('progress').update(payload).eq('id', progress.id)
      : await supabase.from('progress').insert(payload)

    if (!error) {
      const { data: admins } = await supabase.from('profiles').select('id').in('role', ['admin', 'instructor'])
      if (admins?.length) {
        await supabase.from('notifications').insert(admins.map(a => ({
          user_id: a.id,
          title: `New submission: ${profile.full_name}`,
          body: `Week ${wn} · Lab ${ln}: ${lab.title}${hasSteps ? ` · ${completedSteps} steps completed` : ''}`,
          type: 'grade', link: '/admin/grading'
        })))
      }
      // Unlock check
      const { data: updated } = await supabase.from('progress').select('*').eq('user_id', profile.id)
      const programWeeks = getWeeksByProgram(profile?.program)
      const nextWeek = programWeeks.find(w => w.num === wn + 1)
      if (nextWeek?.unlocksAt) {
        const wasLocked = getWeekStatus(nextWeek.num, allProgress) === 'locked'
        const nowUnlocked = getWeekStatus(nextWeek.num, updated || []) === 'unlocked'
        if (wasLocked && nowUnlocked) {
          await supabase.from('notifications').insert({
            user_id: profile.id,
            title: `🔓 Week ${nextWeek.num} is now unlocked!`,
            body: `You've met the requirements for "${nextWeek.title}". Head to your Program page to start.`,
            type: 'success', link: `/program/week/${nextWeek.num}`
          })
        }
      }
      setMsg('✅ Submitted! Your instructor will review and grade your work.')
      loadData()
    } else {
      setMsg('Error submitting. Please try again.')
    }
    setSubmitting(false)
  }

  if (!week || !lab) return null
  const isComplete = progress?.completed
  const grade = progress?.grade
  const accentColor = lab.isApplied ? 'var(--orange)' : week.color

  const tabs = [
    { id: 'guide', label: '📋 Guide' },
    { id: 'slides', label: '🎞 Slides' },
    { id: 'video', label: '🎬 Video' },
    { id: 'submit', label: `📤 Submit${isComplete ? ' ✓' : ''}` },
  ]

  return (
    <AppLayout>
      <div style={{ maxWidth: 940, margin: '0 auto', padding: '1.5rem' }}>

        {/* Back navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '1.25rem' }}>
          <button onClick={() => navigate(`/program/week/${wn}`)} className="btn btn-ghost btn-sm" style={{ gap: 5, fontSize: '0.78rem' }}>
            ← Week {wn}
          </button>
          <span style={{ color: 'var(--border2)', fontSize: '0.8rem' }}>/</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Lab {ln}: {lab.title}</span>
        </div>

        {/* Lab header card */}
        <div className="card" style={{ marginBottom: '1.25rem', overflow: 'hidden', borderTop: `3px solid ${accentColor}` }}>
          {/* Colored accent strip */}
          <div style={{ height: 4, background: `linear-gradient(90deg, ${accentColor}, ${accentColor}40)` }} />
          <div style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', marginBottom: 10 }}>
                <span className={`badge badge-l${week.level}`}>{week.levelLabel}</span>
                <span className="badge badge-gray">Lab {ln}</span>
                <DayBadge day={lab.day} />
                {lab.isApplied && <span className="badge badge-orange">★ Applied Lab</span>}
                {steps.length > 0 && <span style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6', padding: '2px 8px', borderRadius: 10, fontSize: '0.62rem', fontWeight: 700 }}>{steps.length} steps</span>}
              </div>
              <h1 style={{ fontSize: 'clamp(1.1rem,3vw,1.4rem)', fontWeight: 800, lineHeight: 1.25, marginBottom: 6 }}>{lab.title}</h1>
              <p style={{ fontSize: '0.84rem', color: 'var(--text2)', lineHeight: 1.6 }}>{lab.desc}</p>
            </div>
            <div style={{ flexShrink: 0, textAlign: 'center', minWidth: 80 }}>
              {isComplete ? (
                <>
                  <div style={{ fontSize: '2.2rem', marginBottom: 4 }}>✅</div>
                  <GradeBadge grade={grade} />
                  {progress?.grade_notes && <div style={{ fontSize: '0.7rem', color: 'var(--text2)', marginTop: 4, maxWidth: 140, lineHeight: 1.4 }}>{progress.grade_notes}</div>}
                </>
              ) : (
                <div style={{ width: 52, height: 52, borderRadius: '50%', border: `3px solid var(--border2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 700 }}>W{wn}·L{ln}</span>
                </div>
              )}
            </div>
          </div>

          {/* Step progress bar (guided labs) */}
          {hasSteps && (
            <div style={{ padding: '0 1.5rem 1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--muted)', marginBottom: 5 }}>
                <span>Step progress</span>
                <span style={{ color: accentColor, fontWeight: 700 }}>{completedSteps} / {steps.length} completed</span>
              </div>
              <div style={{ height: 5, background: 'var(--s3)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.round((completedSteps / steps.length) * 100)}%`, background: `linear-gradient(90deg, ${accentColor}, ${accentColor}cc)`, borderRadius: 3, transition: 'width 0.4s ease' }} />
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="tab-bar" style={{ top: 58, borderRadius: 'var(--r) var(--r) 0 0', marginBottom: 0 }}>
          {tabs.map(({ id, label }) => (
            <button key={id} className={`tab-btn ${activeTab === id ? 'active' : ''}`} onClick={() => setActiveTab(id)}>{label}</button>
          ))}
        </div>

        {/* ── GUIDE TAB ── */}
        {activeTab === 'guide' && (
          <div className="card" style={{ padding: '1.5rem', borderRadius: '0 0 var(--r-lg) var(--r-lg)' }}>
            {labData.overview && (
              <div style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.7, marginBottom: '1.5rem', padding: '14px 16px', background: 'var(--s2)', borderRadius: 'var(--r)', borderLeft: `3px solid ${accentColor}` }}>
                {labData.overview}
              </div>
            )}
            {hasSteps ? (
              <div>
                <div className="section-label">Step-by-Step Instructions</div>
                {steps.map((step, i) => {
                  const stepVideoUrl = stepVideos[i] || step.videoUrl || null
                  const done = stepResponses[i]?.text?.trim().length > 0
                  return (
                    <div key={i} className="step-card" style={{ display: 'grid', gridTemplateColumns: '48px 1fr', gap: 14, padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: done ? 'var(--green-d)' : step.featured ? 'var(--orange-d)' : 'var(--s3)', border: `2px solid ${done ? 'var(--green-b)' : step.featured ? 'var(--orange-b)' : 'var(--border2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.78rem', color: done ? 'var(--green)' : step.featured ? 'var(--orange)' : 'var(--muted)', flexShrink: 0 }}>
                          {done ? '✓' : i + 1}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, marginBottom: 6, fontSize: '0.9rem', color: 'var(--text)' }}>{step.action}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text2)', lineHeight: 1.65, marginBottom: step.tip || step.warn ? 8 : 0 }}
                          dangerouslySetInnerHTML={{ __html: step.detail.replace(/`([^`]+)`/g, '<code style="font-family:DM Mono;background:var(--s3);padding:1px 6px;border-radius:3px;font-size:0.82em;color:#38d9c0">$1</code>') }} />
                        {step.tip && <div style={{ padding: '8px 12px', background: 'var(--yellow-d)', borderLeft: '3px solid var(--yellow)', borderRadius: '0 6px 6px 0', fontSize: '0.76rem', color: 'var(--yellow)', marginBottom: 6, lineHeight: 1.5 }}>💡 <strong>Tip:</strong> {step.tip}</div>}
                        {step.warn && <div style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.08)', borderLeft: '3px solid var(--danger)', borderRadius: '0 6px 6px 0', fontSize: '0.76rem', color: 'var(--danger)', marginBottom: 6, lineHeight: 1.5 }}>⚠ <strong>Watch out:</strong> {step.warn}</div>}
                        {stepVideoUrl && <StepVideo url={stepVideoUrl} />}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)', fontSize: '0.85rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>📋</div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Step-by-step guide coming soon</div>
                <div style={{ fontSize: '0.78rem' }}>Your instructor will share the lab companion during class. Check back after session.</div>
              </div>
            )}
            {labData.deliverable && (
              <div style={{ marginTop: '1.5rem', padding: '14px 16px', background: 'var(--s2)', borderRadius: 'var(--r)', border: '1px solid var(--border2)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.78rem', color: accentColor, marginBottom: 6 }}>📤 What to Submit</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text2)', lineHeight: 1.6 }}>{labData.deliverable}</div>
              </div>
            )}
            <div style={{ marginTop: '1.25rem' }}>
              <button className="btn btn-primary" onClick={() => setActiveTab('submit')} style={{ width: '100%' }}>
                📤 Go to Submit Work →
              </button>
            </div>
          </div>
        )}

        {/* ── SLIDES TAB ── */}
        {activeTab === 'slides' && (
          <div className="card" style={{ borderRadius: '0 0 var(--r-lg) var(--r-lg)', overflow: 'hidden' }}>
            <ModernSlideShow labData={labData} lab={lab} week={week} wn={wn} ln={ln} stepVideos={stepVideos} accentColor={accentColor} onSubmit={() => setActiveTab('submit')} />
          </div>
        )}

        {/* ── VIDEO TAB ── */}
        {activeTab === 'video' && (
          <div className="card" style={{ padding: '1.5rem', borderRadius: '0 0 var(--r-lg) var(--r-lg)' }}>
            {videoUrl ? <><div className="section-label" style={{ marginBottom: '1rem' }}>Class Recording</div><VideoEmbed url={videoUrl} /></> : (
              <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--muted)' }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎬</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 6 }}>No video uploaded yet</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.6 }}>Your instructor will add a recording after class. Check back soon.</div>
              </div>
            )}
          </div>
        )}

        {/* ── SUBMIT TAB ── */}
        {activeTab === 'submit' && (
          <div className="card" style={{ padding: '1.5rem', borderRadius: '0 0 var(--r-lg) var(--r-lg)' }}>

            {/* Already passed */}
            {grade === 'pass' ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎉</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--green)', marginBottom: 6 }}>Lab Passed!</div>
                {progress.grade_notes && <div style={{ fontSize: '0.82rem', color: 'var(--text2)', marginBottom: 16 }}>{progress.grade_notes}</div>}
                <div style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>Graded {new Date(progress.graded_at).toLocaleDateString()}</div>
              </div>
            ) : (
              <>
                {/* Needs revision banner */}
                {grade === 'fail' && (
                  <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, marginBottom: '1.25rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--danger)', marginBottom: 4 }}>📝 Revision Required</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>{progress.grade_notes || 'Your instructor has requested revisions. Update your responses below and resubmit.'}</div>
                  </div>
                )}

                {hasSteps ? (
                  /* ── Guided step-by-step submission ── */
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 2 }}>Complete Each Step</h3>
                        <div style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>Describe what you did and upload a screenshot for each step.</div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.82rem', color: completedSteps === steps.length ? 'var(--green)' : 'var(--orange)' }}>
                        {completedSteps}/{steps.length} steps done
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: '1.5rem' }}>
                      {steps.map((step, i) => {
                        const resp = stepResponses[i] || {}
                        const isDone = resp.text?.trim().length > 0
                        const uploadId = `step-upload-${i}`
                        return (
                          <div key={i} style={{ borderRadius: 12, border: `1px solid ${isDone ? 'var(--green-b)' : 'var(--border2)'}`, background: isDone ? 'rgba(34,197,94,0.04)' : 'var(--s2)', overflow: 'hidden', transition: 'border-color 0.2s' }}>
                            {/* Step header */}
                            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${isDone ? 'var(--green-b)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', gap: 10, background: isDone ? 'rgba(34,197,94,0.06)' : 'var(--s3)' }}>
                              <div style={{ width: 30, height: 30, borderRadius: '50%', background: isDone ? 'var(--green-d)' : `${accentColor}20`, border: `2px solid ${isDone ? 'var(--green-b)' : `${accentColor}40`}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.78rem', color: isDone ? 'var(--green)' : accentColor, flexShrink: 0 }}>
                                {isDone ? '✓' : i + 1}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text)' }}>{step.action}</div>
                                <div style={{ fontSize: '0.68rem', color: 'var(--muted)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{step.detail?.replace(/<[^>]*>/g, '').slice(0, 80)}…</div>
                              </div>
                              {isDone && <span style={{ fontSize: '0.62rem', color: 'var(--green)', fontWeight: 700, background: 'var(--green-d)', padding: '2px 8px', borderRadius: 10, flexShrink: 0 }}>Done</span>}
                            </div>

                            {/* Step body */}
                            <div style={{ padding: '14px 16px' }}>
                              <div className="form-group" style={{ marginBottom: 10 }}>
                                <label className="form-label" style={{ color: 'var(--text2)' }}>What did you do? What did you find? *</label>
                                <textarea className="input" rows={3}
                                  placeholder={`Describe what you did for "${step.action}"…`}
                                  value={resp.text || ''}
                                  onChange={e => updateStepText(i, e.target.value)}
                                  style={{ fontSize: '0.82rem', minHeight: 72, resize: 'vertical' }} />
                              </div>

                              {/* Screenshot upload */}
                              <div>
                                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text2)', marginBottom: 6 }}>Screenshot (optional but encouraged)</div>
                                {resp.screenshot_url ? (
                                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                    <a href={resp.screenshot_url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border2)', flexShrink: 0 }}>
                                      <img src={resp.screenshot_url} alt="screenshot" style={{ width: 80, height: 56, objectFit: 'cover', display: 'block' }}
                                        onError={e => { e.target.style.display = 'none' }} />
                                    </a>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <div style={{ fontSize: '0.74rem', color: 'var(--green)', fontWeight: 600, marginBottom: 4 }}>✅ {resp.screenshot_name}</div>
                                      <a href={resp.screenshot_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.68rem', color: 'var(--orange)', textDecoration: 'none' }}>View full ↗</a>
                                      <button onClick={() => removeStepScreenshot(i)} className="btn btn-ghost btn-sm" style={{ marginLeft: 8, fontSize: '0.66rem', padding: '2px 8px' }}>Remove</button>
                                    </div>
                                  </div>
                                ) : (
                                  <label htmlFor={uploadId} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '10px 14px', borderRadius: 8, border: '1px dashed var(--border2)', cursor: 'pointer', fontSize: '0.76rem', color: 'var(--muted)', background: 'var(--s3)', transition: 'border-color 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = accentColor}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border2)'}>
                                    {uploadingStep === i ? <><div className="loader-sm" /> Uploading…</> : <><span>📸</span> Click to upload screenshot · PNG, JPG · Max 20MB</>}
                                    <input id={uploadId} type="file" accept="image/*" style={{ display: 'none' }}
                                      onChange={e => e.target.files[0] && uploadStepScreenshot(i, e.target.files[0])} />
                                  </label>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Overall notes */}
                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                      <label className="form-label">Notes or questions for your instructor (optional)</label>
                      <textarea className="input" rows={3} placeholder="Anything you struggled with, questions, or extra context for your instructor…" value={overallNotes} onChange={e => setOverallNotes(e.target.value)} />
                    </div>
                  </div>
                ) : (
                  /* ── Fallback (no steps) — simple URL submit ── */
                  <div>
                    <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Submit Your Work</h3>
                    <div style={{ display: 'flex', gap: 8, marginBottom: '1rem', flexWrap: 'wrap' }}>
                      {[['url', '🔗 Link / Google Doc'], ['text', '✍️ Write response']].map(([type, label]) => (
                        <button key={type} className={`btn btn-sm ${fallbackType === type ? 'btn-secondary' : 'btn-ghost'}`} onClick={() => setFallbackType(type)}>{label}</button>
                      ))}
                    </div>
                    {fallbackType === 'url' && (
                      <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label className="form-label">Google Doc, Slides, or URL</label>
                        <input className="input" type="url" placeholder="https://docs.google.com/…" value={fallbackUrl} onChange={e => setFallbackUrl(e.target.value)} />
                        <span className="form-hint">Set sharing to "Anyone with link can view"</span>
                      </div>
                    )}
                    {fallbackType === 'text' && (
                      <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label className="form-label">Your response</label>
                        <textarea className="input textarea" rows={6} placeholder="Describe what you completed, what you learned, or paste your work here…" value={overallNotes} onChange={e => setOverallNotes(e.target.value)} style={{ minHeight: 140 }} />
                      </div>
                    )}
                    {fallbackType === 'url' && (
                      <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                        <label className="form-label">Notes for instructor (optional)</label>
                        <textarea className="input" rows={2} value={overallNotes} onChange={e => setOverallNotes(e.target.value)} placeholder="Any context, questions, or notes…" />
                      </div>
                    )}
                  </div>
                )}

                {/* Submit button */}
                {msg && (
                  <div style={{ padding: '10px 14px', borderRadius: 8, background: msg.startsWith('✅') ? 'var(--green-d)' : 'rgba(239,68,68,0.08)', border: `1px solid ${msg.startsWith('✅') ? 'var(--green-b)' : 'rgba(239,68,68,0.2)'}`, color: msg.startsWith('✅') ? 'var(--green)' : 'var(--danger)', fontSize: '0.8rem', marginBottom: '1rem' }}>{msg}</div>
                )}
                <button className="btn btn-primary" onClick={handleSubmit}
                  disabled={submitting || !allStepsComplete}
                  style={{ width: '100%', height: 50, fontSize: '0.92rem', borderRadius: 10, gap: 8 }}>
                  {submitting ? <><div className="loader-sm" /> Submitting…</> : isComplete ? '✏️ Update Submission' : `✅ Submit ${hasSteps ? `All ${steps.length} Steps` : 'Work'}`}
                </button>
                {!allStepsComplete && hasSteps && (
                  <div style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--muted)', marginTop: 8 }}>
                    Complete {steps.length - completedSteps} more step{steps.length - completedSteps > 1 ? 's' : ''} to unlock submission
                  </div>
                )}
                {isComplete && (
                  <div style={{ marginTop: '1rem', padding: '12px 16px', background: 'var(--s2)', borderRadius: 10, borderLeft: '3px solid var(--green)', fontSize: '0.78rem' }}>
                    <div style={{ fontWeight: 600, marginBottom: 3 }}>Submission received</div>
                    <div style={{ color: 'var(--muted)' }}>Submitted {new Date(progress.completed_at).toLocaleString()} · <GradeBadge grade={grade} inline /></div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Lab navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => navigate(`/program/week/${wn}`)} className="btn btn-ghost btn-sm">← Week {wn}</button>
            {ln > 1 && <Link to={`/program/week/${wn}/lab/${ln - 1}`} className="btn btn-ghost btn-sm">← Lab {ln - 1}</Link>}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {ln < week.labCount && <Link to={`/program/week/${wn}/lab/${ln + 1}`} className="btn btn-ghost btn-sm">Lab {ln + 1} →</Link>}
            {ln === week.labCount && <Link to={`/program/week/${wn + 1}`} className="btn btn-primary btn-sm">Next Week →</Link>}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

// ── Modern Slide Show ─────────────────────────────────────────
function ModernSlideShow({ labData, lab, week, wn, ln, stepVideos, accentColor, onSubmit }) {
  const [current, setCurrent] = useState(0)
  const containerRef = useRef(null)

  const slides = [
    { type: 'intro' },
    ...(labData.steps || []).map((step, i) => ({ type: 'step', step, i })),
    { type: 'submit' },
  ]
  const total = slides.length
  const slide = slides[current]

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') setCurrent(c => Math.min(total - 1, c + 1))
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') setCurrent(c => Math.max(0, c - 1))
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [total])

  const SLIDE_BG = {
    intro: `linear-gradient(135deg, ${accentColor}18 0%, var(--s1) 60%)`,
    step: 'var(--s1)',
    submit: 'linear-gradient(135deg, var(--green-d) 0%, var(--s1) 60%)',
  }

  return (
    <div ref={containerRef} style={{ userSelect: 'none' }}>
      {/* Progress bar */}
      <div style={{ height: 3, background: 'var(--s3)' }}>
        <div style={{ height: '100%', width: `${((current + 1) / total) * 100}%`, background: `linear-gradient(90deg, ${accentColor}, ${accentColor}80)`, transition: 'width 0.35s ease' }} />
      </div>

      {/* Slide counter + nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid var(--border)', background: 'var(--s2)' }}>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0} style={{ padding: '5px 10px' }}>←</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setCurrent(c => Math.min(total - 1, c + 1))} disabled={current === total - 1} style={{ padding: '5px 10px' }}>→</button>
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--muted)', fontFamily: 'DM Mono' }}>{current + 1} / {total}</div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: 200 }}>
          {slides.map((s, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              style={{ width: i === current ? 18 : 6, height: 6, borderRadius: 3, background: i === current ? accentColor : i < current ? `${accentColor}60` : 'var(--border2)', border: 'none', cursor: 'pointer', transition: 'all 0.2s', padding: 0, flexShrink: 0 }} />
          ))}
        </div>
      </div>

      {/* Slide content */}
      <div style={{ minHeight: 420, padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: SLIDE_BG[slide.type], transition: 'background 0.4s ease' }}>

        {slide.type === 'intro' && (
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 24, background: `${accentColor}20`, border: `1px solid ${accentColor}40`, marginBottom: 20 }}>
              <span style={{ color: accentColor, fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Week {wn} · Lab {ln}</span>
            </div>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.4rem,4vw,2.2rem)', marginBottom: 16, lineHeight: 1.15, color: 'var(--text)' }}>{lab.title}</h2>
            {labData.overview ? (
              <p style={{ fontSize: '0.88rem', color: 'var(--text2)', lineHeight: 1.75, marginBottom: 24 }}>{labData.overview}</p>
            ) : (
              <p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginBottom: 24 }}>{lab.desc}</p>
            )}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ padding: '8px 16px', background: `${accentColor}15`, border: `1px solid ${accentColor}30`, borderRadius: 20, fontSize: '0.76rem', color: accentColor, fontWeight: 600 }}>
                {labData.steps?.length || 0} steps to complete
              </div>
              {lab.isApplied && <div style={{ padding: '8px 16px', background: 'var(--orange-d)', border: '1px solid var(--orange-b)', borderRadius: 20, fontSize: '0.76rem', color: 'var(--orange)', fontWeight: 600 }}>★ Applied Lab</div>}
              <div style={{ padding: '8px 16px', background: 'var(--s3)', border: '1px solid var(--border2)', borderRadius: 20, fontSize: '0.76rem', color: 'var(--muted)' }}>
                ← → Arrow keys to navigate
              </div>
            </div>
          </div>
        )}

        {slide.type === 'step' && (
          <div style={{ maxWidth: 680, margin: '0 auto', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: slide.step.featured ? `${accentColor}25` : 'var(--s3)', border: `2px solid ${slide.step.featured ? accentColor : 'var(--border2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.3rem', color: slide.step.featured ? accentColor : 'var(--muted)', flexShrink: 0 }}>
                {slide.i + 1}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--muted)', fontFamily: 'DM Mono', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Step {slide.i + 1} of {labData.steps.length}</div>
            </div>
            <h3 style={{ fontWeight: 800, fontSize: 'clamp(1.1rem,3vw,1.5rem)', marginBottom: 16, lineHeight: 1.25, color: 'var(--text)' }}>{slide.step.action}</h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.8, marginBottom: slide.step.tip || slide.step.warn ? 16 : 0 }}
              dangerouslySetInnerHTML={{ __html: slide.step.detail.replace(/`([^`]+)`/g, '<code style="font-family:DM Mono;background:#1B2030;padding:2px 8px;border-radius:4px;font-size:0.84em;color:#38d9c0">$1</code>') }} />
            {slide.step.tip && (
              <div style={{ padding: '12px 16px', background: 'var(--yellow-d)', borderLeft: '4px solid var(--yellow)', borderRadius: '0 8px 8px 0', fontSize: '0.8rem', color: 'var(--yellow)', marginBottom: 10, lineHeight: 1.5 }}>
                <strong>💡 Tip:</strong> {slide.step.tip}
              </div>
            )}
            {slide.step.warn && (
              <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.08)', borderLeft: '4px solid var(--danger)', borderRadius: '0 8px 8px 0', fontSize: '0.8rem', color: 'var(--danger)', marginBottom: 10, lineHeight: 1.5 }}>
                <strong>⚠ Watch out:</strong> {slide.step.warn}
              </div>
            )}
            {(stepVideos[slide.i] || slide.step.videoUrl) && (
              <div style={{ marginTop: 16 }}>
                <StepVideo url={stepVideos[slide.i] || slide.step.videoUrl} />
              </div>
            )}
          </div>
        )}

        {slide.type === 'submit' && (
          <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>📤</div>
            <h3 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: 12, color: 'var(--text)' }}>Ready to Submit?</h3>
            <div style={{ fontSize: '0.86rem', color: 'var(--text2)', lineHeight: 1.75, padding: '16px 20px', background: 'var(--s2)', borderRadius: 12, border: '1px solid var(--border2)', marginBottom: 24 }}>
              {labData.deliverable || `Submit your work via the Submit tab.\nFile naming: LAB${ln}_YourName_W${wn}`}
            </div>
            <button className="btn btn-primary" onClick={onSubmit} style={{ padding: '12px 28px', fontSize: '0.92rem', borderRadius: 10 }}>
              Go to Submit Tab →
            </button>
          </div>
        )}
      </div>

      {/* Bottom navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: 'var(--s2)', borderTop: '1px solid var(--border)' }}>
        <button className="btn btn-ghost" onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}>← Previous</button>
        <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Use arrow keys to navigate</span>
        {current < total - 1
          ? <button className="btn btn-primary" onClick={() => setCurrent(c => Math.min(total - 1, c + 1))}>Next →</button>
          : <button className="btn btn-primary" onClick={onSubmit}>Submit Work →</button>
        }
      </div>
    </div>
  )
}

// ── Helpers ────────────────────────────────────────────────────
function StepVideo({ url }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ marginTop: 10 }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20, border: '1px solid var(--border2)', background: open ? 'var(--s3)' : 'var(--s2)', color: 'var(--text2)', fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer' }}>
        <span>{open ? '▾' : '▶'}</span>{open ? 'Hide video' : 'Watch this step'}
      </button>
      {open && <div style={{ marginTop: 10, borderRadius: 'var(--r)', overflow: 'hidden', border: '1px solid var(--border2)' }}><VideoEmbed url={url} /></div>}
    </div>
  )
}

function VideoEmbed({ url }) {
  const getEmbedUrl = (u) => {
    if (u.includes('youtube.com/watch?v=')) return u.replace('watch?v=', 'embed/')
    if (u.includes('youtu.be/')) return u.replace('youtu.be/', 'www.youtube.com/embed/')
    if (u.includes('loom.com/share/')) return u.replace('/share/', '/embed/')
    return u
  }
  const isEmbed = url.includes('youtube') || url.includes('loom')
  if (isEmbed) return <div className="video-wrap"><iframe src={getEmbedUrl(url)} allowFullScreen title="Lab video" /></div>
  return <video src={url} controls style={{ width: '100%', borderRadius: 'var(--r)' }} />
}

function GradeBadge({ grade, inline }) {
  const map = { pass: ['badge-green', '✅ Passed'], fail: ['badge-red', '❌ Needs Revision'], pending: ['badge-yellow', '⏳ Pending Review'], not_submitted: ['badge-gray', '—'] }
  const [cls, label] = map[grade] || map.not_submitted
  return <span className={`badge ${cls}`} style={inline ? { marginLeft: 6 } : {}}>{label}</span>
}

function DayBadge({ day }) {
  const map = {
    Mon: { bg: 'rgba(59,130,246,0.12)', color: '#3B82F6' },
    Tue: { bg: 'rgba(234,179,8,0.12)',   color: '#EAB308' },
    Wed: { bg: 'rgba(34,197,94,0.12)',   color: '#22C55E' },
    Thu: { bg: 'rgba(249,115,22,0.12)',  color: '#F97316' },
  }
  const style = map[day] || { bg: 'var(--s3)', color: 'var(--muted)' }
  return <span style={{ ...style, background: style.bg, padding: '3px 9px', borderRadius: 20, fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{day}</span>
}
