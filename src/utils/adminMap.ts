// Two-way translation between gamer tags (shown in app) and
// first names (stored in Google Sheets).

export type GamerTag = 'Skatecrete' | 'RampageGamer' | 'zEViLvSTON4z';
export type FirstName = 'Dan' | 'Thomas' | 'Kingi';

export const GAMER_TO_FIRST: Record<GamerTag, FirstName> = {
  'Skatecrete': 'Dan',
  'RampageGamer': 'Thomas',
  'zEViLvSTON4z': 'Kingi',
};

export const FIRST_TO_GAMER: Record<FirstName, GamerTag> = {
  'Dan': 'Skatecrete',
  'Thomas': 'RampageGamer',
  'Kingi': 'zEViLvSTON4z',
};

export const ADMIN_LIST: {
  gamerTag: GamerTag;
  firstName: FirstName;
  available: boolean;
}[] = [
  { gamerTag: 'Skatecrete',    firstName: 'Dan',    available: true  },
  { gamerTag: 'RampageGamer',  firstName: 'Thomas', available: false },
  { gamerTag: 'zEViLvSTON4z',  firstName: 'Kingi',  available: false },
];

export function gamerTagToFirstName(tag: string): string {
  return GAMER_TO_FIRST[tag as GamerTag] || tag;
}

export function firstNameToGamerTag(name: string): string {
  return FIRST_TO_GAMER[name as FirstName] || name;
}