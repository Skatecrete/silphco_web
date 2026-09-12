const ULTIMATE_GALLERY_URL = 'https://raw.githubusercontent.com/Skatecrete/infographics/main/ultimategallery';
const COMING_SOON_URL = 'https://raw.githubusercontent.com/Skatecrete/infographics/main/web/misc/imagecomingsoon.png';

const STRIP_PREFIXES = [
  'shadow ',
  'purified ',
  'd-max ',
  'g-max ',
  'dynamax ',
  'gigantamax ',
  'primal ',
  'ultra beast ',
  'mega ',
];

export function getUltimateGalleryUrl(
  pokemonName: string,
  isShiny: boolean = false,
  isMega: boolean = false,
  isGigantamax: boolean = false,
  isUltraBeast: boolean = false
): string | null {
  if (!pokemonName) return null;

  let baseName = pokemonName.toLowerCase().trim();

  baseName = baseName.replace(/\([^)]*\)/g, '').trim();

  for (const prefix of STRIP_PREFIXES) {
    if (baseName.startsWith(prefix)) {
      baseName = baseName.substring(prefix.length).trim();
      break;
    }
  }

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
    if (baseName.startsWith(keyword + ' ')) {
      baseName = baseName.substring(keyword.length + 1).trim() + '-' + suffix;
      break;
    }
    if (baseName.endsWith(' ' + keyword)) {
      baseName = baseName.substring(0, baseName.length - keyword.length - 1).trim() + '-' + suffix;
      break;
    }
  }

  const slug = baseName
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  if (!slug) return null;

  let formSuffix = '';
  if (isMega) formSuffix += '-mega';
  else if (isGigantamax) formSuffix += '-gigantamax';
  else if (isUltraBeast) formSuffix += '-ultra-beast';

  const shinySuffix = isShiny ? '-shiny' : '';

  return `${ULTIMATE_GALLERY_URL}/${slug}${formSuffix}${shinySuffix}.png`;
}

export function getPokeApiUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;
}

export function getComingSoonUrl(): string {
  return COMING_SOON_URL;
}

/**
 * Resolves the best available image for a Pokemon.
 * Order: Ultimate Gallery → PokeAPI (only if id > 0) → Coming Soon image.
 */
export function resolveImage(
  pokemonName: string,
  id: number,
  isShiny: boolean = false,
  isMega: boolean = false,
  isGigantamax: boolean = false,
  isUltraBeast: boolean = false
): string {
  const galleryUrl = getUltimateGalleryUrl(pokemonName, isShiny, isMega, isGigantamax, isUltraBeast);
  if (galleryUrl) return galleryUrl;
  if (id && id > 0) return getPokeApiUrl(id);
  return COMING_SOON_URL;
}
