import { useEffect } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  type?: 'info' | 'success' | 'error';
  onHide: () => void;
}

export function Toast({ message, isVisible, type = 'info', onHide }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onHide();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide]);

  if (!isVisible) return null;

  const bgColor = type === 'success' ? '#4CAF50' : 
                  type === 'error' ? '#F44336' : 
                  '#7627C5';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        padding: '12px 24px',
        backgroundColor: bgColor,
        color: '#ffffff',
        fontWeight: 700,
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        maxWidth: '90%',
        textAlign: 'center',
        fontSize: '14px',
        transition: 'opacity 0.3s ease',
      }}
    >
      {message}
    </div>
  );
}