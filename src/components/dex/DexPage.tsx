import { useState, useMemo } from 'react';
import { useCart } from '@/hooks/useCart';
import { useDex } from '@/hooks/useDex';
import { DexCard } from './DexCard';
import { DexTabs } from './DexTabs';
import { RegionFilter } from './RegionFilter';
import { Header } from '@/components/common/Header';
import { REGIONS } from '@/utils/regionHelper';

export function DexPage() {
  const { totalItems } = useCart();
  const [listType, setListType] = useState<'Normal' | 'Shiny'>('Normal');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const { pokemon, loading, error, pendingRemovals, togglePokemon, confirmRemovals, cancelRemovals, hasPendingRemovals } = useDex(listType);

  const filteredPokemon = useMemo(() => {
    let result = pokemon;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(query) || p.id.toString().includes(query)
      );
    }

    if (selectedRegion) {
      const region = REGIONS.find((r) => r.name === selectedRegion);
      if (region) {
        result = result.filter((p) => p.id >= region.startId && p.id <= region.endId);
      }
    }

    if (listType === 'Shiny') {
      result = result.filter((p) => p.isShinyAvailable);
    }

    return result.sort((a, b) => a.id - b.id);
  }, [pokemon, searchQuery, selectedRegion, listType]);

  const totalPending = pendingRemovals.length;

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-dark-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
        <p className="text-gray-400 mt-4">Loading your dex...</p>
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
      <Header title="My Lists" cartCount={totalItems} />

      <DexTabs currentTab={listType} onTabChange={setListType} />

      <div className="px-4 py-2 bg-dark-bg/95 border-b border-gray-800/50">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search Pokemon by name or ID"
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

      <div className="px-4 py-2 flex gap-2 bg-dark-bg/95 border-b border-gray-800/50">
        <RegionFilter
          selectedRegion={selectedRegion}
          onRegionSelect={setSelectedRegion}
          onClear={() => setSelectedRegion(null)}
        />
        <span className="text-gray-400 text-sm ml-auto self-center">
          {filteredPokemon.filter((p) => p.onList).length} on list
          {totalPending > 0 && ` | ${totalPending} pending`}
        </span>
      </div>

      {hasPendingRemovals && (
        <div className="px-4 py-2 flex gap-2 bg-dark-bg/95 border-b border-gray-800/50">
          <button
            onClick={() => confirmRemovals()}
            className="flex-1 py-2 bg-green-500 text-white text-sm font-bold rounded-lg hover:bg-green-600 transition-colors"
          >
            ✅ Confirm Removal ({totalPending})
          </button>
          <button
            onClick={cancelRemovals}
            className="flex-1 py-2 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600 transition-colors"
          >
            ❌ Cancel Removal
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-2">
        {filteredPokemon.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p className="text-lg">No Pokémon found</p>
            <p className="text-sm mt-1">
              {searchQuery ? 'Try a different search' : 'Add some to your list!'}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredPokemon.map((p) => (
              <DexCard
                key={p.id}
                pokemon={p}
                onToggle={(checked) => togglePokemon(p.id, checked)}
              />
            ))}
          </div>
        )}
      </div>

      {listType === 'Shiny' && (
        <div className="px-4 py-2 bg-dark-bg/95 border-t border-gray-800/50">
          <p className="text-orange-500 text-xs text-center">
            ⚠️ Disclaimer: Some Pokémon on this list may not have a shiny variant released yet.
          </p>
        </div>
      )}
    </div>
  );
}