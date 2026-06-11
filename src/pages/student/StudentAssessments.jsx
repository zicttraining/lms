// StudentAssessments.jsx — Student view, submission, and grade tracking for project assessments
import { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useAuth } from '../../lib/AuthContext'
import { supabase } from '../../lib/supabase'
import { CAREER_TRACKS } from '../../lib/programData'
import { getScoreLevel, TRACK_INTEL, getImprovementSuggestions } from '../../lib/careerIntel'
import AppLayout from '../../components/layout/AppLayout'

const DIFFICULTY_COLORS = {
  beginner: { bg: 'rgba(34,197,94,0.12)', color: '#22C55E', label: 'Beginner' },
  intermediate: { bg: 'rgba(249,115,22,0.12)', color: '#F97316', label: 'Intermediate' },
  advanced: { bg: 'rgba(239,68,68,0.12)', color: '#EF4444', label: 'Advanced' },
}
const TYPE_ICONS = { project: '🔨', reflection: '💭', portfolio: '📁', case_study: '📊' }
const TYPE_LABELS = { project: 'Project', reflection: 'Reflection', portfolio: 'Portfolio', case_study: 'Case Study' }

export default function StudentAssessments() {
  const { profile } = useAuth()
  const [assessments, setAssessments] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null) // assessment object being viewed
  const [filterType, setFilterType] = useState('all') // 'all' | 'general' | 'track'
  const [filterStatus, setFilterStatus] = useState('all') // 'all' | 'pending' | 'pass' | 'fail' | 'new'

  useEffect(() => {
    if (profile?.id) loadData()
  }, [profile?.id])

  async function loadData() {
    const [{ data: asmt }, { data: subs }] = await Promise.all([
      supabase.from('assessments').select('*').eq('active', true).order('created_at', { ascending: false }),
      supabase.from('assessment_submissions').select('*').eq('user_id', profile.id),
    ])
    const all = asmt || []
    // Filter: show general (no specialization) OR matching student's career track
    const visible = all.filter(a =>
      !a.specialization || a.specialization.length === 0 ||
      (profile.career_track && a.specialization.includes(profile.career_track))
    )
    setAssessments(visible)
    setSubmissions(subs || [])
    setLoading(false)
  }

  function getSubmission(assessmentId) {
    return submissions.find(s => s.assessment_id === assessmentId)
  }

  // Apply display filters
  const filtered = assessments.filter(a => {
    const sub = getSubmission(a.id)
    const isGeneral = !a.specialization || a.specialization.length === 0
    if (filterType === 'general' && !isGeneral) return false
    if (filterType === 'track' && isGeneral) return false
    if (filterStatus === 'new' && sub) return false
    if (filterStatus === 'pending' && sub?.grade !== 'pending') return false
    if (filterStatus === 'pass' && sub?.grade !== 'pass') return false
    if (filterStatus === 'fail' && sub?.grade !== 'fail') return false
    return true
  })

  const trackInfo = CAREER_TRACKS.find(t => t.id === profile?.career_track)
  const trackIntel = TRACK_INTEL[profile?.career_track]
  const totalAssessments = assessments.length
  const submitted = submissions.length
  const passed = submissions.filter(s => s.grade === 'pass').length
  const fails = submissions.filter(s => s.grade === 'fail').length
  const totalScore = submissions.filter(s => s.grade === 'pass').reduce((sum, s) => sum + (s.score || 0), 0)
  const scoreLevel = getScoreLevel(totalScore)
  const improvements = getImprovementSuggestions(profile?.career_track, profile?.skill_level || 'beginner', fails, totalScore, totalAssessments, passed)

  if (loading) return <AppLayout><div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="loader" /></div></AppLayout>

  return (
    <AppLayout>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '1.5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: 4 }}>My Assessments</h1>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>Applied, real-world projects for your career track</span>
            {trackInfo && <span style={{ background: 'rgba(249,115,22,0.1)', color: 'var(--orange)', padding: '2px 10px', borderRadius: 10, fontSize: '0.68rem', fontWeight: 700 }}>{trackInfo.label}</span>}
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: '1rem' }}>
          {[
            { label: 'Available', value: totalAssessments, color: 'var(--text)' },
            { label: 'Submitted', value: submitted, color: 'var(--orange)' },
            { label: 'Passed', value: passed, color: 'var(--green)' },
            { label: 'Total Score', value: totalScore + 'pts', color: scoreLevel.color },
          ].map(stat => (
            <div key={stat.label} className="card" style={{ padding: '12px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: '0.64rem', color: 'var(--muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</div>
            </div>
          ))}
        </div>
        {/* Level badge */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span style={{ background: `${scoreLevel.color}18`, color: scoreLevel.color, padding: '4px 12px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, border: `1px solid ${scoreLevel.color}30` }}>
            🏆 {scoreLevel.label}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text2)' }}>{scoreLevel.desc}</span>
        </div>

        {/* Improvement suggestions */}
        {improvements.length > 0 && !selected && (
          <div style={{ padding: '12px 14px', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.74rem', color: 'var(--orange)', marginBottom: 8 }}>💡 What to focus on next</div>
            {improvements.map((imp, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: '0.76rem', color: 'var(--text2)', lineHeight: 1.5 }}>
                <span>{imp.icon}</span><span>{imp.text}</span>
              </div>
            ))}
          </div>
        )}

        {selected ? (
          <AssessmentDetail
            assessment={selected}
            submission={getSubmission(selected.id)}
            profile={profile}
            onBack={() => { setSelected(null); loadData() }}
            onSubmitted={loadData}
          />
        ) : (
          <>
            {/* Filters */}
            <div style={{ display: 'flex', gap: 6, marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Show:</span>
              {[
                { id: 'all', label: 'All' },
                { id: 'general', label: 'General' },
                { id: 'track', label: 'My Track' },
              ].map(f => (
                <button key={f.id} onClick={() => setFilterType(f.id)}
                  className={`btn btn-sm ${filterType === f.id ? 'btn-secondary' : 'btn-ghost'}`}
                  style={{ fontSize: '0.72rem' }}>{f.label}</button>
              ))}
              <span style={{ fontSize: '0.72rem', color: 'var(--muted)', marginLeft: 6 }}>Status:</span>
              {[
                { id: 'all', label: 'All' },
                { id: 'new', label: 'Not Started' },
                { id: 'pending', label: 'Awaiting Grade' },
                { id: 'pass', label: 'Passed' },
                { id: 'fail', label: 'Needs Revision' },
              ].map(f => (
                <button key={f.id} onClick={() => setFilterStatus(f.id)}
                  className={`btn btn-sm ${filterStatus === f.id ? 'btn-secondary' : 'btn-ghost'}`}
                  style={{ fontSize: '0.72rem' }}>{f.label}</button>
              ))}
            </div>

            {/* Assessment cards */}
            {filtered.length === 0 ? (
              <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>📝</div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>No assessments match this filter</div>
                <div style={{ fontSize: '0.78rem' }}>Your instructor will publish assessments as the program progresses.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filtered.map(a => {
                  const sub = getSubmission(a.id)
                  const isGeneral = !a.specialization || a.specialization.length === 0
                  const dc = DIFFICULTY_COLORS[a.difficulty] || DIFFICULTY_COLORS.intermediate
                  return (
                    <div key={a.id} className="card" style={{ padding: '16px 18px', cursor: 'pointer', borderLeft: `3px solid ${sub?.grade === 'pass' ? 'var(--green)' : sub ? 'var(--orange)' : 'var(--border2)'}`, transition: 'border-color 0.2s' }}
                      onClick={() => setSelected(a)}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8, alignItems: 'center' }}>
                            <span style={{ fontSize: '0.86rem', fontWeight: 700 }}>{TYPE_ICONS[a.type]} {a.title}</span>
                          </div>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                            <span style={{ ...dc, padding: '2px 8px', borderRadius: 10, fontSize: '0.63rem', fontWeight: 700 }}>{dc.label}</span>
                            <span style={{ background: 'var(--s3)', color: 'var(--muted)', padding: '2px 8px', borderRadius: 10, fontSize: '0.63rem' }}>{TYPE_LABELS[a.type]}</span>
                            {isGeneral
                              ? <span style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6', padding: '2px 8px', borderRadius: 10, fontSize: '0.63rem', fontWeight: 600 }}>General</span>
                              : <span style={{ background: 'rgba(249,115,22,0.1)', color: 'var(--orange)', padding: '2px 8px', borderRadius: 10, fontSize: '0.63rem', fontWeight: 600 }}>Your Track</span>
                            }
                            {a.week_context && <span style={{ background: 'var(--s3)', color: 'var(--muted)', padding: '2px 8px', borderRadius: 10, fontSize: '0.63rem' }}>Week {a.week_context}</span>}
                          </div>
                          {a.description && <div style={{ fontSize: '0.78rem', color: 'var(--text2)', lineHeight: 1.55 }}>{a.description}</div>}
                          <div style={{ display: 'flex', gap: 14, fontSize: '0.68rem', color: 'var(--muted)', marginTop: 8 }}>
                            <span>~{a.estimated_hours}h to complete</span>
                            <span>{(a.instructions || []).length} steps</span>
                            {a.rubric?.length > 0 && <span>{a.rubric.length} rubric criteria</span>}
                          </div>
                        </div>
                        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                          <GradeBadge grade={sub?.grade} score={sub?.score} />
                          <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>View →</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  )
}

// ── Assessment Detail View ────────────────────────────────────
function AssessmentDetail({ assessment: a, submission, profile, onBack, onSubmitted }) {
  const [activeTab, setActiveTab] = useState('guide')
  const [submitType, setSubmitType] = useState('url')
  const [submitText, setSubmitText] = useState(submission?.submission_text || '')
  const [submitLink, setSubmitLink] = useState(submission?.submission_url || '')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [msg, setMsg] = useState('')

  const isGeneral = !a.specialization || a.specialization.length === 0
  const dc = DIFFICULTY_COLORS[a.difficulty] || DIFFICULTY_COLORS.intermediate

  const onDrop = useCallback(async (files) => {
    if (!files[0]) return
    setUploading(true)
    const file = files[0]
    const path = `${profile.id}/assessments/${a.id}/${file.name}`
    const { data, error } = await supabase.storage.from('submissions').upload(path, file, { upsert: true })
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('submissions').getPublicUrl(path)
      setSubmitLink(publicUrl)
      setUploadedFile(file.name)
      setSubmitType('file')
    }
    setUploading(false)
  }, [profile?.id, a.id])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1, maxSize: 50 * 1024 * 1024 })

  async function handleSubmit() {
    if (!submitText && !submitLink) { setMsg('Please add your submission before submitting.'); return }
    setSubmitting(true)
    const payload = {
      assessment_id: a.id,
      user_id: profile.id,
      submission_text: submitType === 'text' ? (submitText || null) : (notes || null),
      submission_url: submitLink || null,
      submission_type: submitType,
      grade: 'pending',
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    const { error } = submission
      ? await supabase.from('assessment_submissions').update(payload).eq('id', submission.id)
      : await supabase.from('assessment_submissions').insert(payload)

    if (!error) {
      // Notify instructors
      const { data: admins } = await supabase.from('profiles').select('id').in('role', ['admin', 'instructor'])
      if (admins?.length) {
        await supabase.from('notifications').insert(admins.map(adm => ({
          user_id: adm.id,
          title: `Assessment submitted: ${profile.full_name}`,
          body: a.title,
          type: 'grade',
          link: '/admin/assessments',
        })))
      }
      setMsg('✅ Submitted! Your instructor will review and grade this project.')
      onSubmitted()
    } else {
      setMsg('Error submitting. Please try again.')
    }
    setSubmitting(false)
  }

  return (
    <div>
      {/* Back button */}
      <button onClick={onBack} className="btn btn-ghost btn-sm" style={{ marginBottom: '1rem', fontSize: '0.78rem' }}>← Back to Assessments</button>

      {/* Header card */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem', borderTop: `3px solid ${dc.color}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
              <span style={{ ...dc, padding: '3px 10px', borderRadius: 10, fontSize: '0.68rem', fontWeight: 700 }}>{dc.label}</span>
              <span style={{ background: 'var(--s3)', color: 'var(--muted)', padding: '3px 10px', borderRadius: 10, fontSize: '0.68rem' }}>{TYPE_ICONS[a.type]} {TYPE_LABELS[a.type]}</span>
              {isGeneral
                ? <span style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6', padding: '3px 10px', borderRadius: 10, fontSize: '0.68rem', fontWeight: 600 }}>General</span>
                : <span style={{ background: 'rgba(249,115,22,0.1)', color: 'var(--orange)', padding: '3px 10px', borderRadius: 10, fontSize: '0.68rem', fontWeight: 600 }}>Your Track</span>
              }
              {a.week_context && <span style={{ background: 'var(--s3)', color: 'var(--muted)', padding: '3px 10px', borderRadius: 10, fontSize: '0.68rem' }}>Week {a.week_context}</span>}
            </div>
            <h1 style={{ fontSize: 'clamp(1.1rem,3vw,1.5rem)', fontWeight: 800, marginBottom: 8 }}>{TYPE_ICONS[a.type]} {a.title}</h1>
            {a.description && <p style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.6, marginBottom: 8 }}>{a.description}</p>}
            <div style={{ display: 'flex', gap: 16, fontSize: '0.72rem', color: 'var(--muted)' }}>
              <span>~{a.estimated_hours} hours to complete</span>
              {a.instructions?.length > 0 && <span>{a.instructions.length} guided steps</span>}
              {a.rubric?.length > 0 && <span>{a.rubric.length} rubric criteria</span>}
            </div>
          </div>
          <div style={{ flexShrink: 0, textAlign: 'center' }}>
            {submission && (
              <div>
                <GradeBadge grade={submission.grade} score={submission.score} />
                {submission.grade_notes && <div style={{ fontSize: '0.72rem', color: 'var(--text2)', marginTop: 6, maxWidth: 180, lineHeight: 1.5 }}>{submission.grade_notes}</div>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-bar" style={{ top: 58, borderRadius: 'var(--r) var(--r) 0 0', marginBottom: 0 }}>
        {[
          ['guide', '📋 Guide'],
          ...(a.rubric?.length > 0 ? [['rubric', '📊 Rubric']] : []),
          ['submit', '📤 Submit'],
        ].map(([id, label]) => (
          <button key={id} className={`tab-btn ${activeTab === id ? 'active' : ''}`} onClick={() => setActiveTab(id)}>{label}</button>
        ))}
      </div>

      <div className="card" style={{ padding: '1.5rem', borderRadius: '0 0 var(--r-lg) var(--r-lg)' }}>

        {/* Guide tab */}
        {activeTab === 'guide' && (
          <div>
            {(a.instructions || []).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)', fontSize: '0.85rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>📋</div>
                Your instructor will provide detailed instructions for this assessment. Check the Submit tab to get started.
              </div>
            ) : (
              <div>
                <div className="section-label" style={{ marginBottom: '1rem' }}>Step-by-Step Instructions</div>
                {a.instructions.map((step, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '36px 1fr', gap: 12, padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--s3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'var(--orange)', flexShrink: 0, fontFamily: 'DM Mono' }}>{i + 1}</div>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 6, fontSize: '0.9rem' }}>{step.action}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text2)', lineHeight: 1.65 }}
                        dangerouslySetInnerHTML={{ __html: (step.detail || '').replace(/`([^`]+)`/g, '<code style="font-family:DM Mono;background:var(--s3);padding:1px 6px;border-radius:3px;font-size:0.82em;color:#38d9c0">$1</code>') }} />
                      {step.tip && <div style={{ marginTop: 8, padding: '6px 12px', background: 'var(--yellow-d)', borderLeft: '2px solid var(--yellow)', borderRadius: '0 4px 4px 0', fontSize: '0.76rem', color: 'var(--yellow)', lineHeight: 1.5 }}>💡 {step.tip}</div>}
                      {step.warn && <div style={{ marginTop: 8, padding: '6px 12px', background: 'rgba(239,68,68,0.08)', borderLeft: '2px solid var(--danger)', borderRadius: '0 4px 4px 0', fontSize: '0.76rem', color: 'var(--danger)', lineHeight: 1.5 }}>⚠ {step.warn}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {a.deliverable && (
              <div style={{ marginTop: '1.5rem', padding: '1rem 1.25rem', background: 'var(--s2)', borderRadius: 'var(--r)', border: '1px solid var(--border2)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--orange)', marginBottom: 6 }}>📤 What to Submit</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text2)', lineHeight: 1.65 }}>{a.deliverable}</div>
              </div>
            )}
          </div>
        )}

        {/* Rubric tab */}
        {activeTab === 'rubric' && (
          <div>
            <div className="section-label" style={{ marginBottom: '1rem' }}>Grading Rubric</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text2)', marginBottom: '1rem', lineHeight: 1.6 }}>
              Your instructor will evaluate your submission against these criteria. A pass requires meeting most criteria well.
            </div>
            {(a.rubric || []).map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--orange-d)', border: '1px solid var(--orange-b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: 'var(--orange)', flexShrink: 0 }}>{i + 1}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.84rem', marginBottom: 3 }}>{r.criterion}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text2)', lineHeight: 1.55 }}>{r.description}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Submit tab */}
        {activeTab === 'submit' && (
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Submit Your Work</h3>

            {submission?.grade === 'pass' ? (
              <div style={{ padding: '1.5rem', background: 'var(--green-d)', border: '1px solid var(--green-b)', borderRadius: 'var(--r)', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>🎉</div>
                <div style={{ fontWeight: 700, color: 'var(--green)', marginBottom: 4 }}>Assessment Passed!</div>
                {submission.score != null && (
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--orange)', margin: '8px 0' }}>{submission.score}<span style={{ fontSize: '0.9rem', color: 'var(--muted)' }}> / {a.max_score || 100} pts</span></div>
                )}
                {submission.grade_notes && <div style={{ fontSize: '0.8rem', color: 'var(--text2)', marginTop: 4 }}>{submission.grade_notes}</div>}
                <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 8 }}>Graded {new Date(submission.graded_at).toLocaleDateString()}</div>
              </div>
            ) : (
              <>
                {submission?.grade === 'fail' && (
                  <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, marginBottom: '1rem', fontSize: '0.8rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--danger)', marginBottom: 4 }}>📝 Revision Required</div>
                    <div style={{ color: 'var(--text2)' }}>{submission.grade_notes || 'Your instructor has requested revisions. Please update your submission below.'}</div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                  {[['url', '🔗 Google Doc / Link'], ['text', '✍️ Write response'], ['file', '📁 Upload file']].map(([type, label]) => (
                    <button key={type} className={`btn btn-sm ${submitType === type ? 'btn-secondary' : 'btn-ghost'}`} onClick={() => setSubmitType(type)}>{label}</button>
                  ))}
                </div>

                {submitType === 'url' && (
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Google Doc / Link / URL</label>
                    <input className="input" type="url" placeholder="https://docs.google.com/…" value={submitLink} onChange={e => setSubmitLink(e.target.value)} />
                    <span className="form-hint">Paste your Google Doc, Slides, or any shareable link. Set sharing to "Anyone with link can view."</span>
                  </div>
                )}

                {submitType === 'text' && (
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Your response</label>
                    <textarea className="input textarea" rows={8} placeholder="Write your response here…" value={submitText} onChange={e => setSubmitText(e.target.value)} style={{ minHeight: 200 }} />
                  </div>
                )}

                {submitType === 'file' && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                      <input {...getInputProps()} />
                      {uploading ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', color: 'var(--orange)' }}><div className="loader-sm" /> Uploading…</div>
                      ) : uploadedFile ? (
                        <div style={{ color: 'var(--green)' }}>✅ {uploadedFile} uploaded</div>
                      ) : (
                        <div>
                          <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>📁</div>
                          <div style={{ fontWeight: 600, marginBottom: 4 }}>Upload your file</div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>Drag & drop or click · Max 50MB · PDF, DOCX, XLSX, PNG</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label">Notes for instructor (optional)</label>
                  <textarea className="input" rows={3} placeholder="Any context, questions, or notes for your instructor…" value={notes} onChange={e => setNotes(e.target.value)} />
                </div>

                {msg && <div style={{ padding: '10px 14px', borderRadius: 8, background: msg.startsWith('✅') ? 'var(--green-d)' : 'rgba(239,68,68,0.08)', border: `1px solid ${msg.startsWith('✅') ? 'var(--green-b)' : 'rgba(239,68,68,0.2)'}`, color: msg.startsWith('✅') ? 'var(--green)' : 'var(--danger)', fontSize: '0.8rem', marginBottom: '1rem' }}>{msg}</div>}

                <button className="btn btn-primary" onClick={handleSubmit}
                  disabled={submitting || (submitType === 'text' ? !submitText.trim() : !submitLink.trim())}
                  style={{ width: '100%' }}>
                  {submitting ? <><div className="loader-sm" /> Submitting…</> : submission ? '✏️ Update Submission' : '✅ Submit Assessment'}
                </button>

                {submission && submission.grade === 'pending' && (
                  <div style={{ marginTop: '1rem', padding: '10px 14px', background: 'var(--s2)', borderRadius: 8, borderLeft: '3px solid var(--yellow)', fontSize: '0.78rem', color: 'var(--text2)' }}>
                    ⏳ Submitted {new Date(submission.submitted_at).toLocaleString()} — awaiting instructor review
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function GradeBadge({ grade, score }) {
  if (!grade) return <span className="badge badge-gray" style={{ fontSize: '0.64rem' }}>Not Started</span>
  const map = {
    pass: ['badge-green', `✅ Passed${score ? ` · ${score}pts` : ''}`],
    fail: ['badge-red', '📝 Needs Revision'],
    pending: ['badge-yellow', '⏳ Awaiting Grade'],
  }
  const [cls, label] = map[grade] || ['badge-gray', '—']
  return <span className={`badge ${cls}`} style={{ fontSize: '0.64rem' }}>{label}</span>
}
