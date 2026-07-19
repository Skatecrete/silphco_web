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
  recalculateRaidPrices: () => void;
}

// Raid pricing constants
const RAID_PRICE_10 = 7.0;
const RAID_PRICE_20 = 12.0;
const RAID_PRICE_50 = 20.0;
const DYNAMAX_PRICE_4 = 10.0;
const DYNAMAX_PRICE_SINGLE = 2.5;

function calculateRaidPrice(totalQuantity: number): number {
  let remaining = totalQuantity;
  let totalPrice = 0;
  const singlePrice = RAID_PRICE_10 / 10; // $0.70 per raid

  // Use 50-packs first (best value)
  const fiftyPacks = Math.floor(remaining / 50);
  totalPrice += fiftyPacks * RAID_PRICE_50;
  remaining = remaining % 50;

  // Then use 20-packs
  const twentyPacks = Math.floor(remaining / 20);
  totalPrice += twentyPacks * RAID_PRICE_20;
  remaining = remaining % 20;

  // Then use 10-packs
  const tenPacks = Math.floor(remaining / 10);
  totalPrice += tenPacks * RAID_PRICE_10;
  remaining = remaining % 10;

  // Remaining individual raids
  totalPrice += remaining * singlePrice;

  return totalPrice;
}

function calculateDynamaxPrice(totalQuantity: number): number {
  return Math.floor(totalQuantity / 4) * DYNAMAX_PRICE_4 + (totalQuantity % 4) * DYNAMAX_PRICE_SINGLE;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (item) => {
        const items = get().items;
        
        // For raid items, find by pokemonName + raidTier (not by price)
        const existingIndex = items.findIndex(
          (i) => i.pokemonName === item.pokemonName && 
                i.type === item.type && 
                i.raidTier === item.raidTier &&
                i.coinAmount === item.coinAmount
        );

        let newItems;
        if (existingIndex >= 0) {
          newItems = [...items];
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            quantity: newItems[existingIndex].quantity + item.quantity,
            // Price will be recalculated
          };
        } else {
          newItems = [...items, { ...item, id: Date.now().toString() }];
        }

        set({ items: newItems });
        get().recalculateRaidPrices();
        get().recalculate();
      },

      removeItem: (index) => {
        const items = get().items;
        const newItems = [...items];
        newItems.splice(index, 1);
        set({ items: newItems });
        get().recalculateRaidPrices();
        get().recalculate();
      },

      updateQuantity: (index, quantity) => {
        const items = get().items;
        if (quantity <= 0) {
          get().removeItem(index);
          return;
        }
        
        const newItems = [...items];
        const item = newItems[index];
        
        // For raid items, just update quantity, price will be recalculated
        if (item.type === 'raid' || item.type === 'dynamax') {
          newItems[index] = {
            ...item,
            quantity: quantity,
          };
        } else {
          // For non-raid items, maintain unit price
          const unitPrice = item.price / item.quantity;
          newItems[index] = {
            ...item,
            quantity: quantity,
            price: unitPrice * quantity,
          };
        }
        
        set({ items: newItems });
        get().recalculateRaidPrices();
        get().recalculate();
      },

      clearCart: () => {
        set({ items: [] });
        get().recalculate();
      },

      recalculateRaidPrices: () => {
        const items = get().items;
        let newItems = [...items];

        // Get all regular raid items
        const raidIndices: number[] = [];
        const raidItems: CartItem[] = [];
        
        // Get all dynamax raid items (separate from regular raids)
        const dynamaxIndices: number[] = [];
        const dynamaxItems: CartItem[] = [];

        for (let i = 0; i < newItems.length; i++) {
          const item = newItems[i];
          if (item.type === 'raid') {
            raidIndices.push(i);
            raidItems.push(item);
          } else if (item.type === 'dynamax') {
            dynamaxIndices.push(i);
            dynamaxItems.push(item);
          }
        }

        // ========== Calculate Regular Raid Prices (combined across all raids) ==========
        if (raidItems.length > 0) {
          const totalRaidQuantity = raidItems.reduce((sum, item) => sum + item.quantity, 0);
          const totalRaidPrice = calculateRaidPrice(totalRaidQuantity);

          // Distribute price proportionally
          for (let i = 0; i < raidItems.length; i++) {
            const proportion = raidItems[i].quantity / totalRaidQuantity;
            newItems[raidIndices[i]] = {
              ...raidItems[i],
              price: totalRaidPrice * proportion,
            };
          }
        }

        // ========== Calculate Dynamax Prices (per item) ==========
        for (let i = 0; i < dynamaxItems.length; i++) {
          const item = dynamaxItems[i];
          newItems[dynamaxIndices[i]] = {
            ...item,
            price: calculateDynamaxPrice(item.quantity),
          };
        }

        set({ items: newItems });
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