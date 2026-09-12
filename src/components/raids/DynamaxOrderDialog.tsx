import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { getComingSoonUrl, resolveImage } from '@/services/imageUrlBuilder';

interface DynamaxOrderDialogProps {
  isOpen: boolean;
  raid: any;
  onClose: () => void;
}

export function DynamaxOrderDialog({ isOpen, raid, onClose }: DynamaxOrderDialogProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if (!isOpen) setQuantity(0);
  }, [isOpen]);

  useEffect(() => {
    setQuantity(0);
  }, [raid]);

  if (!raid) return null;

  const isGigantamax = raid.tier.includes('Gigantamax');
  const imageUrl = resolveImage(raid.name, raid.id, true, false, isGigantamax);

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
    setQuantity(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
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
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = getComingSoonUrl();
            }}
          />
          <h2 style={{ color: '#ffffff', fontSize: '24px', fontWeight: 700, marginTop: '8px' }}>
            {raid.name}
          </h2>
          <p style={{ color: '#888888', fontSize: '14px' }}>{raid.tier}</p>
        </div>

        <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>
          SELECT QUANTITY (4 for ${DYNAMAX_PRICE_PER_4} or ${DYNAMAX_PRICE_SINGLE} each)
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '16px' }}>
          <button
            onClick={() => setQuantity(Math.max(0, quantity - 1))}
            style={{
              width: '40px', height: '40px',
              backgroundColor: '#7627C5',
              color: '#ffffff', border: 'none', borderRadius: '50%',
              fontSize: '24px', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background-color 0.2s, transform 0.1s',
            }}
            onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#5A1E9E'; }}
            onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#7627C5'; }}
          >
            -
          </button>
          <span style={{ color: '#ffffff', fontSize: '24px', fontWeight: 700, width: '48px', textAlign: 'center' }}>
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            style={{
              width: '40px', height: '40px',
              backgroundColor: '#7627C5',
              color: '#ffffff', border: 'none', borderRadius: '50%',
              fontSize: '24px', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background-color 0.2s, transform 0.1s',
            }}
            onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#5A1E9E'; }}
            onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#7627C5'; }}
          >
            +
          </button>
        </div>

        {quantity > 0 && (
          <p style={{ color: '#4CAF50', textAlign: 'center', fontWeight: 700, marginBottom: '16px' }}>
            Price: ${calculatePrice(quantity).toFixed(2)}
          </p>
        )}

        <p style={{ color: '#FFA500', fontSize
