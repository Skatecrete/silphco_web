import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { useRaids } from '@/hooks/useRaids';
import { fetchManualRaids, ManualRaid } from '@/services/rotationApi';
import { getUltimateGalleryUrl, getPokeApiUrl } from '@/services/imageUrlBuilder';
import { RaidOrderDialog } from './RaidOrderDialog';
import { DynamaxOrderDialog } from './DynamaxOrderDialog';
import { Header } from '@/components/common/Header';

export function RaidsPage() {
  const { totalItems } = useCart();
  const { regularRaids, dynamaxRaids, loading, error } = useRaids();
  const [manualRaids, setManualRaids] = useState<ManualRaid[]>([]);
  const [manualLoading, setManualLoading] = useState(true);
  const [selectedRaid, setSelectedRaid] = useState<any>(null);
  const [showRaidDialog, setShowRaidDialog] = useState(false);
  const [showDynamaxDialog, setShowDynamaxDialog] = useState(false);

  useEffect(() => {
    async function loadManualRaids() {
      setManualLoading(true);
      try {
        const data = await fetchManualRaids();
        setManualRaids(data);
      } catch (e) {
        console.error('Error loading manual raids:', e);
      } finally {
        setManualLoading(false);
      }
    }
    loadManualRaids();
  }, []);

  const categoryOrder = [
    { key: 'ultraBeasts', title: '🌀 ULTRA BEASTS' },
    { key: 'tier5', title: '⭐⭐⭐⭐⭐ 5-STAR RAIDS' },
    { key: 'tier4', title: '⭐⭐⭐⭐ 4-STAR RAIDS' },
    { key: 'tier3', title: '⭐⭐⭐ 3-STAR RAIDS' },
    { key: 'tier2', title: '⭐⭐ 2-STAR RAIDS' },
    { key: 'tier1', title: '⭐ 1-STAR RAIDS' },
    { key: 'mega', title: '🔴 MEGA RAIDS' },
    { key: 'primal', title: '🌊 PRIMAL RAIDS' },
    { key: 'shadow5', title: '🌑 SHADOW LEGENDARY (5-STAR)' },
    { key: 'shadow3', title: '🌑 SHADOW 3-STAR RAIDS' },
    { key: 'shadow1', title: '🌑 SHADOW 1-STAR RAIDS' },
  ];

  const visibleCategories = categoryOrder.filter(
    (cat) => regularRaids[cat.key] && regularRaids[cat.key].length > 0
  );

  const hasRaids = visibleCategories.length > 0 || dynamaxRaids.length > 0 || manualRaids.length > 0;

  const handleRaidClick = (raid: any) => {
    setSelectedRaid(raid);
    if (raid.tier.includes('Dynamax') || raid.tier.includes('Gigantamax')) {
      setShowDynamaxDialog(true);
    } else {
      setShowRaidDialog(true);
    }
  };

  const getPokemonIdFromName = (name: string): number => {
    const map: Record<string, number> = {
      'pikachu': 25, 'eevee': 133, 'mewtwo': 150, 'mew': 151,
      'lugia': 249, 'ho-oh': 250, 'kyogre': 382, 'groudon': 383,
      'rayquaza': 384, 'dialga': 483, 'palkia': 484, 'giratina': 487,
      'moltres': 146, 'zapdos': 145, 'articuno': 144,
    };
    const key = name.toLowerCase().trim();
    return map[key] || 25;
  };

  const buildManualRaidObjects = (manualRaids: ManualRaid[]): any[] => {
    const allPokemon: any[] = [];
    manualRaids.forEach((manual) => {
      manual.pokemon.forEach((name) => {
        const id = getPokemonIdFromName(name);
        const image = getUltimateGalleryUrl(name) || getPokeApiUrl(id);
        allPokemon.push({
          id,
          name,
          tier: manual.category,
          isShiny: false,
          image,
          isManual: true,
        });
      });
    });
    return allPokemon;
  };

  const manualRaidObjects = buildManualRaidObjects(manualRaids);

  if (loading || manualLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#1a1a2e' }}>
        <Header title="Current Raids" cartCount={totalItems} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #333', borderTopColor: '#7627C5', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#1a1a2e', overflow: 'hidden' }}>
      <Header title="Current Raids" cartCount={totalItems} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}>
        <p style={{ color: '#FFA500', fontSize: '12px', textAlign: 'center', marginBottom: '12px' }}>
          Last updated: {new Date().toLocaleDateString()}
        </p>

        {!hasRaids ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888888' }}>
            <p style={{ fontSize: '18px' }}>No raids available</p>
            <p style={{ fontSize: '14px', marginTop: '4px' }}>Check back later</p>
          </div>
        ) : (
          <>
            {/* Manual Raids */}
            {manualRaidObjects.length > 0 && (
              <div style={{ backgroundColor: '#1a2a1a', borderRadius: '14px', padding: '14px', border: '2px solid #2a3a2a', marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, padding: '8px 12px 10px', margin: '-14px -14px 12px', background: 'rgba(255,255,255,0.06)', borderRadius: '14px 14px 0 0', borderBottom: '2px solid rgba(255,255,255,0.08)', color: '#FFA500' }}>
                  {manualRaids.map(r => r.category).join(' • ')}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px', width: '100%' }}>
                  {manualRaidObjects.map((raid) => (
                    <RaidGridCard
                      key={`manual-${raid.id}-${raid.name}`}
                      raid={raid}
                      cardType="standard"
                      onClick={() => handleRaidClick(raid)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Standard Raids - Deep Green */}
            {visibleCategories
              .filter(cat => !cat.key.startsWith('shadow') && cat.key !== 'ultraBeasts')
              .map((cat) => (
                <div key={cat.key} style={{ backgroundColor: '#1a2a1a', borderRadius: '14px', padding: '14px', border: '2px solid #2a3a2a', marginBottom: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, padding: '8px 12px 10px', margin: '-14px -14px 12px', background: 'rgba(255,255,255,0.06)', borderRadius: '14px 14px 0 0', borderBottom: '2px solid rgba(255,255,255,0.08)', color: '#ffffff' }}>
                    {cat.title}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px', width: '100%' }}>
                    {regularRaids[cat.key].map((raid: any) => (
                      <RaidGridCard
                        key={`${raid.id}-${raid.name}`}
                        raid={raid}
                        cardType="standard"
                        onClick={() => handleRaidClick(raid)}
                      />
                    ))}
                  </div>
                </div>
              ))}

            {/* Shadow Raids - Deep Purple */}
            {visibleCategories
              .filter(cat => cat.key.startsWith('shadow'))
              .map((cat) => (
                <div key={cat.key} style={{ backgroundColor: '#2a1a3e', borderRadius: '14px', padding: '14px', border: '2px solid #3a2a4e', marginBottom: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, padding: '8px 12px 10px', margin: '-14px -14px 12px', background: 'rgba(118,39,197,0.12)', borderRadius: '14px 14px 0 0', borderBottom: '2px solid rgba(255,255,255,0.08)', color: '#c084fc' }}>
                    {cat.title}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px', width: '100%' }}>
                    {regularRaids[cat.key].map((raid: any) => (
                      <RaidGridCard
                        key={`${raid.id}-${raid.name}`}
                        raid={raid}
                        cardType="shadow"
                        onClick={() => handleRaidClick(raid)}
                      />
                    ))}
                  </div>
                </div>
              ))}

            {/* Ultra Beasts - Cyan Accent */}
            {visibleCategories
              .filter(cat => cat.key === 'ultraBeasts')
              .map((cat) => (
                <div key={cat.key} style={{ backgroundColor: '#1a2a2a', borderRadius: '14px', padding: '14px', border: '2px solid rgba(0,188,212,0.4)', marginBottom: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, padding: '8px 12px 10px', margin: '-14px -14px 12px', background: 'rgba(0,188,212,0.08)', borderRadius: '14px 14px 0 0', borderBottom: '2px solid rgba(255,255,255,0.08)', color: '#22d3ee' }}>
                    {cat.title}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px', width: '100%' }}>
                    {regularRaids[cat.key].map((raid: any) => (
                      <RaidGridCard
                        key={`${raid.id}-${raid.name}`}
                        raid={raid}
                        cardType="ultra"
                        onClick={() => handleRaidClick(raid)}
                      />
                    ))}
                  </div>
                </div>
              ))}

            {/* Dynamax Raids - Deep Red */}
            {dynamaxRaids.length > 0 && (
              <>
                {['💥 Gigantamax', '⚡⚡⚡⚡⚡ Dynamax Tier 5', '⚡⚡⚡⚡ Dynamax Tier 4', '⚡⚡⚡ Dynamax Tier 3', '⚡⚡ Dynamax Tier 2', '⚡ Dynamax Tier 1'].map((tier) => {
                  const tierRaids = dynamaxRaids.filter((r) => r.tier === tier);
                  if (tierRaids.length === 0) return null;
                  return (
                    <div key={tier} style={{ backgroundColor: '#2a1a1a', borderRadius: '14px', padding: '14px', border: '2px solid #3a2a2a', marginBottom: '16px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, padding: '8px 12px 10px', margin: '-14px -14px 12px', background: 'rgba(244,67,54,0.08)', borderRadius: '14px 14px 0 0', borderBottom: '2px solid rgba(255,255,255,0.08)', color: '#f87171' }}>
                        {tier}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px', width: '100%' }}>
                        {tierRaids.map((raid) => (
                          <RaidGridCard
                            key={`${raid.id}-${raid.name}`}
                            raid={raid}
                            cardType="dynamax"
                            onClick={() => handleRaidClick(raid)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </>
        )}
      </div>

      {/* Raid Order Dialog */}
      <RaidOrderDialog
        isOpen={showRaidDialog}
        raid={selectedRaid}
        onClose={() => {
          setShowRaidDialog(false);
          setSelectedRaid(null);
        }}
      />

      {/* Dynamax Order Dialog */}
      <DynamaxOrderDialog
        isOpen={showDynamaxDialog}
        raid={selectedRaid}
        onClose={() => {
          setShowDynamaxDialog(false);
          setSelectedRaid(null);
        }}
      />
    </div>
  );
}

// ========== RaidGridCard ==========
interface RaidGridCardProps {
  raid: any;
  cardType?: 'standard' | 'shadow' | 'dynamax' | 'ultra';
  onClick: () => void;
}

function RaidGridCard({ raid, cardType = 'standard', onClick }: RaidGridCardProps) {
  const isShadow = raid.name.toLowerCase().includes('shadow');

  const cardBg: Record<string, string> = {
    standard: '#1a2a1a',
    shadow: '#2a1a3e',
    dynamax: '#2a1a1a',
    ultra: '#1a2a2a',
  };

  const cardHoverBg: Record<string, string> = {
    standard: '#2a3a2a',
    shadow: '#3a2a4e',
    dynamax: '#3a2a2a',
    ultra: '#2a3a3a',
  };

  const bgColor = cardBg[cardType] || cardBg.standard;
  const hoverBg = cardHoverBg[cardType] || cardHoverBg.standard;

  const showShadow = isShadow || cardType === 'shadow';
  const showDynamax = cardType === 'dynamax';
  const showUltra = cardType === 'ultra';

  return (
    <div
      style={{
        backgroundColor: bgColor,
        borderRadius: '12px',
        padding: '10px 6px 8px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        minHeight: '140px',
        transition: 'background-color 0.15s, transform 0.15s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.backgroundColor = hoverBg;
        (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.04)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.backgroundColor = bgColor;
        (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
      }}
      onMouseDown={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'scale(0.95)';
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
      }}
      onClick={onClick}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '140px',
          aspectRatio: '1/1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '10px',
          overflow: 'hidden',
          background: 'rgba(0,0,0,0.3)',
        }}
      >
        {showShadow && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url(https://raw.githubusercontent.com/Skatecrete/infographics/main/effects/shadow_effect.png)',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              zIndex: 1,
              opacity: 0.9,
            }}
          />
        )}
        {showDynamax && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, rgba(255,50,50,0.25) 0%, rgba(255,0,0,0.05) 70%, transparent 100%)',
              zIndex: 1,
            }}
          />
        )}
        {showUltra && (
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '32px',
              height: '32px',
              backgroundImage: 'url(https://raw.githubusercontent.com/Skatecrete/infographics/main/effects/ultrabeastportal.png)',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              zIndex: 3,
              opacity: 0.9,
              pointerEvents: 'none',
            }}
          />
        )}
        <img
          src={raid.image}
          alt={raid.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            padding: '6px',
            position: 'relative',
            zIndex: 2,
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${raid.id}.png`;
          }}
        />
        {showDynamax && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url(https://raw.githubusercontent.com/Skatecrete/infographics/main/effects/dynamax_effect.png)',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              zIndex: 3,
              opacity: 0.9,
              pointerEvents: 'none',
            }}
          />
        )}
        {showDynamax && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(255,0,0,0.10)',
              zIndex: 3,
              pointerEvents: 'none',
              borderRadius: '10px',
            }}
          />
        )}
      </div>
      <p
        style={{
          fontSize: '12px',
          color: '#e0e0e0',
          fontWeight: 500,
          marginTop: '6px',
          lineHeight: 1.3,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          width: '100%',
          padding: '0 2px',
        }}
      >
        {raid.name}
      </p>
    </div>
  );
}