import { useState } from 'react'
import { useAuth } from '../../lib/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'

const PROGRAMS = [
  { id: 'applied_ai',    label: 'Applied AI & Digital Productivity', icon: '🤖', color: '#F97316' },
  { id: 'aws',           label: 'AWS Cloud Architect Engineer',       icon: '☁️', color: '#3B82F6' },
  { id: 'cybersecurity', label: 'Cybersecurity Essentials',          icon: '🔐', color: '#EF4444' },
  { id: 'ai_ml',         label: 'AI / ML Foundations',               icon: '🧠', color: '#8B5CF6' },
  { id: 'mentorship',    label: 'Technical Mentorship & Placement',  icon: '🚀', color: '#22C55E' },
]

const WHY_OPTIONS = [
  'New job in tech or AI', 'Advance in current job', 'Start or grow a business',
  'Learn for personal growth', 'Career change', 'Other',
]

export default function Login() {
  const { signIn, updateLanguage } = useAuth()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [tab, setTab] = useState('login') // 'login' | 'request'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Request Access form state
  const [req, setReq] = useState({
    full_name: '', email: '', phone: '', program: 'applied_ai', role: 'student',
    preferred_language: 'en', why_joining: '', career_interest: '',
  })
  const [reqError, setReqError] = useState('')
  const [reqSuccess, setReqSuccess] = useState(false)
  const [reqLoading, setReqLoading] = useState(false)

  async function handleSignIn(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email.trim(), password)
    setLoading(false)
    if (error) {
      setError(error.message === 'Invalid login credentials'
        ? 'Email or password is incorrect. Contact your instructor or request access below.'
        : error.message)
    } else {
      navigate('/dashboard')
    }
  }

  async function handleRequestAccess(e) {
    e.preventDefault()
    if (!req.full_name || !req.email || !req.program) { setReqError('Please fill in all required fields.'); return }
    setReqLoading(true); setReqError('')
    const { error } = await supabase.from('account_requests').insert({
      full_name: req.full_name.trim(),
      email: req.email.trim().toLowerCase(),
      phone: req.phone || null,
      program: req.program,
      preferred_language: req.preferred_language,
      why_joining: req.why_joining || null,
      career_interest: req.career_interest || null,
    })
    setReqLoading(false)
    if (error) {
      setReqError(error.code === '23505' ? 'This email already has a pending request.' : `Error: ${error.message}`)
    } else {
      setReqSuccess(true)
    }
  }

  return (
    <div style={s.wrap}>
      <div style={s.bgGlow1} /><div style={s.bgGlow2} /><div style={s.bgGlow3} /><div style={s.bgGlow4} />

      {/* Left panel */}
      <div className="login-left" style={s.left}>
        <div style={s.leftContent}>
          <div style={s.logoRow}>
            <div style={s.logoMark}>Z</div>
            <div>
              <div style={s.logoText}>ZICT</div>
              <div style={s.logoSub}>Zicloud Technology Inc.</div>
            </div>
          </div>
          <h1 style={s.headline}>Professional<br /><span style={{ color: '#F97316', fontStyle: 'italic' }}>Technology</span> Training<br /><span style={{ color: '#EAB308' }}>& Certification</span></h1>
          <p style={s.tagline}>Industry-Ready Programs · Stackable Certificates</p>
          <p style={s.location}>📍 Denver, CO · WIOA/ETPL Eligible</p>
          <div style={s.certList}>
            {PROGRAMS.map((p, i) => (
              <div key={i} style={{ ...s.certItem, borderLeftColor: p.color }}>
                <span style={{ fontSize: '1rem', flexShrink: 0 }}>{p.icon}</span>
                <div style={{ fontSize: '0.78rem', color: '#0F172A', fontWeight: 600 }}>{p.label}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '2rem' }}>
            <div style={{ fontSize: '0.65rem', color: '#6B7A96', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('portalLanguage')}</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[['en', '🇺🇸 English'], ['ar', '🇸🇦 العربية'], ['fa', '🇮🇷 فارسی']].map(([code, label]) => (
                <button key={code} onClick={() => { i18n.changeLanguage(code); document.documentElement.dir = code !== 'en' ? 'rtl' : 'ltr'; updateLanguage(code) }}
                  style={{ padding: '5px 12px', borderRadius: 20, border: `1px solid ${i18n.language === code ? '#F97316' : 'rgba(15,23,42,0.12)'}`, background: i18n.language === code ? 'rgba(249,115,22,0.15)' : 'transparent', color: i18n.language === code ? '#F97316' : '#6B7A96', fontSize: '0.74rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="login-right" style={s.right}>
        <div style={s.formWrap} className="fade-up">
          {/* Logo (mobile only) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
            <div style={{ ...s.logoMark, width: 38, height: 38, fontSize: '1rem' }}>Z</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0F172A' }}>ZICT Portal</div>
              <div style={{ fontSize: '0.65rem', color: '#6B7A96', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Learning Management System</div>
            </div>
          </div>

          {/* Tab switcher */}
          <div style={{ display: 'flex', gap: 4, marginBottom: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: 4 }}>
            {[['login', '🔑 Sign In'], ['request', '✋ Request Access']].map(([id, label]) => (
              <button key={id} onClick={() => { setTab(id); setError(''); setReqError('') }}
                style={{ flex: 1, padding: '8px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.8rem', transition: 'all 0.2s', background: tab === id ? 'rgba(249,115,22,0.9)' : 'transparent', color: tab === id ? 'white' : '#6B7A96' }}>
                {label}
              </button>
            ))}
          </div>

          {/* ── Sign In ── */}
          {tab === 'login' && (
            <form onSubmit={handleSignIn}>
              <h2 style={s.formTitle}>{t('welcomeBack')} 👋</h2>
              <p style={s.formDesc}>{t('signInDescription')}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', margin: '1.25rem 0' }}>
                <div className="form-group">
                  <label className="form-label">{t('email')}</label>
                  <input type="email" required className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" autoComplete="email" />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('password')}</label>
                  <input type="password" required className="input" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
                </div>
              </div>
              {error && <div style={s.errorBox}><span>⚠</span> {error}</div>}
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', height: 48, fontSize: '0.92rem', borderRadius: 10 }}>
                {loading ? <><div className="loader-sm" style={{ marginRight: 8 }} />{t('signingIn')}</> : `${t('signIn')} →`}
              </button>
              <div style={s.helpBox}>
                <div>Don't have an account?</div>
                <button type="button" onClick={() => setTab('request')} style={{ color: '#F97316', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 700 }}>{t('requestAccess')} →</button>
              </div>
            </form>
          )}

          {/* ── Request Access ── */}
          {tab === 'request' && (
            reqSuccess ? (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                <h2 style={{ ...s.formTitle, fontSize: '1.3rem' }}>Request Submitted!</h2>
                <p style={{ ...s.formDesc, marginBottom: '1.5rem' }}>Your enrollment request has been received. Your instructor will review it and send you login credentials once approved. This usually takes 1–2 business days.</p>
                <div style={{ padding: '12px 16px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, fontSize: '0.8rem', color: '#22C55E', marginBottom: '1.5rem' }}>
                  ✅ Request submitted for <strong>{req.email}</strong>
                </div>
                <button className="btn btn-ghost" onClick={() => { setTab('login'); setReqSuccess(false) }} style={{ width: '100%' }}>← Back to Sign In</button>
              </div>
            ) : (
              <form onSubmit={handleRequestAccess}>
                <h2 style={s.formTitle}>Request Access ✋</h2>
                <p style={s.formDesc}>Fill in your details and your instructor will review your request and send login credentials.</p>
                
                {/* Role selector */}
                <div style={{ display: 'flex', gap: 6, marginBottom: '1.25rem', marginTop: '1rem' }}>
                  {[['student', '👤 Student'], ['instructor', '👨‍🏫 Teacher']].map(([role, label]) => (
                    <button key={role} type="button" onClick={() => setReq(r => ({ ...r, role }))}
                      style={{ flex: 1, padding: '10px', borderRadius: 8, border: `1px solid ${req.role === role ? '#F97316' : 'rgba(15,23,42,0.12)'}`, background: req.role === role ? 'rgba(249,115,22,0.15)' : 'transparent', color: req.role === role ? '#F97316' : '#475569', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit', fontWeight: req.role === role ? 700 : 400 }}>
                      {label}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', margin: '1.25rem 0' }}>
                  <div className="form-group">
                    <label className="form-label">{t('fullName')} *</label>
                    <input className="input" required value={req.full_name} onChange={e => setReq(r => ({ ...r, full_name: e.target.value }))} placeholder={t('fullNamePlaceholder')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('emailAddress')} *</label>
                    <input type="email" className="input" required value={req.email} onChange={e => setReq(r => ({ ...r, email: e.target.value }))} placeholder={t('emailAddressPlaceholder')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('phoneOptional')}</label>
                    <input type="tel" className="input" value={req.phone} onChange={e => setReq(r => ({ ...r, phone: e.target.value }))} placeholder={t('phoneOptionalPlaceholder')} />
                  </div>
                  
                  {/* Show program choice only for students */}
                  {req.role === 'student' && (
                    <div className="form-group">
                      <label className="form-label">{t('programEnroll')}</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                        {PROGRAMS.map(p => (
                          <button key={p.id} type="button" onClick={() => setReq(r => ({ ...r, program: p.id }))}
                            style={{ textAlign: 'left', padding: '10px 14px', borderRadius: 8, border: `1px solid ${req.program === p.id ? p.color : 'rgba(15,23,42,0.12)'}`, background: req.program === p.id ? `${p.color}15` : 'transparent', color: req.program === p.id ? p.color : '#6B7A96', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit', fontWeight: req.program === p.id ? 700 : 400, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span>{p.icon}</span> {p.label}
                            {req.program === p.id && <span style={{ marginLeft: 'auto' }}>✓</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('whyJoining')}</label>
                    <select className="input select" value={req.why_joining} onChange={e => setReq(r => ({ ...r, why_joining: e.target.value }))}>
                      <option value="">Select…</option>
                      {WHY_OPTIONS.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('preferredLanguage')}</label>
                    <select className="input select" value={req.preferred_language} onChange={e => setReq(r => ({ ...r, preferred_language: e.target.value }))}>
                      <option value="en">🇺🇸 English</option>
                      <option value="ar">🇸🇦 Arabic — العربية</option>
                      <option value="fa">🇮🇷 Persian — فارسی</option>
                    </select>
                  </div>
                </div>
                {reqError && <div style={s.errorBox}><span>⚠</span> {reqError}</div>}
                <button type="submit" className="btn btn-primary" disabled={reqLoading} style={{ width: '100%', height: 48, fontSize: '0.92rem', borderRadius: 10 }}>
                  {reqLoading ? <><div className="loader-sm" style={{ marginRight: 8 }} /> {t('submitting')} </> : `${t('submitRequest')} →`}
                </button>
                <div style={{ ...s.helpBox, marginTop: '1rem' }}>
                  Already have credentials?{' '}
                  <button type="button" onClick={() => setTab('login')} style={{ color: '#F97316', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 700 }}>Sign In →</button>
                </div>
              </form>
            )
          )}

          {/* Features strip */}
          <div style={s.featureRow}>
            {['✅ Lab submissions', '📊 Grades & feedback', '📝 Assessments', '🌐 AR / FA / EN'].map((f, i) => (
              <span key={i} style={s.featureChip}>{f}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const s = {
  wrap: { minHeight: '100vh', display: 'flex', background: '#F8FAFC', position: 'relative', overflow: 'hidden' },
  bgGlow1: { position: 'absolute', top: -200, left: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.14) 0%, transparent 60%)', pointerEvents: 'none' },
  bgGlow2: { position: 'absolute', bottom: -150, left: 300, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(234,179,8,0.12) 0%, transparent 60%)', pointerEvents: 'none' },
  bgGlow3: { position: 'absolute', top: 200, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 60%)', pointerEvents: 'none' },
  left: { flex: 1, display: 'flex', alignItems: 'center', padding: '3rem', borderRight: '1px solid rgba(15,23,42,0.08)', position: 'relative', background: '#FFFFFF' },
  leftContent: { maxWidth: 480 },
  logoRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2rem' },
  logoMark: { width: 46, height: 46, borderRadius: 12, background: 'linear-gradient(135deg,#8B5CF6,#F97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 800, color: 'white', flexShrink: 0 },
  logoText: { fontWeight: 800, fontSize: '1.2rem', color: '#0F172A', letterSpacing: '-0.02em' },
  logoSub: { fontSize: '0.65rem', color: '#475569', letterSpacing: '0.06em' },
  headline: { fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.75rem', color: '#0F172A' },
  tagline: { fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 },
  location: { fontSize: '0.8rem', color: '#475569', marginBottom: '1.75rem' },
  certList: { display: 'flex', flexDirection: 'column', gap: 8 },
  certItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: '#F8FAFC', borderRadius: 8, borderLeft: '3px solid' },
  right: { width: '100%', maxWidth: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', overflowY: 'auto' },
  formWrap: { width: '100%', maxWidth: 400 },
  formTitle: { fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: 6 },
  formDesc: { fontSize: '0.8rem', color: '#475569', lineHeight: 1.6 },
  errorBox: { display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, fontSize: '0.78rem', color: '#EF4444', marginBottom: '1rem' },
  helpBox: { marginTop: '1.25rem', textAlign: 'center', fontSize: '0.78rem', color: '#475569', lineHeight: 1.8 },
  featureRow: { display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: '1.5rem', justifyContent: 'center' },
  featureChip: { fontSize: '0.66rem', padding: '3px 10px', borderRadius: 20, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.18)', color: '#4338CA' },
  bgGlow4: { position: 'absolute', bottom: -120, right: 160, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)', pointerEvents: 'none' },
}
