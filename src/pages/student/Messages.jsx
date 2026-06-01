import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../lib/AuthContext'
import { supabase } from '../../lib/supabase'
import AppLayout from '../../components/layout/AppLayout'

export default function Messages() {
  const { profile } = useAuth()
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState(searchParams.get('tab') || 'inbox')
  const [threads, setThreads] = useState([])
  const [activeThread, setActiveThread] = useState(null)
  const [threadMessages, setThreadMessages] = useState([])
  const [reply, setReply] = useState('')
  const [newSubject, setNewSubject] = useState('')
  const [newBody, setNewBody] = useState('')
  const [instructors, setInstructors] = useState([])
  const [toId, setToId] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef(null)

  useEffect(() => { loadAll() }, [profile?.id])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [threadMessages])

  async function loadAll() {
    const [{ data: msgs }, { data: staff }] = await Promise.all([
      supabase.from('messages').select('*').or(`from_id.eq.${profile.id},to_id.eq.${profile.id}`).order('created_at', { ascending: false }),
      supabase.from('profiles').select('id,full_name,role').in('role', ['admin', 'instructor'])
    ])
    setInstructors(staff || [])
    if (staff?.length && !toId) setToId(staff[0]?.id)
    // Group by thread
    const threadMap = {}
    ;(msgs || []).forEach(m => {
      const tid = m.thread_id || m.id
      if (!threadMap[tid]) threadMap[tid] = { id: tid, subject: m.subject, messages: [], lastAt: m.created_at, unread: 0 }
      threadMap[tid].messages.push(m)
      if (!m.read && m.to_id === profile.id) threadMap[tid].unread++
      if (m.created_at > threadMap[tid].lastAt) threadMap[tid].lastAt = m.created_at
    })
    setThreads(Object.values(threadMap).sort((a, b) => b.lastAt.localeCompare(a.lastAt)))
    setLoading(false)
  }

  async function openThread(thread) {
    setActiveThread(thread)
    setThreadMessages(thread.messages.sort((a, b) => a.created_at.localeCompare(b.created_at)))
    // Mark read
    await supabase.from('messages').update({ read: true }).in('id', thread.messages.map(m => m.id)).eq('to_id', profile.id)
  }

  async function sendReply() {
    if (!reply.trim() || !activeThread) return
    setSending(true)
    const other = activeThread.messages.find(m => m.from_id !== profile.id)?.from_id || toId
    await supabase.from('messages').insert({ from_id: profile.id, to_id: other, thread_id: activeThread.id, subject: activeThread.subject, body: reply })
    // Notify recipient
    await supabase.from('notifications').insert({ user_id: other, title: `New reply from ${profile.full_name}`, body: reply.slice(0, 100), type: 'message', link: '/messages' })
    setReply('')
    loadAll()
    setSending(false)
  }

  async function sendNew() {
    if (!newBody.trim() || !toId) return
    setSending(true)
    const { data } = await supabase.from('messages').insert({ from_id: profile.id, to_id: toId, subject: newSubject || 'New message', body: newBody }).select().single()
    await supabase.from('notifications').insert({ user_id: toId, title: `Message from ${profile.full_name}`, body: newBody.slice(0, 100), type: 'message', link: '/messages' })
    setNewBody(''); setNewSubject('')
    setTab('inbox')
    loadAll()
    setSending(false)
  }

  const inbox = threads.filter(t => t.messages.some(m => m.to_id === profile.id))
  const sent = threads.filter(t => t.messages[0]?.from_id === profile.id)

  const panelActive = !!(activeThread || tab === 'new' || tab === 'support')

  function handleMobileBack() {
    if (activeThread) setActiveThread(null)
    else setTab('inbox')
  }

  return (
    <AppLayout>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '1.5rem' }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: '1.25rem' }}>
          {t('messages')} & {t('support')}
        </h1>

        <div className={`msg-grid ${panelActive ? 'msg-panel-active' : ''}`}>
          {/* Left: thread list */}
          <div className="card msg-panel-list" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div className="tab-bar" style={{ top: 0, borderRadius: 'var(--r) var(--r) 0 0' }}>
              {[['inbox', '📥 Inbox'], ['sent', '📤 Sent'], ['new', '✏️ New'], ['support', '🆘 Help']].map(([id, label]) => (
                <button key={id} className={`tab-btn ${tab === id ? 'active' : ''}`} style={{ flex: 1, fontSize: '0.72rem', padding: '0.65rem 0.4rem' }} onClick={() => { setTab(id); setActiveThread(null) }}>{label}</button>
              ))}
            </div>

            <div style={{ overflowY: 'auto', flex: 1 }}>
              {(tab === 'inbox' ? inbox : sent).map(thread => (
                <div key={thread.id} onClick={() => openThread(thread)}
                  style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--border)', background: activeThread?.id === thread.id ? 'var(--orange-d)' : thread.unread ? 'rgba(255,255,255,0.03)' : 'transparent', transition: 'background 0.1s' }}>
                  <div style={{ fontWeight: thread.unread ? 700 : 400, fontSize: '0.82rem', marginBottom: 2, color: thread.unread ? 'var(--white)' : 'var(--text2)' }}>{thread.subject}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{new Date(thread.lastAt).toLocaleDateString()}</div>
                  {thread.unread > 0 && <span style={{ fontSize: '0.6rem', background: 'var(--orange)', color: 'white', padding: '1px 6px', borderRadius: 10, fontWeight: 700 }}>{thread.unread} new</span>}
                </div>
              ))}
              {(tab === 'inbox' ? inbox : tab === 'sent' ? sent : []).length === 0 && (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.82rem' }}>No messages yet</div>
              )}
            </div>
          </div>

          {/* Right: message area */}
          <div className="card msg-panel-msg" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Mobile back button */}
            <button
              className="msg-mobile-back btn btn-ghost btn-sm"
              onClick={handleMobileBack}
              style={{ alignSelf: 'flex-start', margin: '10px 12px 0', gap: 6 }}
            >← Back</button>

            {tab === 'new' && (
              <div style={{ padding: '1.25rem', flex: 1 }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>{t('newMessage')}</h3>
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label">{t('to')}</label>
                  <select className="input select" value={toId} onChange={e => setToId(e.target.value)}>
                    {instructors.map(i => <option key={i.id} value={i.id}>{i.full_name} ({i.role})</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label">{t('subject')}</label>
                  <input className="input" placeholder="Subject…" value={newSubject} onChange={e => setNewSubject(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">{t('message')}</label>
                  <textarea className="input textarea" placeholder="Write your message…" value={newBody} onChange={e => setNewBody(e.target.value)} style={{ minHeight: 200 }} />
                </div>
                <button className="btn btn-primary" onClick={sendNew} disabled={sending || !newBody.trim()}>{sending ? 'Sending…' : t('send')}</button>
              </div>
            )}

            {tab === 'support' && (
              <div style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>💬</div>
                <h3 style={{ fontWeight: 700, marginBottom: 6 }}>Contact Support</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text2)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                  Need help with the portal, your coursework, or account access? Your instructor and support team are here.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <a href="mailto:zicttraining@cloudtech.com" className="btn btn-primary">📧 Email Support</a>
                  <button className="btn btn-ghost" onClick={() => setTab('new')}>✉ Send In-Portal Message</button>
                </div>
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--s2)', borderRadius: 'var(--r)', fontSize: '0.78rem', color: 'var(--text2)', lineHeight: 1.7 }}>
                  <strong style={{ color: 'var(--orange)' }}>Response time:</strong> Within 24 hours (Mon–Fri)<br />
                  <strong style={{ color: 'var(--orange)' }}>Urgent:</strong> zicttraining@cloudtech.com<br />
                  <strong style={{ color: 'var(--orange)' }}>Phone:</strong> 720-788-0908<br />
                  <strong style={{ color: 'var(--orange)' }}>Address:</strong> 7900 E Union Ave, Suite 1100, Denver, CO 80237
                </div>
              </div>
            )}

            {activeThread && (tab === 'inbox' || tab === 'sent') && (
              <>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontWeight: 700 }}>{activeThread.subject}</div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                  {threadMessages.map(m => (
                    <div key={m.id} style={{ marginBottom: '1rem', display: 'flex', flexDirection: m.from_id === profile.id ? 'row-reverse' : 'row', gap: 10 }}>
                      <div style={{ maxWidth: '70%', padding: '10px 14px', borderRadius: 12, background: m.from_id === profile.id ? 'var(--orange-d)' : 'var(--s2)', border: `1px solid ${m.from_id === profile.id ? 'var(--orange-b)' : 'var(--border)'}` }}>
                        <div style={{ fontSize: '0.8rem', lineHeight: 1.6 }}>{m.body}</div>
                        <div style={{ fontSize: '0.66rem', color: 'var(--muted)', marginTop: 4 }}>{new Date(m.created_at).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>
                <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
                  <input className="input" placeholder="Type a reply…" value={reply} onChange={e => setReply(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendReply()} />
                  <button className="btn btn-primary" onClick={sendReply} disabled={sending || !reply.trim()}>{t('send')}</button>
                </div>
              </>
            )}

            {!activeThread && tab !== 'new' && tab !== 'support' && (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: '0.85rem' }}>
                Select a message to read
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
