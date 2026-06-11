// AdminApprovals.jsx — Review, approve, or reject student account requests
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const PROGRAMS = [
  { id: 'applied_ai',    label: 'Applied AI & Digital Productivity', icon: '🤖', color: '#F97316' },
  { id: 'aws',           label: 'AWS Cloud Architect Engineer',       icon: '☁️', color: '#3B82F6' },
  { id: 'cybersecurity', label: 'Cybersecurity Essentials',          icon: '🔐', color: '#EF4444' },
  { id: 'ai_ml',         label: 'AI / ML Foundations',               icon: '🧠', color: '#8B5CF6' },
  { id: 'mentorship',    label: 'Technical Mentorship & Placement',  icon: '🚀', color: '#22C55E' },
]

function genPassword() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let pw = 'ZICT-'
  for (let i = 0; i < 8; i++) pw += chars[Math.floor(Math.random() * chars.length)]
  return pw
}

export default function AdminApprovals() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [approving, setApproving] = useState(null) // request id
  const [tempPassword, setTempPassword] = useState('')
  const [rejectingId, setRejectingId] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [actionMsg, setActionMsg] = useState({}) // { id: {type, text} }
  const [working, setWorking] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase.from('account_requests').select('*').order('created_at', { ascending: false })
    setRequests(data || [])
    setLoading(false)
  }

  const filtered = requests.filter(r => filter === 'all' ? true : r.status === filter)
  const pendingCount = requests.filter(r => r.status === 'pending').length

  function startApprove(req) {
    setApproving(req.id)
    setTempPassword(genPassword())
    setRejectingId(null)
  }

  async function approve(req) {
    setWorking(true)
    // Create auth account
    const { data, error } = await supabase.auth.signUp({
      email: req.email,
      password: tempPassword,
      options: { data: { full_name: req.full_name, role: 'student', program: req.program } }
    })
    if (error) { setActionMsg(m => ({ ...m, [req.id]: { type: 'error', text: error.message } })); setWorking(false); return }

    // Update profile with language if user created
    if (data?.user?.id) {
      await supabase.from('profiles').update({
        program: req.program,
        language: req.preferred_language || 'en',
      }).eq('id', data.user.id)
    }

    // Mark request approved
    const { data: { user: adminUser } } = await supabase.auth.getUser()
    await supabase.from('account_requests').update({
      status: 'approved', reviewed_by: adminUser?.id, reviewed_at: new Date().toISOString(),
    }).eq('id', req.id)

    setActionMsg(m => ({
      ...m, [req.id]: {
        type: 'success',
        text: `✅ Account created! Share these credentials with ${req.full_name}:\n\nEmail: ${req.email}\nPassword: ${tempPassword}\n\nThey should change their password on first login.`,
      }
    }))
    setApproving(null)
    setWorking(false)
    load()
  }

  async function reject(req) {
    setWorking(true)
    const { data: { user: adminUser } } = await supabase.auth.getUser()
    await supabase.from('account_requests').update({
      status: 'rejected', reviewed_by: adminUser?.id, reviewed_at: new Date().toISOString(),
      rejection_reason: rejectReason || null,
    }).eq('id', req.id)
    setRejectingId(null); setRejectReason('')
    setActionMsg(m => ({ ...m, [req.id]: { type: 'info', text: `Request from ${req.full_name} rejected.` } }))
    setWorking(false)
    load()
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="loader" /></div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: '1.2rem' }}>Account Requests</h2>
          <div style={{ fontSize: '0.74rem', color: 'var(--muted)', marginTop: 2 }}>Students who submitted the "Request Access" form on the login page</div>
        </div>
        {pendingCount > 0 && (
          <div style={{ padding: '8px 16px', background: 'var(--orange-d)', border: '1px solid var(--orange-b)', borderRadius: 8, fontSize: '0.8rem', color: 'var(--orange)', fontWeight: 700 }}>
            ⏳ {pendingCount} awaiting review
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: '1.25rem' }}>
        {[['pending', 'Pending'], ['approved', 'Approved'], ['rejected', 'Rejected'], ['all', 'All']].map(([id, label]) => {
          const count = id === 'all' ? requests.length : requests.filter(r => r.status === id).length
          return (
            <button key={id} onClick={() => setFilter(id)}
              className={`btn btn-sm ${filter === id ? 'btn-secondary' : 'btn-ghost'}`}
              style={{ fontSize: '0.74rem' }}>
              {label} {count > 0 && <span style={{ marginLeft: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '0 6px', fontSize: '0.66rem' }}>{count}</span>}
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>📭</div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>No {filter === 'all' ? '' : filter} requests</div>
          <div style={{ fontSize: '0.78rem' }}>When students submit the "Request Access" form on the login page, they'll appear here.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(req => {
            const prog = PROGRAMS.find(p => p.id === req.program) || PROGRAMS[0]
            const msg = actionMsg[req.id]
            const isApproving = approving === req.id
            const isRejecting = rejectingId === req.id

            return (
              <div key={req.id} className="card" style={{ padding: '1.25rem', borderLeft: `3px solid ${req.status === 'pending' ? 'var(--orange)' : req.status === 'approved' ? 'var(--green)' : 'var(--muted)'}` }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{req.full_name}</div>
                      <StatusBadge status={req.status} />
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{req.email} {req.phone && `· ${req.phone}`}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--muted)', marginTop: 2 }}>Requested {new Date(req.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ background: `${prog.color}18`, color: prog.color, padding: '4px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600, border: `1px solid ${prog.color}30` }}>
                      {prog.icon} {prog.label}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8, marginBottom: 12 }}>
                  {req.why_joining && <Detail label="Why joining" value={req.why_joining} />}
                  {req.career_interest && <Detail label="Career interest" value={req.career_interest} />}
                  <Detail label="Language" value={{ en: 'English', ar: 'Arabic', fa: 'Persian' }[req.preferred_language] || req.preferred_language} />
                </div>

                {/* Rejection reason (if rejected) */}
                {req.status === 'rejected' && req.rejection_reason && (
                  <div style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 7, fontSize: '0.74rem', color: 'var(--danger)', marginBottom: 12 }}>
                    <strong>Rejection reason:</strong> {req.rejection_reason}
                  </div>
                )}

                {/* Action message */}
                {msg && (
                  <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 12, whiteSpace: 'pre-line', fontSize: '0.78rem', fontFamily: msg.type === 'success' ? 'DM Mono, monospace' : 'inherit', background: msg.type === 'success' ? 'var(--green-d)' : msg.type === 'error' ? 'rgba(239,68,68,0.08)' : 'var(--s2)', border: `1px solid ${msg.type === 'success' ? 'var(--green-b)' : msg.type === 'error' ? 'rgba(239,68,68,0.2)' : 'var(--border)'}`, color: msg.type === 'success' ? 'var(--green)' : msg.type === 'error' ? 'var(--danger)' : 'var(--text2)' }}>
                    {msg.text}
                    {msg.type === 'success' && (
                      <button onClick={() => navigator.clipboard?.writeText(`Email: ${req.email}\nPassword: ${tempPassword}`)}
                        className="btn btn-ghost btn-sm" style={{ marginTop: 8, fontSize: '0.68rem', display: 'block' }}>
                        📋 Copy credentials
                      </button>
                    )}
                  </div>
                )}

                {/* Actions (pending only) */}
                {req.status === 'pending' && !msg && (
                  <div>
                    {!isApproving && !isRejecting && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-success btn-sm" onClick={() => startApprove(req)}>✅ Approve & Create Account</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => { setRejectingId(req.id); setApproving(null) }}>❌ Reject</button>
                      </div>
                    )}

                    {isApproving && (
                      <div style={{ padding: '14px', background: 'var(--green-d)', border: '1px solid var(--green-b)', borderRadius: 10 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--green)', marginBottom: 10 }}>Create account for {req.full_name}</div>
                        <div className="form-group" style={{ marginBottom: 10 }}>
                          <label className="form-label">Temporary Password</label>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <input className="input" value={tempPassword} onChange={e => setTempPassword(e.target.value)} style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.86rem' }} />
                            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setTempPassword(genPassword())} style={{ flexShrink: 0, fontSize: '0.7rem' }}>🔄 New</button>
                          </div>
                          <span className="form-hint">Share this with the student — they should change it on first login.</span>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn btn-primary btn-sm" onClick={() => approve(req)} disabled={!tempPassword || working}>
                            {working ? <><div className="loader-sm" /> Creating…</> : '✅ Create Account'}
                          </button>
                          <button className="btn btn-ghost btn-sm" onClick={() => setApproving(null)}>Cancel</button>
                        </div>
                      </div>
                    )}

                    {isRejecting && (
                      <div style={{ padding: '14px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 10 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--danger)', marginBottom: 10 }}>Reject request from {req.full_name}</div>
                        <div className="form-group" style={{ marginBottom: 10 }}>
                          <label className="form-label">Reason (optional — not shown to student)</label>
                          <input className="input" value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="e.g. Wrong cohort, already enrolled…" />
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn btn-danger btn-sm" onClick={() => reject(req)} disabled={working}>
                            {working ? <><div className="loader-sm" /> Rejecting…</> : '❌ Confirm Rejection'}
                          </button>
                          <button className="btn btn-ghost btn-sm" onClick={() => setRejectingId(null)}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    pending: ['var(--orange)', 'var(--orange-d)', '⏳ Pending'],
    approved: ['var(--green)', 'var(--green-d)', '✅ Approved'],
    rejected: ['var(--muted)', 'var(--s2)', '❌ Rejected'],
  }
  const [color, bg, label] = map[status] || map.pending
  return <span style={{ background: bg, color, padding: '2px 10px', borderRadius: 10, fontSize: '0.64rem', fontWeight: 700 }}>{label}</span>
}

function Detail({ label, value }) {
  return (
    <div style={{ padding: '8px 10px', background: 'var(--s2)', borderRadius: 7 }}>
      <div style={{ fontSize: '0.6rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: '0.76rem', color: 'var(--text)' }}>{value}</div>
    </div>
  )
}
