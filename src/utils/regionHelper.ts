export interface Region {
  name: string;
  startId: number;
  endId: number;
  displayName: string;
}

export const REGIONS: Region[] = [
  { name: 'Kanto', startId: 1, endId: 151, displayName: 'Kanto (Gen 1)' },
  { name: 'Johto', startId: 152, endId: 251, displayName: 'Johto (Gen 2)' },
  { name: 'Hoenn', startId: 252, endId: 386, displayName: 'Hoenn (Gen 3)' },
  { name: 'Sinnoh', startId: 387, endId: 493, displayName: 'Sinnoh (Gen 4)' },
  { name: 'Unova', startId: 494, endId: 649, displayName: 'Unova (Gen 5)' },
  { name: 'Kalos', startId: 650, endId: 721, displayName: 'Kalos (Gen 6)' },
  { name: 'Alola', startId: 722, endId: 807, displayName: 'Alola (Gen 7)' },
  { name: 'Galar', startId: 810, endId: 898, displayName: 'Galar (Gen 8)' },
  { name: 'Hisui', startId: 899, endId: 905, displayName: 'Hisui (Gen 8)' },
  { name: 'Paldea', startId: 906, endId: 1025, displayName: 'Paldea (Gen 9)' },
  { name: 'Unidentified', startId: 808, endId: 809, displayName: 'Unidentified (Meltan/Melmetal)' },
];

export const RegionHelper = {
  regions: REGIONS,
  getRegionDisplayNameByName: (name: string): string => {
    const region = REGIONS.find((r) => r.name === name);
    return region ? region.displayName : name;
  },
};