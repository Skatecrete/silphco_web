import { useState, useEffect } from 'react';
import { DebutData } from '@/services/leekDuckApi';

interface DebutBannerProps {
  debut: DebutData | null;
  onViewDebuts: () => void;
  onViewEvent: () => void;
}

export function DebutBanner({ debut, onViewDebuts, onViewEvent }: DebutBannerProps) {
  if (!debut) return null;

  const [timeLeft, setTimeLeft] = useState<string>('⏰ Starts in: Coming soon');

  useEffect(() => {
    // In a real implementation, you'd parse the event date and calculate
    setTimeLeft('⏰ Starts in: Coming soon');
  }, [debut]);

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(118,39,197,0.3), #1a1a2e)',
        border: '1px solid rgba(255,165,0,0.3)',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '16px',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#FFA500', fontSize: '14px', fontWeight: 700, margin: 0 }}>🎉 NEW POKÉMON DEBUT 🎉</p>
        <p style={{ color: '#22d3ee', fontSize: '18px', fontWeight: 700, marginTop: '4px' }}>{debut.event_name}</p>
        <p style={{ color: '#ffffff', fontSize: '14px', marginTop: '4px' }}>{timeLeft}</p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '12px' }}>
          <button
            onClick={onViewDebuts}
            style={{
              padding: '8px 16px',
              backgroundColor: '#7627C5',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            View Debut Mon
          </button>
          <button
            onClick={onViewEvent}
            style={{
              padding: '8px 16px',
              backgroundColor: '#2196F3',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            View Event
          </button>
        </div>
      </div>
    </div>
  );
}