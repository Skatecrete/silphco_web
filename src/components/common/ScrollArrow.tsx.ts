import { motion, AnimatePresence } from 'framer-motion';
import { useScrollArrow } from '@/hooks/useScrollArrow';

interface ScrollArrowProps {
  containerRef: React.RefObject<HTMLElement>;
}

export function ScrollArrow({ containerRef }: ScrollArrowProps) {
  const { isVisible } = useScrollArrow(containerRef);

  const handleClick = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ top: 200, behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.5, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={handleClick}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-12 h-12 bg-dark-card rounded-full border-2 border-orange-500/50 flex items-center justify-center text-orange-500 text-2xl hover:bg-dark-bg transition-colors shadow-lg"
        >
          ↓
        </motion.button>
      )}
    </AnimatePresence>
  );
}