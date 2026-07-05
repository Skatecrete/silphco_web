import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string;
  isVisible: boolean;
  type?: 'info' | 'success' | 'error';
  onHide: () => void;
}

export function Toast({ message, isVisible, type = 'info', onHide }: ToastProps) {
  const bgColor = type === 'success' ? 'bg-green-500' : 
                  type === 'error' ? 'bg-red-500' : 
                  'bg-purple-500';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 ${bgColor} text-white font-bold rounded-xl shadow-xl max-w-sm text-center`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}