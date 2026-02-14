/* eslint-disable react-refresh/only-export-components */
/**
 * AuthContext - React Context per l'Autenticazione
 *
 * COSA FA:
 * Fornisce lo stato di autenticazione e i metodi (login/logout)
 * a tutti i componenti dell'app.
 *
 * COME FUNZIONA:
 * 1. AuthProvider wrappa tutta l'app
 * 2. Qualsiasi componente può usare useAuth() per accedere a:
 *    - user: l'utente loggato (o null)
 *    - isLoading: true mentre verifica la sessione
 *    - signInWithGoogle(): fa login con Google
 *    - signOut(): fa logout
 *
 * CONCETTI REACT:
 * - Context: modo per passare dati "globali" senza prop drilling
 * - Provider: componente che "fornisce" i dati ai figli
 * - useContext: hook per "consumare" i dati del context
 */

import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// 1. Crea il Context (contenitore vuoto)
const AuthContext = createContext(null)

// 2. Provider component (fornisce i dati)
export function AuthProvider({ children }) {
  // Stato dell'utente
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Al mount: controlla se esiste già una sessione
  useEffect(() => {
    // Prende la sessione corrente (se l'utente era già loggato)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    // Ascolta i cambiamenti di auth (login, logout, refresh token)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    // Cleanup: rimuove il listener quando il componente smonta
    return () => subscription.unsubscribe()
  }, [])

  // Login con Google OAuth
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Dopo il login, Google reindirizza qui
        redirectTo: window.location.origin,
      },
    })

    if (error) {
      console.error('Errore login:', error.message)
      throw error
    }
  }

  // Logout
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Errore logout:', error.message)
      throw error
    }
    // onAuthStateChange aggiornerà automaticamente user/session a null
  }

  // Valore fornito ai componenti figli
  const value = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    signInWithGoogle,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// 3. Custom hook per usare il context
// Invece di useContext(AuthContext), usiamo useAuth()
export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve essere usato dentro un AuthProvider')
  }

  return context
}
