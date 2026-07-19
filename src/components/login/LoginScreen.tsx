import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { LOGIN_LOGO } from '@/utils/imageUrls';

export function LoginScreen() {
  const navigate = useNavigate();
  const { login, guestLogin, isLoggedIn } = useUser();
  const [name, setName] = useState('');
  const [ign, setIgn] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/app/home', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  if (isLoggedIn) {
    return null;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedIgn = ign.trim();

    if (!trimmedName || !trimmedIgn) {
      setError(true);
      return;
    }

    setError(false);
    login(trimmedName, trimmedIgn);
  };

  const handleGuest = () => {
    guestLogin();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a1a2e',
        padding: '0 24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '24px',
          }}
        >
          <img
            src={LOGIN_LOGO}
            alt="PokeSpawn"
            style={{
              width: '192px',
              height: '192px',
              objectFit: 'contain',
              borderRadius: '24px',
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                const fallback = document.createElement('div');
                fallback.style.cssText = `
                  width: 128px;
                  height: 128px;
                  border-radius: 24px;
                  background: rgba(118, 39, 197, 0.2);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 48px;
                `;
                fallback.textContent = '🎯';
                parent.appendChild(fallback);
              }
            }}
          />
        </div>

        <h1
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#ffffff',
            textAlign: 'center',
            marginBottom: '4px',
          }}
        >
          PokeSpawn
        </h1>
        <p
          style={{
            color: '#888888',
            textAlign: 'center',
            marginBottom: '32px',
            fontSize: '16px',
          }}
        >
          Welcome back, Trainer!
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(false);
            }}
            placeholder="Your First Name *"
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: '#2a2a3e',
              color: '#ffffff',
              borderRadius: '12px',
              border: error ? '2px solid #F44336' : '2px solid transparent',
              outline: 'none',
              fontSize: '16px',
              fontFamily: 'inherit',
            }}
            autoFocus
          />

          <input
            type="text"
            value={ign}
            onChange={(e) => {
              setIgn(e.target.value);
              setError(false);
            }}
            placeholder="In-Game Name (PoGo Name) *"
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: '#2a2a3e',
              color: '#ffffff',
              borderRadius: '12px',
              border: error ? '2px solid #F44336' : '2px solid transparent',
              outline: 'none',
              fontSize: '16px',
              fontFamily: 'inherit',
            }}
          />

          {error && (
            <p
              style={{
                color: '#F44336',
                fontSize: '14px',
                textAlign: 'center',
                margin: 0,
              }}
            >
              Please enter both name and in-game name
            </p>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#7627C5',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#5A1E9E';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#7627C5';
            }}
          >
            CONTINUE TO POGO BLISS!
          </button>
        </form>

        <button
          onClick={handleGuest}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#444444',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
            marginTop: '12px',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = '#555555';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = '#444444';
          }}
        >
          Continue as Guest
        </button>

        <p
          style={{
            color: '#FFA500',
            fontSize: '12px',
            textAlign: 'center',
            marginTop: '16px',
            lineHeight: 1.5,
          }}
        >
          *Continue as Guest if you don't wish to have<br />
          your order history or dex progress saved.
        </p>
      </div>
    </div>
  );
}