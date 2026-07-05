import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import { getUltimateGalleryUrl, getPokeApiUrl } from '@/services/imageUrlBuilder';

interface SpawnOrderDialogProps {
  isOpen: boolean;
  pokemon: any;
  onClose: () => void;
}

type QuantityType = 'shundo' | 'hundo' | 'shiny' | 'normal';

export function SpawnOrderDialog({ isOpen, pokemon, onClose }: SpawnOrderDialogProps) {
  const { addItem } = useCart();
  const [quantities, setQuantities] = useState({
    shundo: 0,
    hundo: 0,
    shiny: 0,
    normal: 0,
  });

  if (!pokemon) return null;

  const imageUrl = getUltimateGalleryUrl(pokemon.name) || getPokeApiUrl(pokemon.id);
  const shundoAvailable = pokemon.spawnRate >= 0.45 && pokemon.isShiny;
  const showShundoDisclaimer = pokemon.spawnRate >= 0.45 && pokemon.spawnRate < 0.65 && pokemon.isShiny;
  const isRegional = pokemon.isRegional;

  const PRICES = {
    shundo: 5.0,
    hundo: isRegional ? 8.0 : 3.0,
    shiny: isRegional ? 5.0 : 2.0,
    normal: 3.0,
  };

  const updateQuantity = (type: QuantityType, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta),
    }));
  };

  const getTotal = () => {
    return (
      quantities.shundo * PRICES.shundo +
      quantities.hundo * PRICES.hundo +
      quantities.shiny * PRICES.shiny +
      quantities.normal * PRICES.normal
    );
  };

  const handleAddToCart = () => {
    const total = getTotal();
    if (total === 0) return;

    if (quantities.shundo > 0) {
      addItem({
        id: `${pokemon.id}-shundo-${Date.now()}`,
        type: 'shundo',
        pokemonName: pokemon.name,
        quantity: quantities.shundo,
        price: quantities.shundo * PRICES.shundo,
        imageUrl,
      });
    }
    if (quantities.hundo > 0) {
      addItem({
        id: `${pokemon.id}-hundo-${Date.now()}`,
        type: 'hundo',
        pokemonName: pokemon.name,
        quantity: quantities.hundo,
        price: quantities.hundo * PRICES.hundo,
        imageUrl,
      });
    }
    if (quantities.shiny > 0) {
      addItem({
        id: `${pokemon.id}-shiny-${Date.now()}`,
        type: 'shiny',
        pokemonName: pokemon.name,
        quantity: quantities.shiny,
        price: quantities.shiny * PRICES.shiny,
        imageUrl,
      });
    }
    if (quantities.normal > 0) {
      addItem({
        id: `${pokemon.id}-normal-${Date.now()}`,
        type: 'normal',
        pokemonName: pokemon.name,
        quantity: quantities.normal,
        price: quantities.normal * PRICES.normal,
        imageUrl,
      });
    }

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
            className="relative bg-dark-card rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto p-6"
          >
            <div className="text-center mb-4">
              <img
                src={imageUrl}
                alt={pokemon.name}
                className="w-24 h-24 object-contain mx-auto"
              />
              <h2 className="text-white text-xl font-bold mt-2">{pokemon.name}</h2>
              <p className="text-gray-400 text-sm">
                Spawn Rate: {pokemon.spawnRate.toFixed(2)}% | {pokemon.shinyRate}
              </p>
            </div>

            {showShundoDisclaimer && (
              <div className="bg-orange-500/20 border border-orange-500 rounded-lg p-3 mb-4">
                <p className="text-orange-500 text-sm text-center">
                  ⚠️ Shundos between 0.45% - 0.65% may take up to 2 days to complete
                </p>
              </div>
            )}

            {shundoAvailable && (
              <QuantityRow
                label="✨ SHUNDO (100% IV + SHINY)"
                price={PRICES.shundo}
                quantity={quantities.shundo}
                onUpdate={(delta) => updateQuantity('shundo', delta)}
              />
            )}

            <QuantityRow
              label={`💯 HUNDO (100% IV)${isRegional ? ' - REGIONAL' : ''}`}
              price={PRICES.hundo}
              quantity={quantities.hundo}
              onUpdate={(delta) => updateQuantity('hundo', delta)}
            />

            <QuantityRow
              label={`✨ SHINY (Random IVs)${isRegional ? ' - REGIONAL' : ''}`}
              price={PRICES.shiny}
              quantity={quantities.shiny}
              onUpdate={(delta) => updateQuantity('shiny', delta)}
            />

            <QuantityRow
              label="🎲 NORMAL (Any IV)"
              price={PRICES.normal}
              quantity={quantities.normal}
              onUpdate={(delta) => updateQuantity('normal', delta)}
            />

            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex justify-between text-white text-lg font-bold">
                <span>Total:</span>
                <span className="text-green-500">${getTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-gray-700 text-white rounded-xl font-bold hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToCart}
                disabled={getTotal() === 0}
                className={`flex-1 py-3 rounded-xl font-bold transition-colors ${
                  getTotal() > 0
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

interface QuantityRowProps {
  label: string;
  price: number;
  quantity: number;
  onUpdate: (delta: number) => void;
}

function QuantityRow({ label, price, quantity, onUpdate }: QuantityRowProps) {
  return (
    <div className="bg-dark-bg/50 rounded-xl p-3 mb-3">
      <p className="text-white text-sm font-bold">
        {label} - ${price.toFixed(2)} each
      </p>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onUpdate(-1)}
            className="w-8 h-8 bg-purple-500 text-white rounded-full hover:bg-purple-700 transition-colors text-xl font-bold flex items-center justify-center"
          >
            -
          </button>
          <span className="text-white text-lg font-bold w-8 text-center">{quantity}</span>
          <button
            onClick={() => onUpdate(1)}
            className="w-8 h-8 bg-purple-500 text-white rounded-full hover:bg-purple-700 transition-colors text-xl font-bold flex items-center justify-center"
          >
            +
          </button>
        </div>
        <span className="text-green-500 font-bold">
          ${(quantity * price).toFixed(2)}
        </span>
      </div>
    </div>
  );
}