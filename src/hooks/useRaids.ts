import { useState, useEffect } from 'react';
import { fetchCurrentRaids, fetchScrapedDuckRaids, RaidData } from '@/services/rotationApi';
import { getUltimateGalleryUrl, getPokeApiUrl } from '@/services/imageUrlBuilder';
import { isUltraBeast } from '@/utils/constants';

export interface Raid {
  id: number;
  name: string;
  tier: string;
  isShiny: boolean;
  image: string;
}

const INVALID_NAMES = ['Search...', 'bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 'flying', 'ghost', 'grass', 'ground', 'ice', 'normal', 'poison', 'psychic', 'rock', 'steel', 'water'];

// Simple map for ID lookup
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

        // ========== 1. Process ScrapedDuck (Shadow Raids) ==========
        if (scrapedDuck && scrapedDuck.length > 0) {
          for (const raid of scrapedDuck) {
            const name = raid.name || '';
            const tier = raid.tier || '';
            const isShiny = raid.canBeShiny || false;
            
            // ONLY Shadow raids from ScrapedDuck
            if (!name.toLowerCase().includes('shadow') && !tier.toLowerCase().includes('shadow')) {
              continue; // Skip non-shadow raids from ScrapedDuck
            }

            const id = await getPokemonId(name);
            // Shadow raids: keep isShiny as-is from ScrapedDuck
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

        // ========== 2. Process SnackNap Data ==========
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
              if (INVALID_NAMES.includes(name) || name.length < 3) continue;
              const id = await getPokemonId(name);
              // ✅ FIX: Normal raids should NOT show shiny by default
              // isShiny = false for normal raids (they show ✨ indicator separately)
              const isShiny = false;  // ← CHANGED from true to false
              const isMega = key === 'mega' || key === 'primal';
              const isUltra = key === 'ultra_beasts';
              const image = getUltimateGalleryUrl(name, isShiny, isMega, false, isUltra) || getPokeApiUrl(id);
              const displayKey = key === 'ultra_beasts' ? 'ultraBeasts' : key;
              regular[displayKey].push({ id, name, tier: tierName, isShiny, image });
            }
          }
        }

        // ========== 3. Process Dynamax ==========
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
              // ✅ FIX: Dynamax raids should NOT show shiny by default
              const isShiny = false;  // ← CHANGED from true to false
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