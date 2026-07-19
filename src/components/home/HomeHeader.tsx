import { PromoButton } from '@/components/common/PromoButton';
import { WelcomeText } from './WelcomeText';

interface HomeHeaderProps {
  viewMode: 'dial' | 'grid';
  onToggleView: () => void;
  onPromoClick: () => void;
}

export function HomeHeader({ viewMode, onToggleView, onPromoClick }: HomeHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        flexShrink: 0,
        padding: '12px 16px',
        backgroundColor: 'rgba(26, 26, 46, 0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(128, 128, 128, 0.2)',
        zIndex: 10,
        minHeight: '56px',
      }}
    >
      {/* Left: Promo Button */}
      <div
        style={{
          minWidth: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <PromoButton onClick={onPromoClick} />
      </div>

      {/* Center: Welcome Text */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <WelcomeText />
      </div>

      {/* Right: View Toggle Button */}
      <div
        style={{
          minWidth: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <button
          onClick={onToggleView}
          style={{
            padding: '4px 10px',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            border: '2px solid #FFA500',
            borderRadius: '12px',
            color: 'white',
            fontSize: '10px',
            fontWeight: 'bold',
            lineHeight: 1.3,
            textAlign: 'center',
            minWidth: '52px',
            cursor: 'pointer',
            whiteSpace: 'pre-line',
          }}
        >
          {viewMode === 'dial' ? 'Grid\nView' : 'Tile\nView'}
        </button>
      </div>
    </div>
  );
}