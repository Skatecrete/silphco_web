import { useState } from 'react';

interface PromoButtonProps {
  onClick: () => void;
}

export function PromoButton({ onClick }: PromoButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '4px 10px',
        backgroundColor: 'transparent',
        border: '2px solid #FFA500',
        borderRadius: '12px',
        color: '#ffffff',
        fontSize: '10px',
        fontWeight: 'bold',
        lineHeight: 1.3,
        textAlign: 'center',
        minWidth: '52px',
        cursor: 'pointer',
        whiteSpace: 'pre-line',
        fontFamily: 'inherit',
      }}
    >
      Promo<br />Codes
    </button>
  );
}