import { useState, useEffect } from 'react';
import { fetchCurrentRaids, fetchScrapedDuckRaids } from '@/services/rotationApi';
import { getUltimateGalleryUrl, getPokeApiUrl } from '@/services/imageUrlBuilder';
import { isUltraBeast } from '@/utils/constants';

export interface Raid {
  id: number;
  name: string;
  tier: string;
  isShiny: boolean;
  image: string;
}

const INVALID_NAMES = [
  'search...', 'search', 'bug', 'dark', 'dragon', 'electric', 'fairy',
  'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice',
  'normal', 'poison', 'psychic', 'rock', 'steel', 'water',
  'debaty', 'mystery', 'unknown',
];

const POKEMON_ID_MAP: Record<string, number> = {
  'pikachu': 25, 'eevee': 133, 'vulpix': 37, 'alolan vulpix': 37,
  'gastly': 92, 'swablu': 333, 'rufflet': 627, 'starly': 396,
  'gligar': 207, 'moltres': 146, 'pidgeot': 18, 'lucario': 448,
  'machop': 66, 'shuckle': 213, 'rookidee': 821, 'vullaby': 629,
  'staraptor': 398, 'corvisquire': 822, 'bombirdier': 962, 'noctowl': 164,
  'celesteela': 797, 'kartana': 798, 'dialga': 483, 'latias': 380,
  'latios': 381, 'horsea': 116, 'porygon': 137, 'beldum': 374,
  'golett': 622, 'marowak': 105, 'alolan marowak': 105, 'hitmonlee': 106,
};

/**
 * Convert a display name to a PokeAPI-compatible slug.
 * Returns null if the name shouldn't be sent to PokeAPI at all.
 */
function cleanNameForPokeApi(raw: string): string | null {
  let name = raw.toLowerCase().trim();

  // Reject known-invalid entries immediately.
  if (INVALID_NAMES.includes(name)) return null;

  // Remove parentheticals: "thundurus (incarnate)" -> "thundurus"
  name = name.replace(/\([^)]*\)/g, '').trim();
  if (!name) return null;

  // Strip prefix words that PokeAPI doesn't use in slugs.
  const prefixStrips = ['shadow ', 'purified ', 'd-max ', 'g-max ', 'dynamax ', 'gigantamax ', 'primal ', 'super mega ', 'mega ', 'ultra beast '];
  for (const p of prefixStrips) {
    if (name.startsWith(p)) {
      name = name.substring(p.length).trim();
      break;
    }
  }
  if (!name) return null;

  // Handle region prefix/suffix -> PokeAPI regional slug format:
  // "alolan sandslash" -> "sandslash-alola"
  // "sandslash alolan" -> "sandslash-alola"
  const regionMap: Record<string, string> = {
    'alolan': 'alola',
    'alola': 'alola',
    'galarian': 'galarian',
    'galar': 'galarian',
    'hisuian': 'hisuian',
    'hisui': 'hisuian',
    'paldean': 'paldea',
    'paldea': 'paldea',
  };
  for (const [keyword, suffix] of Object.entries(regionMap)) {
    if (name.startsWith(keyword + ' ')) {
      name = name.substring(keyword.length + 1).trim() + '-' + suffix;
      break;
    }
    if (name.endsWith(' ' + keyword)) {
      name = name.substring(0, name.length - keyword.length - 1).trim() + '-' + suffix;
      break;
    }
  }

  // Sanity check: must contain only letters, digits, hyphen.
  if (!/^[a-z0-9-]+$/.test(name)) return null;
  // Sanity check: must not be ridiculously short.
  if (name.length < 3) return null;

  return name;
}

