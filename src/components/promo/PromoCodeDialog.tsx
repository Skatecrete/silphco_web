import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70" onClick={onClose} />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-dark-card rounded-2xl w-full max-w-md p-6 max-h-[85vh] flex flex-col"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-xl font-bold">Active Promo Codes</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-500 border-t-transparent" />
                  <p className="text-gray-400 mt-4 text-sm">Loading promo codes...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-500 text-sm">{error}</p>
                  <button
                    onClick={loadPromoCodes}
                    className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg text-sm"
                  >
                    Retry
                  </button>
                </div>
              ) : promoCodes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm">No active promo codes available</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {promoCodes.map((promo, index) => (
                    <div key={index} className="bg-dark-bg rounded-xl p-3">
                      <div className="flex items-start gap-3">
                        {promo.imageUrl && (
                          <img
                            src={promo.imageUrl}
                            alt={promo.title}
                            className="w-12 h-12 rounded-lg object-contain bg-dark-card flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-bold text-sm truncate">{promo.title}</p>
                          <p className="text-orange-400 font-mono text-sm font-bold">{promo.code}</p>
                          <p className="text-gray-400 text-xs">Rewards: {promo.rewards.join(', ')}</p>
                          {promo.expiry && (
                            <p className="text-gray-500 text-[10px]">Expires: {promo.expiry}</p>
                          )}
                        </div>
                        <button
                          onClick={() => copyToClipboard(promo.code)}
                          className="px-4 py-1 bg-blue-500 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}