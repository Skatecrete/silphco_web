import { LeekDuckEvent } from '@/services/leekDuckApi';
import { getComingSoonUrl, getUltimateGalleryUrl } from '@/services/imageUrlBuilder';
import { ALL_POKEMON_NAMES } from '@/utils/constants';

const POKEMON_NAME_MAP: Record<string, number> = {};
for (const [id, name] of Object.entries(ALL_POKEMON_NAMES)) {
  POKEMON_NAME_MAP[name.toLowerCase()] = parseInt(id);
}

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
  const getEventImage = (): string | null => {
    const eventLower = event.name.toLowerCase();

    for (const [name] of Object.entries(POKEMON_NAME_MAP)) {
      if (eventLower.includes(name) && name.length > 3) {
        const url = getUltimateGalleryUrl(name);
        if (url) return url;
      }
    }

    for (const [, variations] of Object.entries(EVENT_NAME_PATTERNS)) {
      for (const variation of variations) {
        if (eventLower.includes(variation)) {
          for (const [name] of Object.entries(POKEMON_NAME_MAP)) {
            if (eventLower.includes(name) && name.length > 3) {
              const url = getUltimateGalleryUrl(name);
              if (url) return url;
            }
          }
        }
      }
    }

    return null;
  };

  const imageSrc = getEventImage();

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
      <img
        src={imageSrc || getComingSoonUrl()}
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
          target.onerror = null;
          target.src = getComingSoonUrl();
        }}
      />

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
