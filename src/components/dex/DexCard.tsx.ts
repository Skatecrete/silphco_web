import { motion } from 'framer-motion';
import { getUltimateGalleryUrl, getPokeApiUrl } from '@/services/imageUrlBuilder';

interface DexCardProps {
  pokemon: {
    id: number;
    name: string;
    onList: boolean;
    isPendingRemoval: boolean;
    isShinyAvailable: boolean;
  };
  onToggle: (checked: boolean) => void;
}

export function DexCard({ pokemon, onToggle }: DexCardProps) {
  const imageUrl = getUltimateGalleryUrl(pokemon.name) || getPokeApiUrl(pokemon.id);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="bg-dark-card rounded-xl p-3 flex items-center gap-3"
    >
      {/* Number */}
      <span className="text-gray-500 text-xs font-mono w-12">
        #{String(pokemon.id).padStart(3, '0')}
      </span>

      {/* Image */}
      <div className="w-10 h-10 flex-shrink-0">
        <img
          src={imageUrl}
          alt={pokemon.name}
          className="w-full h-full object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getPokeApiUrl(pokemon.id);
          }}
        />
      </div>

      {/* Name */}
      <span className="text-white font-bold text-sm flex-1 truncate">
        {pokemon.name}
      </span>

      {/* Pending Removal Badge */}
      {pokemon.isPendingRemoval && (
        <span className="text-orange-500 text-[10px] font-bold text-center leading-tight">
          Pending
          <br />
          Removal
        </span>
      )}

      {/* Checkbox */}
      <input
        type="checkbox"
        checked={pokemon.onList}
        onChange={(e) => onToggle(e.target.checked)}
        className="w-5 h-5 accent-green-500 cursor-pointer"
      />
    </motion.div>
  );
}