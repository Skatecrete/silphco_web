import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DebutData } from '@/services/leekDuckApi';

interface DebutBannerProps {
  debut: DebutData | null;
  onViewDebuts: () => void;
  onViewEvent: () => void;
}

export function DebutBanner({ debut, onViewDebuts, onViewEvent }: DebutBannerProps) {
  if (!debut) return null;

  const [timeLeft, setTimeLeft] = useState<string>('');

  // Calculate time until event starts (simplified)
  useEffect(() => {
    // In a real implementation, you'd parse the event date and calculate
    setTimeLeft('⏰ Starts in: Coming soon');
  }, [debut]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-gradient-to-r from-purple-900/30 to-dark-card border border-orange-500/30 rounded-xl p-4 mb-4"
      >
        <div className="text-center">
          <p className="text-orange-500 text-sm font-bold">🎉 NEW POKÉMON DEBUT 🎉</p>
          <p className="text-cyan-400 text-lg font-bold mt-1">{debut.event_name}</p>
          <p className="text-white text-sm mt-1">{timeLeft}</p>
          <div className="flex gap-2 mt-3 justify-center">
            <button
              onClick={onViewDebuts}
              className="px-4 py-2 bg-purple-500 text-white text-sm font-bold rounded-lg hover:bg-purple-700 transition-colors"
            >
              View Debut Mon
            </button>
            <button
              onClick={onViewEvent}
              className="px-4 py-2 bg-blue-500 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Event
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}