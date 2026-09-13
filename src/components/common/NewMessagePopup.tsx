import { useNavigate } from 'react-router-dom';

interface NewMessagePopupProps {
  visible: boolean;
  unreadCount: number;
  onDismiss: () => void;
}

export function NewMessagePopup({ visible, unreadCount, onDismiss }: NewMessagePopupProps) {
  const navigate = useNavigate();

  if (!visible) return null;

  const label =
    unreadCount === 1
      ? '📩 New message from your Admin — tap to open chat'
      : `📩 ${unreadCount} new messages from your Admin — tap to open chat`;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 44px 10px 16px',
        backgroundColor: '#4CAF50',
        color: '#ffffff',
        fontWeight: 700,
        fontSize: '13px',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
        textAlign: 'center',
        userSelect: 'none',
      }}
      onClick={() => {
        onDismiss();
        navigate('/app/chat');
      }}
    >
      <span>{label}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDismiss();
        }}
        aria-label="Dismiss"
        style={{
          position: 'absolute',
          right: '8px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          backgroundColor: 'rgba(0,0,0,0.2)',
          color: '#ffffff',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          fontWeight: 700,
          padding: 0,
        }}
      >
        ✕
      </button>
    </div>
  );
}