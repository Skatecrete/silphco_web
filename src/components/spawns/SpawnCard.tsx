import { getUltimateGalleryUrl, getPokeApiUrl } from '@/services/imageUrlBuilder';

interface SpawnCardProps {
  pokemon: {
    id: number;
    name: string;
    spawnRate: number;
    isShiny: boolean;
    shinyRate: string;
    isRegional: boolean;
    isTopGreatLeague: boolean;
    isTopUltraLeague: boolean;
    isTopMasterLeague: boolean;
    isTopPremierCup: boolean;
    isTopUltraPremier: boolean;
    imageUrl: string;
  };
  onClick: () => void;
}

export function SpawnCard({ pokemon, onClick }: SpawnCardProps) {
  const isNope = pokemon.spawnRate === 0.0;

  let badgeText = '';
  let badgeColor = '';
  if (!isNope) {
    if (pokemon.spawnRate >= 2.0) { badgeText = 'INSANE'; badgeColor = '#9C27B0'; }
    else if (pokemon.spawnRate >= 0.85) { badgeText = 'HEAVY'; badgeColor = '#F44336'; }
    else if (pokemon.spawnRate >= 0.65) { badgeText = 'MEDIUM'; badgeColor = '#FF9800'; }
    else if (pokemon.spawnRate >= 0.30) { badgeText = 'LOW'; badgeColor = '#4CAF50'; }
    else if (pokemon.spawnRate > 0.0) { badgeText = 'MINIMAL'; badgeColor = '#2196F3'; }
  }

  const ultimateUrl = getUltimateGalleryUrl(pokemon.name);
  const fallbackUrl = pokemon.imageUrl || getPokeApiUrl(pokemon.id);
  const imageUrl = ultimateUrl || fallbackUrl;

  const tags: string[] = [];
  if (pokemon.isRegional) tags.push('🌍 Regional');
  if (pokemon.isTopGreatLeague) tags.push('🏆 Great');
  if (pokemon.isTopUltraLeague) tags.push('🏆 Ultra');
  if (pokemon.isTopMasterLeague) tags.push('🏆 Master');

  return (
    <div
      style={{
        backgroundColor: '#2a2a3e',
        borderRadius: '12px',
        padding: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
        cursor: isNope ? 'not-allowed' : 'pointer',
        opacity: isNope ? 0.5 : 1,
        transition: 'background-color 0.2s',
      }}
      onMouseEnter={(e) => {
        if (!isNope) {
          (e.currentTarget as HTMLDivElement).style.backgroundColor = '#33334a';
        }
      }}
      onMouseLeave={(e) => {
        if (!isNope) {
          (e.currentTarget as HTMLDivElement).style.backgroundColor = '#2a2a3e';
        }
      }}
      onClick={isNope ? undefined : onClick}
    >
      {/* Image */}
      <div
        style={{
          width: '48px',
          height: '48px',
          flexShrink: 0,
        }}
      >
        <img
          src={imageUrl}
          alt={pokemon.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = getPokeApiUrl(pokemon.id);
          }}
        />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '14px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {pokemon.name}
          </span>
          {badgeText && (
            <span
              style={{
                backgroundColor: badgeColor,
                color: '#ffffff',
                fontSize: '9px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '12px',
                flexShrink: 0,
              }}
            >
              {badgeText}
            </span>
          )}
        </div>

        {tags.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '2px' }}>
            {tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: '9px',
                  color: '#ffffff',
                  backgroundColor: 'rgba(118, 39, 197, 0.3)',
                  padding: '1px 6px',
                  borderRadius: '4px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '2px' }}>
          <span style={{ fontSize: '12px', color: '#888888' }}>
            {isNope ? '0.00%' : `${pokemon.spawnRate.toFixed(2)}%`}
          </span>
          <span style={{ fontSize: '12px', color: '#FFD700' }}>
            {pokemon.shinyRate}
          </span>
        </div>
      </div>

      {/* Order Button */}
      {!isNope && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          style={{
            padding: '4px 12px',
            backgroundColor: '#4CAF50',
            color: '#ffffff',
            border: 'none',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = '#3d8b40';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = '#4CAF50';
          }}
        >
          ➕ Order
        </button>
      )}
    </div>
  );
}