import { motion } from 'framer-motion';
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

  // Determine badge
  let badgeText = '';
  let badgeColor = '';
  if (!isNope) {
    if (pokemon.spawnRate >= 2.0) { badgeText = 'INSANE'; badgeColor = 'bg-purple-600'; }
    else if (pokemon.spawnRate >= 0.85) { badgeText = 'HEAVY'; badgeColor = 'bg-red-500'; }
    else if (pokemon.spawnRate >= 0.65) { badgeText = 'MEDIUM'; badgeColor = 'bg-orange-500'; }
    else if (pokemon.spawnRate >= 0.30) { badgeText = 'LOW'; badgeColor = 'bg-green-500'; }
    else if (pokemon.spawnRate > 0.0) { badgeText = 'MINIMAL'; badgeColor = 'bg-blue-500'; }
  }

  // Image URL
  const ultimateUrl = getUltimateGalleryUrl(pokemon.name);
  const fallbackUrl = pokemon.imageUrl || getPokeApiUrl(pokemon.id);
  const imageUrl = ultimateUrl || fallbackUrl;

  // Tags
  const tags: string[] = [];
  if (pokemon.isRegional) tags.push('🌍 Regional');
  if (pokemon.isTopGreatLeague) tags.push('🏆 Great');
  if (pokemon.isTopUltraLeague) tags.push('🏆 Ultra');
  if (pokemon.isTopMasterLeague) tags.push('🏆 Master');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`
        bg-dark-card rounded-xl p-3 flex items-center gap-3
        ${isNope ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-[#33334a] transition-colors'}
      `}
      onClick={isNope ? undefined : onClick}
    >
      {/* Image */}
      <div className="w-12 h-12 flex-shrink-0">
        <img
          src={imageUrl}
          alt={pokemon.name}
          className="w-full h-full object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getPokeApiUrl(pokemon.id);
          }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-sm truncate">
            {pokemon.name}
          </span>
          {badgeText && (
            <span className={`${badgeColor} text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0`}>
              {badgeText}
            </span>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex gap-1 flex-wrap mt-0.5">
            {tags.map((tag) => (
              <span key={tag} className="text-[9px] text-white bg-purple-500/30 px-1.5 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Rates */}
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-xs text-gray-400">
            {isNope ? '0.00%' : `${pokemon.spawnRate.toFixed(2)}%`}
          </span>
          <span className="text-xs text-yellow-400">
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
          className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full hover:bg-green-600 transition-colors flex-shrink-0"
        >
          ➕ Order
        </button>
      )}
    </motion.div>
  );
}