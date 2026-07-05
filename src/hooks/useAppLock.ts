import { useEffect } from 'react';
import { useAppStore } from '@/stores/appStore';
import { useNavigate } from 'react-router-dom';

export function useAppLock() {
  const { isUnlocked } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isUnlocked) {
      navigate('/');
    }
  }, [isUnlocked, navigate]);

  return { isUnlocked };
}