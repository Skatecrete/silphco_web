const EVENTS_URL = 'https://leekduck.com/feeds/events.json';
const DEBUTS_URL = 'https://raw.githubusercontent.com/Skatecrete/pogo-raid-data/main/debuts.json';

export interface LeekDuckEvent {
  name: string;
  eventType: string;
  heading: string;
  link: string;
  image: string;
  start: string;
  end: string;
}

export interface DebutData {
  event_name: string;
  event_date: string;
  new_pokemon: string[];
  new_shiny: string[];
  pokemon_images: Record<string, string>;
  event_type: string;
}

export interface DebutsResponse {
  last_updated: string;
  debuts: DebutData[];
}

export interface PromoCode {
  code: string;
  title: string;
  rewards: string[];
  imageUrl: string | null;
  expiry: string;
}

export async function fetchEvents(): Promise<LeekDuckEvent[]> {
  try {
    const response = await fetch('https://corsproxy.io/?' + encodeURIComponent(EVENTS_URL));
    if (!response.ok) throw new Error('Failed to fetch events');
    return await response.json();
  } catch (e) {
    console.error('Error fetching events:', e);
    return [];
  }
}

export async function fetchDebuts(): Promise<DebutsResponse | null> {
  try {
    const response = await fetch(DEBUTS_URL);
    if (!response.ok) throw new Error('Failed to fetch debuts');
    return await response.json();
  } catch (e) {
    console.error('Error fetching debuts:', e);
    return null;
  }
}

export async function fetchPromoCodes(): Promise<PromoCode[]> {
  try {
    const response = await fetch('https://corsproxy.io/?' + encodeURIComponent('https://leekduck.com/promo-codes/'));
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const promoCodes: PromoCode[] = [];

    const cards = doc.querySelectorAll('.promo-card:not(.expired)');

    cards.forEach((card) => {
      try {
        const titleEl = card.querySelector('.title');
        const codeEl = card.querySelector('.text');
        const rewardLabels = card.querySelectorAll('.reward-label');
        const imgEl = card.querySelector('.reward-image');
        const expiryEl = card.querySelector('.expiry');

        const title = titleEl?.textContent?.trim() || 'Unknown';
        const code = codeEl?.textContent?.trim() || '';
        const rewards = Array.from(rewardLabels).map((el) => el.textContent?.trim() || '');
        const expiry = expiryEl?.textContent?.trim() || '';

        let imageUrl: string | null = null;
        if (imgEl) {
          const src = imgEl.getAttribute('src');
          if (src) {
            imageUrl = src.startsWith('//') ? `https:${src}` :
                       src.startsWith('/') ? `https://leekduck.com${src}` :
                       src;
          }
        }

        if (code) {
          promoCodes.push({ code, title, rewards, imageUrl, expiry });
        }
      } catch (e) {
        // Skip invalid cards
      }
    });

    if (promoCodes.length === 0) {
      return [{
        code: 'FENDIxFRGMTxPOKEMON',
        title: 'FENDI x FRGMT x POKEMON Hoodie',
        rewards: ['FENDI x FRGMT x POKEMON hoodie'],
        imageUrl: 'https://cdn.leekduck.com/assets/img/avatar_items/n_shirt_partneritemsjan2024hoodie_0_icon.png',
        expiry: '???',
      }];
    }

    return promoCodes;
  } catch (e) {
    console.error('Error fetching promo codes:', e);
    return [{
      code: 'FENDIxFRGMTxPOKEMON',
      title: 'FENDI x FRGMT x POKEMON Hoodie',
      rewards: ['FENDI x FRGMT x POKEMON hoodie'],
      imageUrl: 'https://cdn.leekduck.com/assets/img/avatar_items/n_shirt_partneritemsjan2024hoodie_0_icon.png',
      expiry: '???',
    }];
  }
}