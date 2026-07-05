import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  // Payment options based on admin
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
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70" onClick={onClose} />

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="relative bg-dark-card rounded-2xl w-full max-w-sm p-6 max-h-[90vh] overflow-y-auto"
          >
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto" />
                <p className="text-gray-400 mt-4">Submitting order...</p>
              </div>
            ) : success ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✅</div>
                <p className="text-white text-xl font-bold">✨ Success! ✨</p>
                <p className="text-gray-400 mt-2">You Just Gained Some Aura 😎</p>
                <p className="text-green-400 text-sm mt-4">Order submitted!</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-white text-xl font-bold">Complete Order</h2>
                  <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">
                    ✕
                  </button>
                </div>

                {/* Order Summary */}
                <div className="bg-dark-bg rounded-xl p-3 mb-4">
                  <p className="text-white text-sm">
                    <strong>Customer:</strong> {customerName} ({customerIgn})
                  </p>
                  <p className="text-white text-sm">
                    <strong>Admin:</strong> {selectedAdmin}
                  </p>
                  <p className="text-green-400 text-sm font-bold mt-1">
                    Total: ${totalPrice.toFixed(2)}
                  </p>
                  {timePreference !== 'Whenever Possible' && (
                    <p className="text-orange-500 text-sm">
                      <strong>Time Preference:</strong> {timePreference}
                    </p>
                  )}
                </div>

                {/* Payment Options */}
                <div className="space-y-3 mb-4">
                  {paymentOptions.map((option) => (
                    <div key={option.id} className="bg-dark-bg rounded-xl p-3 text-center">
                      <p className="text-white font-bold text-sm">{option.label}</p>
                      {option.identifier && (
                        <div className="flex items-center justify-center gap-3 mt-2">
                          <span className="text-white font-mono text-lg bg-dark-card px-3 py-1 rounded-lg">
                            {option.identifier}
                          </span>
                          <button
                            onClick={() => copyToClipboard(option.copyText)}
                            className="px-4 py-1 bg-blue-500 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Copy
                          </button>
                        </div>
                      )}
                      {option.id === 'paypal' && (
                        <p className="text-orange-500 text-[10px] mt-1">
                          ⚠️ Please send with Friends and Family option
                        </p>
                      )}
                      {option.id === 'other' && (
                        <p className="text-orange-500 text-xs mt-1">
                          Please contact Kingi directly for payment options
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-orange-500 text-xs text-center mb-4">
                  Once payment is received, your order will be placed in queue 🧙
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 bg-gray-700 text-white rounded-xl font-bold hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSubmitOrder('Web Order')}
                    className="flex-1 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors"
                  >
                    Submit Order
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}