import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { usePricing } from '@/hooks/usePricing';
import { CartList } from './CartList';
import { CoinSelector } from './CoinSelector';
import { CheckoutDialog } from './CheckoutDialog';
import { ItemBoxDialog } from './ItemBoxDialog';
import { Header } from '@/components/common/Header';

export function OrdersPage() {
  const { items, totalItems, totalPrice, clearCart, updateQuantity, removeItem, addItem } = useCart();
  const { prices } = usePricing();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showItemBoxes, setShowItemBoxes] = useState(false);

  const handleAddCoin = (coinAmount: number) => {
    // Check if coin item already exists
    const existingIndex = items.findIndex(
      (item) => item.type === 'coins' && item.coinAmount === coinAmount
    );

    if (existingIndex >= 0) {
      // Update quantity of existing coin item
      const existingItem = items[existingIndex];
      updateQuantity(existingIndex, existingItem.quantity + 1);
    } else {
      // Add new coin item
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
        {/* Cart Section */}
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

        {/* Coins Section */}
        <CoinSelector prices={prices} onAddCoin={handleAddCoin} />

        {/* Item Boxes Button */}
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

        {/* Notes Section */}
        <div style={{ backgroundColor: '#2a2a3e', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
          <p style={{ color: '#ffffff', fontWeight: 700, marginBottom: '8px' }}>📝 Other Requests (Optional)</p>
          <textarea
            id="notesInput"
            rows={3}
            placeholder="Any other service ideas or questions please ask here! For example, if you want the 31k Coin order split between 2 accounts or want details on upcoming Go Fests, etc..."
            style={{
              width: '100%',
              padding: '8px 12px',
              backgroundColor: '#1a1a2e',
              color: '#ffffff',
              borderRadius: '8px',
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
          />
        </div>

        {/* Checkout Button */}
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

        {/* Contact Section */}
        <div style={{ backgroundColor: '#2a2a3e', borderRadius: '12px', padding: '16px', marginTop: '16px' }}>
          <p style={{ color: '#ffffff', fontWeight: 700, textAlign: 'center', marginBottom: '12px' }}>📱 Need Help?</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a
              href="https://m.me/danstudz.skatecrete"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '12px',
                backgroundColor: '#2E7D32',
                color: '#ffffff',
                textAlign: 'center',
                fontWeight: 700,
                borderRadius: '12px',
                textDecoration: 'none',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => { (e.target as HTMLAnchorElement).style.backgroundColor = '#1B5E20'; }}
              onMouseLeave={(e) => { (e.target as HTMLAnchorElement).style.backgroundColor = '#2E7D32'; }}
            >
              💬 Dan (Skatecrete)
            </a>
            <a
              href="https://m.me/thomas.keelan.733"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '12px',
                backgroundColor: '#E65100',
                color: '#ffffff',
                textAlign: 'center',
                fontWeight: 700,
                borderRadius: '12px',
                textDecoration: 'none',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => { (e.target as HTMLAnchorElement).style.backgroundColor = '#BF360C'; }}
              onMouseLeave={(e) => { (e.target as HTMLAnchorElement).style.backgroundColor = '#E65100'; }}
            >
              💬 Thomas (RampageGamer)
            </a>
            <button
              onClick={() => alert("Kingi's messenger link coming soon!")}
              style={{
                padding: '12px',
                backgroundColor: '#0D47A1',
                color: '#ffffff',
                textAlign: 'center',
                fontWeight: 700,
                borderRadius: '12px',
                border: 'none',
                cursor: 'not-allowed',
                opacity: 0.6,
              }}
            >
              💬 Kingi (zEViLvSTON4z)
            </button>
          </div>
          <p style={{ color: '#888888', fontSize: '12px', textAlign: 'center', marginTop: '12px' }}>
            💡 Reach out to your admin through Facebook Messenger!
          </p>
        </div>
      </div>

      {/* Checkout Dialog */}
      <CheckoutDialog
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        items={items}
        totalPrice={totalPrice}
        onClearCart={clearCart}
      />

      {/* Item Boxes Dialog */}
      <ItemBoxDialog
        isOpen={showItemBoxes}
        onClose={() => setShowItemBoxes(false)}
      />
    </div>
  );
}