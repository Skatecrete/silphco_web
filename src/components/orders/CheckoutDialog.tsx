import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/hooks/useUser';
import { CartItem } from '@/stores/cartStore';
import { AdminSelectionDialog } from './AdminSelectionDialog';

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totalPrice: number;
  onClearCart: () => void;
}

export function CheckoutDialog({ isOpen, onClose, items, totalPrice, onClearCart }: CheckoutDialogProps) {
  const { userDisplay, isLoggedIn } = useUser();
  const [name, setName] = useState('');
  const [ign, setIgn] = useState('');
  const [timePreference, setTimePreference] = useState('Whenever Possible');
  const [showAdminSelection, setShowAdminSelection] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    const trimmedName = name.trim();
    const trimmedIgn = ign.trim();

    if (!trimmedName || !trimmedIgn) {
      setError('Please enter both name and in-game name');
      return;
    }

    setError(null);
    setShowAdminSelection(true);
  };

  // Pre-fill with user data if logged in
  const handleOpen = () => {
    if (isLoggedIn && userDisplay) {
      const parts = userDisplay.split(' (');
      if (parts.length === 2) {
        setName(parts[0]);
        setIgn(parts[1].replace(')', ''));
      }
    }
    setError(null);
    setShowAdminSelection(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && !showAdminSelection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70" onClick={onClose} />

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="relative bg-dark-card rounded-2xl w-full max-w-sm p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-xl font-bold">Who are you?! Reveal Yourself!</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your First Name *"
                className="w-full px-4 py-3 bg-dark-bg text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <input
                type="text"
                value={ign}
                onChange={(e) => setIgn(e.target.value)}
                placeholder="In-Game Name (PoGo Name) *"
                className="w-full px-4 py-3 bg-dark-bg text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <div>
                <p className="text-white text-sm font-bold mb-1">⏰ Preferred Time to Start Order</p>
                <select
                  value={timePreference}
                  onChange={(e) => setTimePreference(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-bg text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Whenever Possible">Whenever Possible</option>
                  <option value="Morning (US)">Morning (US)</option>
                  <option value="Midday (US)">Midday (US)</option>
                  <option value="Night/Overnight (US)">Night/Overnight (US)</option>
                </select>
              </div>

              <p className="text-orange-500 text-xs">
                *Timed Events cannot have a predetermined time slot, nor can all orders be considered at certain times given the amount of orders we may have.
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-gray-700 text-white rounded-xl font-bold hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleContinue}
                className="flex-1 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors"
              >
                ✓ Continue
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Admin Selection Dialog */}
      <AdminSelectionDialog
        isOpen={showAdminSelection}
        onClose={() => {
          setShowAdminSelection(false);
          onClose();
        }}
        customerName={name}
        customerIgn={ign}
        timePreference={timePreference}
        items={items}
        totalPrice={totalPrice}
        onClearCart={onClearCart}
      />
    </AnimatePresence>
  );
}