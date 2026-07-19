const RAIDS_URL = 'https://raw.githubusercontent.com/Skatecrete/pogo-raid-data/main/current_raids.json';
const SCRAPEDDUCK_URL = 'https://raw.githubusercontent.com/bigfoott/ScrapedDuck/data/raids.min.json';

export interface CurrentRaidsResponse {
  last_updated: string;
  tier1: string[];
  tier3: string[];
  tier5: string[];
  mega: string[];
  primal: string[];
  ultra_beasts: string[];
  super_mega: string[];
  dynamax_tier1: string[];
  dynamax_tier2: string[];
  dynamax_tier3: string[];
  dynamax_tier5: string[];
  gigantamax: string[];
  gigantamax_last_updated?: string;
}

export async function fetchCurrentRaids(): Promise<CurrentRaidsResponse | null> {
  try {
    const response = await fetch(RAIDS_URL);
    if (!response.ok) throw new Error('Failed to fetch raids');
    const data = await response.json();
    return data;
  } catch (e) {
    console.error('Error fetching raids:', e);
    return null;
  }
}

export async function fetchScrapedDuckRaids(): Promise<any[]> {
  try {
    const response = await fetch(SCRAPEDDUCK_URL);
    if (!response.ok) throw new Error('Failed to fetch ScrapedDuck raids');
    const data = await response.json();
    return data;
  } catch (e) {
    console.error('Error fetching ScrapedDuck raids:', e);
    return [];
  }
}

const MANUAL_RAIDS_URL = 'https://corsproxy.io/?' + encodeURIComponent('https://script.google.com/macros/s/AKfycbx6i6Yn7ezXqwJKgZF3Mbq_MbgNeb4mQ8weT0Qipu0c9ASFRVK6l-HIdH83xFbJOeI4/exec');

export async function fetchManualRaids(): Promise<ManualRaid[]> {
  try {
    const response = await fetch(MANUAL_RAIDS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'getManualRaids' }),
    });
    const data = await response.json();
    if (data.status === 'success' && data.raids) {
      return data.raids;
    }
    return [];
  } catch (e) {
    console.error('Error fetching manual raids:', e);
    return [];
  }
}