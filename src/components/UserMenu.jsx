/**
 * UserMenu - Menu utente con avatar e logout
 *
 * Mostra l'avatar e il nome dell'utente loggato,
 * con un dropdown per fare logout.
 */

import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function UserMenu() {
  const { user, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Estrae info dal profilo Google (Google usa 'picture' e 'name')
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture
  const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email
  const email = user?.email

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await signOut()
    } catch (error) {
      console.error('Errore durante il logout:', error)
      setIsLoggingOut(false)
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Avatar button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 8px',
          background: 'transparent',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={fullName}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
            }}
          />
        ) : (
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#6366f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            {fullName?.charAt(0)?.toUpperCase() || '?'}
          </div>
        )}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <>
          {/* Overlay per chiudere cliccando fuori */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10,
            }}
          />

          {/* Menu */}
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              minWidth: '200px',
              backgroundColor: 'var(--card-bg, #fff)',
              border: '1px solid var(--border-color, #e5e7eb)',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 20,
              overflow: 'hidden',
            }}
          >
            {/* User info */}
            <div
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border-color, #e5e7eb)',
              }}
            >
              <div style={{ fontWeight: '600', fontSize: '14px' }}>
                {fullName}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary, #6b7280)',
                  marginTop: '2px',
                }}
              >
                {email}
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              style={{
                width: '100%',
                padding: '12px 16px',
                textAlign: 'left',
                background: 'transparent',
                border: 'none',
                cursor: isLoggingOut ? 'wait' : 'pointer',
                fontSize: '14px',
                color: '#ef4444',
              }}
            >
              {isLoggingOut ? 'Disconnessione...' : 'Esci'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
