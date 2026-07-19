import { useCartStore } from '@/stores/cartStore';

export function useCart() {
  const {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    recalculate,
    recalculateRaidPrices,
  } = useCartStore();

  return {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    recalculate,
    recalculateRaidPrices,
  };
}