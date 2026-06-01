import { useState } from 'react'
import { useAuth } from '../../lib/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Login() {
  const { signIn } = useAuth()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email.trim(), password)
    setLoading(false)
    if (error) {
      setError(error.message === 'Invalid login credentials'
        ? 'Email or password is incorrect. Contact your instructor for help.'
        : error.message)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div style={s.wrap}>
      {/* Animated background */}
      <div style={s.bgGlow1} />
      <div style={s.bgGlow2} />
      <div style={s.bgGlow3} />

      {/* Left panel */}
      <div className="login-left" style={s.left}>
        <div style={s.leftContent}>
          {/* Logo */}
          <div style={s.logoRow}>
            <div style={s.logoMark}>Z</div>
            <div>
              <div style={s.logoText}>ZICT</div>
              <div style={s.logoSub}>Zicloud Technology Inc.</div>
            </div>
          </div>

          <h1 style={s.headline}>
            Professional<br />
            <span style={{ color: '#F97316', fontStyle: 'italic' }}>Technology</span> Training<br />
            <span style={{ color: '#EAB308' }}>& Certification</span>
          </h1>

          <p style={s.tagline}>Industry-Ready Programs · Stackable Certificates</p>
          <p style={s.location}>📍 Denver, CO · WIOA/ETPL Eligible</p>

          {/* Program tracks */}
          <div style={s.certList}>
            {[
              { color: '#F97316', icon: '🤖', label: 'Applied AI & Digital Productivity', desc: 'AI tools, automation & workplace productivity' },
              { color: '#3B82F6', icon: '☁️', label: 'AWS Cloud Architect Engineer', desc: 'Architecture, Terraform, CI/CD, containers & Kubernetes' },
              { color: '#EF4444', icon: '🔐', label: 'Cybersecurity Essentials', desc: 'Security principles, defense & compliance' },
              { color: '#8B5CF6', icon: '🧠', label: 'AI / ML Foundations', desc: 'Machine learning concepts & applied modeling' },
              { color: '#22C55E', icon: '🚀', label: 'Technical Mentorship & Placement', desc: 'Career coaching, job prep & employer connections' },
            ].map((p, i) => (
              <div key={i} style={{ ...s.certItem, borderLeftColor: p.color }}>
                <span style={{ fontSize: '1rem', flexShrink: 0 }}>{p.icon}</span>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#E8EDF5', fontWeight: 600 }}>{p.label}</div>
                  <div style={{ fontSize: '0.7rem', color: '#6B7A96', marginTop: 1 }}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Language selector */}
          <div style={{ marginTop: '2rem' }}>
            <div style={{ fontSize: '0.65rem', color: '#6B7A96', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Portal Language</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[['en', '🇺🇸 English'], ['ar', '🇸🇦 العربية'], ['fa', '🇮🇷 فارسی']].map(([code, label]) => (
                <button key={code} onClick={() => { i18n.changeLanguage(code); document.documentElement.dir = code !== 'en' ? 'rtl' : 'ltr' }}
                  style={{ padding: '5px 12px', borderRadius: 20, border: `1px solid ${i18n.language === code ? '#F97316' : 'rgba(255,255,255,0.1)'}`, background: i18n.language === code ? 'rgba(249,115,22,0.15)' : 'transparent', color: i18n.language === code ? '#F97316' : '#6B7A96', fontSize: '0.74rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="login-right" style={s.right}>
        <form onSubmit={handleSubmit} style={s.form} className="login-form fade-up">
          {/* Mobile logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.75rem' }}>
            <div style={{ ...s.logoMark, width: 38, height: 38, fontSize: '1rem' }}>Z</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'white' }}>ZICT Portal</div>
              <div style={{ fontSize: '0.65rem', color: '#6B7A96', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Student Login</div>
            </div>
          </div>

          <h2 style={s.formTitle}>{t('welcomeBack')} 👋</h2>
          <p style={s.formDesc}>Sign in with the credentials your instructor provided.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', margin: '1.5rem 0' }}>
            <div className="form-group">
              <label className="form-label">{t('email')}</label>
              <input type="email" required className="input" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com" autoComplete="email" />
            </div>
            <div className="form-group">
              <label className="form-label">{t('password')}</label>
              <input type="password" required className="input" value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" autoComplete="current-password" />
            </div>
          </div>

          {error && (
            <div style={s.errorBox}>
              <span>⚠</span> {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: '100%', height: 48, fontSize: '0.92rem', borderRadius: 10 }}>
            {loading ? <><div className="loader-sm" style={{ marginRight: 8 }} />{t('signingIn')}</> : `${t('signIn')} →`}
          </button>

          <div style={s.helpBox}>
            <div style={{ marginBottom: 4 }}>{t('noAccess')}</div>
            <strong style={{ color: '#F97316' }}>zicttraining@cloudtech.com</strong>
            <div style={{ marginTop: 4 }}>📞 720-788-0908</div>
          </div>

          {/* Features preview */}
          <div style={s.featureRow}>
            {['✅ Lab submissions', '📊 Grades & feedback', '🔔 Notifications', '🌐 AR / FA / EN'].map((f, i) => (
              <span key={i} style={s.featureChip}>{f}</span>
            ))}
          </div>
        </form>
      </div>
    </div>
  )
}

const s = {
  wrap: {
    minHeight: '100vh', display: 'flex',
    background: '#0C0F14', position: 'relative', overflow: 'hidden',
  },
  bgGlow1: { position: 'absolute', top: -200, left: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 65%)', pointerEvents: 'none' },
  bgGlow2: { position: 'absolute', bottom: -150, left: 300, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(234,179,8,0.06) 0%, transparent 65%)', pointerEvents: 'none' },
  bgGlow3: { position: 'absolute', top: 200, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 65%)', pointerEvents: 'none' },
  left: { flex: 1, display: 'flex', alignItems: 'center', padding: '3rem', borderRight: '1px solid rgba(255,255,255,0.07)', position: 'relative' },
  leftContent: { maxWidth: 480 },
  logoRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2rem' },
  logoMark: { width: 46, height: 46, borderRadius: 12, background: 'linear-gradient(135deg,#F97316,#EAB308)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 800, color: 'white', flexShrink: 0 },
  logoText: { fontWeight: 800, fontSize: '1.2rem', color: 'white', letterSpacing: '-0.02em' },
  logoSub: { fontSize: '0.65rem', color: '#6B7A96', letterSpacing: '0.06em' },
  headline: { fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.75rem', color: 'white' },
  tagline: { fontSize: '0.8rem', color: '#6B7A96', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 },
  location: { fontSize: '0.8rem', color: '#6B7A96', marginBottom: '1.75rem' },
  certList: { display: 'flex', flexDirection: 'column', gap: 8 },
  certItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, borderLeft: '3px solid' },
  certDot: { width: 7, height: 7, borderRadius: '50%', flexShrink: 0 },
  right: { width: '100%', maxWidth: 460, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
  form: { width: '100%', maxWidth: 380 },
  formTitle: { fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: 6 },
  formDesc: { fontSize: '0.8rem', color: '#6B7A96', lineHeight: 1.6 },
  errorBox: { display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, fontSize: '0.78rem', color: '#EF4444', marginBottom: '1rem' },
  helpBox: { marginTop: '1.25rem', textAlign: 'center', fontSize: '0.76rem', color: '#6B7A96', lineHeight: 1.7 },
  featureRow: { display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: '1.5rem', justifyContent: 'center' },
  featureChip: { fontSize: '0.66rem', padding: '3px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#6B7A96' },
}
