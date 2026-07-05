import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  type: string;
  pokemonName: string;
  quantity: number;
  price: number;
  raidTier?: string;
  coinAmount?: number;
  serviceName?: string;
  imageUrl?: string;
}

interface CartStore {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: CartItem) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  recalculate: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (item) => {
        const items = get().items;
        const existingIndex = items.findIndex(
          (i) => i.pokemonName === item.pokemonName && i.type === item.type
        );

        let newItems;
        if (existingIndex >= 0) {
          newItems = [...items];
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            quantity: newItems[existingIndex].quantity + item.quantity,
            price: newItems[existingIndex].price + item.price,
          };
        } else {
          newItems = [...items, { ...item, id: Date.now().toString() }];
        }

        set({ items: newItems });
        get().recalculate();
      },

      removeItem: (index) => {
        const items = get().items;
        items.splice(index, 1);
        set({ items });
        get().recalculate();
      },

      updateQuantity: (index, quantity) => {
        const items = get().items;
        if (quantity <= 0) {
          get().removeItem(index);
          return;
        }
        items[index].quantity = quantity;
        set({ items });
        get().recalculate();
      },

      clearCart: () => {
        set({ items: [] });
        get().recalculate();
      },

      recalculate: () => {
        const items = get().items;
        let totalItems = 0;
        let totalPrice = 0;
        for (const item of items) {
          totalItems += item.quantity;
          totalPrice += item.price;
        }
        set({ totalItems, totalPrice });
      },
    }),
    {
      name: 'pokespawn-cart-storage',
    }
  )
);