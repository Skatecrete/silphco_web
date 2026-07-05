// Add this function to the existing file

export interface PromoCode {
  code: string;
  title: string;
  rewards: string[];
  imageUrl: string | null;
  expiry: string;
}

export async function fetchPromoCodes(): Promise<PromoCode[]> {
  try {
    // Use a CORS proxy to fetch the page
    const response = await fetch('https://corsproxy.io/?' + encodeURIComponent('https://leekduck.com/promo-codes/'));
    const html = await response.text();

    // Parse HTML using DOMParser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const promoCodes: PromoCode[] = [];

    // Select promo cards that are NOT expired
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
    // Return fallback promo code
    return [{
      code: 'FENDIxFRGMTxPOKEMON',
      title: 'FENDI x FRGMT x POKEMON Hoodie',
      rewards: ['FENDI x FRGMT x POKEMON hoodie'],
      imageUrl: 'https://cdn.leekduck.com/assets/img/avatar_items/n_shirt_partneritemsjan2024hoodie_0_icon.png',
      expiry: '???',
    }];
  }
}