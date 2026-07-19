import { useState, useEffect } from 'react';
import { fetchPromoCodes, PromoCode } from '@/services/leekDuckApi';

interface PromoCodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PromoCodeDialog({ isOpen, onClose }: PromoCodeDialogProps) {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadPromoCodes();
    }
  }, [isOpen]);

  const loadPromoCodes = async () => {
    setLoading(true);
    setError(null);
    try {
      const codes = await fetchPromoCodes();
      setPromoCodes(codes);
    } catch (err) {
      setError('Failed to load promo codes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Copied: ${text}`);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        overflow: 'auto',
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
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          margin: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexShrink: 0 }}>
          <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: 700 }}>Active Promo Codes</h2>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#F44336',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50%',
              fontSize: '18px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 0' }}>
              <div style={{ width: '40px', height: '40px', border: '4px solid #333', borderTopColor: '#7627C5', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ color: '#888888', fontSize: '14px', marginTop: '16px' }}>Loading promo codes...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <p style={{ color: '#F44336', fontSize: '14px' }}>{error}</p>
              <button
                onClick={loadPromoCodes}
                style={{
                  marginTop: '16px',
                  padding: '8px 24px',
                  backgroundColor: '#7627C5',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Retry
              </button>
            </div>
          ) : promoCodes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <p style={{ color: '#888888', fontSize: '14px' }}>No active promo codes available</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {promoCodes.map((promo, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: '#1a1a2e',
                    borderRadius: '12px',
                    padding: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    {promo.imageUrl && (
                      <img
                        src={promo.imageUrl}
                        alt={promo.title}
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '8px',
                          objectFit: 'contain',
                          backgroundColor: '#2a2a3e',
                          flexShrink: 0,
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: '#ffffff', fontWeight: 700, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {promo.title}
                      </p>
                      <p style={{ color: '#FFA500', fontFamily: 'monospace', fontSize: '14px', fontWeight: 700 }}>
                        {promo.code}
                      </p>
                      <p style={{ color: '#888888', fontSize: '12px' }}>Rewards: {promo.rewards.join(', ')}</p>
                      {promo.expiry && (
                        <p style={{ color: '#555555', fontSize: '10px' }}>Expires: {promo.expiry}</p>
                      )}
                    </div>
                    <button
                      onClick={() => copyToClipboard(promo.code)}
                      style={{
                        padding: '4px 16px',
                        backgroundColor: '#2196F3',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    >
                      Copy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}