async function getPokemonId(name: string): Promise<number> {
  const cleanName = name.toLowerCase().replace(/\s+/g, ' ').trim();

  if (POKEMON_ID_MAP[cleanName]) return POKEMON_ID_MAP[cleanName];

  const slug = cleanNameForPokeApi(name);
  if (!slug) return 0;

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${slug}`);
    if (response.ok) {
      const data = await response.json();
      return data.id;
    }
  } catch (e) {}

  return 0;
}

function getTierDisplay(tier: string, name: string): string {
  const tierLower = tier.toLowerCase();
  const nameLower = name.toLowerCase();

  if (nameLower.includes('shadow') || tierLower.includes('shadow')) {
    if (tierLower.includes('5-star') || tierLower.includes('legendary')) {
      return '🌑 Shadow Legendary (5-Star)';
    } else if (tierLower.includes('3-star')) {
      return '🌑 Shadow 3-Star';
    } else {
      return '🌑 Shadow 1-Star';
    }
  }

  if (nameLower.includes('shadow')) return '🌑 Shadow';

  return tier;
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
        const [snackNap, scrapedDuck] = await Promise.all([
          fetchCurrentRaids(),
          fetchScrapedDuckRaids(),
        ]);

        if (!snackNap) {
          setError('Failed to load raids');
          setLoading(false);
          return;
        }

        const regular: Record<string, Raid[]> = {
          tier1: [],
          tier2: [],
          tier3: [],
          tier4: [],
          tier5: [],
          mega: [],
          primal: [],
          ultraBeasts: [],
          shadow5: [],
          shadow3: [],
          shadow1: [],
        };

        // ScrapedDuck shadow raids
        if (scrapedDuck && scrapedDuck.length > 0) {
          for (const raid of scrapedDuck) {
            const name = raid.name || '';
            const tier = raid.tier || '';
            const isShiny = raid.canBeShiny || false;

            if (!name.toLowerCase().includes('shadow') && !tier.toLowerCase().includes('shadow')) {
              continue;
            }
            if (INVALID_NAMES.includes(name.toLowerCase().trim())) continue;

            const id = await getPokemonId(name);
            const image = getUltimateGalleryUrl(name, isShiny) || getPokeApiUrl(id);
            const displayTier = getTierDisplay(tier, name);

            const raidObj: Raid = { id, name, tier: displayTier, isShiny, image };

            if (displayTier.includes('5-Star') || displayTier.includes('Legendary')) {
              regular.shadow5.push(raidObj);
            } else if (displayTier.includes('3-Star')) {
              regular.shadow3.push(raidObj);
            } else {
              regular.shadow1.push(raidObj);
            }
          }
        }

        // SnackNap regular tiers
        const tiers = {
          tier1: '1-Star',
          tier2: '2-Star',
          tier3: '3-Star',
          tier4: '4-Star',
          tier5: '5-Star',
          mega: 'Mega',
          primal: 'Primal',
          ultra_beasts: 'Ultra Beast',
        };

        for (const [key, tierName] of Object.entries(tiers)) {
          const list = snackNap[key as keyof typeof snackNap];
          if (Array.isArray(list)) {
            for (const name of list) {
              if (INVALID_NAMES.includes(name.toLowerCase().trim()) || name.length < 3) continue;
              const id = await getPokemonId(name);
              const isShiny = false;
              const isMega = key === 'mega' || key === 'primal';
              const isUltra = key === 'ultra_beasts';
              const image = getUltimateGalleryUrl(name, isShiny, isMega, false, isUltra) || getPokeApiUrl(id);
              const displayKey = key === 'ultra_beasts' ? 'ultraBeasts' : key;
              regular[displayKey].push({ id, name, tier: tierName, isShiny, image });
            }
          }
        }

        // Dynamax
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
              if (INVALID_NAMES.includes(name.toLowerCase().trim()) || name.length < 3) continue;
              const id = await getPokemonId(name);
              const isGigantamax = key === 'gigantamax';
              const isShiny = false;
              const image = getUltimateGalleryUrl(name, isShiny, false, isGigantamax, false) || getPokeApiUrl(id);
              dynamax.push({ id, name, tier: dynaTiers[key], isShiny, image });
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
