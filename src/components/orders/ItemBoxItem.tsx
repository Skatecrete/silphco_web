import { ItemBoxItem as ItemBoxItemType } from '@/services/storeApi';

interface ItemBoxItemProps {
  item: ItemBoxItemType;
}

export function ItemBoxItem({ item }: ItemBoxItemProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div
        style={{
          width: '48px',
          height: '48px',
          backgroundColor: '#1a1a2e',
          borderRadius: '8px',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={item.image}
          alt={item.name}
          style={{
            width: '40px',
            height: '40px',
            objectFit: 'contain',
          }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '';
            target.style.cssText = 'width:40px;height:40px;background:rgba(118,39,197,0.2);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:12px;';
          }}
        />
      </div>
      <span
        style={{
          color: '#FFA500',
          fontSize: '12px',
          fontWeight: 700,
          marginTop: '4px',
        }}
      >
        {item.count}
      </span>
    </div>
  );
}