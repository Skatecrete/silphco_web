import { useState, useEffect, useCallback } from 'react';
import { getDexProgress, addDexPokemonBatch, removeDexPokemon } from '@/services/sheetsApi';
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
  wasOnServer: boolean;
  isShinyAvailable: boolean;
  isPendingRemoval: boolean;
}

const CACHE_DURATION = 5 * 60 * 1000;

export function useDex(listType: 'Normal' | 'Shiny', isSearchMode: boolean) {
  const { userDisplay, isLoggedIn } = useUser();
  const [pokemon, setPokemon] = useState<DexPokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingAdds, setPendingAdds] = useState<Set<number>>(new Set());
  const [pendingRemovals, setPendingRemovals] = useState<Set<number>>(new Set());
  const [confirmingAdds, setConfirmingAdds] = useState(false);
  const [confirmingRemovals, setConfirmingRemovals] = useState(false);
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

      const ids = new Set(
        (dexList || []).map((entry: DexEntry) => parseInt(String(entry.id), 10))
      );

      const allPokemon: DexPokemon[] = Object.entries(ALL_POKEMON_NAMES).map(([id, name]) => {
        const numericId = parseInt(id);
        const onServer = ids.has(numericId);
        return {
          id: numericId,
          name,
          onList: onServer,
          wasOnServer: onServer,
          isShinyAvailable: true,
          isPendingRemoval: false,
        };
      });

      setPokemon(allPokemon);
      setPendingAdds(new Set());
      setPendingRemovals(new Set());
      setLastFetchTime(now);
    } catch (err) {
      setError('Failed to load dex');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userDisplay, isLoggedIn, listType, lastFetchTime, pokemon.length]);

  const togglePokemon = (pokemonId: number, checked: boolean) => {
    if (!userDisplay) return;

    // ---- SEARCH MODE: only handle pending adds ----
    if (isSearchMode) {
      setPokemon((prev) =>
        prev.map((p) => {
          if (p.id !== pokemonId) return p;
          if (p.wasOnServer) return p; // already on list, checkbox is replaced by "Added" anyway

          if (checked) {
            setPendingAdds((s) => new Set(s).add(pokemonId));
            return { ...p, onList: true };
          } else {
            setPendingAdds((s) => {
              const ns = new Set(s);
              ns.delete(pokemonId);
              return ns;
            });
            return { ...p, onList: false };
          }
        })
      );
      return;
    }

    // ---- MAIN LIST MODE: removal flow ----
    setPokemon((prev) =>
      prev.map((p) => {
        if (p.id !== pokemonId) return p;

        if (checked) {
          // Re-checking cancels the pending removal
          if (p.isPendingRemoval) {
            setPendingRemovals((s) => {
              const ns = new Set(s);
              ns.delete(pokemonId);
              return ns;
            });
            return { ...p, onList: true, isPendingRemoval: false };
          }
          return { ...p, onList: true };
        } else {
          // Unchecking on main list marks for removal
          if (p.wasOnServer && !p.isPendingRemoval) {
            setPendingRemovals((s) => new Set(s).add(pokemonId));
            return { ...p, onList: false, isPendingRemoval: true };
          }
          return p;
        }
      })
    );
  };

  const confirmAdds = async () => {
    if (pendingAdds.size === 0 || !userDisplay || confirmingAdds) {
      return { success: true, added: 0 };
    }

    setConfirmingAdds(true);
    try {
      const items = Array.from(pendingAdds).map((id) => ({
        id,
        name: ALL_POKEMON_NAMES[id] || `Pokemon #${id}`,
      }));

      const result = await addDexPokemonBatch(userDisplay, items, listType);

      if (result.success) {
        setPokemon((prev) =>
          prev.map((p) =>
            pendingAdds.has(p.id) ? { ...p, wasOnServer: true } : p
          )
        );
        setPendingAdds(new Set());
      }

      return result;
    } finally {
      setConfirmingAdds(false);
    }
  };

  const cancelAdds = () => {
    if (confirmingAdds) return;
    setPendingAdds(new Set());
    setPokemon((prev) =>
      prev.map((p) =>
        p.wasOnServer ? p : { ...p, onList: false }
      )
    );
  };

  const confirmRemovals = async () => {
    if (pendingRemovals.size === 0 || !userDisplay || confirmingRemovals) {
      return { successCount: 0, total: 0 };
    }

    setConfirmingRemovals(true);
    try {
      const toRemove = Array.from(pendingRemovals);
      let successCount = 0;

      for (const id of toRemove) {
        const success = await removeDexPokemon(userDisplay, id, listType);
        if (success) {
          successCount++;
          setPendingRemovals((prev) => {
            const ns = new Set(prev);
            ns.delete(id);
            return ns;
          });
          setPokemon((prev) =>
            prev.map((p) =>
              p.id === id
                ? { ...p, onList: false, wasOnServer: false, isPendingRemoval: false }
                : p
            )
          );
        }
      }

      return { successCount, total: toRemove.length };
    } finally {
      setConfirmingRemovals(false);
    }
  };

  const cancelRemovals = () => {
    if (confirmingRemovals) return;
    setPendingRemovals(new Set());
    setPokemon((prev) =>
      prev.map((p) => {
        if (p.isPendingRemoval) {
          return { ...p, onList: true, isPendingRemoval: false };
        }
        return p;
      })
    );
  };

  useEffect(() => {
    loadDex();
  }, [loadDex]);

  return {
    pokemon,
    loading,
    error,
    pendingAdds: Array.from(pendingAdds),
    pendingRemovals: Array.from(pendingRemovals),
    confirmingAdds,
    confirmingRemovals,
    togglePokemon,
    confirmAdds,
    cancelAdds,
    confirmRemovals,
    cancelRemovals,
    refreshDex: () => loadDex(true),
    hasPendingAdds: pendingAdds.size > 0,
    hasPendingRemovals: pendingRemovals.size > 0,
  };
}
