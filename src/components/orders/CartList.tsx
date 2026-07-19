import { CartItem } from '@/stores/cartStore';
import { getUltimateGalleryUrl } from '@/services/imageUrlBuilder';

const COIN_5K_IMAGE = 'https://raw.githubusercontent.com/Skatecrete/infographics/main/web/misc/5kcoins.png';
const COIN_15K_IMAGE = 'https://raw.githubusercontent.com/Skatecrete/infographics/main/web/misc/15kcoins.png';
const COIN_31K_IMAGE = 'https://raw.githubusercontent.com/Skatecrete/infographics/main/web/misc/31kcoins.png';

function getCoinImage(coinAmount: number): string {
  if (coinAmount === 5600) return COIN_5K_IMAGE;
  if (coinAmount === 15500) return COIN_15K_IMAGE;
  if (coinAmount === 31000) return COIN_31K_IMAGE;
  return COIN_5K_IMAGE;
}

interface CartListProps {
  items: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemove: (index: number) => void;
}

export function CartList({ items, onUpdateQuantity, onRemove }: CartListProps) {
  if (items.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {items.map((item, index) => {
        const itemPrice = item.price || 0;

        // Determine image URL
        let imageUrl;
        if (item.type === 'coins' && item.coinAmount) {
          imageUrl = getCoinImage(item.coinAmount);
        } else if (item.imageUrl) {
          imageUrl = item.imageUrl;
        } else {
          imageUrl = getUltimateGalleryUrl(item.pokemonName) || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png';
        }

        return (
          <div
            key={item.id || index}
            style={{
              backgroundColor: '#1a1a2e',
              borderRadius: '8px',
              padding: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Image */}
              <div style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                <img
                  src={imageUrl}
                  alt={item.pokemonName}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png';
                  }}
                />
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.pokemonName}
                  {item.raidTier && ` (${item.raidTier})`}
                </p>
                <p style={{ color: '#4CAF50', fontSize: '12px' }}>
                  ${itemPrice.toFixed(2)}
                </p>
              </div>

              {/* Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                  style={{
                    width: '28px',
                    height: '28px',
                    backgroundColor: '#7627C5',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '50%',
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#5A1E9E'; }}
                  onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#7627C5'; }}
                >
                  -
                </button>
                <span style={{ color: '#ffffff', fontSize: '14px', width: '24px', textAlign: 'center' }}>
                  {item.quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                  style={{
                    width: '28px',
                    height: '28px',
                    backgroundColor: '#7627C5',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '50%',
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#5A1E9E'; }}
                  onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#7627C5'; }}
                >
                  +
                </button>
                <button
                  onClick={() => onRemove(index)}
                  style={{
                    width: '28px',
                    height: '28px',
                    backgroundColor: '#F44336',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '50%',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#c62828'; }}
                  onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#F44336'; }}
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}