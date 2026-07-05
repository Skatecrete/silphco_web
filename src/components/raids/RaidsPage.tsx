import { useCart } from '@/hooks/useCart';
import { useRaids } from '@/hooks/useRaids';
import { RaidCard } from './RaidCard';
import { RaidOrderDialog } from './RaidOrderDialog';
import { DynamaxOrderDialog } from './DynamaxOrderDialog';
import { Header } from '@/components/common/Header';
import { useState } from 'react';

export function RaidsPage() {
  const { totalItems } = useCart();
  const { regularRaids, dynamaxRaids, loading, error } = useRaids();
  const [selectedRaid, setSelectedRaid] = useState<any>(null);
  const [showRaidDialog, setShowRaidDialog] = useState(false);
  const [showDynamaxDialog, setShowDynamaxDialog] = useState(false);

  const categoryOrder = [
    { key: 'ultraBeasts', title: '🌀 ULTRA BEASTS' },
    { key: 'tier5', title: '⭐⭐⭐⭐⭐ 5-STAR RAIDS' },
    { key: 'tier4', title: '⭐⭐⭐⭐ 4-STAR RAIDS' },
    { key: 'tier3', title: '⭐⭐⭐ 3-STAR RAIDS' },
    { key: 'tier2', title: '⭐⭐ 2-STAR RAIDS' },
    { key: 'tier1', title: '⭐ 1-STAR RAIDS' },
    { key: 'mega', title: '🔴 MEGA RAIDS' },
    { key: 'primal', title: '🌊 PRIMAL RAIDS' },
    { key: 'superMega', title: '💫 SUPER MEGA RAIDS' },
    { key: 'shadow5', title: '🌑 SHADOW LEGENDARY (5-STAR)' },
    { key: 'shadow3', title: '🌑 SHADOW 3-STAR RAIDS' },
    { key: 'shadow1', title: '🌑 SHADOW 1-STAR RAIDS' },
  ];

  const visibleCategories = categoryOrder.filter(
    (cat) => regularRaids[cat.key] && regularRaids[cat.key].length > 0
  );

  const hasRaids = visibleCategories.length > 0 || dynamaxRaids.length > 0;

  const handleRaidClick = (raid: any) => {
    setSelectedRaid(raid);
    if (raid.tier.includes('Dynamax') || raid.tier.includes('Gigantamax')) {
      setShowDynamaxDialog(true);
    } else {
      setShowRaidDialog(true);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-dark-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
        <p className="text-gray-400 mt-4">Loading raids...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-dark-bg">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-dark-bg">
      <Header title="Current Raids" cartCount={totalItems} />

      <div className="flex-1 overflow-y-auto px-4 py-3">
        <p className="text-orange-500 text-xs text-center mb-3">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        {!hasRaids ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p className="text-lg">No raids available</p>
            <p className="text-sm mt-1">Check back later</p>
          </div>
        ) : (
          <>
            {visibleCategories.map((cat) => (
              <div key={cat.key} className="mb-4">
                <div className={`text-white text-sm font-bold px-3 py-2 rounded-lg mb-2 ${
                  cat.key === 'ultraBeasts' ? 'bg-cyan-600/30 border-l-4 border-cyan-400' : 'bg-dark-bg/50'
                }`}>
                  {cat.title}
                </div>
                <div className="flex flex-wrap gap-2">
                  {regularRaids[cat.key].map((raid: any) => (
                    <RaidCard
                      key={`${raid.id}-${raid.name}`}
                      raid={raid}
                      isUltraBeast={cat.key === 'ultraBeasts'}
                      onClick={() => handleRaidClick(raid)}
                    />
                  ))}
                </div>
              </div>
            ))}

            {dynamaxRaids.length > 0 && (
              <>
                {['💥 Gigantamax', '⚡⚡⚡⚡⚡ Dynamax Tier 5', '⚡⚡⚡⚡ Dynamax Tier 4', '⚡⚡⚡ Dynamax Tier 3', '⚡⚡ Dynamax Tier 2', '⚡ Dynamax Tier 1'].map((tier) => {
                  const tierRaids = dynamaxRaids.filter((r) => r.tier === tier);
                  if (tierRaids.length === 0) return null;
                  return (
                    <div key={tier} className="mb-4">
                      <div className="text-white text-sm font-bold px-3 py-2 rounded-lg mb-2 bg-dark-bg/50">
                        {tier}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tierRaids.map((raid) => (
                          <RaidCard
                            key={`${raid.id}-${raid.name}`}
                            raid={raid}
                            isUltraBeast={false}
                            isDynamax={true}
                            isGigantamax={tier.includes('Gigantamax')}
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

      <RaidOrderDialog
        isOpen={showRaidDialog}
        raid={selectedRaid}
        onClose={() => {
          setShowRaidDialog(false);
          setSelectedRaid(null);
        }}
      />

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