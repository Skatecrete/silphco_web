import { useState } from 'react';

const COIN_5K_IMAGE = 'https://raw.githubusercontent.com/Skatecrete/infographics/main/web/misc/5kcoins.png';
const COIN_15K_IMAGE = 'https://raw.githubusercontent.com/Skatecrete/infographics/main/web/misc/15kcoins.png';
const COIN_31K_IMAGE = 'https://raw.githubusercontent.com/Skatecrete/infographics/main/web/misc/31kcoins.png';

interface CoinSelectorProps {
  prices: {
    coins5600: number;
    coins15500: number;
    coins31000: number;
  };
  onAddCoin: (amount: number) => void;
}

export function CoinSelector({ prices, onAddCoin }: CoinSelectorProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const handleSelect = (amount: number) => {
    setSelectedAmount(amount);
    onAddCoin(amount);
    setTimeout(() => {
      setSelectedAmount(null);
    }, 300);
  };

  const isSelected = (amount: number) => selectedAmount === amount;

  return (
    <div style={{ backgroundColor: '#2a2a3e', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
      <p style={{ color: '#ffffff', fontWeight: 700, marginBottom: '12px' }}>💰 ADD COINS TO ORDER</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        {/* 5,600 Coins */}
        <button
          onClick={() => handleSelect(5600)}
          style={{
            padding: '12px',
            backgroundColor: isSelected(5600) ? '#4CAF50' : '#7627C5',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background-color 0.2s, transform 0.1s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
          }}
          onMouseEnter={(e) => {
            if (!isSelected(5600)) {
              (e.target as HTMLButtonElement).style.backgroundColor = '#5A1E9E';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected(5600)) {
              (e.target as HTMLButtonElement).style.backgroundColor = '#7627C5';
            }
          }}
        >
          <img
            src={COIN_5K_IMAGE}
            alt="5,600 Coins"
            style={{
              width: '40px',
              height: '40px',
              objectFit: 'contain',
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <span>5,600</span>
          <span style={{ fontSize: '12px', fontWeight: 400 }}>${prices.coins5600}</span>
        </button>

        {/* 15,500 Coins */}
        <button
          onClick={() => handleSelect(15500)}
          style={{
            padding: '12px',
            backgroundColor: isSelected(15500) ? '#4CAF50' : '#7627C5',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background-color 0.2s, transform 0.1s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
          }}
          onMouseEnter={(e) => {
            if (!isSelected(15500)) {
              (e.target as HTMLButtonElement).style.backgroundColor = '#5A1E9E';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected(15500)) {
              (e.target as HTMLButtonElement).style.backgroundColor = '#7627C5';
            }
          }}
        >
          <img
            src={COIN_15K_IMAGE}
            alt="15,500 Coins"
            style={{
              width: '40px',
              height: '40px',
              objectFit: 'contain',
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <span>15,500</span>
          <span style={{ fontSize: '12px', fontWeight: 400 }}>${prices.coins15500}</span>
        </button>

        {/* 31,000 Coins */}
        <button
          onClick={() => handleSelect(31000)}
          style={{
            padding: '12px',
            backgroundColor: isSelected(31000) ? '#4CAF50' : '#7627C5',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background-color 0.2s, transform 0.1s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
          }}
          onMouseEnter={(e) => {
            if (!isSelected(31000)) {
              (e.target as HTMLButtonElement).style.backgroundColor = '#5A1E9E';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected(31000)) {
              (e.target as HTMLButtonElement).style.backgroundColor = '#7627C5';
            }
          }}
        >
          <img
            src={COIN_31K_IMAGE}
            alt="31,000 Coins"
            style={{
              width: '40px',
              height: '40px',
              objectFit: 'contain',
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <span>31,000</span>
          <span style={{ fontSize: '12px', fontWeight: 400 }}>${prices.coins31000}</span>
        </button>
      </div>
    </div>
  );
}