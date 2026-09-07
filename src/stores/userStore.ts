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
        
        // 🔥 Set chat_name for chat system
        localStorage.setItem('chat_name', display);
        
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
        
        // 🔥 Set chat_name for chat system (guests can chat too)
        localStorage.setItem('chat_name', display);
        
        set({
          userName: guestName,
          userIgn: 'Guest',
          userDisplay: display,
          isLoggedIn: true,
          isGuest: true,
        });
      },

      logout: () => {
        // 🔥 Clear chat_name on logout
        localStorage.removeItem('chat_name');
        
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
