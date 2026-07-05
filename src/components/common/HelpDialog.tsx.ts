import { motion, AnimatePresence } from 'framer-motion';

interface HelpDialogProps {
  isOpen: boolean;
  title: string;
  content: string;
  onClose: () => void;
}

export function HelpDialog({ isOpen, title, content, onClose }: HelpDialogProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70" onClick={onClose} />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-dark-card rounded-2xl w-full max-w-md p-6 max-h-[85vh] flex flex-col"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-xl font-bold">{title}</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                {content}
              </pre>
            </div>

            <button
              onClick={onClose}
              className="mt-4 w-full py-3 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors"
            >
              Got it!
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}