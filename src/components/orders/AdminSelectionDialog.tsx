import { useState } from 'react';
import { CartItem } from '@/stores/cartStore';
import { PaymentDialog } from './PaymentDialog';

interface AdminSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  customerName: string;
  customerIgn: string;
  timePreference: string;
  items: CartItem[];
  totalPrice: number;
  onClearCart: () => void;
}

export function AdminSelectionDialog({
  isOpen,
  onClose,
  customerName,
  customerIgn,
  timePreference,
  items,
  totalPrice,
  onClearCart,
}: AdminSelectionDialogProps) {
  const [selectedAdmin, setSelectedAdmin] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const handleAdminSelect = (admin: string) => {
    setSelectedAdmin(admin);
    setShowPayment(true);
  };

  if (!isOpen) return null;

  return (
    <>
      {!showPayment && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 51,
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
              <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: 700 }}>Choose Your Admin</h2>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => handleAdminSelect('Dan')}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: '#2E7D32',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#1B5E20'; }}
                onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#2E7D32'; }}
              >
                Dan (Skatecrete)
              </button>
              <button
                onClick={() => handleAdminSelect('Kingi')}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: '#0D47A1',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#0A1F6E'; }}
                onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#0D47A1'; }}
              >
                Kingi (zEViLvSTON4z)
              </button>
              <button
                onClick={() => handleAdminSelect('Thomas')}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: '#E65100',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#BF360C'; }}
                onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#E65100'; }}
              >
                Thomas (RampageGamer)
              </button>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #444' }}>
              <button
                onClick={onClose}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#444444',
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
        customerIgn={customerIgn}
        timePreference={timePreference}
        selectedAdmin={selectedAdmin || ''}
        items={items}
        totalPrice={totalPrice}
        onClearCart={onClearCart}
      />
    </>
  );
}