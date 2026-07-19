interface RaidCardProps {
  raid: {
    id: number;
    name: string;
    tier: string;
    isShiny: boolean;
    image: string;
  };
  isUltraBeast?: boolean;
  isDynamax?: boolean;
  isGigantamax?: boolean;
  onClick: () => void;
}

export function RaidCard({
  raid,
  isUltraBeast = false,
  isDynamax = false,
  isGigantamax = false,
  onClick,
}: RaidCardProps) {
  const isShadow = raid.name.toLowerCase().includes('shadow');

  return (
    <div
      style={{
        backgroundColor: '#2a2a3e',
        borderRadius: '12px',
        padding: '8px',
        cursor: 'pointer',
        width: '100%',
        transition: 'transform 0.2s, background-color 0.2s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.backgroundColor = '#33334a';
        (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.02)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.backgroundColor = '#2a2a3e';
        (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
      }}
      onClick={onClick}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1/1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isShadow && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom right, rgba(118,39,197,0.4), transparent)',
              borderRadius: '8px',
            }}
          />
        )}
        {isDynamax && !isGigantamax && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom right, rgba(255,0,0,0.2), transparent)',
              borderRadius: '8px',
            }}
          />
        )}
        {isUltraBeast && (
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '24px',
              height: '24px',
              background: 'rgba(0,188,212,0.3)',
              borderRadius: '50%',
              filter: 'blur(4px)',
            }}
          />
        )}
        <img
          src={raid.image}
          alt={raid.name}
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${raid.id}.png`;
          }}
        />
      </div>
      <p
        style={{
          color: '#ffffff',
          fontSize: '12px',
          fontWeight: 700,
          textAlign: 'center',
          marginTop: '4px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {raid.name}
      </p>
      <p
        style={{
          color: '#888888',
          fontSize: '10px',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {raid.tier}
      </p>
      {raid.isShiny && (
        <span
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            fontSize: '14px',
          }}
        >
          ✨
        </span>
      )}
    </div>
  );
}