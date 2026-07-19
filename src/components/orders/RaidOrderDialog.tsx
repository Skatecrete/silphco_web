import { useState } from 'react';
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
    // Reset selection after adding to cart
    setSelectedPack(null);
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
          padding: '24px',
          width: '100%',
          maxWidth: '400px',
          position: 'relative',
          margin: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <img
            src={imageUrl}
            alt={raid.name}
            style={{ width: '80px', height: '80px', objectFit: 'contain', margin: '0 auto' }}
          />
          <h2 style={{ color: '#ffffff', fontSize: '24px', fontWeight: 700, marginTop: '8px' }}>
            {raid.name}
          </h2>
          <p style={{ color: '#888888', fontSize: '14px' }}>{raid.tier}</p>
          <p style={{ color: '#FFD700', fontSize: '14px' }}>
            {raid.isShiny ? '✨ Shiny Available' : '❌ Shiny Not Available'}
          </p>
        </div>

        <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>
          SELECT QUANTITY
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
          {PACKS.map((pack) => (
            <button
              key={pack.quantity}
              onClick={() => setSelectedPack(pack)}
              style={{
                padding: '12px',
                backgroundColor: selectedPack?.quantity === pack.quantity ? '#4CAF50' : 'rgba(118, 39, 197, 0.5)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background-color 0.2s, transform 0.1s',
                fontSize: '14px',
                lineHeight: 1.4,
              }}
              onMouseEnter={(e) => {
                if (selectedPack?.quantity !== pack.quantity) {
                  (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(118, 39, 197, 0.7)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedPack?.quantity !== pack.quantity) {
                  (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(118, 39, 197, 0.5)';
                }
              }}
            >
              {pack.quantity}
              <br />
              <span style={{ fontSize: '12px', fontWeight: 400 }}>${pack.price}</span>
            </button>
          ))}
        </div>

        {selectedPack && (
          <p style={{ color: '#ffffff', textAlign: 'center', marginBottom: '16px' }}>
            Selected: {selectedPack.quantity} Raids - ${selectedPack.price.toFixed(2)}
          </p>
        )}

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
            onClick={handleAddToCart}
            disabled={!selectedPack}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: selectedPack ? '#4CAF50' : '#555555',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: selectedPack ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.2s, transform 0.1s',
            }}
            onMouseEnter={(e) => {
              if (selectedPack) {
                (e.target as HTMLButtonElement).style.backgroundColor = '#3d8b40';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedPack) {
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