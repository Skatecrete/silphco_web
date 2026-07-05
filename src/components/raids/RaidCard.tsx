import { motion } from 'framer-motion';

interface RaidCardProps {
  raid: {
    id: number;
    name: string;
    tier: string;
    isShiny: boolean;
    image: string;
  };
  isUltraBeast: boolean;
  isDynamax?: boolean;
  isGigantamax?: boolean;
  onClick: () => void;
}

export function RaidCard({
  raid,
  isUltraBeast,
  isDynamax = false,
  isGigantamax = false,
  onClick,
}: RaidCardProps) {
  const isShadow = raid.name.toLowerCase().includes('shadow');

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-dark-card rounded-xl p-3 w-[110px] cursor-pointer hover:bg-[#33334a] transition-colors relative"
      onClick={onClick}
    >
      <div className="relative w-full aspect-square flex items-center justify-center">
        {isShadow && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-transparent rounded-lg" />
        )}

        {isDynamax && !isGigantamax && (
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent rounded-lg" />
        )}

        {isUltraBeast && (
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-cyan-400/30 rounded-full blur-sm" />
        )}

        <img
          src={raid.image}
          alt={raid.name}
          className="w-16 h-16 object-contain relative z-10"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${raid.id}.png`;
          }}
        />

        {isDynamax && !isGigantamax && (
          <div className="absolute inset-0 bg-red-500/20 rounded-lg z-5" />
        )}
      </div>

      <p className="text-white text-xs font-bold text-center mt-1 truncate">
        {raid.name}
      </p>

      <p className="text-gray-400 text-[10px] text-center truncate">
        {raid.tier}
      </p>

      {raid.isShiny && (
        <span className="absolute top-1 right-1 text-sm">✨</span>
      )}
    </motion.div>
  );
}