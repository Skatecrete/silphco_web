import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import { usePricing } from '@/hooks/usePricing';
import { CartList } from './CartList';
import { CoinSelector } from './CoinSelector';
import { CheckoutDialog } from './CheckoutDialog';
import { Header } from '@/components/common/Header';

export function OrdersPage() {
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, clearCart, recalculate } = useCart();
  const { prices } = usePricing();
  const [showCheckout, setShowCheckout] = useState(false);

  const handleAddCoin = (coinAmount: number) => {
    // Add coin to cart
    const price = coinAmount === 5600 ? prices.coins5600 :
                  coinAmount === 15500 ? prices.coins15500 :
                  prices.coins31000;

    // Find if coin item already exists
    const existingIndex = items.findIndex(
      (item) => item.type === 'coins' && item.coinAmount === coinAmount
    );

    if (existingIndex >= 0) {
      // Update quantity
      const item = items[existingIndex];
      // Recalculate by removing and re-adding (simplified)
    } else {
      // Add new
      // This would use the cart store's addItem method
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      // Show toast: "Add items to your cart first"
      return;
    }
    setShowCheckout(true);
  };

  return (
    <div className="h-screen flex flex-col bg-dark-bg">
      <Header title="Order Cart" cartCount={totalItems} />

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {/* Cart Section */}
        <div className="bg-dark-card rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <p className="text-white font-bold">🛒 YOUR CART</p>
            <p className="text-gray-400 text-sm">{totalItems} items</p>
          </div>

          <CartList
            items={items}
            onUpdateQuantity={(index, quantity) => {
              // Update cart item
            }}
            onRemove={(index) => {
              // Remove from cart
            }}
          />

          {items.length === 0 && (
            <p className="text-gray-400 text-center py-4">Your Pokecart is empty</p>
          )}

          <div className="mt-3 pt-3 border-t border-gray-700">
            <p className="text-green-400 text-right font-bold">
              Total: ${totalPrice.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Coins Section */}
        <CoinSelector
          prices={prices}
          onAddCoin={handleAddCoin}
        />

        {/* Notes Section */}
        <div className="bg-dark-card rounded-xl p-4 mb-4">
          <p className="text-white font-bold mb-2">📝 Other Requests (Optional)</p>
          <textarea
            id="notesInput"
            rows={3}
            placeholder="Any other service ideas or questions please ask here! For example, if you want the 31k Coin order split between 2 accounts or want details on upcoming Go Fests, etc..."
            className="w-full px-3 py-2 bg-dark-bg text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={items.length === 0}
          className={`w-full py-3 rounded-xl font-bold transition-colors ${
            items.length > 0
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {items.length > 0 ? '🛒 PROCEED TO CHECKOUT' : '🛒 ADD ITEMS TO CART'}
        </button>

        {/* Contact Section */}
        <div className="bg-dark-card rounded-xl p-4 mt-4">
          <p className="text-white font-bold text-center mb-3">📱 Need Help?</p>
          <div className="flex flex-col gap-2">
            <a
              href="https://m.me/danstudz.skatecrete"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 bg-green-600 text-white text-center font-bold rounded-xl hover:bg-green-700 transition-colors"
            >
              💬 Dan (Skatecrete)
            </a>
            <a
              href="https://m.me/thomas.keelan.733"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 bg-orange-600 text-white text-center font-bold rounded-xl hover:bg-orange-700 transition-colors"
            >
              💬 Thomas (RampageGamer)
            </a>
            <button
              onClick={() => alert("Kingi's messenger link coming soon!")}
              className="py-3 bg-blue-600 text-white text-center font-bold rounded-xl opacity-60 cursor-not-allowed"
            >
              💬 Kingi (zEViLvSTON4z)
            </button>
          </div>
          <p className="text-gray-400 text-xs text-center mt-3">
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
    </div>
  );
}