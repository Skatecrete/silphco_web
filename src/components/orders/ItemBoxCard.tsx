import { ItemBox } from '@/services/storeApi';
import { ItemBoxItem } from './ItemBoxItem';

interface ItemBoxCardProps {
  box: ItemBox;
  isSelected: boolean;
  onToggle: () => void;
}

export function ItemBoxCard({ box, isSelected, onToggle }: ItemBoxCardProps) {
  return (
    <div
      style={{
        backgroundColor: '#7627C5',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      }}
    >
      {/* Box Name */}
      <h3
        style={{
          color: '#ffffff',
          fontSize: '18px',
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: '12px',
        }}
      >
        {box.box_name}
      </h3>

      {/* Content Row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        {/* Left: Checkbox + Prices */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onToggle}
              style={{
                width: '20px',
                height: '20px',
                accentColor: '#ffffff',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ color: '#cccccc', fontSize: '14px' }}>In-Store Price:</span>
                <span
                  style={{
                    color: '#cccccc',
                    fontSize: '14px',
                    textDecoration: 'line-through',
                    textDecorationColor: '#F44336',
                    textDecorationThickness: '2px',
                  }}
                >
                  ${box.in_store_price.toFixed(2)}
                </span>
              </div>
              <span style={{ color: '#ffffff', fontSize: '16px', fontWeight: 700 }}>
                SilphCo Price: ${box.silphco_price.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Box Image */}
        <div style={{ flexShrink: 0 }}>
          <img
            src={box.box_image}
            alt={box.box_name}
            style={{
              width: '80px',
              height: '80px',
              objectFit: 'contain',
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '';
              target.style.cssText = 'width:80px;height:80px;background:#1a1a2e;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:24px;';
            }}
          />
        </div>
      </div>

      {/* Items Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '8px',
          marginTop: '12px',
        }}
      >
        {box.items.map((item, index) => (
          <ItemBoxItem key={index} item={item} />
        ))}
      </div>
    </div>
  );
}