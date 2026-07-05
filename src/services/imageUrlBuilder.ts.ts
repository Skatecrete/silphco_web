const ULTIMATE_GALLERY_URL = 'https://raw.githubusercontent.com/Skatecrete/infographics/main/ultimategallery';

export function getUltimateGalleryUrl(
  pokemonName: string,
  isShiny: boolean = false,
  isMega: boolean = false,
  isGigantamax: boolean = false,
  isUltraBeast: boolean = false
): string | null {
  if (!pokemonName) return null;

  let baseName = pokemonName.toLowerCase().trim();

  // Remove common prefixes
  const prefixes = ['mega ', 'gigantamax ', 'shadow ', 'd-max ', 'ultra beast '];
  for (const prefix of prefixes) {
    if (baseName.startsWith(prefix)) {
      baseName = baseName.substring(prefix.length);
      break;
    }
  }

  // Remove parentheses content
  baseName = baseName.replace(/\([^)]*\)/g, '').trim();

  // Handle region variations
  const regionMap: Record<string, string> = {
    'alolan': 'alola',
    'alola': 'alola',
    'galarian': 'galarian',
    'hisuian': 'hisuian',
    'paldean': 'paldea',
    'paldea': 'paldea',
  };

  for (const [regionKeyword, regionSuffix] of Object.entries(regionMap)) {
    if (baseName.startsWith(regionKeyword + ' ')) {
      const pokemon = baseName.substring(regionKeyword.length + 1);
      baseName = pokemon + '-' + regionSuffix;
      break;
    } else if (baseName.endsWith(' ' + regionKeyword)) {
      const pokemon = baseName.substring(0, baseName.length - regionKeyword.length - 1);
      baseName = pokemon + '-' + regionSuffix;
      break;
    }
  }

  const slug = baseName.trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  let suffix = '';
  if (isMega) suffix = '-mega';
  else if (isGigantamax) suffix = '-gigantamax';
  else if (isUltraBeast) suffix = '-ultra-beast';

  const shinySuffix = isShiny ? '-shiny' : '';

  return `${ULTIMATE_GALLERY_URL}/${slug}${suffix}${shinySuffix}.png`;
}

export function getPokeApiUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;
}