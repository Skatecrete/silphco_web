import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserSession } from '@/types';

interface UserStore extends UserSession {
  login: (name: string, ign: string) => void;
  guestLogin: () => void;
  logout: () => void;
}

const generateGuestName = (): string => {
  const randomNum = Math.floor(Math.random() * 10000);
  return `Guest_${String(randomNum).padStart(4, '0')}`;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userName: '',
      userIgn: '',
      userDisplay: '',
      isLoggedIn: false,
      isGuest: false,

      login: (name: string, ign: string) => {
        const display = `${name} (${ign})`;
        set({
          userName: name,
          userIgn: ign,
          userDisplay: display,
          isLoggedIn: true,
          isGuest: false,
        });
      },

      guestLogin: () => {
        const guestName = generateGuestName();
        const display = `${guestName} (Guest)`;
        set({
          userName: guestName,
          userIgn: 'Guest',
          userDisplay: display,
          isLoggedIn: true,
          isGuest: true,
        });
      },

      logout: () => {
        set({
          userName: '',
          userIgn: '',
          userDisplay: '',
          isLoggedIn: false,
          isGuest: false,
        });
      },
    }),
    {
      name: 'pokespawn-user-storage',
      partialize: (state) => ({
        userName: state.userName,
        userIgn: state.userIgn,
        userDisplay: state.userDisplay,
        isLoggedIn: state.isLoggedIn,
        isGuest: state.isGuest,
      }),
    }
  )
);