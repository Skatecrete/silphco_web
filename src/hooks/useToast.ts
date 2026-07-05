import { useState, useCallback } from 'react';

export function useToast() {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [type, setType] = useState<'info' | 'success' | 'error'>('info');

  const showToast = useCallback((msg: string, toastType: 'info' | 'success' | 'error' = 'info') => {
    setMessage(msg);
    setType(toastType);
    setIsVisible(true);

    // Auto-hide after 2.5 seconds
    clearTimeout((window as any)._toastTimeout);
    (window as any)._toastTimeout = setTimeout(() => {
      setIsVisible(false);
    }, 2500);
  }, []);

  const hideToast = useCallback(() => {
    setIsVisible(false);
  }, []);

  return { message, isVisible, type, showToast, hideToast };
}