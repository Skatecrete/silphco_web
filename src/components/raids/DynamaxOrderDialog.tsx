import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import { getUltimateGalleryUrl, getPokeApiUrl } from '@/services/imageUrlBuilder';

interface DynamaxOrderDialogProps {
  isOpen: boolean;
  raid: any;
  onClose: () => void;
}

export function DynamaxOrderDialog({ isOpen, raid, onClose }: DynamaxOrderDialogProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(0);

  if (!raid) return null;

  const isGigantamax = raid.tier.includes('Gigantamax');
  const imageUrl = getUltimateGalleryUrl(raid.name, true, false, isGigantamax) || getPokeApiUrl(raid.id);

  const DYNAMAX_PRICE_PER_4 = 10.0;
  const DYNAMAX_PRICE_SINGLE = 2.5;

  const calculatePrice = (qty: number) => {
    return Math.floor(qty / 4) * DYNAMAX_PRICE_PER_4 + (qty % 4) * DYNAMAX_PRICE_SINGLE;
  };

  const handleAddToCart = () => {
    if (quantity === 0) return;
    const price = calculatePrice(quantity);
    addItem({
      id: `${raid.id}-dynamax-${Date.now()}`,
      type: 'dynamax',
      pokemonName: raid.name,
      quantity,
      price,
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
            </div>

            <p className="text-white text-sm font-bold mb-3">
              SELECT QUANTITY (4 for ${DYNAMAX_PRICE_PER_4} or ${DYNAMAX_PRICE_SINGLE} each)
            </p>

            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={() => setQuantity(Math.max(0, quantity - 1))}
                className="w-10 h-10 bg-purple-500 text-white rounded-full hover:bg-purple-700 transition-colors text-2xl font-bold flex items-center justify-center"
              >
                -
              </button>
              <span className="text-white text-2xl font-bold w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 bg-purple-500 text-white rounded-full hover:bg-purple-700 transition-colors text-2xl font-bold flex items-center justify-center"
              >
                +
              </button>
            </div>

            {quantity > 0 && (
              <p className="text-green-500 text-center font-bold mb-4">
                Price: ${calculatePrice(quantity).toFixed(2)}
              </p>
            )}

            <p className="text-orange-500 text-xs text-center mb-4">
              ⚠️ Raids may be limited due to spawning distance, personal mon not strong enough, or limited max particle use.
            </p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-gray-700 text-white rounded-xl font-bold hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToCart}
                disabled={quantity === 0}
                className={`flex-1 py-3 rounded-xl font-bold transition-colors ${
                  quantity > 0
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