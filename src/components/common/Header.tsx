import { useNavigate } from 'react-router-dom';
import { BackArrowIcon, CartIcon } from './Icons';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showCart?: boolean;
  cartCount?: number;
}

export function Header({ 
  title, 
  showBack = true, 
  showCart = true, 
  cartCount = 0 
}: HeaderProps) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        flexShrink: 0,
        padding: '12px 16px',
        backgroundColor: 'rgba(26, 26, 46, 0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(128, 128, 128, 0.2)',
        minHeight: '56px',
      }}
    >
      {/* Left: Back Button */}
      <div
        style={{
          minWidth: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        {showBack && (
          <button
            onClick={() => navigate('/app/home')}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Back"
          >
            <BackArrowIcon size={24} />
          </button>
        )}
      </div>

      {/* Center: Title */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 8px',
        }}
      >
        <h1
          style={{
            color: '#ffffff',
            fontSize: '18px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '60%',
            margin: 0,
          }}
        >
          {title}
        </h1>
      </div>

      {/* Right: Cart Button */}
      <div
        style={{
          minWidth: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        {showCart && (
          <button
            onClick={() => navigate('/app/orders')}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              position: 'relative',
            }}
            aria-label="Cart"
          >
            <span
              style={{
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
                display: 'inline',
              }}
            >
              Order Cart
            </span>
            <CartIcon size={24} />
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-8px',
                  backgroundColor: '#FFA500',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: 700,
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {cartCount}
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}