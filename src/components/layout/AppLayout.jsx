import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../lib/AuthContext'
import { supabase } from '../../lib/supabase'
import JobMatchPanel from '../JobMatchPanel'

export default function AppLayout({ children }) {
  const { profile, signOut, updateLanguage } = useAuth()
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const [unreadNotifs, setUnreadNotifs] = useState(0)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifs, setNotifs] = useState([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [progress, setProgress] = useState([])

  const isAdmin = ['admin', 'instructor'].includes(profile?.role)

  useEffect(() => {
    if (profile?.id && !isAdmin) {
      supabase.from('progress').select('*').eq('user_id', profile.id)
        .then(({ data }) => setProgress(data || []))
    }
    fetchCounts()
    const channel = supabase.channel('notifs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${profile?.id}` },
        () => { fetchCounts() })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [profile?.id])

  async function fetchCounts() {
    if (!profile?.id) return
    const [{ count: nc }, { count: mc }] = await Promise.all([
      supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', profile.id).eq('read', false),
      supabase.from('messages').select('*', { count: 'exact', head: true }).eq('to_id', profile.id).eq('read', false)
    ])
    setUnreadNotifs(nc || 0)
    setUnreadMessages(mc || 0)
  }

  async function fetchNotifs() {
    const { data } = await supabase.from('notifications').select('*').eq('user_id', profile.id).order('created_at', { ascending: false }).limit(10)
    setNotifs(data || [])
    setNotifOpen(true)
    // Mark all read
    await supabase.from('notifications').update({ read: true }).eq('user_id', profile.id).eq('read', false)
    setUnreadNotifs(0)
  }

  const initials = profile?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'S'
  const path = location.pathname

  const navItems = [
    { to: '/dashboard', icon: '⊞', label: t('dashboard') },
    { to: '/program', icon: '📚', label: t('program') },
    { to: '/career', icon: '🚀', label: t('careerCenter') },
    { to: '/assessments', icon: '📝', label: 'Assessments' },
    { to: '/analytics', icon: '📊', label: 'Analytics' },
    { to: '/notes', icon: '📓', label: 'Notes' },
    ...(!profile?.survey_completed ? [{ to: '/survey', icon: '📋', label: 'Intake Survey' }] : []),
    { to: '/messages', icon: '✉', label: t('messages'), badge: unreadMessages },
  ]

  if (isAdmin && profile?.role === 'instructor') {
    navItems.push({ to: '/instructor', icon: '👨‍🏫', label: 'Teacher Dashboard' })
  } else if (isAdmin) {
    navItems.push({ to: '/admin', icon: '⚙', label: t('admin') })
  }

  return (
    <div className="page-wrap">
      {/* Top Nav */}
      <nav className="topnav">
        <div className="inner-wide topnav-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="mobile-menu-btn" style={{ background: 'none', border: 'none', color: 'var(--text)', fontSize: '1.2rem' }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>☰</button>
            <Link to="/dashboard" className="nav-logo">
              <div className="nav-logo-mark">Z</div>
              <div>
                <div className="nav-logo-text">ZICT</div>
                <div className="nav-logo-sub">Learning Portal</div>
              </div>
            </Link>
          </div>

          <div className="nav-right">
            {/* Language selector */}
            <select
              value={i18n.language}
              onChange={e => updateLanguage(e.target.value)}
              className="input lang-select"
              style={{ width: 'auto', padding: '5px 10px', fontSize: '0.76rem', background: 'var(--s2)' }}
            >
              <option value="en">🇺🇸 EN</option>
              <option value="ar">🇸🇦 AR</option>
              <option value="fa">🇮🇷 FA</option>
            </select>

            {/* Notifications bell */}
            <div style={{ position: 'relative' }}>
              <button
                className="btn btn-ghost btn-sm"
                style={{ padding: '6px 10px', fontSize: '1rem', position: 'relative' }}
                onClick={fetchNotifs}
              >
                🔔
                {unreadNotifs > 0 && <span className="notif-dot" />}
              </button>
              {notifOpen && (
                <NotifDropdown notifs={notifs} onClose={() => setNotifOpen(false)} t={t} navigate={navigate} />
              )}
            </div>

            {/* User chip */}
            <div className="user-chip">
              <div className="user-avatar">{initials}</div>
              <span className="user-name">{profile?.full_name}</span>
            </div>

            <button className="btn btn-ghost btn-sm" onClick={signOut}>{t('signOut')}</button>
          </div>
        </div>
      </nav>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* App layout */}
      <div className="app-layout">
        {/* Sidebar */}
        <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="sidebar-content">
            {/* Progress summary */}
            <div style={{ padding: '0 0.75rem 1rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
              <MiniProgress profile={profile} />
            </div>

            <div className="snav-section">
              <div className="snav-label">Navigation</div>
              {navItems.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`snav-item ${path === item.to || path.startsWith(item.to + '/') ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="icon">{item.icon}</span>
                  {item.label}
                  {item.badge > 0 && <span className="snav-badge">{item.badge}</span>}
                </Link>
              ))}
            </div>

            {/* Support button */}
            <div style={{ padding: '0 0.75rem', marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <Link to="/messages?tab=support" className="snav-item" onClick={() => setMobileMenuOpen(false)}>
                <span className="icon">💬</span> {t('support')}
              </Link>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="page-content">
          {children}
        </main>
      </div>

      {/* Job match floating panel — students only */}
      {!isAdmin && <JobMatchPanel progress={progress} />}

      {/* Mobile bottom navigation */}
      <nav className="mobile-bottom-nav">
        {navItems.map(item => (
          <Link
            key={item.to}
            to={item.to}
            className={`mobile-bottom-nav-item ${path === item.to || path.startsWith(item.to + '/') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            {item.badge > 0 && <span className="bnav-badge">{item.badge}</span>}
            <span className="bnav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

function MiniProgress({ profile }) {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    if (!profile?.id) return
    supabase.from('progress').select('*', { count: 'exact' }).eq('user_id', profile.id).eq('completed', true)
      .then(({ count }) => setPct(Math.round(((count || 0) / 52) * 100)))
  }, [profile?.id])
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Program Progress</span>
        <span style={{ fontSize: '0.72rem', color: 'var(--orange)', fontWeight: 700 }}>{pct}%</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill progress-fill-gradient" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function NotifDropdown({ notifs, onClose, t, navigate }) {
  useEffect(() => {
    const handler = (e) => { if (!e.target.closest('.notif-dropdown')) onClose() }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  const typeIcon = { info: 'ℹ', success: '✅', warning: '⚠', alert: '🚨', grade: '📊', message: '✉' }

  return (
    <div className="notif-dropdown fade-in" style={{ position: 'absolute', top: '110%', right: 0, width: 340, background: 'var(--s1)', border: '1px solid var(--border2)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-lg)', zIndex: 400, overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{t('notifications')}</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '1rem', cursor: 'pointer' }}>✕</button>
      </div>
      <div style={{ maxHeight: 320, overflowY: 'auto' }}>
        {notifs.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.82rem' }}>{t('noNotifications')}</div>
        ) : notifs.map(n => (
          <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', cursor: n.link ? 'pointer' : 'default', background: n.read ? 'transparent' : 'rgba(249,115,22,0.04)' }}
            onClick={() => { if (n.link) { navigate(n.link); onClose() } }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>{typeIcon[n.type] || 'ℹ'}</span>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: 2 }}>{n.title}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text2)', lineHeight: 1.5 }}>{n.body}</div>
                <div style={{ fontSize: '0.66rem', color: 'var(--muted)', marginTop: 4 }}>{new Date(n.created_at).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
