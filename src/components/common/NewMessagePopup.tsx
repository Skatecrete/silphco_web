import { useNavigate } from 'react-router-dom';

interface NewMessagePopupProps {
  visible: boolean;
  unreadCount: number;
  onDismiss: () => void;
}

export function NewMessagePopup({ visible, unreadCount, onDismiss }: NewMessagePopupProps) {
  const navigate = useNavigate();

  if (!visible) return null;

  const lineOne =
    unreadCount === 1
      ? 'New Message from Admin'
      : `${unreadCount} New Messages from Admin`;

  const lineTwo = 'Tap to open Chat';

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
        padding: '10px 44px 10px 16px',
        backgroundColor: '#4CAF50',
        color: '#ffffff',
        fontWeight: 700,
        fontSize: '13px',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
        userSelect: 'none',
      }}
      onClick={() => {
        onDismiss();
        navigate('/app/chat');
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1.3,
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%',
          }}
        >
          {lineOne}
        </span>
        <span style={{ fontSize: '11px', fontWeight: 400, opacity: 0.9 }}>
          {lineTwo}
        </span>
      </div>

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
