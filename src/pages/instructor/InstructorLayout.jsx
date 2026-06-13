// InstructorLayout.jsx — Wrapper for instructor (teacher) dashboard pages
import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../lib/AuthContext'
import { supabase } from '../../lib/supabase'
import AppLayout from '../../components/layout/AppLayout'

export default function InstructorLayout() {
  const location = useLocation()
  const path = location.pathname
  const { profile } = useAuth()
  const [pendingGrades, setPendingGrades] = useState(0)

  useEffect(() => {
    supabase.from('progress').select('id', { count: 'exact', head: true }).eq('grade', 'pending')
      .then(({ count }) => setPendingGrades(count || 0))
  }, [path])

  const tabs = [
    { to: '/instructor', label: '📊 Overview', exact: true },
    { to: '/instructor/students', label: '👥 Students' },
    { to: '/instructor/grading', label: `📋 Grading${pendingGrades > 0 ? ` (${pendingGrades})` : ''}` },
    { to: '/instructor/assignments', label: '📝 Assignments' },
    { to: '/instructor/class', label: '🎬 Class' },
    { to: '/instructor/notifications', label: '🔔 Messages' },
  ]

  return (
    <AppLayout>
      <div style={{ borderBottom: '1px solid var(--border)', position: 'sticky', top: 58, zIndex: 50, background: 'var(--s1)', backdropFilter: 'blur(10px)' }}>
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
