import { useScrollArrow } from '@/hooks/useScrollArrow';

interface ScrollArrowProps {
  containerRef: React.RefObject<HTMLElement>;
}

export function ScrollArrow({ containerRef }: ScrollArrowProps) {
  const { isVisible } = useScrollArrow(containerRef);

  if (!isVisible) return null;

  const handleClick = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ top: 200, behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        position: 'fixed',
        bottom: '96px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 40,
        width: '48px',
        height: '48px',
        backgroundColor: '#2a2a3e',
        borderRadius: '50%',
        border: '2px solid rgba(255, 165, 0, 0.5)',
        color: '#FFA500',
        fontSize: '24px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        transition: 'background-color 0.2s',
      }}
    >
      ↓
    </button>
  );
}