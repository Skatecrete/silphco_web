import { useState, useEffect } from 'react';
import { fetchSpawns, SpawnData } from '@/services/spawnApi';
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

const REGIONAL_POKEMON = [
  "Farfetch'd", "Kangaskhan", "Mr. Mime", "Tauros", "Corsola", "Heracross",
  "Illumise", "Lunatone", "Relicanth", "Seviper", "Solrock", "Torkoal",
  "Tropius", "Volbeat", "Zangoose", "Carnivine", "Chatot", "Pachirisu",
  "Shellos", "Maractus", "Sigilyph", "Hawlucha", "Klefki", "Comfey", "Stonjourner"
];

const GREAT_LEAGUE = ['Aegislash', 'Carbink', 'Giratina', 'Zygarde', 'Clodsire', 'Registeel', 'Azumarill', 'Lucario', 'Altaria', 'Turtonator', 'Regidrago', 'Crustle', 'Skeledirge', 'Diggersby', 'Kommo-o', 'Torkoal', 'Clefable', 'Regirock', 'Genesect', 'Goodra', 'Latias', 'Machamp', 'Cetitan', 'Pangoro', 'Murkrow', 'Raikou', 'Rufflet'];
const ULTRA_LEAGUE = ['Zygarde', 'Giratina', 'Cresselia', 'Forretress', 'Registeel', 'Skeledirge', 'Pecharunt', 'Tentacruel', 'Moltres', 'Jellicent', 'Cobalion', 'Regidrago', 'Tinkaton', 'Grumpig', 'Dusknoir', 'Crustle', 'Lapras', 'Turtonator', 'Steelix', 'Lucario', 'Clefable', 'Lickilicky', 'Florges', 'Genesect', 'Dialga', 'Latias', 'Regirock'];
const MASTER_LEAGUE = ['Zygarde', 'Eternatus', 'Dialga', 'Giratina', 'Meloetta', 'Yveltal', 'Kyurem', 'Reshiram', 'Palkia', 'Zekrom', 'Zamazenta', 'Lugia', 'Ho-Oh', 'Metagross', 'Goodra', 'Lunala', 'Xerneas', 'Urshifu', 'Garchomp', 'Latias'];
const PREMIER_CUP = ['Zygarde', 'Eternatus', 'Meloetta', 'Dialga', 'Kyurem', 'Giratina', 'Palkia', 'Zamazenta', 'Zacian', 'Metagross', 'Goodra', 'Urshifu', 'Garchomp', 'Moltres', 'Hydreigon', 'Gholdengo', 'Marshadow', 'Ho-Oh', 'Kommo-o', 'Genesect', 'Baxcalibur'];
const ULTRA_PREMIER = ['Forretress', 'Zygarde', 'Jellicent', 'Tinkaton', 'Moltres', 'Skeledirge', 'Mewtwo', 'Regidrago', 'Pecharunt', 'Cresselia', 'Turtonator', 'Giratina', 'Cradily', 'Lucario', 'Lapras', 'Crustle', 'Tentacruel', 'Ninetales', 'Florges', 'Dialga', 'Genesect', 'Toucannon', 'Goodra', 'Kingdra', 'Talonflame', 'Lickilicky'];

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
          isTopPremierCup: isInList(spawn.name, PREMIER_CUP),
          isTopUltraPremier: isInList(spawn.name, ULTRA_PREMIER),
          imageUrl: spawn.image_url,
        });
      }

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
            isTopPremierCup: isInList(name, PREMIER_CUP),
            isTopUltraPremier: isInList(name, ULTRA_PREMIER),
            imageUrl: '',
          });
        }
      }

      pokemonList.sort((a, b) => b.spawnRate - a.spawnRate);
      setAllPokemon(pokemonList);
      setLoading(false);
    }

    loadSpawns();
  }, []);

  return { allPokemon, loading, error };
}