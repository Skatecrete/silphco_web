import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { REGIONS } from '@/utils/regionHelper';

interface RegionFilterProps {
  selectedRegion: string | null;
  onRegionSelect: (region: string | null) => void;
  onClear: () => void;
}

export function RegionFilter({ selectedRegion, onRegionSelect, onClear }: RegionFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getDisplayName = () => {
    if (!selectedRegion) return 'Filter by Region';
    const region = REGIONS.find((r) => r.name === selectedRegion);
    return region ? region.displayName : 'Filter by Region';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-1.5 text-sm font-bold rounded-lg transition-colors ${
          selectedRegion
            ? 'bg-orange-500 text-white'
            : 'bg-purple-500 text-white hover:bg-purple-700'
        }`}
      >
        {getDisplayName()}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-1 bg-dark-card rounded-xl shadow-xl border border-gray-700 p-2 z-50 w-56 max-h-60 overflow-y-auto"
          >
            {REGIONS.map((region) => (
              <button
                key={region.name}
                onClick={() => {
                  onRegionSelect(region.name);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                  selectedRegion === region.name
                    ? 'bg-purple-500 text-white'
                    : 'text-white hover:bg-dark-bg'
                }`}
              >
                {region.displayName}
              </button>
            ))}
            {selectedRegion && (
              <button
                onClick={() => {
                  onClear();
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-red-400 rounded-lg hover:bg-dark-bg transition-colors mt-1 border-t border-gray-700 pt-2"
              >
                Clear Filter
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}