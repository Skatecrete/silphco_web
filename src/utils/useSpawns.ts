import { useState, useEffect } from 'react';
import { fetchSpawns, SpawnData } from '@/services/shungoApi';
import { ALL_POKEMON_NAMES } from '@/utils/constants';

export interface Pokemon {
  id: number;
  name: string;
  spawnRate: number;
  isShiny: boolean;
  shinyRate: string;
  isRegional: boolean;
  isTopGreatLeague: boolean;
  isTopUltraLeague: boolean;
  isTopMasterLeague: boolean;
  isTopPremierCup: boolean;
  isTopUltraPremier: boolean;
  imageUrl: string;
}

// Regional list
const REGIONAL_POKEMON = [
  "Farfetch'd", "Kangaskhan", "Mr. Mime", "Tauros", "Corsola", "Heracross",
  "Illumise", "Lunatone", "Relicanth", "Seviper", "Solrock", "Torkoal",
  "Tropius", "Volbeat", "Zangoose", "Carnivine", "Chatot", "Pachirisu",
  "Shellos", "Maractus", "Sigilyph", "Hawlucha", "Klefki", "Comfey", "Stonjourner"
];

// PvP league lists (truncated - full lists from Pokemon.kt)
const GREAT_LEAGUE = ['Aegislash', 'Carbink', 'Giratina', 'Zygarde', 'Clodsire', 'Registeel'];
const ULTRA_LEAGUE = ['Zygarde', 'Giratina', 'Cresselia', 'Forretress', 'Registeel'];
const MASTER_LEAGUE = ['Zygarde', 'Eternatus', 'Dialga', 'Giratina', 'Meloetta'];

const PERMABOOSTED_IDS = new Set([
  144, 145, 146, 150, 243, 244, 245, 249, 250, 251,
  380, 381, 382, 383, 384, 480, 481, 482, 483, 484,
  485, 486, 487, 488, 785, 786, 787, 788, 888, 889,
  894, 895,
]);

function isRegional(name: string): boolean {
  for (const r of REGIONAL_POKEMON) {
    if (name.includes(r)) return true;
  }
  return false;
}

function isInList(name: string, list: string[]): boolean {
  for (const item of list) {
    if (name.includes(item)) return true;
  }
  return false;
}

function getShinyRate(id: number, isShiny: boolean): string {
  if (!isShiny) return '❌ Not available';
  return PERMABOOSTED_IDS.has(id) ? '✨ 1/64' : '✨ 1/512';
}

export function useSpawns() {
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSpawns() {
      setLoading(true);
      setError(null);

      const data = await fetchSpawns();

      if (!data) {
        setError('Failed to load spawns');
        setLoading(false);
        return;
      }

      const fetchedMap = new Map<number, SpawnData>();
      for (const spawn of data.spawns) {
        fetchedMap.set(spawn.id, spawn);
      }

      const pokemonList: Pokemon[] = [];

      // Add fetched spawns
      for (const spawn of data.spawns) {
        pokemonList.push({
          id: spawn.id,
          name: spawn.name,
          spawnRate: spawn.rate,
          isShiny: spawn.shiny,
          shinyRate: getShinyRate(spawn.id, spawn.shiny),
          isRegional: isRegional(spawn.name),
          isTopGreatLeague: isInList(spawn.name, GREAT_LEAGUE),
          isTopUltraLeague: isInList(spawn.name, ULTRA_LEAGUE),
          isTopMasterLeague: isInList(spawn.name, MASTER_LEAGUE),
          isTopPremierCup: false,
          isTopUltraPremier: false,
          imageUrl: spawn.image_url,
        });
      }

      // Add missing Pokemon as NOPE (0.0% spawn rate)
      for (const [id, name] of Object.entries(ALL_POKEMON_NAMES)) {
        const numericId = parseInt(id);
        if (!fetchedMap.has(numericId)) {
          pokemonList.push({
            id: numericId,
            name: name,
            spawnRate: 0.0,
            isShiny: false,
            shinyRate: '❌ Not available',
            isRegional: isRegional(name),
            isTopGreatLeague: isInList(name, GREAT_LEAGUE),
            isTopUltraLeague: isInList(name, ULTRA_LEAGUE),
            isTopMasterLeague: isInList(name, MASTER_LEAGUE),
            isTopPremierCup: false,
            isTopUltraPremier: false,
            imageUrl: '',
          });
        }
      }

      // Sort by spawn rate descending
      pokemonList.sort((a, b) => b.spawnRate - a.spawnRate);
      setAllPokemon(pokemonList);
      setLoading(false);
    }

    loadSpawns();
  }, []);

  return { allPokemon, loading, error };
}