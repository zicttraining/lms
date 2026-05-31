// ResumeBuilder.jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../../lib/AuthContext'
import { supabase } from '../../lib/supabase'
import AppLayout from '../../components/layout/AppLayout'

export default function ResumeBuilder() {
  const { profile } = useAuth()
  const [resumes, setResumes] = useState([])
  const [active, setActive] = useState(null)
  const [form, setForm] = useState({ version_name: '', target_role: '', content: { summary: '', experience: '', skills: '', education: '', certifications: '' } })
  const [jobDesc, setJobDesc] = useState('')
  const [atsScore, setAtsScore] = useState(null)
  const [saving, setSaving] = useState(false)
  const [scoring, setScoring] = useState(false)

  useEffect(() => { load() }, [profile?.id])

  async function load() {
    const { data } = await supabase.from('resumes').select('*').eq('user_id', profile.id).order('created_at', { ascending: false })
    setResumes(data || [])
    if (data?.length && !active) setActive(data[0])
  }

  async function save() {
    setSaving(true)
    const payload = { ...form, user_id: profile.id, ats_score: atsScore, updated_at: new Date().toISOString() }
    if (active?.id && !active.isNew) await supabase.from('resumes').update(payload).eq('id', active.id)
    else await supabase.from('resumes').insert(payload)
    load(); setSaving(false)
  }

  function calcATS() {
    if (!jobDesc || !form.content.skills) { alert('Add your skills section and a job description to score.'); return }
    setScoring(true)
    setTimeout(() => {
      const jdWords = jobDesc.toLowerCase().split(/\W+/).filter(w => w.length > 3)
      const resumeText = Object.values(form.content).join(' ').toLowerCase()
      const matches = jdWords.filter(w => resumeText.includes(w))
      const score = Math.min(99, Math.round((matches.length / Math.max(jdWords.length, 1)) * 100) + 15)
      setAtsScore(score)
      setScoring(false)
    }, 1500)
  }

  const content = active?.content || form.content
  const setContent = (field, val) => setForm(prev => ({ ...prev, content: { ...prev.content, [field]: val } }))

  return (
    <AppLayout>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: 4 }}>Resume Builder 📄</h1>
            <p style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>Build ATS-optimized resumes for each target role</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => { setActive({ isNew: true }); setForm({ version_name: '', target_role: '', content: { summary: '', experience: '', skills: '', education: '', certifications: '' } }); setAtsScore(null) }}>+ New Resume Version</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1rem' }}>
          {/* Versions */}
          <div className="card" style={{ padding: '0.75rem' }}>
            <div className="section-label" style={{ padding: '0 0.25rem' }}>Resume Versions</div>
            {resumes.map(r => (
              <div key={r.id} onClick={() => { setActive(r); setForm({ ...r }); setAtsScore(r.ats_score) }}
                style={{ padding: '8px 10px', borderRadius: 7, cursor: 'pointer', marginBottom: 4, background: active?.id === r.id ? 'var(--orange-d)' : 'transparent', border: `1px solid ${active?.id === r.id ? 'var(--orange-b)' : 'transparent'}` }}>
                <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{r.version_name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{r.target_role}</div>
                {r.ats_score && <div style={{ fontSize: '0.68rem', color: r.ats_score >= 70 ? 'var(--green)' : r.ats_score >= 50 ? 'var(--yellow)' : 'var(--danger)', marginTop: 3 }}>ATS: {r.ats_score}%</div>}
              </div>
            ))}
            {resumes.length === 0 && <div style={{ fontSize: '0.76rem', color: 'var(--muted)', padding: '0.5rem' }}>No resumes yet</div>}
          </div>

          {/* Editor */}
          <div>
            {active ? (
              <div className="card card-p">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div className="form-group"><label className="form-label">Version Name</label><input className="input" value={form.version_name} onChange={e => setForm({ ...form, version_name: e.target.value })} placeholder="e.g. HR Specialist v1" /></div>
                  <div className="form-group"><label className="form-label">Target Role</label><input className="input" value={form.target_role} onChange={e => setForm({ ...form, target_role: e.target.value })} placeholder="HR Assistant" /></div>
                </div>
                {[['summary', 'Professional Summary', 'A results-driven professional with AI skills…', 3], ['skills', 'Skills (match job keywords here)', 'ChatGPT, Google Workspace, Microsoft 365, Zapier, HRIS systems…', 3], ['experience', 'Work Experience', 'Include: Role · Company · Dates\n• Achievement with numbers\n• AI tools used\n• Results delivered', 6], ['education', 'Education & Training', 'ZICT Applied AI Certificate, 2024\nBA Communications, …', 3], ['certifications', 'Certifications', 'ZICT Applied AI (2024), Google AI Essentials (2024), Microsoft AI-900 (2024)', 2]].map(([field, label, placeholder, rows]) => (
                  <div key={field} className="form-group" style={{ marginBottom: '0.75rem' }}>
                    <label className="form-label">{label}</label>
                    <textarea className="input textarea" rows={rows} value={form.content[field] || ''} onChange={e => setContent(field, e.target.value)} placeholder={placeholder} />
                  </div>
                ))}

                {/* ATS scorer */}
                <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--s2)', borderRadius: 'var(--r)', borderLeft: '3px solid var(--orange)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: 8 }}>ATS Score Checker</div>
                  <textarea className="input textarea" rows={4} placeholder="Paste the job description here to check how well your resume matches…" value={jobDesc} onChange={e => setJobDesc(e.target.value)} style={{ marginBottom: 10 }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button className="btn btn-secondary btn-sm" onClick={calcATS} disabled={scoring}>{scoring ? '⏳ Scoring…' : '🎯 Check ATS Score'}</button>
                    {atsScore !== null && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <svg width={50} height={50} viewBox="0 0 50 50">
                          <circle cx={25} cy={25} r={20} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={5} />
                          <circle cx={25} cy={25} r={20} fill="none" stroke={atsScore >= 70 ? 'var(--green)' : atsScore >= 50 ? 'var(--yellow)' : 'var(--danger)'} strokeWidth={5}
                            strokeDasharray={`${2 * Math.PI * 20}`} strokeDashoffset={`${2 * Math.PI * 20 * (1 - atsScore / 100)}`}
                            strokeLinecap="round" transform="rotate(-90 25 25)" />
                          <text x={25} y={29} textAnchor="middle" fill="white" fontSize={10} fontWeight={800} fontFamily="Plus Jakarta Sans">{atsScore}%</text>
                        </svg>
                        <div style={{ fontSize: '0.76rem', color: atsScore >= 70 ? 'var(--green)' : atsScore >= 50 ? 'var(--yellow)' : 'var(--danger)' }}>
                          {atsScore >= 70 ? '✅ Strong match' : atsScore >= 50 ? '⚠ Add more keywords' : '❌ Low match — add more job keywords to skills & summary'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: '1.25rem' }}>
                  <button className="btn btn-primary" onClick={save} disabled={saving || !form.version_name}>{saving ? 'Saving…' : '💾 Save Resume'}</button>
                  <a href={`https://docs.google.com/document/create`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">Open in Google Docs ↗</a>
                </div>
              </div>
            ) : <div className="card card-p" style={{ textAlign: 'center', color: 'var(--muted)', padding: '3rem' }}><div style={{ fontSize: '2rem', marginBottom: 8 }}>📄</div>Select a resume version or create a new one</div>}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
