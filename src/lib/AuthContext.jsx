import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { supabase } from './supabase'
import i18n from '../i18n'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const sessionRef = useRef(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) { fetchProfile(session.user.id); startTimeTracking(session.user.id) }
      else setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      if (session?.user) { fetchProfile(session.user.id); startTimeTracking(session.user.id) }
      else { setProfile(null); setLoading(false); endTimeTracking() }
    })
    return () => { subscription.unsubscribe(); endTimeTracking() }
  }, [])

  async function fetchProfile(userId) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setProfile(data)
    if (data?.language) { i18n.changeLanguage(data.language); document.documentElement.dir = data.language === 'ar' || data.language === 'fa' ? 'rtl' : 'ltr' }
    await supabase.from('profiles').update({ last_seen: new Date().toISOString() }).eq('id', userId)
    setLoading(false)
  }

  async function startTimeTracking(userId) {
    const { data } = await supabase.from('time_tracking').insert({ user_id: userId, session_start: new Date().toISOString(), page_context: window.location.pathname }).select().single()
    sessionRef.current = data?.id
  }

  async function endTimeTracking() {
    if (!sessionRef.current) return
    const end = new Date().toISOString()
    await supabase.from('time_tracking').update({ session_end: end }).eq('id', sessionRef.current)
    sessionRef.current = null
  }

  async function signIn(email, password) {
    return supabase.auth.signInWithPassword({ email, password })
  }

  async function signOut() {
    await endTimeTracking()
    await supabase.auth.signOut()
  }

  async function updateLanguage(lang) {
    i18n.changeLanguage(lang)
    document.documentElement.dir = lang === 'ar' || lang === 'fa' ? 'rtl' : 'ltr'
    if (user) await supabase.from('profiles').update({ language: lang }).eq('id', user.id)
    setProfile(prev => prev ? { ...prev, language: lang } : prev)
  }

  async function refreshProfile() {
    if (user) await fetchProfile(user.id)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signOut, fetchProfile, refreshProfile, updateLanguage }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
