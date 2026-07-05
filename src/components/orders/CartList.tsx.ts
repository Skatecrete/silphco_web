import { motion, AnimatePresence } from 'framer-motion';
import { CartItem } from '@/stores/cartStore';
import { getUltimateGalleryUrl } from '@/services/imageUrlBuilder';

interface CartListProps {
  items: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemove: (index: number) => void;
}

export function CartList({ items, onUpdateQuantity, onRemove }: CartListProps) {
  if (items.length === 0) return null;

  return (
    <AnimatePresence>
      <div className="space-y-2">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-dark-bg rounded-lg p-3"
          >
            <div className="flex items-center gap-3">
              {/* Image */}
              <div className="w-10 h-10 flex-shrink-0">
                <img
                  src={item.imageUrl || getUltimateGalleryUrl(item.pokemonName) || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'}
                  alt={item.pokemonName}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-bold truncate">
                  {item.pokemonName}
                  {item.raidTier && ` (${item.raidTier})`}
                </p>
                <p className="text-green-400 text-xs">
                  ${item.price.toFixed(2)}
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                  className="w-7 h-7 bg-purple-500 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors text-sm font-bold"
                >
                  -
                </button>
                <span className="text-white text-sm w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                  className="w-7 h-7 bg-purple-500 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors text-sm font-bold"
                >
                  +
                </button>
                <button
                  onClick={() => onRemove(index)}
                  className="w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors text-sm"
                >
                  🗑️
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
}