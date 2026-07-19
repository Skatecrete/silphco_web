import { useState, useEffect, useCallback } from 'react';
import { getDexProgress, addDexPokemon, removeDexPokemon } from '@/services/sheetsApi';
import { useUser } from './useUser';
import { ALL_POKEMON_NAMES } from '@/utils/constants';

interface DexEntry {
  id: number;
  name: string;
  dateAdded: string;
}

interface DexPokemon {
  id: number;
  name: string;
  onList: boolean;
  isShinyAvailable: boolean;
  isPendingRemoval: boolean;
}

const CACHE_DURATION = 5 * 60 * 1000;

export function useDex(listType: 'Normal' | 'Shiny') {
  const { userDisplay, isLoggedIn } = useUser();
  const [pokemon, setPokemon] = useState<DexPokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingRemovals, setPendingRemovals] = useState<Set<number>>(new Set());
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  const loadDex = useCallback(async (forceRefresh: boolean = false) => {
    if (!isLoggedIn || !userDisplay) {
      setLoading(false);
      return;
    }

    const now = Date.now();
    if (!forceRefresh && lastFetchTime > 0 && (now - lastFetchTime) < CACHE_DURATION && pokemon.length > 0) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dexList = await getDexProgress(userDisplay, listType);
      const ids = new Set(dexList.map((entry: DexEntry) => entry.id));

      const allPokemon: DexPokemon[] = Object.entries(ALL_POKEMON_NAMES).map(([id, name]) => ({
        id: parseInt(id),
        name,
        onList: ids.has(parseInt(id)),
        isShinyAvailable: true,
        isPendingRemoval: false,
      }));

      setPokemon(allPokemon);
      setLastFetchTime(now);
    } catch (err) {
      setError('Failed to load dex');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userDisplay, isLoggedIn, listType, lastFetchTime, pokemon.length]);

  const togglePokemon = async (pokemonId: number, checked: boolean) => {
    if (!userDisplay) {
      console.error('❌ No user display found');
      return;
    }

    const pokemonName = ALL_POKEMON_NAMES[pokemonId] || `Pokemon #${pokemonId}`;

    if (checked) {
      // ✅ CHECKING: Add to dex
      console.log(`➕ Adding ${pokemonName} (ID: ${pokemonId}) to ${listType} dex for ${userDisplay}`);
      
      const success = await addDexPokemon(userDisplay, pokemonId, pokemonName, listType);
      console.log(`📡 Add result: ${success}`);
      
      if (success) {
        // Update local state
        setPokemon((prev) =>
          prev.map((p) =>
            p.id === pokemonId ? { ...p, onList: true, isPendingRemoval: false } : p
          )
        );
        // Remove from pending if it was there
        setPendingRemovals((prev) => {
          const newSet = new Set(prev);
          newSet.delete(pokemonId);
          return newSet;
        });
        console.log(`✅ ${pokemonName} added to ${listType} dex`);
      } else {
        console.error(`❌ Failed to add ${pokemonName} to dex`);
        // Revert local state
        setPokemon((prev) =>
          prev.map((p) =>
            p.id === pokemonId ? { ...p, onList: false, isPendingRemoval: false } : p
          )
        );
      }
    } else {
      // ❌ UNCHECKING: Mark for removal
      console.log(`⏳ Marking ${pokemonName} for removal from ${listType} dex`);
      setPendingRemovals((prev) => new Set(prev).add(pokemonId));
      setPokemon((prev) =>
        prev.map((p) =>
          p.id === pokemonId ? { ...p, onList: false, isPendingRemoval: true } : p
        )
      );
    }
  };

  const confirmRemovals = async () => {
    if (pendingRemovals.size === 0 || !userDisplay) {
      return { successCount: 0, total: 0 };
    }

    const toRemove = Array.from(pendingRemovals);
    console.log(`🗑️ Confirming removal of ${toRemove.length} Pokémon from ${listType} dex`);
    let successCount = 0;

    for (const id of toRemove) {
      const pokemonName = ALL_POKEMON_NAMES[id] || `Pokemon #${id}`;
      console.log(`  Removing ${pokemonName} (ID: ${id})...`);
      
      const success = await removeDexPokemon(userDisplay, id, listType);
      console.log(`  Result: ${success}`);
      
      if (success) {
        successCount++;
        setPendingRemovals((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        setPokemon((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, onList: false, isPendingRemoval: false } : p
          )
        );
      }
    }

    console.log(`✅ Removed ${successCount}/${toRemove.length} Pokémon`);
    return { successCount, total: toRemove.length };
  };

  const cancelRemovals = () => {
    console.log(`❌ Cancelling removals from ${listType} dex`);
    setPendingRemovals(new Set());
    setPokemon((prev) =>
      prev.map((p) => ({
        ...p,
        isPendingRemoval: false,
      }))
    );
  };

  // Load dex on mount
  useEffect(() => {
    loadDex();
  }, [loadDex]);

  return {
    pokemon,
    loading,
    error,
    pendingRemovals: Array.from(pendingRemovals),
    togglePokemon,
    confirmRemovals,
    cancelRemovals,
    refreshDex: () => loadDex(true),
    hasPendingRemovals: pendingRemovals.size > 0,
  };
}