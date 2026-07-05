import { motion, AnimatePresence } from 'framer-motion';

interface FilterState {
  regional: boolean;
  shundo: boolean;
  shiny164: boolean;
  greatLeague: boolean;
  ultraLeague: boolean;
  masterLeague: boolean;
  premierCup: boolean;
  ultraPremier: boolean;
}

interface SpawnFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function SpawnFilterDialog({
  isOpen,
  onClose,
  filters,
  onFilterChange,
}: SpawnFilterDialogProps) {
  const toggleFilter = (key: keyof FilterState) => {
    onFilterChange({ ...filters, [key]: !filters[key] });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-dark-card rounded-2xl p-6 w-full max-w-sm max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-xl font-bold">Filter Spawns</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.regional}
                  onChange={() => toggleFilter('regional')}
                  className="w-5 h-5 accent-purple-500"
                />
                <span>🌍 Regional</span>
              </label>

              <label className="flex items-center gap-3 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.shundo}
                  onChange={() => toggleFilter('shundo')}
                  className="w-5 h-5 accent-purple-500"
                />
                <span>✨ Shundo (0.65%+ Spawn)</span>
              </label>

              <label className="flex items-center gap-3 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.shiny164}
                  onChange={() => toggleFilter('shiny164')}
                  className="w-5 h-5 accent-purple-500"
                />
                <span>⭐ 1/64 Shiny Odds</span>
              </label>

              <div className="border-t border-gray-700 my-2" />

              <label className="flex items-center gap-3 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.greatLeague}
                  onChange={() => toggleFilter('greatLeague')}
                  className="w-5 h-5 accent-purple-500"
                />
                <span>🏆 Great League</span>
              </label>

              <label className="flex items-center gap-3 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.ultraLeague}
                  onChange={() => toggleFilter('ultraLeague')}
                  className="w-5 h-5 accent-purple-500"
                />
                <span>🏆 Ultra League</span>
              </label>

              <label className="flex items-center gap-3 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.masterLeague}
                  onChange={() => toggleFilter('masterLeague')}
                  className="w-5 h-5 accent-purple-500"
                />
                <span>🏆 Master League</span>
              </label>

              <label className="flex items-center gap-3 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.premierCup}
                  onChange={() => toggleFilter('premierCup')}
                  className="w-5 h-5 accent-purple-500"
                />
                <span>🏆 Premier Cup</span>
              </label>

              <label className="flex items-center gap-3 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.ultraPremier}
                  onChange={() => toggleFilter('ultraPremier')}
                  className="w-5 h-5 accent-purple-500"
                />
                <span>🏆 Ultra Premier</span>
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  onFilterChange({
                    regional: false,
                    shundo: false,
                    shiny164: false,
                    greatLeague: false,
                    ultraLeague: false,
                    masterLeague: false,
                    premierCup: false,
                    ultraPremier: false,
                  });
                }}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors"
              >
                Apply
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}