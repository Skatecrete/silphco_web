import { useState, useEffect } from 'react';
import { fetchStoreBoxes, ItemBox } from '@/services/storeApi';
import { ItemBoxCard } from './ItemBoxCard';
import { useCart } from '@/hooks/useCart';

interface ItemBoxDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ItemBoxDialog({ isOpen, onClose }: ItemBoxDialogProps) {
  const { addItem } = useCart();
  const [boxes, setBoxes] = useState<ItemBox[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (isOpen) {
      loadBoxes();
    }
  }, [isOpen]);

  const loadBoxes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchStoreBoxes();
      if (data && !data.error) {
        setBoxes(data.boxes);
      } else {
        setError('Failed to load store boxes. Please contact admin.');
      }
    } catch (e) {
      setError('Failed to load store boxes. Please contact admin.');
    } finally {
      setLoading(false);
    }
  };

  const toggleBox = (index: number) => {
    const newSelected = new Set(selectedIndices);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedIndices(newSelected);
  };

  const getTotalPrice = (): number => {
    let total = 0;
    selectedIndices.forEach((index) => {
      if (boxes[index]) {
        total += boxes[index].silphco_price;
      }
    });
    return total;
  };

  const handleAddToCart = () => {
    const total = getTotalPrice();
    if (total < 15) {
      alert('Total must be over $15 to purchase boxes.');
      return;
    }

    selectedIndices.forEach((index) => {
      const box = boxes[index];
      if (box) {
        addItem({
          id: `box-${Date.now()}-${index}`,
          type: 'service',
          pokemonName: `Item Box: ${box.box_name}`,
          quantity: 1,
          price: box.silphco_price,
          imageUrl: box.box_image,
        });
      }
    });

    alert(`Added ${selectedIndices.size} box(es) to cart!`);
    setSelectedIndices(new Set());
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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        overflow: 'auto',
      }}
    >
      <div
        style={{
          backgroundColor: '#1a1a2e',
          width: '100%',
          maxWidth: '400px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: '16px',
          margin: 'auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: '1px solid #444',
            flexShrink: 0,
          }}
        >
          <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: 700 }}>In-Store Item Boxes</h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#888888',
              fontSize: '24px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <div style={{ width: '48px', height: '48px', border: '4px solid #333', borderTopColor: '#7627C5', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ color: '#888888', marginTop: '16px' }}>Loading store boxes...</p>
            </div>
          ) : error ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <p style={{ color: '#F44336', textAlign: 'center' }}>{error}</p>
              <button
                onClick={loadBoxes}
                style={{
                  marginTop: '16px',
                  padding: '8px 24px',
                  backgroundColor: '#7627C5',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Retry
              </button>
            </div>
          ) : boxes.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <p style={{ color: '#888888', textAlign: 'center' }}>No boxes available</p>
            </div>
          ) : (
            <>
              <div
                style={{
                  backgroundColor: 'rgba(255,165,0,0.1)',
                  border: '1px solid rgba(255,165,0,0.3)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '16px',
                }}
              >
                <p style={{ color: '#FFA500', fontSize: '12px', textAlign: 'center', fontWeight: 700, lineHeight: 1.6 }}>
                  Item purchase(s) will only be accepted if total items selected from in-store items (Coins + Item Boxes) equates over $15.
                  <br />
                  <br />
                  Due to store rotation, there is a chance the item is no longer available.
                  <br />
                  <br />
                  Ensure you have item space in-game for purchase.
                </p>
              </div>

              {boxes.map((box, index) => (
                <ItemBoxCard
                  key={index}
                  box={box}
                  isSelected={selectedIndices.has(index)}
                  onToggle={() => toggleBox(index)}
                />
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid #444',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#F44336',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Go Back
          </button>

          {selectedIndices.size > 0 && (
            <button
              onClick={handleAddToCart}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#4CAF50',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#3d8b40'; }}
              onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#4CAF50'; }}
            >
              Add Selected to Cart  ${getTotalPrice().toFixed(2)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}