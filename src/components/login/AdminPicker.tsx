import { useState } from 'react';
import { ADMIN_LIST, GamerTag } from '@/utils/adminMap';

interface AdminPickerProps {
  selected: GamerTag | null;
  onSelect: (tag: GamerTag) => void;
}

export function AdminPicker({ selected, onSelect }: AdminPickerProps) {
  const [toast, setToast] = useState<string | null>(null);

  const handleClick = (tag: GamerTag, available: boolean) => {
    if (!available) {
      setToast(`${tag} is temporarily unavailable. Please choose another admin.`);
      setTimeout(() => setToast(null), 2500);
      return;
    }
    onSelect(tag);
  };

  return (
    <div style={{ position: 'relative' }}>
      <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>
        👤 Who's your admin?
      </p>
      <p style={{ color: '#FFA500', fontSize: '12px', marginBottom: '12px', lineHeight: 1.4 }}>
        Don't know? Please contact your admin from your original contact method to find out!
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {ADMIN_LIST.map(({ gamerTag, available }) => {
          const isSelected = selected === gamerTag;
          return (
            <button
              key={gamerTag}
              onClick={() => handleClick(gamerTag, available)}
              disabled={!available}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                backgroundColor: isSelected ? '#4CAF50' : (available ? '#1a1a2e' : '#181818'),
                color: available ? '#ffffff' : '#555555',
                border: isSelected ? '2px solid #4CAF50' : '2px solid transparent',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: available ? 'pointer' : 'not-allowed',
                textAlign: 'left',
                transition: 'background-color 0.2s, border-color 0.2s',
              }}
            >
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                border: isSelected ? '2px solid #ffffff' : '2px solid #555555',
                backgroundColor: isSelected ? '#ffffff' : 'transparent',
                color: isSelected ? '#4CAF50' : 'transparent',
                fontSize: '14px',
                fontWeight: 900,
                flexShrink: 0,
              }}>
                {isSelected ? '✓' : ''}
              </span>
              <span style={{ flex: 1 }}>{gamerTag}</span>
              {!available && (
                <span style={{ fontSize: '11px', color: '#888888', fontWeight: 400 }}>
                  Unavailable
                </span>
              )}
            </button>
          );
        })}
      </div>

      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 24px',
            backgroundColor: '#F44336',
            color: '#ffffff',
            fontWeight: 700,
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            maxWidth: '90%',
            textAlign: 'center',
            fontSize: '13px',
            zIndex: 1000,
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}