/**
 * Supabase Client Configuration
 *
 * Questo file inizializza il client Supabase che useremo
 * in tutta l'app per autenticazione e operazioni database.
 *
 * CONCETTI CHIAVE:
 * - createClient() crea una connessione a Supabase
 * - Le variabili VITE_* vengono lette da .env.local
 * - Il client è un "singleton" - stessa istanza ovunque
 */

import { createClient } from '@supabase/supabase-js'

// Legge le variabili d'ambiente (definite in .env.local)
// import.meta.env è il modo di Vite per accedere alle env variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validazione: assicuriamoci che le variabili esistano
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Mancano le variabili VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY in .env.local'
  )
}

// Crea il client Supabase
// Questo oggetto ci permette di:
// - Fare login/logout (supabase.auth)
// - Leggere/scrivere dati (supabase.from('tabella'))
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Salva la sessione in localStorage (persiste tra refresh)
    persistSession: true,
    // Rinnova automaticamente il token prima che scada
    autoRefreshToken: true,
    // Rileva la sessione dall'URL (per OAuth redirect)
    detectSessionInUrl: true,
  },
})

export default supabase
