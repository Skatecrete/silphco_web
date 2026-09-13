const EVENTS_URL = 'https://leekduck.com/feeds/events.json';
const DEBUTS_URL = 'https://raw.githubusercontent.com/Skatecrete/pogo-raid-data/main/debuts.json';
const PROMO_URL = 'https://leekduck.com/promo-codes/';

// Your own Apps Script proxy — no rate limits, no CORS
const PROXY_BASE = 'https://script.google.com/macros/s/AKfycbzG1Q22LCOzqyXUwrTzxkqi5csH_yhQdQCAgZqsky0LB2YTiVHD7NttkGkDS6ilcyp7eg/exec';

async function proxyFetch(targetUrl: string): Promise<string> {
  const url = PROXY_BASE + '?type=proxyFetch&url=' + encodeURIComponent(targetUrl);
  const response = await fetch(url);
  return await response.text();
}

export async function fetchEvents(): Promise<LeekDuckEvent[]> {
  try {
    const text = await proxyFetch(EVENTS_URL);
    return JSON.parse(text);
  } catch (e) {
    console.error('Error fetching events:', e);
    return [];
  }
}

export async function fetchPromoCodes(): Promise<PromoCode[]> {
  try {
    const html = await proxyFetch(PROMO_URL);

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

    return promoCodes;
  } catch (e) {
    console.error('Error fetching promo codes:', e);
    return [];
  }
}
