import { motion } from 'framer-motion';
import { DialTileData } from '@/types';

interface DialTileProps {
  tile: DialTileData;
  isActive: boolean;
  onClick: () => void;
}

export function DialTile({ tile, isActive, onClick }: DialTileProps) {
  return (
    <motion.div
      className={`
        w-full h-44 rounded-2xl overflow-hidden cursor-pointer
        transition-all duration-300
        ${isActive ? 'scale-110 shadow-2xl shadow-purple-500/30' : 'scale-90 opacity-60'}
      `}
      whileHover={{ scale: isActive ? 1.12 : 0.92 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        background: `linear-gradient(135deg, #2a2a3e, #1a1a2e)`,
        border: isActive ? '2px solid #7627C5' : 'none',
      }}
    >
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        <span className="text-4xl mb-2">{tile.icon}</span>
        <span className="text-white font-bold text-lg tracking-wide">{tile.label}</span>
      </div>
    </motion.div>
  );
}