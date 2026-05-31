import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../lib/AuthContext'
import { supabase } from '../../lib/supabase'
import AppLayout from '../../components/layout/AppLayout'
import { WEEKS, getWeekStatus, LAB_DATA } from '../../lib/programData'

export default function LabView() {
  const { weekNum, labNum } = useParams()
  const wn = parseInt(weekNum), ln = parseInt(labNum)
  const week = WEEKS[wn - 1]
  const lab = week?.labs[ln - 1]
  const { profile } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [progress, setProgress] = useState(null)
  const [allProgress, setAllProgress] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [submitText, setSubmitText] = useState('')
  const [submitLink, setSubmitLink] = useState('')
  const [submitType, setSubmitType] = useState('text')
  const [uploadedFile, setUploadedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')
  const [activeTab, setActiveTab] = useState('guide')
  const [videoUrl, setVideoUrl] = useState('')

  const labData = LAB_DATA[`w${wn}l${ln}`] || {}

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
    if (existing?.submission_text) setSubmitText(existing.submission_text)
    if (existing?.submission_url) setSubmitLink(existing.submission_url)
    if (existing?.submission_type) setSubmitType(existing.submission_type)
    // Fetch video URL
    const { data: sess } = await supabase.from('class_sessions').select('recording_url').eq('week_num', wn).limit(1).single()
    if (sess?.recording_url) setVideoUrl(sess.recording_url)
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
      submission_text: submitText || null,
      submission_url: submitLink || null,
      submission_type: submitType,
      grade: 'pending',
    }
    const { error } = progress
      ? await supabase.from('progress').update(payload).eq('id', progress.id)
      : await supabase.from('progress').insert(payload)

    if (!error) {
      // Send notification to instructor
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
          {[['guide', '📋 Step-by-Step Guide'], ['submit', '📤 Submit Work'], ...(videoUrl ? [['video', '🎬 Video Guide']] : [])].map(([id, label]) => (
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
                {labData.steps.map((step, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '36px 1fr', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: step.featured ? 'var(--orange-d)' : 'var(--s3)', border: step.featured ? '1px solid var(--orange-b)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 700, color: step.featured ? 'var(--orange)' : 'var(--muted)', flexShrink: 0, fontFamily: 'DM Mono' }}>{i + 1}</div>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 4, fontSize: '0.88rem' }}>{step.action}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text2)', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: step.detail.replace(/`([^`]+)`/g, '<code style="font-family:DM Mono;background:var(--s3);padding:1px 6px;border-radius:3px;font-size:0.8em;color:#38d9c0">$1</code>') }} />
                      {step.tip && <div style={{ marginTop: 6, padding: '6px 10px', background: 'var(--yellow-d)', borderLeft: '2px solid var(--yellow)', borderRadius: '0 4px 4px 0', fontSize: '0.74rem', color: 'var(--yellow)' }}>💡 {step.tip}</div>}
                      {step.warn && <div style={{ marginTop: 6, padding: '6px 10px', background: 'rgba(239,68,68,0.08)', borderLeft: '2px solid var(--danger)', borderRadius: '0 4px 4px 0', fontSize: '0.74rem', color: 'var(--danger)' }}>⚠ {step.warn}</div>}
                    </div>
                  </div>
                ))}
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
              <textarea className="input" placeholder="Any notes, questions, or context for your instructor…" value={submitText} onChange={e => setSubmitText(e.target.value)} rows={3} />
            </div>

            {msg && <div style={{ padding: '10px 14px', borderRadius: 8, background: msg.startsWith('✅') ? 'var(--green-d)' : 'rgba(239,68,68,0.08)', border: `1px solid ${msg.startsWith('✅') ? 'var(--green-b)' : 'rgba(239,68,68,0.2)'}`, color: msg.startsWith('✅') ? 'var(--green)' : 'var(--danger)', fontSize: '0.8rem', marginBottom: '1rem' }}>{msg}</div>}

            <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting || (!submitText && !submitLink)} style={{ width: '100%' }}>
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

        {/* Video tab */}
        {activeTab === 'video' && videoUrl && (
          <div className="card" style={{ padding: '1.5rem', borderRadius: '0 0 var(--r-lg) var(--r-lg)' }}>
            <div className="section-label">Video Guide</div>
            <VideoEmbed url={videoUrl} />
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
