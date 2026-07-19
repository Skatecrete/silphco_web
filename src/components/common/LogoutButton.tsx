import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { useAppStore } from '@/stores/appStore';

interface LogoutButtonProps {
  variant?: 'icon' | 'text';
}

export function LogoutButton({ variant = 'icon' }: LogoutButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const { logout } = useUser();
  const { lock } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    lock();
    navigate('/gate', { replace: true });
    setShowConfirm(false);
  };

  if (variant === 'icon') {
    return (
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowConfirm(!showConfirm)}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#888888',
            fontSize: '14px',
            padding: '4px',
          }}
        >
          ⚡
        </button>

        {showConfirm && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: '32px',
              backgroundColor: '#2a2a3e',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              border: '1px solid #444',
              padding: '12px',
              width: '160px',
              zIndex: 50,
            }}
          >
            <p
              style={{
                color: '#ffffff',
                fontSize: '14px',
                textAlign: 'center',
                marginBottom: '12px',
              }}
            >
              Logout?
            </p>
            <div
              style={{
                display: 'flex',
                gap: '8px',
              }}
            >
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  flex: 1,
                  padding: '8px',
                  backgroundColor: '#444',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                style={{
                  flex: 1,
                  padding: '8px',
                  backgroundColor: '#F44336',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: '#F44336',
        fontSize: '14px',
        padding: '4px 8px',
      }}
    >
      🚪 Logout
    </button>
  );
}