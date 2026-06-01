import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
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
  const [submitText, setSubmitText] = useState('')
  const [submitNotes, setSubmitNotes] = useState('')
  const [submitLink, setSubmitLink] = useState('')
  const [submitType, setSubmitType] = useState('text')
  const [uploadedFile, setUploadedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')
  const [activeTab, setActiveTab] = useState('guide')
  const [videoUrl, setVideoUrl] = useState('')
  const [stepVideos, setStepVideos] = useState({})

  const labPrefix = profile?.program && profile.program !== 'applied_ai' ? `${profile.program}_` : ''
  const labData = LAB_DATA[`${labPrefix}w${wn}l${ln}`] || {}

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
    if (existing?.submission_url) setSubmitLink(existing.submission_url)
    if (existing?.submission_type) setSubmitType(existing.submission_type)
    if (existing?.submission_text) {
      if (existing.submission_type === 'text') setSubmitText(existing.submission_text)
      else setSubmitNotes(existing.submission_text)
    }
    // Fetch week video
    const { data: sess } = await supabase.from('class_sessions').select('recording_url').eq('week_num', wn).limit(1).single()
    if (sess?.recording_url) setVideoUrl(sess.recording_url)
    // Fetch per-step videos
    const { data: svData } = await supabase.from('step_videos').select('step_num,video_url').eq('week_num', wn).eq('lab_num', ln)
    if (svData?.length) {
      const map = {}
      svData.forEach(sv => { map[sv.step_num - 1] = sv.video_url })
      setStepVideos(map)
    }
  }

  const onDrop = useCallback(async (files) => {
    if (!files[0]) return
    setUploading(true)
    const file = files[0]
    const path = `${profile.id}/w${wn}l${ln}/${file.name}`
    const { data, error } = await supabase.storage.from('submissions').upload(path, file, { upsert: true })
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('submissions').getPublicUrl(path)
      setSubmitLink(publicUrl)
      setUploadedFile(file.name)
      setSubmitType('file')
      await supabase.from('file_uploads').insert({ user_id: profile.id, week_num: wn, lab_num: ln, file_name: file.name, file_url: publicUrl, file_size: file.size, file_type: file.type })
    }
    setUploading(false)
  }, [profile?.id, wn, ln])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1, maxSize: 50 * 1024 * 1024 })

  async function handleSubmit() {
    if (!submitText && !submitLink) { setMsg('Please add your submission before marking complete.'); return }
    setSubmitting(true)
    const payload = {
      user_id: profile.id, week_num: wn, lab_num: ln,
      completed: true, completed_at: new Date().toISOString(),
      submission_text: submitType === 'text' ? (submitText || null) : (submitNotes || null),
      submission_url: submitLink || null,
      submission_type: submitType,
      grade: 'pending',
    }
    const { error } = progress
      ? await supabase.from('progress').update(payload).eq('id', progress.id)
      : await supabase.from('progress').insert(payload)

    if (!error) {
      // Notify instructors
      const { data: admins } = await supabase.from('profiles').select('id').in('role', ['admin', 'instructor'])
      if (admins?.length) {
        await supabase.from('notifications').insert(admins.map(a => ({
          user_id: a.id,
          title: `New submission: ${profile.full_name}`,
          body: `Week ${wn} · Lab ${ln}: ${lab.title}`,
          type: 'grade',
          link: `/admin/grading`
        })))
      }

      // Check if this submission unlocks the next week — send an instant unlock notification
      const { data: updatedProgress } = await supabase.from('progress').select('*').eq('user_id', profile.id)
      const programWeeks = getWeeksByProgram(profile?.program)
      const nextWeek = programWeeks.find(w => w.num === wn + 1)
      if (nextWeek?.unlocksAt) {
        const wasLocked = getWeekStatus(nextWeek.num, allProgress) === 'locked'
        const nowUnlocked = getWeekStatus(nextWeek.num, updatedProgress || []) === 'unlocked'
        if (wasLocked && nowUnlocked) {
          await supabase.from('notifications').insert({
            user_id: profile.id,
            title: `🔓 Week ${nextWeek.num} is now unlocked!`,
            body: `You've met the requirements for "${nextWeek.title}". Head to your Program page to start the next week.`,
            type: 'success',
            link: `/program/week/${nextWeek.num}`
          })
        }
      }

      setMsg('✅ Submitted! Your instructor will review and grade this lab.')
      loadData()
    } else {
      setMsg('Error submitting. Please try again.')
    }
    setSubmitting(false)
  }

  if (!week || !lab) return null

  const isComplete = progress?.completed
  const grade = progress?.grade

  return (
    <AppLayout>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '1.5rem' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem', fontSize: '0.78rem', color: 'var(--muted)' }}>
          <Link to="/program" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Program</Link>
          <span>›</span>
          <Link to={`/program/week/${wn}`} style={{ color: 'var(--muted)', textDecoration: 'none' }}>Week {wn}</Link>
          <span>›</span>
          <span style={{ color: 'var(--text)' }}>Lab {ln}: {lab.title}</span>
        </div>

        {/* Lab header */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem', borderTop: `3px solid ${lab.isApplied ? 'var(--orange)' : week.color}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
                <span className={`badge badge-l${week.level}`}>{week.levelLabel}</span>
                <span className="badge badge-gray">Lab {ln}</span>
                <span style={{ ...dayStyle(lab.day) }}>{lab.day}</span>
                {lab.isApplied && <span className="badge badge-orange">★ Applied Lab</span>}
              </div>
              <h1 style={{ fontSize: 'clamp(1.1rem,3vw,1.5rem)', fontWeight: 800, marginBottom: 6 }}>{lab.title}</h1>
              <p style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.6 }}>{lab.desc}</p>
            </div>
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              {isComplete ? (
                <div>
                  <div style={{ fontSize: '2rem', marginBottom: 4 }}>✅</div>
                  <GradeBadge grade={grade} />
                  {progress?.grade_notes && <div style={{ fontSize: '0.72rem', color: 'var(--text2)', marginTop: 4, maxWidth: 160 }}>{progress.grade_notes}</div>}
                </div>
              ) : (
                <div style={{ fontSize: '1.5rem', color: 'var(--muted)' }}>⬜</div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tab-bar" style={{ top: 58, borderRadius: 'var(--r) var(--r) 0 0', marginBottom: 0 }}>
          {[['guide', '📋 Guide'], ['slides', '📊 Slides'], ['video', '🎬 Video'], ['submit', '📤 Submit']].map(([id, label]) => (
            <button key={id} className={`tab-btn ${activeTab === id ? 'active' : ''}`} onClick={() => setActiveTab(id)}>{label}</button>
          ))}
        </div>

        {/* Guide tab */}
        {activeTab === 'guide' && (
          <div className="card" style={{ padding: '1.5rem', borderRadius: '0 0 var(--r-lg) var(--r-lg)' }}>
            {labData.overview && <p style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.7, marginBottom: '1.25rem', padding: '12px 14px', background: 'var(--s2)', borderRadius: 'var(--r)', borderLeft: '3px solid var(--orange)' }}>{labData.overview}</p>}
            {labData.steps?.length > 0 ? (
              <div>
                <div className="section-label">Step-by-Step Instructions</div>
                {labData.steps.map((step, i) => {
                  const stepVideoUrl = stepVideos[i] || step.videoUrl || null
                  return (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '36px 1fr', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ width: 26, height: 26, borderRadius: '50%', background: step.featured ? 'var(--orange-d)' : 'var(--s3)', border: step.featured ? '1px solid var(--orange-b)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 700, color: step.featured ? 'var(--orange)' : 'var(--muted)', flexShrink: 0, fontFamily: 'DM Mono' }}>{i + 1}</div>
                      <div>
                        <div style={{ fontWeight: 700, marginBottom: 4, fontSize: '0.88rem' }}>{step.action}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text2)', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: step.detail.replace(/`([^`]+)`/g, '<code style="font-family:DM Mono;background:var(--s3);padding:1px 6px;border-radius:3px;font-size:0.8em;color:#38d9c0">$1</code>') }} />
                        {step.tip && <div style={{ marginTop: 6, padding: '6px 10px', background: 'var(--yellow-d)', borderLeft: '2px solid var(--yellow)', borderRadius: '0 4px 4px 0', fontSize: '0.74rem', color: 'var(--yellow)' }}>💡 {step.tip}</div>}
                        {step.warn && <div style={{ marginTop: 6, padding: '6px 10px', background: 'rgba(239,68,68,0.08)', borderLeft: '2px solid var(--danger)', borderRadius: '0 4px 4px 0', fontSize: '0.74rem', color: 'var(--danger)' }}>⚠ {step.warn}</div>}
                        {stepVideoUrl && <StepVideo url={stepVideoUrl} />}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)', fontSize: '0.85rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>📋</div>
                Step-by-step guide for this lab is in the Lab Companion document. Your instructor will share it in class.
              </div>
            )}
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--s2)', borderRadius: 'var(--r)', border: '1px solid var(--border2)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--orange)', marginBottom: 4 }}>📤 Submission Format</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text2)' }}>{labData.deliverable || `Submit via the Submit Work tab. File: LAB${ln}_YourName_W${wn} · Pass/Fail based on completion + rubric criteria`}</div>
            </div>
          </div>
        )}

        {/* Slides tab */}
        {activeTab === 'slides' && (
          <div className="card" style={{ borderRadius: '0 0 var(--r-lg) var(--r-lg)', overflow: 'hidden' }}>
            <SlideShow labData={labData} lab={lab} week={week} wn={wn} ln={ln} stepVideos={stepVideos} />
          </div>
        )}

        {/* Video tab */}
        {activeTab === 'video' && (
          <div className="card" style={{ padding: '1.5rem', borderRadius: '0 0 var(--r-lg) var(--r-lg)' }}>
            {videoUrl ? (
              <>
                <div className="section-label" style={{ marginBottom: '1rem' }}>Video Guide</div>
                <VideoEmbed url={videoUrl} />
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--muted)' }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎬</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 6 }}>No video uploaded yet</div>
                <div style={{ fontSize: '0.8rem', lineHeight: 1.6 }}>Your instructor will add a recording or walkthrough video for this lab soon. Check back after class.</div>
              </div>
            )}
          </div>
        )}

        {/* Submit tab */}
        {activeTab === 'submit' && (
          <div className="card" style={{ padding: '1.5rem', borderRadius: '0 0 var(--r-lg) var(--r-lg)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>{t('submitWork')}</h3>

            {/* Type selector */}
            <div style={{ display: 'flex', gap: 8, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              {[['text', '✍️ Write submission'], ['url', '🔗 Google Doc / Link'], ['file', '📁 Upload file']].map(([type, label]) => (
                <button key={type} className={`btn btn-sm ${submitType === type ? 'btn-secondary' : 'btn-ghost'}`} onClick={() => setSubmitType(type)}>{label}</button>
              ))}
            </div>

            {submitType === 'text' && (
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Your submission</label>
                <textarea className="input textarea" placeholder="Write your response, reflection, or describe what you completed…" value={submitText} onChange={e => setSubmitText(e.target.value)} style={{ minHeight: 160 }} />
              </div>
            )}

            {submitType === 'url' && (
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Google Doc / Link / URL</label>
                <input className="input" type="url" placeholder="https://docs.google.com/…" value={submitLink} onChange={e => setSubmitLink(e.target.value)} />
                <span className="form-hint">Paste your Google Doc shareable link, Google Slides, or any other URL</span>
              </div>
            )}

            {submitType === 'file' && (
              <div style={{ marginBottom: '1rem' }}>
                <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                  <input {...getInputProps()} />
                  {uploading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', color: 'var(--orange)' }}>
                      <div className="loader-sm" /> Uploading…
                    </div>
                  ) : uploadedFile ? (
                    <div style={{ color: 'var(--green)' }}>✅ {uploadedFile} uploaded</div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>📁</div>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>{t('uploadFile')}</div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>Drag & drop or click to browse · Max 50MB · PDF, DOCX, XLSX, PNG, MP4</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Optional notes */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Notes for instructor (optional)</label>
              <textarea className="input" placeholder="Any notes, questions, or context for your instructor…" value={submitNotes} onChange={e => setSubmitNotes(e.target.value)} rows={3} />
            </div>

            {msg && <div style={{ padding: '10px 14px', borderRadius: 8, background: msg.startsWith('✅') ? 'var(--green-d)' : 'rgba(239,68,68,0.08)', border: `1px solid ${msg.startsWith('✅') ? 'var(--green-b)' : 'rgba(239,68,68,0.2)'}`, color: msg.startsWith('✅') ? 'var(--green)' : 'var(--danger)', fontSize: '0.8rem', marginBottom: '1rem' }}>{msg}</div>}

            <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting || (submitType === 'text' ? !submitText : !submitLink)} style={{ width: '100%' }}>
              {submitting ? <><div className="loader-sm" /> Submitting…</> : isComplete ? '✏️ Update Submission' : `✅ ${t('submitLab')}`}
            </button>

            {isComplete && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--s2)', borderRadius: 'var(--r)', borderLeft: '3px solid var(--green)' }}>
                <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: 4 }}>Submission received</div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text2)' }}>
                  Submitted: {new Date(progress.completed_at).toLocaleString()}<br />
                  Status: <GradeBadge grade={grade} inline />
                  {progress.grade_notes && <><br />Instructor note: {progress.grade_notes}</>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.25rem' }}>
          {ln > 1 && <Link to={`/program/week/${wn}/lab/${ln - 1}`} className="btn btn-ghost">← Lab {ln - 1}</Link>}
          <div style={{ flex: 1 }} />
          {ln < week.labCount && <Link to={`/program/week/${wn}/lab/${ln + 1}`} className="btn btn-ghost">Lab {ln + 1} →</Link>}
          {ln === week.labCount && <Link to={`/program/week/${wn + 1}`} className="btn btn-primary">Next Week →</Link>}
        </div>
      </div>
    </AppLayout>
  )
}

function StepVideo({ url }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ marginTop: 10 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, border: '1px solid var(--border2)', background: open ? 'var(--s3)' : 'var(--s2)', color: 'var(--text2)', fontSize: '0.73rem', fontWeight: 600, cursor: 'pointer' }}
      >
        <span style={{ fontSize: '0.8rem' }}>{open ? '▾' : '▶'}</span>
        {open ? 'Hide video' : 'Watch this step'}
      </button>
      {open && (
        <div style={{ marginTop: 10, borderRadius: 'var(--r)', overflow: 'hidden', border: '1px solid var(--border2)' }}>
          <VideoEmbed url={url} />
        </div>
      )}
    </div>
  )
}

function SlideShow({ labData, lab, week, wn, ln, stepVideos = {} }) {
  const [current, setCurrent] = useState(0)

  const slides = [
    { type: 'intro' },
    ...(labData.steps || []).map((step, i) => ({ type: 'step', step, i })),
    { type: 'deliverable' },
  ]

  const total = slides.length
  const slide = slides[current]
  const color = lab.isApplied ? 'var(--orange)' : week.color

  const prev = () => setCurrent(c => Math.max(0, c - 1))
  const next = () => setCurrent(c => Math.min(total - 1, c + 1))

  return (
    <div>
      {/* Slide area */}
      <div style={{ minHeight: 380, padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderBottom: '1px solid var(--border)' }}>

        {slide.type === 'intro' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 20, background: `${color}22`, color, fontWeight: 700, fontSize: '0.72rem', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Week {wn} · Lab {ln}</div>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.3rem,4vw,2rem)', marginBottom: 16, lineHeight: 1.2 }}>{lab.title}</h2>
            {labData.overview ? (
              <p style={{ fontSize: '0.88rem', color: 'var(--text2)', lineHeight: 1.7, maxWidth: 580, margin: '0 auto' }}>{labData.overview}</p>
            ) : (
              <p style={{ fontSize: '0.88rem', color: 'var(--muted)' }}>{lab.desc}</p>
            )}
            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>📋 {labData.steps?.length || 0} steps</span>
              {lab.isApplied && <span style={{ fontSize: '0.76rem', color: 'var(--orange)' }}>★ Applied Lab</span>}
            </div>
          </div>
        )}

        {slide.type === 'step' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: slide.step.featured ? 'var(--orange-d)' : 'var(--s3)', border: slide.step.featured ? '2px solid var(--orange-b)' : '2px solid var(--border2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1rem', color: slide.step.featured ? 'var(--orange)' : 'var(--muted)', fontFamily: 'DM Mono', flexShrink: 0 }}>{slide.i + 1}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)', fontFamily: 'DM Mono' }}>STEP {slide.i + 1} OF {labData.steps.length}</div>
            </div>
            <h3 style={{ fontWeight: 800, fontSize: 'clamp(1rem,3vw,1.35rem)', marginBottom: 14, lineHeight: 1.3 }}>{slide.step.action}</h3>
            <div style={{ fontSize: '0.84rem', color: 'var(--text2)', lineHeight: 1.75 }} dangerouslySetInnerHTML={{ __html: slide.step.detail.replace(/`([^`]+)`/g, '<code style="font-family:DM Mono;background:var(--s3);padding:2px 7px;border-radius:3px;font-size:0.82em;color:#38d9c0">$1</code>') }} />
            {slide.step.tip && (
              <div style={{ marginTop: 16, padding: '10px 14px', background: 'var(--yellow-d)', borderLeft: '3px solid var(--yellow)', borderRadius: '0 6px 6px 0', fontSize: '0.78rem', color: 'var(--yellow)' }}>💡 {slide.step.tip}</div>
            )}
            {slide.step.warn && (
              <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(239,68,68,0.08)', borderLeft: '3px solid var(--danger)', borderRadius: '0 6px 6px 0', fontSize: '0.78rem', color: 'var(--danger)' }}>⚠ {slide.step.warn}</div>
            )}
            {(stepVideos[slide.i] || slide.step.videoUrl) && (
              <div style={{ marginTop: 16 }}>
                <StepVideo url={stepVideos[slide.i] || slide.step.videoUrl} />
              </div>
            )}
          </div>
        )}

        {slide.type === 'deliverable' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>📤</div>
            <h3 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: 12 }}>What to Submit</h3>
            <div style={{ fontSize: '0.86rem', color: 'var(--text2)', lineHeight: 1.7, maxWidth: 560, margin: '0 auto', padding: '16px 20px', background: 'var(--s2)', borderRadius: 'var(--r)', border: '1px solid var(--border2)' }}>
              {labData.deliverable || `File: LAB${ln}_YourName_W${wn} — Submit via the Submit Work tab. Pass/Fail based on completion + rubric criteria.`}
            </div>
            <div style={{ marginTop: 16, fontSize: '0.78rem', color: 'var(--muted)' }}>Go to the <strong>Submit</strong> tab when ready.</div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem' }}>
        <button className="btn btn-ghost btn-sm" onClick={prev} disabled={current === 0}>← Prev</button>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', flex: 1, padding: '0 12px' }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? 20 : 8, height: 8, borderRadius: 4, background: i === current ? color : 'var(--border2)', border: 'none', cursor: 'pointer', transition: 'all 0.2s', padding: 0, flexShrink: 0 }} />
          ))}
        </div>

        <button className="btn btn-ghost btn-sm" onClick={next} disabled={current === total - 1}>Next →</button>
      </div>

      {/* Slide counter */}
      <div style={{ textAlign: 'center', paddingBottom: '0.75rem', fontSize: '0.7rem', color: 'var(--muted)', fontFamily: 'DM Mono' }}>
        {current + 1} / {total}
      </div>
    </div>
  )
}

function VideoEmbed({ url }) {
  const getEmbedUrl = (url) => {
    if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/')
    if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'www.youtube.com/embed/')
    if (url.includes('loom.com/share/')) return url.replace('/share/', '/embed/')
    return url
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

function dayStyle(day) {
  const map = { Mon: { background: 'rgba(59,130,246,0.12)', color: '#3B82F6' }, Tue: { background: 'rgba(234,179,8,0.12)', color: '#EAB308' }, Wed: { background: 'rgba(34,197,94,0.12)', color: '#22C55E' }, Thu: { background: 'rgba(249,115,22,0.12)', color: '#F97316' } }
  return { ...map[day], padding: '3px 9px', borderRadius: 20, fontSize: '0.62rem', fontWeight: 700, display: 'inline-block', textTransform: 'uppercase', letterSpacing: '0.05em' }
}
