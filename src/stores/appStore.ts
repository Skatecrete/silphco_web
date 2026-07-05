import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppStore {
  isUnlocked: boolean;
  unlock: () => void;
  lock: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      isUnlocked: false,
      unlock: () => set({ isUnlocked: true }),
      lock: () => set({ isUnlocked: false }),
    }),
    {
      name: 'silphco-app-storage',
      partialize: (state) => ({ isUnlocked: state.isUnlocked }),
    }
  )
);