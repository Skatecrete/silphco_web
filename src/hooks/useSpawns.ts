import { useState, useEffect } from 'react';
import { fetchSpawns, SpawnData } from '@/services/spawnApi';

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

const ALL_POKEMON_NAMES: Record<number, string> = {
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
};

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