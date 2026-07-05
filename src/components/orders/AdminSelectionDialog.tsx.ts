import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <AnimatePresence>
      {isOpen && !showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70" onClick={onClose} />

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="relative bg-dark-card rounded-2xl w-full max-w-sm p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-xl font-bold">Choose Your Admin</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleAdminSelect('Dan')}
                className="w-full py-4 bg-green-600 text-white text-center font-bold rounded-xl hover:bg-green-700 transition-colors"
              >
                Dan (Skatecrete)
              </button>
              <button
                onClick={() => handleAdminSelect('Kingi')}
                className="w-full py-4 bg-blue-600 text-white text-center font-bold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Kingi (zEViLvSTON4z)
              </button>
              <button
                onClick={() => handleAdminSelect('Thomas')}
                className="w-full py-4 bg-orange-600 text-white text-center font-bold rounded-xl hover:bg-orange-700 transition-colors"
              >
                Thomas (RampageGamer)
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
              <button
                onClick={onClose}
                className="w-full py-2 bg-gray-700 text-white rounded-xl font-bold hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Payment Dialog */}
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
    </AnimatePresence>
  );
}