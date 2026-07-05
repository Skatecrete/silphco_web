import { LeekDuckEvent } from '@/services/leekDuckApi';
import { getUltimateGalleryUrl, getPokeApiUrl } from '@/services/imageUrlBuilder';

// Simple Pokemon name mapping for event images
const POKEMON_NAME_MAP: Record<string, number> = {
  'pikachu': 25,
  'eevee': 133,
  'charmander': 4,
  'squirtle': 7,
  'bulbasaur': 1,
  'mewtwo': 150,
  'mew': 151,
  // ... would be expanded
};

interface EventCardProps {
  event: LeekDuckEvent;
  showRSVP?: boolean;
  onRSVP?: () => void;
}

export function EventCard({ event, showRSVP = false, onRSVP }: EventCardProps) {
  // Try to find a matching Pokemon for the event image
  const getEventImage = (): string => {
    const eventLower = event.name.toLowerCase();
    for (const [name, id] of Object.entries(POKEMON_NAME_MAP)) {
      if (eventLower.includes(name)) {
        const url = getUltimateGalleryUrl(name);
        if (url) return url;
        return getPokeApiUrl(id);
      }
    }
    return '😎'; // Fallback emoji
  };

  const imageSrc = getEventImage();
  const isEmoji = imageSrc.length <= 2; // Simple check for emoji

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString();
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-dark-card rounded-xl p-3 flex items-center gap-3 mb-2">
      {/* Image/Emoji */}
      {isEmoji ? (
        <div className="w-14 h-14 rounded-lg bg-purple-500/20 flex items-center justify-center text-3xl flex-shrink-0">
          {imageSrc}
        </div>
      ) : (
        <img
          src={imageSrc}
          alt={event.name}
          className="w-14 h-14 rounded-lg object-contain bg-dark-bg flex-shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            const parent = e.target.parentElement;
            if (parent) {
              const emoji = document.createElement('div');
              emoji.className = 'w-14 h-14 rounded-lg bg-purple-500/20 flex items-center justify-center text-3xl flex-shrink-0';
              emoji.textContent = '😎';
              parent.prepend(emoji);
            }
          }}
        />
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-bold text-sm truncate">{event.name}</p>
        <p className="text-orange-500 text-xs">{event.heading || 'Event'}</p>
        <p className="text-green-400 text-[10px]">🟢 Starts: {formatDate(event.start)}</p>
        <p className="text-red-400 text-[10px]">🔴 Ends: {formatDate(event.end)}</p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-1 flex-shrink-0">
        <button
          onClick={() => window.open(event.link, '_blank')}
          className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
        >
          View
        </button>
        {showRSVP && onRSVP && (
          <button
            onClick={onRSVP}
            className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-colors"
          >
            RSVP
          </button>
        )}
      </div>
    </div>
  );
}