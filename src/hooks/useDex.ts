import { useState, useEffect, useCallback } from 'react';
import { getDexProgress, addDexPokemonBatch } from '@/services/sheetsApi';
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
}

const CACHE_DURATION = 5 * 60 * 1000;

export function useDex(listType: 'Normal' | 'Shiny') {
  const { userDisplay, isLoggedIn } = useUser();
  const [pokemon, setPokemon] = useState<DexPokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingAdds, setPendingAdds] = useState<Set<number>>(new Set());
  const [confirmingAdds, setConfirmingAdds] = useState(false);
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
        };
      });

      setPokemon(allPokemon);
      setPendingAdds(new Set());
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

    setPokemon((prev) =>
      prev.map((p) => {
        if (p.id !== pokemonId) return p;

        if (checked) {
          // Check
          if (!p.wasOnServer) {
            setPendingAdds((s) => new Set(s).add(pokemonId));
          }
          return { ...p, onList: true };
        } else {
          // Uncheck
          if (p.wasOnServer) {
            // It's on the sheet — cannot uncheck it from here.
            // The user would need a separate removal flow (not implemented).
            return p;
          }
          // Just a local pending add — remove it from pending.
          setPendingAdds((s) => {
            const ns = new Set(s);
            ns.delete(pokemonId);
            return ns;
          });
          return { ...p, onList: false };
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

  useEffect(() => {
    loadDex();
  }, [loadDex]);

  return {
    pokemon,
    loading,
    error,
    pendingAdds: Array.from(pendingAdds),
    confirmingAdds,
    togglePokemon,
    confirmAdds,
    cancelAdds,
    refreshDex: () => loadDex(true),
    hasPendingAdds: pendingAdds.size > 0,
  };
}
