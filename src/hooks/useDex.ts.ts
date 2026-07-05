import { useState, useEffect, useCallback } from 'react';
import { getDexProgress, addDexPokemon, removeDexPokemon } from '@/services/sheetsApi';
import { useUser } from './useUser';

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

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useDex(listType: 'Normal' | 'Shiny') {
  const { userDisplay, isLoggedIn } = useUser();
  const [pokemon, setPokemon] = useState<DexPokemon[]>([]);
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingRemovals, setPendingRemovals] = useState<Set<number>>(new Set());
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  // All Pokemon names (simplified - full list would be imported)
  const ALL_POKEMON: Record<number, string> = {
    1: 'Bulbasaur', 2: 'Ivysaur', 3: 'Venusaur',
    4: 'Charmander', 5: 'Charmeleon', 6: 'Charizard',
    7: 'Squirtle', 8: 'Wartortle', 9: 'Blastoise',
    10: 'Caterpie', 11: 'Metapod', 12: 'Butterfree',
    13: 'Weedle', 14: 'Kakuna', 15: 'Beedrill',
    16: 'Pidgey', 17: 'Pidgeotto', 18: 'Pidgeot',
    19: 'Rattata', 20: 'Raticate', 21: 'Spearow',
    22: 'Fearow', 23: 'Ekans', 24: 'Arbok',
    25: 'Pikachu', 26: 'Raichu', 27: 'Sandshrew',
    28: 'Sandslash', 29: 'Nidoran♀', 30: 'Nidorina',
    31: 'Nidoqueen', 32: 'Nidoran♂', 33: 'Nidorino',
    34: 'Nidoking', 35: 'Clefairy', 36: 'Clefable',
    37: 'Vulpix', 38: 'Ninetales', 39: 'Jigglypuff',
    40: 'Wigglytuff', 41: 'Zubat', 42: 'Golbat',
    43: 'Oddish', 44: 'Gloom', 45: 'Vileplume',
    46: 'Paras', 47: 'Parasect', 48: 'Venonat',
    49: 'Venomoth', 50: 'Diglett', 51: 'Dugtrio',
    52: 'Meowth', 53: 'Persian', 54: 'Psyduck',
    55: 'Golduck', 56: 'Mankey', 57: 'Primeape',
    58: 'Growlithe', 59: 'Arcanine', 60: 'Poliwag',
    61: 'Poliwhirl', 62: 'Poliwrath', 63: 'Abra',
    64: 'Kadabra', 65: 'Alakazam', 66: 'Machop',
    67: 'Machoke', 68: 'Machamp', 69: 'Bellsprout',
    70: 'Weepinbell', 71: 'Victreebel', 72: 'Tentacool',
    73: 'Tentacruel', 74: 'Geodude', 75: 'Graveler',
    76: 'Golem', 77: 'Ponyta', 78: 'Rapidash',
    79: 'Slowpoke', 80: 'Slowbro', 81: 'Magnemite',
    82: 'Magneton', 83: "Farfetch'd", 84: 'Doduo',
    85: 'Dodrio', 86: 'Seel', 87: 'Dewgong',
    88: 'Grimer', 89: 'Muk', 90: 'Shellder',
    91: 'Cloyster', 92: 'Gastly', 93: 'Haunter',
    94: 'Gengar', 95: 'Onix', 96: 'Drowzee',
    97: 'Hypno', 98: 'Krabby', 99: 'Kingler',
    100: 'Voltorb', 101: 'Electrode', 102: 'Exeggcute',
    103: 'Exeggutor', 104: 'Cubone', 105: 'Marowak',
    106: 'Hitmonlee', 107: 'Hitmonchan', 108: 'Lickitung',
    109: 'Koffing', 110: 'Weezing', 111: 'Rhyhorn',
    112: 'Rhydon', 113: 'Chansey', 114: 'Tangela',
    115: 'Kangaskhan', 116: 'Horsea', 117: 'Seadra',
    118: 'Goldeen', 119: 'Seaking', 120: 'Staryu',
    121: 'Starmie', 122: 'Mr. Mime', 123: 'Scyther',
    124: 'Jynx', 125: 'Electabuzz', 126: 'Magmar',
    127: 'Pinsir', 128: 'Tauros', 129: 'Magikarp',
    130: 'Gyarados', 131: 'Lapras', 132: 'Ditto',
    133: 'Eevee', 134: 'Vaporeon', 135: 'Jolteon',
    136: 'Flareon', 137: 'Porygon', 138: 'Omanyte',
    139: 'Omastar', 140: 'Kabuto', 141: 'Kabutops',
    142: 'Aerodactyl', 143: 'Snorlax', 144: 'Articuno',
    145: 'Zapdos', 146: 'Moltres', 147: 'Dratini',
    148: 'Dragonair', 149: 'Dragonite', 150: 'Mewtwo',
    151: 'Mew',
    // ... full list would continue to 1025
  };

  const loadDex = useCallback(async (forceRefresh: boolean = false) => {
    if (!isLoggedIn || !userDisplay) {
      setLoading(false);
      return;
    }

    const now = Date.now();
    if (!forceRefresh && lastFetchTime > 0 && (now - lastFetchTime) < CACHE_DURATION && pokemon.length > 0) {
      // Cache is valid
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dexList = await getDexProgress(userDisplay, listType);
      const ids = new Set(dexList.map((entry: DexEntry) => entry.id));

      // Build full Pokemon list
      const allPokemon: DexPokemon[] = Object.entries(ALL_POKEMON).map(([id, name]) => ({
        id: parseInt(id),
        name,
        onList: ids.has(parseInt(id)),
        isShinyAvailable: listType === 'Shiny' || true, // Simplified
        isPendingRemoval: false,
      }));

      setCheckedIds(ids);
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
    if (!userDisplay) return;

    const updatedPokemon = pokemon.map((p) => {
      if (p.id === pokemonId) {
        if (!checked) {
          // Unchecking - mark as pending removal
          setPendingRemovals((prev) => new Set(prev).add(pokemonId));
          return { ...p, isPendingRemoval: true };
        } else {
          // Checking - remove from pending removals
          setPendingRemovals((prev) => {
            const newSet = new Set(prev);
            newSet.delete(pokemonId);
            return newSet;
          });
          return { ...p, onList: true, isPendingRemoval: false };
        }
      }
      return p;
    });
    setPokemon(updatedPokemon);

    if (checked) {
      // Add to sheet immediately
      const pokemonName = ALL_POKEMON[pokemonId] || `Pokemon #${pokemonId}`;
      const success = await addDexPokemon(userDisplay, pokemonId, pokemonName, listType);
      if (success) {
        setCheckedIds((prev) => new Set(prev).add(pokemonId));
        setPendingRemovals((prev) => {
          const newSet = new Set(prev);
          newSet.delete(pokemonId);
          return newSet;
        });
        // Update local state
        setPokemon((prev) =>
          prev.map((p) =>
            p.id === pokemonId ? { ...p, onList: true, isPendingRemoval: false } : p
          )
        );
      } else {
        // Revert
        setPokemon((prev) =>
          prev.map((p) =>
            p.id === pokemonId ? { ...p, onList: false, isPendingRemoval: false } : p
          )
        );
      }
    }
  };

  const confirmRemovals = async () => {
    if (pendingRemovals.size === 0 || !userDisplay) return;

    const toRemove = Array.from(pendingRemovals);
    let successCount = 0;

    for (const id of toRemove) {
      const success = await removeDexPokemon(userDisplay, id, listType);
      if (success) {
        successCount++;
        setCheckedIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
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

    return { successCount, total: toRemove.length };
  };

  const cancelRemovals = () => {
    setPendingRemovals(new Set());
    setPokemon((prev) =>
      prev.map((p) => ({
        ...p,
        isPendingRemoval: false,
      }))
    );
  };

  // Load dex on mount and when dependencies change
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