// ========== ALL POKEMON NAMES (1-1025) ==========
// Truncated for space - you'll want the full list from PokemonNames.kt
// For now, using a simplified map for the dial phase
export const ALL_POKEMON_NAMES: Record<number, string> = {
  1: 'Bulbasaur',
  2: 'Ivysaur',
  3: 'Venusaur',
  4: 'Charmander',
  5: 'Charmeleon',
  6: 'Charizard',
  7: 'Squirtle',
  8: 'Wartortle',
  9: 'Blastoise',
  10: 'Caterpie',
  11: 'Metapod',
  12: 'Butterfree',
  13: 'Weedle',
  14: 'Kakuna',
  15: 'Beedrill',
  16: 'Pidgey',
  17: 'Pidgeotto',
  18: 'Pidgeot',
  19: 'Rattata',
  20: 'Raticate',
  21: 'Spearow',
  22: 'Fearow',
  23: 'Ekans',
  24: 'Arbok',
  25: 'Pikachu',
  // ... full list to 1025
};

// ========== ULTRA BEAST IDS ==========
export const ULTRA_BEAST_IDS = new Set([
  793, 794, 795, 796, 797, 798, 799, 803, 804, 805, 806,
]);

export function isUltraBeast(id: number): boolean {
  return ULTRA_BEAST_IDS.has(id);
}