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
  { id: 'chat', label: 'CHAT', image: DIAL_TILES.chat, route: '/app/chat' },
  { id: 'admin', label: 'ADMIN', image: DIAL_TILES.admin, route: '/app/admin' },
  { id: 'logout', label: 'LOGOUT', image: DIAL_TILES.logout, route: '/app/logout' },
];

const GUEST_LOCKED_TILES = new Set(['dex', 'chat', 'cart']);

const VIEW_MODE_KEY = 'silphco_home_view_mode';

interface HomeProps {
  onPromoClick: () => void;
}

export function Home({ onPromoClick }: HomeProps) {
  const navigate = useNavigate();
  const { isLoggedIn, isGuest } = useUser();

  // Initialize from localStorage so the choice survives navigation and reloads
  const [viewMode, setViewMode] = useState<'dial' | 'grid'>(() => {
    const saved = localStorage.getItem(VIEW_MODE_KEY);
    return saved === 'grid' || saved === 'dial' ? saved : 'dial';
  });

  const [clickedId, setClickedId] = useState<string | null>(null);
  const [guestNotice, setGuestNotice] = useState(false);

  if (!isLoggedIn) {
    return null;
  }

  const handleTileClick = (tile: DialTileData) => {
    if (tile.id === 'logout') {
      navigate('/app/logout');
      return;
    }

    if (isGuest && GUEST_LOCKED_TILES.has(tile.id)) {
      setGuestNotice(true);
      return;
    }

    setClickedId(tile.id);
    setTimeout(() => {
      navigate(tile.route);
    }, 400);
  };

  const toggleView = () => {
    setViewMode((prev) => {
      const next = prev === 'dial' ? 'grid' : 'dial';
      localStorage.setItem(VIEW_MODE_KEY, next);
      return next;
    });
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
      <HomeHeader viewMode={viewMode} onToggleView={toggleView} onPromoClick={onPromoClick} />

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
          {DIAL_TILES_DATA.map((tile) => {
            const locked = isGuest && GUEST_LOCKED_TILES.has(tile.id);
            return (
              <motion.div
                key={tile.id}
                style={{
                  aspectRatio: '4/3',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  backgroundColor: '#2a2a3e',
                  width: '100%',
                  position: 'relative',
                  opacity: locked ? 0.55 : 1,
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
                {locked && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: 'rgba(0, 0, 0, 0.75)',
                      color: '#FFA500',
                      fontSize: '16px',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #FFA500',
                    }}
                  >
                    🔒
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {guestNotice && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 16px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          }}
          onClick={() => setGuestNotice(false)}
        >
          <div
            style={{
              backgroundColor: '#2a2a3e',
              borderRadius: '16px',
              padding: '24px',
              width: '100%',
              maxWidth: '360px',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔒</div>
            <h2 style={{ color: '#ffffff', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
              Login Required
            </h2>
            <p style={{ color: '#cccccc', fontSize: '14px', lineHeight: 1.5, margin: 0 }}>
              Please log in as a user to use <strong>Dex</strong>, <strong>Chat</strong>, and to <strong>place orders</strong>.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button
                onClick={() => setGuestNotice(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#444444',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setGuestNotice(false);
                  navigate('/app/logout');
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#7627C5',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}