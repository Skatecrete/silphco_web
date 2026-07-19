import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { HomeHeader } from './HomeHeader';
import { DIAL_TILES } from '@/utils/imageUrls';
import { DialTileData } from '@/types';
import { motion } from 'framer-motion';

const DIAL_TILES_DATA: DialTileData[] = [
  { id: 'spawns', label: 'SPAWNS', image: DIAL_TILES.spawns, route: '/app/spawns' },
  { id: 'raids', label: 'RAIDS', image: DIAL_TILES.raids, route: '/app/raids' },
  { id: 'dex', label: 'DEX', image: DIAL_TILES.dex, route: '/app/dex' },
  { id: 'viewall', label: 'VIEW ALL\nPOKEMON', image: DIAL_TILES.viewAllPokemon, route: '/app/viewall' },
  { id: 'infographics', label: 'INFOGRAPHICS', image: DIAL_TILES.infographics, route: '/app/infographics' },
  { id: 'events', label: 'EVENTS', image: DIAL_TILES.events, route: '/app/events' },
  { id: 'services', label: 'SERVICES', image: DIAL_TILES.services, route: '/app/services' },
  { id: 'cart', label: 'CART', image: DIAL_TILES.orderCart, route: '/app/orders' },
  { id: 'history', label: 'HISTORY', image: DIAL_TILES.history, route: '/app/history' },
  { id: 'admin', label: 'ADMIN', image: DIAL_TILES.admin, route: '/app/admin' },
  { id: 'logout', label: 'LOGOUT', image: DIAL_TILES.logout, route: '/app/logout' },
];

interface HomeProps {
  onPromoClick: () => void;
}

export function Home({ onPromoClick }: HomeProps) {
  const navigate = useNavigate();
  const { isLoggedIn } = useUser();
  const [viewMode, setViewMode] = useState<'dial' | 'grid'>('dial');
  const [clickedId, setClickedId] = useState<string | null>(null);

  if (!isLoggedIn) {
    return null;
  }

  const handleTileClick = (tile: DialTileData) => {
    if (tile.id === 'logout') {
      navigate('/app/logout');
      return;
    }

    setClickedId(tile.id);
    setTimeout(() => {
      navigate(tile.route);
    }, 400);
  };

  const toggleView = () => {
    setViewMode(viewMode === 'dial' ? 'grid' : 'dial');
  };

  const isDial = viewMode === 'dial';

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#1a1a2e',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <HomeHeader viewMode={viewMode} onToggleView={toggleView} onPromoClick={onPromoClick} />

      {/* Tiles Grid */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: isDial ? '16px' : '8px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isDial ? '1fr' : '1fr 1fr',
            gap: isDial ? '16px' : '6px',
            maxWidth: isDial ? '400px' : '100%',
            margin: '0 auto',
            width: '100%',
          }}
        >
          {DIAL_TILES_DATA.map((tile) => (
            <motion.div
              key={tile.id}
              style={{
                aspectRatio: '4/3',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                backgroundColor: '#2a2a3e',
                width: '100%',
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.92 }}
              animate={{
                scale: clickedId === tile.id ? 0.8 : 1,
                opacity: clickedId === tile.id ? 0 : 1,
              }}
              transition={{ duration: 0.3 }}
              onClick={() => handleTileClick(tile)}
            >
              <img
                src={tile.image}
                alt={tile.label}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = document.createElement('div');
                    fallback.style.cssText = `
                      width: 100%;
                      height: 100%;
                      background: rgba(118, 39, 197, 0.3);
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      justify-content: center;
                      color: white;
                      font-weight: bold;
                      font-size: 14px;
                      text-align: center;
                      padding: 8px;
                    `;
                    fallback.innerHTML = tile.label.split('\n').join('<br />');
                    parent.appendChild(fallback);
                  }
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}