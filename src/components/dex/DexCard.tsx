import { getUltimateGalleryUrl, getPokeApiUrl, getComingSoonUrl } from '@/services/imageUrlBuilder';

interface DexCardProps {
  pokemon: {
    id: number;
    name: string;
    onList: boolean;
    wasOnServer: boolean;
    isPendingRemoval: boolean;
    isShinyAvailable: boolean;
  };
  onToggle: (checked: boolean) => void;
  isSearchMode: boolean;
}

export function DexCard({ pokemon, onToggle, isSearchMode }: DexCardProps) {
  const imageUrl = getUltimateGalleryUrl(pokemon.name) || getPokeApiUrl(pokemon.id);

  const showAddedLabel = isSearchMode && pokemon.wasOnServer;

  return (
    <div
      style={{
        backgroundColor: '#2a2a3e',
        borderRadius: '12px',
        padding: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <span style={{ color: '#888888', fontSize: '12px', fontFamily: 'monospace', width: '48px' }}>
        #{String(pokemon.id).padStart(3, '0')}
      </span>

      <div style={{ width: '40px', height: '40px', flexShrink: 0 }}>
        <img
          src={imageUrl}
          alt={pokemon.name}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = getComingSoonUrl();
          }}
        />
      </div>

      <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '14px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {pokemon.name}
      </span>

      {pokemon.isPendingRemoval && (
        <span style={{ color: '#FFA500', fontSize: '10px', fontWeight: 700, textAlign: 'center', lineHeight: 1.2 }}>
          Pending
          <br />
          Removal
        </span>
      )}

      {showAddedLabel ? (
        <span
          style={{
            color: '#4CAF50',
            fontWeight: 700,
            fontSize: '13px',
            padding: '4px 10px',
            backgroundColor: 'rgba(76, 175, 80, 0.15)',
            borderRadius: '8px',
          }}
        >
          Added
        </span>
      ) : (
        <input
          type="checkbox"
          checked={pokemon.onList}
          onChange={(e) => onToggle(e.target.checked)}
          style={{
            width: '20px',
            height: '20px',
            accentColor: '#4CAF50',
            cursor: 'pointer',
          }}
        />
      )}
    </div>
  );
}
