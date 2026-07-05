const SPAWNS_URL = 'https://raw.githubusercontent.com/Skatecrete/pogo-raid-data/main/spawns.json';

export interface SpawnData {
  id: number;
  name: string;
  rate: number;
  shiny: boolean;
  image_url: string;
}

export interface SpawnsResponse {
  last_updated: string;
  total: number;
  spawns: SpawnData[];
}

export async function fetchSpawns(): Promise<SpawnsResponse | null> {
  try {
    const response = await fetch(SPAWNS_URL);
    if (!response.ok) throw new Error('Failed to fetch spawns');
    const data = await response.json();
    return data;
  } catch (e) {
    console.error('Error fetching spawns:', e);
    return null;
  }
}