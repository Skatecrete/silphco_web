import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import { getUltimateGalleryUrl, getPokeApiUrl } from '@/services/imageUrlBuilder';

interface RaidOrderDialogProps {
  isOpen: boolean;
  raid: any;
  onClose: () => void;
}

export function RaidOrderDialog({ isOpen, raid, onClose }: RaidOrderDialogProps) {
  const { addItem } = useCart();
  const [selectedPack, setSelectedPack] = useState<{ quantity: number; price: number } | null>(null);

  if (!raid) return null;

  const imageUrl = getUltimateGalleryUrl(raid.name, raid.isShiny) || getPokeApiUrl(raid.id);

  const PACKS = [
    { quantity: 10, price: 7.0 },
    { quantity: 20, price: 12.0 },
    { quantity: 50, price: 20.0 },
  ];

  const handleAddToCart = () => {
    if (!selectedPack) return;
    addItem({
      id: `${raid.id}-raid-${Date.now()}`,
      type: 'raid',
      pokemonName: raid.name,
      quantity: selectedPack.quantity,
      price: selectedPack.price,
      raidTier: raid.tier,
      imageUrl,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70" onClick={onClose} />

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="relative bg-dark-card rounded-2xl w-full max-w-sm p-6"
          >
            <div className="text-center mb-4">
              <img
                src={imageUrl}
                alt={raid.name}
                className="w-20 h-20 object-contain mx-auto"
              />
              <h2 className="text-white text-xl font-bold mt-2">{raid.name}</h2>
              <p className="text-gray-400 text-sm">{raid.tier}</p>
              <p className="text-yellow-400 text-sm">
                {raid.isShiny ? '✨ Shiny Available' : '❌ Shiny Not Available'}
              </p>
            </div>

            <p className="text-white text-sm font-bold mb-3">SELECT QUANTITY</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {PACKS.map((pack) => (
                <button
                  key={pack.quantity}
                  onClick={() => setSelectedPack(pack)}
                  className={`
                    py-3 rounded-xl font-bold text-white transition-colors
                    ${
                      selectedPack?.quantity === pack.quantity
                        ? 'bg-purple-500'
                        : 'bg-purple-500/50 hover:bg-purple-500/70'
                    }
                  `}
                >
                  {pack.quantity}
                  <br />
                  <span className="text-sm font-normal">${pack.price}</span>
                </button>
              ))}
            </div>

            {selectedPack && (
              <p className="text-white text-center mb-4">
                Selected: {selectedPack.quantity} Raids - ${selectedPack.price.toFixed(2)}
              </p>
            )}

            <div className="flex gap-3 mt-4">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-gray-700 text-white rounded-xl font-bold hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToCart}
                disabled={!selectedPack}
                className={`flex-1 py-3 rounded-xl font-bold transition-colors ${
                  selectedPack
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                Add to Cart
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}