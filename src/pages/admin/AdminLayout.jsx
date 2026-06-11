// AdminLayout.jsx
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../lib/AuthContext'
import AppLayout from '../../components/layout/AppLayout'

export default function AdminLayout() {
  const location = useLocation()
  const path = location.pathname
  const tabs = [
    { to: '/admin', label: '📊 Overview', exact: true },
    { to: '/admin/students', label: '👥 Students' },
    { to: '/admin/grading', label: '📋 Grading' },
    { to: '/admin/assessments', label: '📝 Assessments' },
    { to: '/admin/attendance', label: '✅ Attendance' },
    { to: '/admin/notifications', label: '🔔 Notifications' },
  ]
  return (
    <AppLayout>
      <div style={{ borderBottom: '1px solid var(--border)', position: 'sticky', top: 58, zIndex: 50, background: 'rgba(12,15,20,0.97)', backdropFilter: 'blur(10px)' }}>
        <div className="admin-tabs" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem', display: 'flex', gap: 0 }}>
          {tabs.map(tab => {
            const active = tab.exact ? path === tab.to : path.startsWith(tab.to)
            return (
              <Link key={tab.to} to={tab.to}
                style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', fontWeight: 500, color: active ? 'var(--orange)' : 'var(--muted)', borderBottom: `2px solid ${active ? 'var(--orange)' : 'transparent'}`, textDecoration: 'none', whiteSpace: 'nowrap', marginBottom: -1, transition: 'all 0.15s' }}>
                {tab.label}
              </Link>
            )
          })}
        </div>
      </div>
      <div className="inner" style={{ maxWidth: 1100, margin: '0 auto', padding: '1.75rem 1.5rem 3rem' }}>
        <Outlet />
      </div>
    </AppLayout>
  )
}
