import { useState, useEffect } from 'react';
import { fetchCurrentRaids } from '@/services/rotationApi';
import { getUltimateGalleryUrl, getPokeApiUrl } from '@/services/imageUrlBuilder';

export interface Raid {
  id: number;
  name: string;
  tier: string;
  isShiny: boolean;
  image: string;
}

const INVALID_NAMES = ['Search...', 'bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice', 'normal', 'poison', 'psychic', 'rock', 'steel', 'water'];

const POKEMON_ID_MAP: Record<string, number> = {
  'pikachu': 25, 'eevee': 133, 'vulpix': 37, 'alolan vulpix': 37,
  'gastly': 92, 'swablu': 333, 'rufflet': 627, 'starly': 396,
  'gligar': 207, 'moltres': 146, 'pidgeot': 18, 'lucario': 448,
  'machop': 66, 'shuckle': 213, 'rookidee': 821, 'vullaby': 629,
  'staraptor': 398, 'corvisquire': 822, 'bombirdier': 962, 'noctowl': 164,
};

async function getPokemonId(name: string): Promise<number> {
  const cleanName = name.toLowerCase()
    .replace('shadow ', '')
    .replace('mega ', '')
    .replace('d-max ', '')
    .trim();

  if (POKEMON_ID_MAP[cleanName]) return POKEMON_ID_MAP[cleanName];

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${cleanName}`);
    if (response.ok) {
      const data = await response.json();
      return data.id;
    }
  } catch (e) {}

  return 25;
}

export function useRaids() {
  const [regularRaids, setRegularRaids] = useState<Record<string, Raid[]>>({});
  const [dynamaxRaids, setDynamaxRaids] = useState<Raid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRaids() {
      setLoading(true);
      setError(null);

      try {
        const snackNap = await fetchCurrentRaids();

        if (!snackNap) {
          setError('Failed to load raids');
          setLoading(false);
          return;
        }

        const regular: Record<string, Raid[]> = {
          tier1: [], tier3: [], tier5: [], mega: [], primal: [],
          ultraBeasts: [], superMega: [], shadow5: [], shadow3: [], shadow1: [],
        };

        const tiers: Record<string, string> = {
          tier1: '1-Star', tier3: '3-Star', tier5: '5-Star',
          mega: 'Mega', primal: 'Primal', ultra_beasts: 'Ultra Beast', super_mega: 'Super Mega',
        };

        for (const [key, tierName] of Object.entries(tiers)) {
          const list = snackNap[key as keyof typeof snackNap];
          if (Array.isArray(list)) {
            for (const name of list) {
              if (INVALID_NAMES.includes(name) || name.length < 3) continue;
              const id = await getPokemonId(name);
              const isShiny = true;
              const isMega = key === 'mega' || key === 'primal' || key === 'super_mega';
              const isUltra = key === 'ultra_beasts';
              const image = getUltimateGalleryUrl(name, isShiny, isMega, false, isUltra) || getPokeApiUrl(id);
              const displayKey = key === 'ultra_beasts' ? 'ultraBeasts' : key;
              regular[displayKey].push({ id, name, tier: tierName, isShiny, image });
            }
          }
        }

        const dynaKeys = ['dynamax_tier1', 'dynamax_tier2', 'dynamax_tier3', 'dynamax_tier5', 'gigantamax'];
        const dynaTiers: Record<string, string> = {
          dynamax_tier1: '⚡ Dynamax Tier 1',
          dynamax_tier2: '⚡⚡ Dynamax Tier 2',
          dynamax_tier3: '⚡⚡⚡ Dynamax Tier 3',
          dynamax_tier5: '⚡⚡⚡⚡⚡ Dynamax Tier 5',
          gigantamax: '💥 Gigantamax',
        };

        const dynamax: Raid[] = [];
        for (const key of dynaKeys) {
          const list = snackNap[key as keyof typeof snackNap];
          if (Array.isArray(list)) {
            for (const name of list) {
              if (INVALID_NAMES.includes(name) || name.length < 3) continue;
              const id = await getPokemonId(name);
              const isGigantamax = key === 'gigantamax';
              const image = getUltimateGalleryUrl(name, true, false, isGigantamax, false) || getPokeApiUrl(id);
              dynamax.push({ id, name, tier: dynaTiers[key], isShiny: true, image });
            }
          }
        }

        setRegularRaids(regular);
        setDynamaxRaids(dynamax);
        setLoading(false);
      } catch (e) {
        console.error('Error loading raids:', e);
        setError('Failed to load raids');
        setLoading(false);
      }
    }

    loadRaids();
  }, []);

  return { regularRaids, dynamaxRaids, loading, error };
}