import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DialTile } from './DialTile';
import { WelcomeText } from './WelcomeText';
import { LogoutButton } from '@/components/common/LogoutButton';
import { DialTileData } from '@/types';

const DIAL_TILES: DialTileData[] = [
  { id: 'spawns', label: 'SPAWNS', icon: '🐾', route: '/app/spawns' },
  { id: 'raids', label: 'RAIDS', icon: '⚔️', route: '/app/raids' },
  { id: 'dex', label: 'DEX', icon: '📖', route: '/app/dex' },
  { id: 'events', label: 'EVENTS', icon: '📅', route: '/app/events' },
  { id: 'cart', label: 'CART', icon: '🛒', route: '/app/orders' },
  { id: 'history', label: 'HISTORY', icon: '📜', route: '/app/history' },
  { id: 'logout', label: 'LOGOUT', icon: '🚪', route: '/app/logout' },
];

export function DialRotator() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const tiles = [...DIAL_TILES, ...DIAL_TILES, ...DIAL_TILES];
  const startIndex = DIAL_TILES.length;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const tileHeight = container.clientHeight;
      const centerIndex = Math.round(scrollTop / tileHeight);

      if (centerIndex >= tiles.length - DIAL_TILES.length) {
        container.scrollTop = startIndex * tileHeight;
      } else if (centerIndex < DIAL_TILES.length) {
        container.scrollTop = (startIndex + DIAL_TILES.length - 1) * tileHeight;
      }

      const normalizedIndex = ((centerIndex % DIAL_TILES.length) + DIAL_TILES.length) % DIAL_TILES.length;
      setActiveIndex(normalizedIndex);
    };

    container.addEventListener('scroll', handleScroll);
    container.scrollTop = startIndex * container.clientHeight;

    return () => container.removeEventListener('scroll', handleScroll);
  }, [tiles.length, startIndex]);

  const handleTileClick = (tile: DialTileData) => {
    if (tile.id === 'logout') {
      navigate('/app/logout');
      return;
    }
    navigate(tile.route);
  };

  return (
    <div className="h-screen flex flex-col bg-dark-bg">
      <div className="flex items-center justify-between px-4 py-3 bg-dark-bg/95 backdrop-blur-sm border-b border-gray-800/50 z-10">
        <div className="w-20" />
        <WelcomeText />
        <LogoutButton variant="icon" />
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-scroll snap-y snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {tiles.map((tile, index) => {
          const normalizedIndex = index % DIAL_TILES.length;
          const isActive = normalizedIndex === activeIndex && index >= DIAL_TILES.length && index < tiles.length - DIAL_TILES.length;

          return (
            <div
              key={`${tile.id}-${index}`}
              className="h-full snap-center snap-always flex items-center justify-center px-6"
            >
              <DialTile
                tile={tile}
                isActive={isActive}
                onClick={() => handleTileClick(tile)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}