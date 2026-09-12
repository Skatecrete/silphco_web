import { useState, useEffect } from 'react';
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
  const { userDisplay, isLoggedIn } = useUser();
  const [timePreference, setTimePreference] = useState('Whenever Possible');
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    if (isOpen && isLoggedIn && userDisplay) {
      // Nothing to prefill — userDisplay is just the gamer tag now.
    }
  }, [isOpen, isLoggedIn, userDisplay]);

  const handleContinue = () => {
    setShowPayment(true);
  };

  if (!isOpen) return null;

  const customerName = userDisplay || 'Guest';

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
              <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: 700 }}>Confirm Order</h2>
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

            <div style={{ backgroundColor: '#1a1a2e', borderRadius: '12px', padding: '12px', marginBottom: '16px' }}>
              <p style={{ color: '#ffffff', fontSize: '14px' }}>
                <strong>Trainer:</strong> {customerName}
              </p>
            </div>

            <div>
              <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>
                ⏰ Preferred Time to Start Order
              </p>
              <select
                value={timePreference}
                onChange={(e) => setTimePreference(e.target.value)}
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
              >
                <option value="Whenever Possible">Whenever Possible</option>
                <option value="Morning (US)">Morning (US)</option>
                <option value="Midday (US)">Midday (US)</option>
                <option value="Night/Overnight (US)">Night/Overnight (US)</option>
              </select>
            </div>

            <p style={{ color: '#FFA500', fontSize: '12px', marginTop: '12px' }}>
              *Timed Events cannot have a predetermined time slot, nor can all orders be considered at certain times given the amount of orders we may have.
            </p>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
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
        customerName={customerName}
        customerIgn=""
        timePreference={timePreference}
        items={items}
        totalPrice={totalPrice}
        onClearCart={onClearCart}
      />
    </>
  );
}
