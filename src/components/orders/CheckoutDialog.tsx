import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { CartItem } from '@/stores/cartStore';
import { PaymentDialog } from './PaymentDialog';

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totalPrice: number;
  onClearCart: () => void;
}

export function CheckoutDialog({ isOpen, onClose, items, totalPrice, onClearCart }: CheckoutDialogProps) {
  const { userName, userIgn } = useUser();
  const [showPayment, setShowPayment] = useState(false);
  const [showDiscord, setShowDiscord] = useState(false);

  const handleContinue = () => {
    setShowPayment(true);
  };

  if (!isOpen) return null;

  return (
    <>
      {!showPayment && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: 700 }}>
                Confirm Order
              </h2>
              <button
                onClick={onClose}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#888888',
                  fontSize: '24px',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(118, 39, 197, 0.15)',
                border: '1px solid rgba(118, 39, 197, 0.4)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '16px',
              }}
            >
              <p style={{ color: '#ffffff', fontSize: '14px', lineHeight: 1.6, margin: 0, textAlign: 'center' }}>
                After placing this order your Admin will reach out as soon as they can.
                Please visit the Discord Channel{' '}
                <button
                  onClick={() => setShowDiscord(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#22d3ee',
                    textDecoration: 'underline',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '14px',
                    padding: 0,
                  }}
                >
                  &gt; HERE &lt;
                </button>{' '}
                for a better understanding of how the process works!
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1, padding: '12px',
                  backgroundColor: '#444444',
                  color: '#ffffff',
                  border: 'none', borderRadius: '12px',
                  fontSize: '16px', fontWeight: 700, cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleContinue}
                style={{
                  flex: 1, padding: '12px',
                  backgroundColor: '#4CAF50',
                  color: '#ffffff',
                  border: 'none', borderRadius: '12px',
                  fontSize: '16px', fontWeight: 700, cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#3d8b40'; }}
                onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#4CAF50'; }}
              >
                ✓ Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <PaymentDialog
        isOpen={showPayment}
        onClose={() => {
          setShowPayment(false);
          onClose();
        }}
        customerName={userName}
        customerIgn={userIgn}
        timePreference="Whenever Possible"
        items={items}
        totalPrice={totalPrice}
        onClearCart={onClearCart}
      />

      <DiscordDialog isOpen={showDiscord} onClose={() => setShowDiscord(false)} />
    </>
  );
}

// ========== Discord dialog ==========
function DiscordDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
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
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: 700, margin: 0 }}>
            SilphCo Discord
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#888888',
              fontSize: '24px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ marginBottom: '16px', textAlign: 'center' }}>
          <p style={{ color: '#ffffff', fontSize: '15px', fontWeight: 700, marginBottom: '10px' }}>
            New to our Discord?
          </p>
          <a
            href="https://discord.gg/E999eTNtyu"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              padding: '14px',
              backgroundColor: '#5865F2',
              color: '#ffffff',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '15px',
              textDecoration: 'none',
              textAlign: 'center',
            }}
          >
            Join the Channel!
          </a>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#ffffff', fontSize: '15px', fontWeight: 700, marginBottom: '10px' }}>
            Existing Discordian?
          </p>
          <a
            href="https://discord.com/channels/1528530126839615538/1528530127816757280"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              padding: '14px',
              backgroundColor: '#5865F2',
              color: '#ffffff',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '15px',
              textDecoration: 'none',
              textAlign: 'center',
            }}
          >
            Welcome Back Trainer!
          </a>
        </div>
      </div>
    </div>
  );
}
