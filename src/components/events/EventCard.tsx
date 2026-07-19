import { LeekDuckEvent } from '@/services/leekDuckApi';
import { getUltimateGalleryUrl, getPokeApiUrl } from '@/services/imageUrlBuilder';
import { ALL_POKEMON_NAMES } from '@/utils/constants';

// Build the Pokemon name map from ALL_POKEMON_NAMES
const POKEMON_NAME_MAP: Record<string, number> = {};
for (const [id, name] of Object.entries(ALL_POKEMON_NAMES)) {
  POKEMON_NAME_MAP[name.toLowerCase()] = parseInt(id);
}

// Event name patterns to help with matching
const EVENT_NAME_PATTERNS: Record<string, string[]> = {
  'community day': ['community day', 'cd'],
  'go fest': ['go fest', 'fest'],
  'spotlight hour': ['spotlight hour'],
  'raid day': ['raid day'],
  'research day': ['research day'],
  'egg hatch': ['hatch', 'egg'],
  'incense day': ['incense'],
  'shadow': ['shadow'],
  'mega': ['mega'],
  'legendary': ['legendary'],
};

interface EventCardProps {
  event: LeekDuckEvent;
  showRSVP?: boolean;
  onRSVP?: () => void;
}

export function EventCard({ event, showRSVP = false, onRSVP }: EventCardProps) {
  const getEventImage = (): string => {
    const eventLower = event.name.toLowerCase();
    
    // First, try direct Pokemon name match
    for (const [name, id] of Object.entries(POKEMON_NAME_MAP)) {
      if (eventLower.includes(name)) {
        const url = getUltimateGalleryUrl(name);
        if (url) return url;
        return getPokeApiUrl(id);
      }
    }
    
    // Try partial matches for event-specific patterns
    for (const [pattern, variations] of Object.entries(EVENT_NAME_PATTERNS)) {
      for (const variation of variations) {
        if (eventLower.includes(variation)) {
          // Try to find a Pokemon name near the pattern
          for (const [name, id] of Object.entries(POKEMON_NAME_MAP)) {
            if (eventLower.includes(name) && name.length > 3) {
              const url = getUltimateGalleryUrl(name);
              if (url) return url;
              return getPokeApiUrl(id);
            }
          }
        }
      }
    }
    
    // Fallback emoji
    return '😎';
  };

  const imageSrc = getEventImage();
  const isEmoji = imageSrc.length <= 2;

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString();
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#2a2a3e',
        borderRadius: '12px',
        padding: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '8px',
      }}
    >
      {isEmoji ? (
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '8px',
            backgroundColor: 'rgba(118,39,197,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            flexShrink: 0,
          }}
        >
          {imageSrc}
        </div>
      ) : (
        <img
          src={imageSrc}
          alt={event.name}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '8px',
            objectFit: 'contain',
            backgroundColor: '#1a1a2e',
            flexShrink: 0,
          }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              const emoji = document.createElement('div');
              emoji.style.cssText = 'width:56px;height:56px;border-radius:8px;background:rgba(118,39,197,0.2);display:flex;align-items:center;justify-content:center;font-size:32px;flex-shrink:0;';
              emoji.textContent = '😎';
              parent.prepend(emoji);
            }
          }}
        />
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: '#ffffff', fontWeight: 700, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {event.name}
        </p>
        <p style={{ color: '#FFA500', fontSize: '12px' }}>{event.heading || 'Event'}</p>
        <p style={{ color: '#4CAF50', fontSize: '10px' }}>🟢 Starts: {formatDate(event.start)}</p>
        <p style={{ color: '#F44336', fontSize: '10px' }}>🔴 Ends: {formatDate(event.end)}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
        <button
          onClick={() => window.open(event.link, '_blank')}
          style={{
            padding: '4px 12px',
            backgroundColor: '#2196F3',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          View
        </button>
        {showRSVP && onRSVP && (
          <button
            onClick={onRSVP}
            style={{
              padding: '4px 12px',
              backgroundColor: '#4CAF50',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            RSVP
          </button>
        )}
      </div>
    </div>
  );
}