import { useState } from 'react';

interface AdminLoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (adminName: string, username: string) => void;
}

export function AdminLoginDialog({ isOpen, onClose, onLogin }: AdminLoginDialogProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    // Hardcoded admin credentials (matches Android)
    const admins: Record<string, string> = {
      'Dan': '2kings',
      'Kingi': '2kings',
      'Thomas': '2kings',
    };

    if (admins[username] === password) {
      onLogin(username, username);
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 16px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#2a2a3e',
          borderRadius: '16px',
          padding: '24px',
          width: '100%',
          maxWidth: '400px',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ color: '#ffffff', fontSize: '24px', fontWeight: 700, textAlign: 'center', marginBottom: '16px' }}>
          Admin Login
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: '#1a1a2e',
              color: '#ffffff',
              borderRadius: '12px',
              border: '2px solid transparent',
              outline: 'none',
              fontSize: '16px',
              fontFamily: 'inherit',
            }}
            onFocus={(e) => { e.target.style.borderColor = '#7627C5'; }}
            onBlur={(e) => { e.target.style.borderColor = 'transparent'; }}
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: '#1a1a2e',
              color: '#ffffff',
              borderRadius: '12px',
              border: '2px solid transparent',
              outline: 'none',
              fontSize: '16px',
              fontFamily: 'inherit',
            }}
            onFocus={(e) => { e.target.style.borderColor = '#7627C5'; }}
            onBlur={(e) => { e.target.style.borderColor = 'transparent'; }}
          />

          {error && (
            <p style={{ color: '#F44336', fontSize: '14px', textAlign: 'center', margin: 0 }}>
              Invalid credentials
            </p>
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#F44336',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#4CAF50',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#3d8b40'; }}
              onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#4CAF50'; }}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}