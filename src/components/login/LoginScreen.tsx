import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { LOGIN_LOGO } from '@/utils/imageUrls';
import { AdminPicker } from './AdminPicker';
import { GamerTag } from '@/utils/adminMap';

export function LoginScreen() {
  const navigate = useNavigate();
  const { login, guestLogin, isLoggedIn } = useUser();
  const [name, setName] = useState('');
  const [ign, setIgn] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState<GamerTag | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/app/home', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  if (isLoggedIn) {
    return null;
  }

  // Auto-advance when an admin is picked.
  const handleAdminSelect = (tag: GamerTag) => {
    setSelectedAdmin(tag);
    const trimmedName = name.trim();
    const trimmedIgn = ign.trim();

    if (!trimmedName || !trimmedIgn) {
      setError('Please enter both name and in-game name');
      return;
    }

    setError(null);
    localStorage.setItem('admin_gamer_tag', tag);
    login(trimmedName, trimmedIgn);
  };

  const handleGuest = () => {
    if (!selectedAdmin) {
      setError('Please select your admin');
      return;
    }
    setError(null);
    localStorage.setItem('admin_gamer_tag', selectedAdmin);
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
        padding: '24px 24px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <img
            src={LOGIN_LOGO}
            alt="PokeSpawn"
            style={{ width: '128px', height: '128px', objectFit: 'contain', borderRadius: '24px' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#ffffff', textAlign: 'center', marginBottom: '4px' }}>
          PokeSpawn
        </h1>
        <p style={{ color: '#888888', textAlign: 'center', marginBottom: '24px', fontSize: '16px' }}>
          Welcome back, Trainer!
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(null); }}
            placeholder="Your First Name *"
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: '#2a2a3e',
              color: '#ffffff',
              borderRadius: '12px',
              border: '2px solid transparent',
              outline: 'none',
              fontSize: '16px',
              fontFamily: 'inherit',
            }}
            autoFocus
          />

          <input
            type="text"
            value={ign}
            onChange={(e) => { setIgn(e.target.value); setError(null); }}
            placeholder="In-Game Name (PoGo Name) *"
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: '#2a2a3e',
              color: '#ffffff',
              borderRadius: '12px',
              border: '2px solid transparent',
              outline: 'none',
              fontSize: '16px',
              fontFamily: 'inherit',
            }}
          />

          <AdminPicker selected={selectedAdmin} onSelect={handleAdminSelect} />

          {error && (
            <p style={{ color: '#F44336', fontSize: '14px', textAlign: 'center', margin: 0 }}>
              {error}
            </p>
          )}
        </div>

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
            marginTop: '20px',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#555555'; }}
          onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#444444'; }}
        >
          Continue as Guest
        </button>

        <p style={{ color: '#FFA500', fontSize: '12px', textAlign: 'center', marginTop: '16px', lineHeight: 1.6 }}>
          *Continuing as Guest will disable the ability to:
          <br />- Make orders
          <br />- Create Dex List
          <br />- Chat with Admins
          <br />- RSVP events
        </p>
      </div>
    </div>
  );
}
