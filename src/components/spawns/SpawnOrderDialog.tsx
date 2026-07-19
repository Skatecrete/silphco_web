import { useState, useEffect } from 'react';
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

  // Reset quantities when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setQuantities({
        shundo: 0,
        hundo: 0,
        shiny: 0,
        normal: 0,
      });
    }
  }, [isOpen]);

  // Reset quantities when Pokemon changes
  useEffect(() => {
    setQuantities({
      shundo: 0,
      hundo: 0,
      shiny: 0,
      normal: 0,
    });
  }, [pokemon]);

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

    // Reset all quantities after adding to cart
    setQuantities({
      shundo: 0,
      hundo: 0,
      shiny: 0,
      normal: 0,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
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
          width: '100%',
          maxWidth: '400px',
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: '24px',
          position: 'relative',
          margin: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <img
            src={imageUrl}
            alt={pokemon.name}
            style={{
              width: '96px',
              height: '96px',
              objectFit: 'contain',
              margin: '0 auto',
            }}
          />
          <h2 style={{ color: '#ffffff', fontSize: '24px', fontWeight: 700, marginTop: '8px' }}>
            {pokemon.name}
          </h2>
          <p style={{ color: '#888888', fontSize: '14px' }}>
            Spawn Rate: {pokemon.spawnRate.toFixed(2)}% | {pokemon.shinyRate}
          </p>
        </div>

        {showShundoDisclaimer && (
          <div
            style={{
              backgroundColor: 'rgba(255, 165, 0, 0.2)',
              border: '1px solid #FFA500',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px',
            }}
          >
            <p style={{ color: '#FFA500', fontSize: '14px', textAlign: 'center', margin: 0 }}>
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

        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ffffff', fontSize: '18px', fontWeight: 700 }}>
            <span>Total:</span>
            <span style={{ color: '#4CAF50' }}>${getTotal().toFixed(2)}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
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
            onClick={handleAddToCart}
            disabled={getTotal() === 0}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: getTotal() > 0 ? '#4CAF50' : '#555555',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: getTotal() > 0 ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.2s, transform 0.1s',
            }}
            onMouseEnter={(e) => {
              if (getTotal() > 0) {
                (e.target as HTMLButtonElement).style.backgroundColor = '#3d8b40';
              }
            }}
            onMouseLeave={(e) => {
              if (getTotal() > 0) {
                (e.target as HTMLButtonElement).style.backgroundColor = '#4CAF50';
              }
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
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
    <div
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '12px',
        padding: '12px',
        marginBottom: '12px',
      }}
    >
      <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: 700, margin: 0 }}>
        {label} - ${price.toFixed(2)} each
      </p>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => onUpdate(-1)}
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#7627C5',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50%',
              fontSize: '20px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s, transform 0.1s',
            }}
            onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#5A1E9E'; }}
            onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#7627C5'; }}
          >
            -
          </button>
          <span style={{ color: '#ffffff', fontSize: '20px', fontWeight: 700, width: '32px', textAlign: 'center' }}>
            {quantity}
          </span>
          <button
            onClick={() => onUpdate(1)}
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#7627C5',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50%',
              fontSize: '20px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s, transform 0.1s',
            }}
            onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#5A1E9E'; }}
            onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#7627C5'; }}
          >
            +
          </button>
        </div>
        <span style={{ color: '#4CAF50', fontWeight: 700, fontSize: '16px' }}>
          ${(quantity * price).toFixed(2)}
        </span>
      </div>
    </div>
  );
}