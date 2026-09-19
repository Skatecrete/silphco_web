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

// Parenthetical or trailing-form name → suffix.
// Keys are lowercase with hyphens removed for matching flexibility.
const PAREN_TO_SUFFIX: Record<string, string> = {
  // Forces of Nature
  'incarnate': 'incarnate',
  'therian': 'therian',

  // Creation Trio
  'altered': 'altered',
  'origin': 'origin',

  // Aegislash
  'blade': 'blade',
  'shield': 'shield',

  // Hoopa
  'confined': 'confined',
  'unbound': 'unbound',

  // Keldeo
  'ordinary': 'ordinary',
  'resolute': 'resolute',

  // Toxtricity
  'amped': 'amped',
  'low key': 'low-key',
  'low-key': 'low-key',

  // Urshifu
  'single strike': 'single-strike',
  'single-strike': 'single-strike',
  'rapid strike': 'rapid-strike',
  'rapid-strike': 'rapid-strike',

  // Lycanroc
  'midday': 'midday',
  'midnight': 'midnight',
  'dusk': 'dusk',

  // Wishiwashi
  'solo': 'solo',
  'school': 'school',

  // Sinistea / Polteageist
  'phony': 'phony',
  'antique': 'antique',

  // Maushold
  'family of three': 'family-of-three',
  'family of four': 'family-of-four',
  'family-of-three': 'family-of-three',
  'family-of-four': 'family-of-four',

  // Tatsugiri
  'curly form': 'curly-form',
  'droopy form': 'droopy-form',
  'stretchy form': 'stretchy-form',
  'curly': 'curly-form',
  'droopy': 'droopy-form',
  'stretchy': 'stretchy-form',

  // Burmy / Wormadam
  'plant': 'plant',
  'plant cloak': 'plant',
  'sandy': 'sandy',
  'sandy cloak': 'sandy',
  'trash': 'trash',
  'trash cloak': 'trash',
  'plant cloak': 'plant',

  // Basculin
  'red striped': 'red-striped',
  'blue striped': 'blue-striped',
  'white striped': 'white-striped',
  'red-striped': 'red-striped',
  'blue-striped': 'blue-striped',
  'white-striped': 'white-striped',

  // Darmanitan
  'standard': 'standard',
  'zen': 'zen',

  // Castform
  'sunny': 'sunny',
  'rainy': 'rainy',
  'snowy': 'snowy',

  // Cherrim
  'overcast': 'overcast',
  'sunshine': 'sunshine',

  // Oricorio
  'baile': 'baile',
  'baile style': 'baile',
  'pom pom': 'pom-pom',
  'pom-pom': 'pom-pom',
  'pom pom style': 'pom-pom',
  'pau': 'pau',
  "pa'u": 'pau',
  'pau style': 'pau',
  'sensu': 'sensu',
  'sensu style': 'sensu',

  // Deoxys
  'normal': 'normal',
  'attack': 'attack',
  'defense': 'defense',
  'speed': 'speed',

  // Misc
  'male': 'male',
  'female': 'female',
};

// Pokémon that REQUIRE a form suffix because bare name doesn't exist in catalog
const DEFAULT_FORM_SUFFIX: Record<string, string> = {
  'unown': 'a',
  'wormadam': 'plant',
  'tornadus': 'incarnate',
  'thundurus': 'incarnate',
  'landorus': 'incarnate',
  'keldeo': 'ordinary',
  'basculin': 'red-striped',
  'giratina': 'altered',
  'florges': 'red',
  'vivillon': 'archipelago',
  'aegislash': 'shield',
  'hoopa': 'confined',
  'zygarde': '50',
  'lycanroc': 'midday',
  'wishiwashi': 'solo',
  'toxtricity': 'amped',
  'sinistea': 'phony',
  'polteageist': 'phony',
  'urshifu': 'single-strike',
  'enamorus': 'incarnate',
  'maushold': 'family-of-four',
  'tatsugiri': 'curly-form',
  'darmanitan': 'standard',
  'meowstic': 'male',
  'indeedee': 'male',
  'basculegion': 'male',
  'oinkologne': 'male',
  'frillish': 'male',
  'jellicent': 'male',
  'pyroar': 'male',
  'hippopotas': 'male',
  'hippowdon': 'male',
  'castform': 'castform',
  'cherrim': 'overcast',
  'deoxys': 'normal',
  'mothim': 'plant',
};

