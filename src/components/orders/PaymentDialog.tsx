import { useState } from 'react';
import { CartItem } from '@/stores/cartStore';
import { submitOrder } from '@/services/sheetsApi';

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  customerName: string;
  customerIgn: string;
  timePreference: string;
  selectedAdmin: string;
  items: CartItem[];
  totalPrice: number;
  onClearCart: () => void;
}

export function PaymentDialog({
  isOpen,
  onClose,
  customerName,
  customerIgn,
  timePreference,
  selectedAdmin,
  items,
  totalPrice,
  onClearCart,
}: PaymentDialogProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Copied: ${text}`);
  };

  const handleSubmitOrder = async (paymentMethod: string) => {
    setLoading(true);

    const orderData = {
      type: 'submitOrder',
      customerName: `${customerName} (${customerIgn})`,
      otherRequests: timePreference !== 'Whenever Possible' ? `Time Preference: ${timePreference}` : '',
      paymentMethod,
      assignedAdmin: selectedAdmin,
      items: items.map((item) => ({
        type: item.type,
        pokemonName: item.pokemonName,
        quantity: item.quantity,
        price: item.price,
        raidTier: item.raidTier,
        coinAmount: item.coinAmount,
        serviceName: item.serviceName,
      })),
    };

    try {
      const result = await submitOrder(orderData);
      if (result.status === 'success') {
        setSuccess(true);
        onClearCart();
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setLoading(false);
        }, 2000);
      } else {
        alert('Order failed. Please try again or contact admin.');
        setLoading(false);
      }
    } catch (e) {
      alert('Network error. Please try again.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const getPaymentOptions = () => {
    if (selectedAdmin === 'Dan') {
      return [
        { id: 'paypal', label: '💰 PayPal', identifier: '@danstudz', copyText: '@danstudz' },
        { id: 'cashapp', label: '💚 CashApp', identifier: '$DanStudz', copyText: '$DanStudz' },
        { id: 'venmo', label: '💙 Venmo', identifier: '@DanStudz', copyText: '@DanStudz' },
      ];
    } else if (selectedAdmin === 'Thomas') {
      return [
        { id: 'paypal', label: '💰 PayPal', identifier: '@Thomas061298', copyText: '@Thomas061298' },
      ];
    } else {
      return [
        { id: 'other', label: '⏳ Payment Options Coming Soon', identifier: '', copyText: '' },
      ];
    }
  };

  const paymentOptions = getPaymentOptions();

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 52,
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
        {loading ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ width: '48px', height: '48px', border: '4px solid #333', borderTopColor: '#7627C5', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: '#888888', marginTop: '16px' }}>Submitting order...</p>
          </div>
        ) : success ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
            <p style={{ color: '#ffffff', fontSize: '24px', fontWeight: 700 }}>✨ Success! ✨</p>
            <p style={{ color: '#888888', marginTop: '8px' }}>You Just Gained Some Aura 😎</p>
            <p style={{ color: '#4CAF50', marginTop: '16px' }}>Order submitted!</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: 700 }}>Complete Order</h2>
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
              <p style={{ color: '#ffffff', fontSize: '14px' }}><strong>Customer:</strong> {customerName} ({customerIgn})</p>
              <p style={{ color: '#ffffff', fontSize: '14px' }}><strong>Admin:</strong> {selectedAdmin}</p>
              <p style={{ color: '#4CAF50', fontSize: '14px', fontWeight: 700, marginTop: '4px' }}>Total: ${totalPrice.toFixed(2)}</p>
              {timePreference !== 'Whenever Possible' && (
                <p style={{ color: '#FFA500', fontSize: '14px' }}><strong>Time Preference:</strong> {timePreference}</p>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              {paymentOptions.map((option) => (
                <div key={option.id} style={{ backgroundColor: '#1a1a2e', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                  <p style={{ color: '#ffffff', fontWeight: 700, fontSize: '14px' }}>{option.label}</p>
                  {option.identifier && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '8px' }}>
                      <span style={{ color: '#ffffff', fontFamily: 'monospace', fontSize: '18px', backgroundColor: '#2a2a3e', padding: '4px 12px', borderRadius: '8px' }}>
                        {option.identifier}
                      </span>
                      <button
                        onClick={() => copyToClipboard(option.copyText)}
                        style={{
                          padding: '4px 16px',
                          backgroundColor: '#2196F3',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Copy
                      </button>
                    </div>
                  )}
                  {option.id === 'paypal' && (
                    <p style={{ color: '#FFA500', fontSize: '10px', marginTop: '4px' }}>
                      ⚠️ Please send with Friends and Family option
                    </p>
                  )}
                  {option.id === 'other' && (
                    <p style={{ color: '#FFA500', fontSize: '12px', marginTop: '4px' }}>
                      Please contact Kingi directly for payment options
                    </p>
                  )}
                </div>
              ))}
            </div>

            <p style={{ color: '#FFA500', fontSize: '12px', textAlign: 'center', marginBottom: '16px' }}>
              Once payment is received, your order will be placed in queue 🧙
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '12px',
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
              <button
                onClick={() => handleSubmitOrder('Web Order')}
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
                Submit Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}