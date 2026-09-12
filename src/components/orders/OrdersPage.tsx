import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { usePricing } from '@/hooks/usePricing';
import { CartList } from './CartList';
import { CoinSelector } from './CoinSelector';
import { CheckoutDialog } from './CheckoutDialog';
import { ItemBoxDialog } from './ItemBoxDialog';
import { Header } from '@/components/common/Header';

export function OrdersPage() {
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, clearCart, updateQuantity, removeItem, addItem } = useCart();
  const { prices } = usePricing();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showItemBoxes, setShowItemBoxes] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showDiscord, setShowDiscord] = useState(false);

  const handleAddCoin = (coinAmount: number) => {
    const existingIndex = items.findIndex(
      (item) => item.type === 'coins' && item.coinAmount === coinAmount
    );

    if (existingIndex >= 0) {
      const existingItem = items[existingIndex];
      updateQuantity(existingIndex, existingItem.quantity + 1);
    } else {
      const price = coinAmount === 5600 ? prices.coins5600 :
                    coinAmount === 15500 ? prices.coins15500 :
                    prices.coins31000;

      addItem({
        id: `coins-${coinAmount}-${Date.now()}`,
        type: 'coins',
        pokemonName: `${coinAmount} Coins`,
        quantity: 1,
        price: price,
        coinAmount: coinAmount,
      });
    }
  };

  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    updateQuantity(index, newQuantity);
  };

  const handleRemove = (index: number) => {
    removeItem(index);
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    setShowCheckout(true);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#1a1a2e', overflow: 'hidden' }}>
      <Header title="Order Cart" cartCount={totalItems} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
        <div style={{ backgroundColor: '#2a2a3e', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <p style={{ color: '#ffffff', fontWeight: 700 }}>🛒 YOUR CART</p>
            <p style={{ color: '#888888', fontSize: '14px' }}>{totalItems} items</p>
          </div>

          <CartList
            items={items}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemove}
          />

          {items.length === 0 && (
            <p style={{ color: '#888888', textAlign: 'center', padding: '16px 0' }}>Your Pokecart is empty</p>
          )}

          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #444' }}>
            <p style={{ color: '#4CAF50', textAlign: 'right', fontWeight: 700 }}>
              Total: ${totalPrice.toFixed(2)}
            </p>
          </div>
        </div>

        <CoinSelector prices={prices} onAddCoin={handleAddCoin} />

        <button
          onClick={() => setShowItemBoxes(true)}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#7627C5',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: '16px',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#5A1E9E'; }}
          onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#7627C5'; }}
        >
          🎁 View/Add In-Store Item Boxes
        </button>

        <button
          onClick={handleCheckout}
          disabled={items.length === 0}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: items.length > 0 ? '#4CAF50' : '#555555',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 700,
            cursor: items.length > 0 ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            if (items.length > 0) {
              (e.target as HTMLButtonElement).style.backgroundColor = '#3d8b40';
            }
          }}
          onMouseLeave={(e) => {
            if (items.length > 0) {
              (e.target as HTMLButtonElement).style.backgroundColor = '#4CAF50';
            }
          }}
        >
          {items.length > 0 ? '🛒 PROCEED TO CHECKOUT' : '🛒 ADD ITEMS TO CART'}
        </button>

        <button
          onClick={() => setShowQuestions(true)}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#2196F3',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
            marginTop: '16px',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#1976D2'; }}
          onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#2196F3'; }}
        >
          ❓ Questions?
        </button>
      </div>

      <CheckoutDialog
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        items={items}
        totalPrice={totalPrice}
        onClearCart={clearCart}
      />

      <ItemBoxDialog
        isOpen={showItemBoxes}
        onClose={() => setShowItemBoxes(false)}
      />

      {/* Questions? popup */}
      {showQuestions && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          }}
          onClick={() => setShowQuestions(false)}
        >
          <div
            style={{
              backgroundColor: '#2a2a3e',
              borderRadius: '16px',
              padding: '24px',
              width: '100%',
              maxWidth: '400px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: 700, margin: 0 }}>
                Questions?
              </h2>
              <button
                onClick={() => setShowQuestions(false)}
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

            <button
              onClick={() => {
                setShowQuestions(false);
                navigate('/app/chat');
              }}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: '#7627C5',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                marginBottom: '12px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#5A1E9E'; }}
              onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#7627C5'; }}
            >
              💬 SilphCo Chat
            </button>

            <button
              onClick={() => {
                setShowQuestions(false);
                setShowDiscord(true);
              }}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: '#5865F2',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#4752C4'; }}
              onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.backgroundColor = '#5865F2'; }}
            >
              🎮 Discord
            </button>
          </div>
        </div>
      )}

      <DiscordDialog isOpen={showDiscord} onClose={() => setShowDiscord(false)} />
    </div>
  );
}

// ========== Discord dialog ==========
function DiscordDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: 700, margin: 0 }}>
            SilphCo Discord
          </h2>
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

        <div style={{ marginBottom: '16px', textAlign: 'center' }}>
          <p style={{ color: '#ffffff', fontSize: '15px', fontWeight: 700, marginBottom: '10px' }}>
            New to our Discord?
          </p>
          <a
            href="https://discord.gg/E999eTNtyu"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              padding: '14px',
              backgroundColor: '#5865F2',
              color: '#ffffff',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '15px',
              textDecoration: 'none',
              textAlign: 'center',
            }}
          >
            Join the Channel!
          </a>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#ffffff', fontSize: '15px', fontWeight: 700, marginBottom: '10px' }}>
            Existing Discordian?
          </p>
          <a
            href="https://discord.com/channels/1528530126839615538/1528530127816757280"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              padding: '14px',
              backgroundColor: '#5865F2',
              color: '#ffffff',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '15px',
              textDecoration: 'none',
              textAlign: 'center',
            }}
          >
            Welcome Back Trainer!
          </a>
        </div>
      </div>
    </div>
  );
}
