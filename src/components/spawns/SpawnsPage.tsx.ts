import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpawns } from '@/hooks/useSpawns';
import { useCart } from '@/hooks/useCart';
import { SpawnCard } from './SpawnCard';
import { SpawnFilterDialog } from './SpawnFilterDialog';
import { SpawnOrderDialog } from './SpawnOrderDialog';
import { Header } from '@/components/common/Header';

export function SpawnsPage() {
  const navigate = useNavigate();
  const { allPokemon, loading, error } = useSpawns();
  const { totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    regional: false,
    shundo: false,
    shiny164: false,
    greatLeague: false,
    ultraLeague: false,
    masterLeague: false,
    premierCup: false,
    ultraPremier: false,
  });
  const [selectedPokemon, setSelectedPokemon] = useState<any>(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);

  const filteredPokemon = useMemo(() => {
    let result = allPokemon;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.id.toString().includes(query)
      );
    }

    // Active filters (OR logic)
    const hasFilters = Object.values(filters).some((v) => v);
    if (hasFilters) {
      result = result.filter((p) => {
        let matches = false;
        if (filters.regional) matches = matches || p.isRegional;
        if (filters.shundo) matches = matches || (p.spawnRate >= 0.45 && p.isShiny);
        if (filters.shiny164) matches = matches || (p.isShiny && p.spawnRate >= 0.45);
        if (filters.greatLeague) matches = matches || p.isTopGreatLeague;
        if (filters.ultraLeague) matches = matches || p.isTopUltraLeague;
        if (filters.masterLeague) matches = matches || p.isTopMasterLeague;
        if (filters.premierCup) matches = matches || p.isTopPremierCup;
        if (filters.ultraPremier) matches = matches || p.isTopUltraPremier;
        return matches;
      });
    }

    return result;
  }, [allPokemon, searchQuery, filters]);

  const handlePokemonClick = (pokemon: any) => {
    if (pokemon.spawnRate === 0.0) {
      // NOPE Pokémon - show toast
      return;
    }
    setSelectedPokemon(pokemon);
    setShowOrderDialog(true);
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-dark-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
        <p className="text-gray-400 mt-4">Loading spawns...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-dark-bg">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-dark-bg">
      <Header title="Wild Spawns" cartCount={totalItems} />

      {/* Search Bar */}
      <div className="px-4 py-3 bg-dark-bg/95 border-b border-gray-800/50">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search Pokemon..."
            className="w-full px-4 py-2 bg-dark-card text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="px-4 py-2 flex gap-2 flex-wrap bg-dark-bg/95 border-b border-gray-800/50">
        <button
          onClick={() => setShowFilters(true)}
          className="px-3 py-1 bg-purple-500 text-white text-sm rounded-full hover:bg-purple-700 transition-colors"
        >
          🔽 Filter
        </button>
        {Object.values(filters).some((v) => v) && (
          <button
            onClick={() => setFilters({
              regional: false,
              shundo: false,
              shiny164: false,
              greatLeague: false,
              ultraLeague: false,
              masterLeague: false,
              premierCup: false,
              ultraPremier: false,
            })}
            className="px-3 py-1 bg-red-500 text-white text-sm rounded-full hover:bg-red-600 transition-colors"
          >
            Clear All
          </button>
        )}
        <span className="text-gray-400 text-sm ml-auto self-center">
          {filteredPokemon.length} / {allPokemon.length}
        </span>
      </div>

      {/* Spawns List */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <AnimatePresence>
          {filteredPokemon.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <p className="text-lg">No spawns found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredPokemon.map((pokemon) => (
                <SpawnCard
                  key={pokemon.id}
                  pokemon={pokemon}
                  onClick={() => handlePokemonClick(pokemon)}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Disclaimer */}
      <div className="px-4 py-2 bg-dark-bg/95 border-t border-gray-800/50">
        <p className="text-orange-500 text-xs text-center">
          *Only Spawn Rates of 0.45% or Higher, with a Shiny Variant can be Shundo Hunted.
        </p>
      </div>

      {/* Filter Dialog */}
      <SpawnFilterDialog
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFilterChange={setFilters}
      />

      {/* Order Dialog */}
      <SpawnOrderDialog
        isOpen={showOrderDialog}
        pokemon={selectedPokemon}
        onClose={() => {
          setShowOrderDialog(false);
          setSelectedPokemon(null);
        }}
      />
    </div>
  );
}