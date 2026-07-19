import { useUserStore } from '@/stores/userStore';

export function useUser() {
  const {
    userName,
    userIgn,
    userDisplay,
    isLoggedIn,
    isGuest,
    login,
    guestLogin,
    logout,
  } = useUserStore();

  const getWelcomeName = (): string => {
    if (isGuest) {
      return userName;
    }
    return userIgn || userName || 'Trainer';
  };

  return {
    userName,
    userIgn,
    userDisplay,
    isLoggedIn,
    isGuest,
    login,
    guestLogin,
    logout,
    getWelcomeName,
  };
}