// Trailing words that should be converted to a form suffix
// Order matters — longest matches first
const TRAILING_FORM_WORDS = [
  'incarnate', 'therian',
  'altered', 'origin',
  'blade', 'shield',
  'confined', 'unbound',
  'ordinary', 'resolute',
  'amped', 'low key', 'low-key',
  'single strike', 'rapid strike', 'single-strike', 'rapid-strike',
  'midday', 'midnight', 'dusk',
  'solo', 'school',
  'phony', 'antique',
  'family of three', 'family of four',
  'curly form', 'droopy form', 'stretchy form',
  'curly', 'droopy', 'stretchy',
  'plant cloak', 'sandy cloak', 'trash cloak',
  'plant', 'sandy', 'trash',
  'red striped', 'blue striped', 'white striped',
  'red-striped', 'blue-striped', 'white-striped',
  'standard', 'zen',
  'sunny', 'rainy', 'snowy',
  'overcast', 'sunshine',
  'baile style', 'pom pom style', 'pau style', 'sensu style',
  'baile', 'pom pom', 'pom-pom', 'pau', "pa'u", 'sensu',
  'attack', 'defense', 'speed',
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

  // 1. Check for parenthetical form (e.g., "Thundurus (Therian)")
  let explicitFormSuffix = '';
  const parenMatch = baseName.match(/\(([^)]+)\)/);
  if (parenMatch) {
    const inner = parenMatch[1].trim().toLowerCase();
    if (PAREN_TO_SUFFIX[inner]) {
      explicitFormSuffix = PAREN_TO_SUFFIX[inner];
    }
    baseName = baseName.replace(/\([^)]*\)/g, '').trim();
  }

  // 2. Strip prefixes (shadow, purified, dynamax, etc.)
  for (const prefix of STRIP_PREFIXES) {
    if (baseName.startsWith(prefix)) {
      baseName = baseName.substring(prefix.length).trim();
      break;
    }
  }

  // 3. Handle regional forms (alolan/galarian/hisuian/paldean)
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

  // 4. If no explicit form from parens, check for trailing form words
  if (!explicitFormSuffix) {
    for (const word of TRAILING_FORM_WORDS) {
      if (baseName.endsWith(' ' + word)) {
        const base = baseName.substring(0, baseName.length - word.length - 1).trim();
        const suffix = PAREN_TO_SUFFIX[word] || word.replace(/\s+/g, '-');
        baseName = base;
        explicitFormSuffix = suffix;
        break;
      }
    }
  }

  let slug = baseName
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  if (!slug) return null;

  // 5. Append explicit form suffix if we have one
  if (explicitFormSuffix) {
    if (!slug.endsWith('-' + explicitFormSuffix)) {
      slug += '-' + explicitFormSuffix;
    }
  }

  // 6. Apply default form suffix if none was specified and the mon needs one
  if (!explicitFormSuffix && DEFAULT_FORM_SUFFIX[slug]) {
    slug += '-' + DEFAULT_FORM_SUFFIX[slug];
  }

  let formSuffix = '';
  if (isMega) formSuffix += '-mega';
  else if (isGigantamax) formSuffix += '-gigantamax';

  const shinySuffix = isShiny ? '-shiny' : '';

  return `${ULTIMATE_GALLERY_URL}/${slug}${formSuffix}${shinySuffix}.png`;
}

export function getPokeApiUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;
}

export function getComingSoonUrl(): string {
  return COMING_SOON_URL;
}

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
