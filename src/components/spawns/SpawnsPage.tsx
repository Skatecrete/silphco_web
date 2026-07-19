import { useState, useMemo, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { useSpawns } from '@/hooks/useSpawns';
import { useUser } from '@/hooks/useUser';
import { SpawnCard } from './SpawnCard';
import { SpawnFilterDialog } from './SpawnFilterDialog';
import { SpawnOrderDialog } from './SpawnOrderDialog';
import { Header } from '@/components/common/Header';
import { getDexProgress } from '@/services/sheetsApi';

export function SpawnsPage() {
  const { allPokemon, loading, error } = useSpawns();
  const { totalItems } = useCart();
  const { userDisplay, isLoggedIn } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    regional: false,
    shundo: false,
    shiny164: false,
    greatLeague: false,
    ultraLeague: false,
    masterLeague: false,
    premierCup: false,
    ultraPremier: false,
  });
  const [selectedPokemon, setSelectedPokemon] = useState<any>(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [dexMatchPopupShown, setDexMatchPopupShown] = useState(false);
  const [dexCheckComplete, setDexCheckComplete] = useState(false);

  const filteredPokemon = useMemo(() => {
    let result = allPokemon;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p: any) => p.name.toLowerCase().includes(query) || p.id.toString().includes(query)
      );
    }

    const hasFilters = Object.values(filters).some((v) => v);
    if (hasFilters) {
      result = result.filter((p: any) => {
        let matches = false;
        if (filters.regional) matches = matches || p.isRegional;
        if (filters.shundo) matches = matches || (p.spawnRate >= 0.45 && p.isShiny);
        if (filters.shiny164) matches = matches || (p.isShiny && p.spawnRate >= 0.45);
        if (filters.greatLeague) matches = matches || p.isTopGreatLeague;
        if (filters.ultraLeague) matches = matches || p.isTopUltraLeague;
        if (filters.masterLeague) matches = matches || p.isTopMasterLeague;
        if (filters.premierCup) matches = matches || p.isTopPremierCup;
        if (filters.ultraPremier) matches = matches || p.isTopUltraPremier;
        return matches;
      });
    }

    return result;
  }, [allPokemon, searchQuery, filters]);

  useEffect(() => {
    if (!loading && allPokemon.length > 0 && isLoggedIn && userDisplay && !dexMatchPopupShown && !dexCheckComplete) {
      setDexCheckComplete(true);
      quickDexCheck(allPokemon);
    }
  }, [loading, allPokemon, isLoggedIn, userDisplay]);

  const quickDexCheck = (spawns: any[]) => {
    if (!userDisplay) return;

    Promise.all([
      getDexProgress(userDisplay, 'Normal'),
      getDexProgress(userDisplay, 'Shiny')
    ]).then(([normalDex, shinyDex]) => {
      if (!normalDex && !shinyDex) return;

      const normalIds = new Set((normalDex || []).map((entry: any) => entry.id));
      const shinyIds = new Set((shinyDex || []).map((entry: any) => entry.id));

      if (normalIds.size === 0 && shinyIds.size === 0) return;

      const normalMatches = spawns.filter((p) => normalIds.has(p.id));
      const shinyMatches = spawns.filter((p) => shinyIds.has(p.id) && p.isShiny);

      if (normalMatches.length > 0 || shinyMatches.length > 0) {
        showDexMatchPopup(normalMatches, shinyMatches);
      }
    }).catch(() => {
      console.debug('Dex check skipped or failed');
    });
  };

  const showDexMatchPopup = (normalMatches: any[], shinyMatches: any[]) => {
    setDexMatchPopupShown(true);

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 16px;
    `;

    const modal = document.createElement('div');
    modal.style.cssText = `
      background: #2a2a3e;
      border-radius: 16px;
      padding: 24px;
      max-width: 400px;
      width: 100%;
      text-align: center;
    `;

    const totalCount = normalMatches.length + shinyMatches.length;

    modal.innerHTML = `
      <h2 style="color: #FFA500; font-size: 20px; font-weight: 700; margin-bottom: 12px;">🎯 DEX MATCH FOUND!</h2>
      <p style="color: #ffffff; font-size: 14px; margin-bottom: 20px;">
        ${totalCount} Pokémon in your dex are currently spawning!
      </p>
      ${normalMatches.length > 0 ? `
        <button id="dexNormalBtn" style="
          width: 100%;
          padding: 12px;
          background: #4CAF50;
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          margin-bottom: 8px;
        ">
          📖 Normal Dex (${normalMatches.length})
        </button>
      ` : ''}
      ${shinyMatches.length > 0 ? `
        <button id="dexShinyBtn" style="
          width: 100%;
          padding: 12px;
          background: #2196F3;
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          margin-bottom: 8px;
        ">
          ✨ Shiny Dex (${shinyMatches.length})
        </button>
      ` : ''}
      <button id="dexCloseBtn" style="
        width: 100%;
        padding: 12px;
        background: #F44336;
        color: #ffffff;
        border: none;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
      ">
        Close & View All Spawns
      </button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const normalBtn = document.getElementById('dexNormalBtn');
    const shinyBtn = document.getElementById('dexShinyBtn');
    const closeBtn = document.getElementById('dexCloseBtn');

    if (normalBtn) {
      normalBtn.addEventListener('click', () => {
        document.body.removeChild(overlay);
        setSearchQuery(normalMatches.map((p) => p.name).join(' '));
      });
    }

    if (shinyBtn) {
      shinyBtn.addEventListener('click', () => {
        document.body.removeChild(overlay);
        setSearchQuery(shinyMatches.map((p) => p.name).join(' '));
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        document.body.removeChild(overlay);
      });
    }

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
      }
    });
  };

  const handlePokemonClick = (pokemon: any) => {
    if (pokemon.spawnRate === 0.0) return;
    setSelectedPokemon(pokemon);
    setShowOrderDialog(true);
  };

  if (loading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#1a1a2e',
        }}
      >
        <Header title="Wild Spawns" cartCount={totalItems} />
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              border: '4px solid #333',
              borderTopColor: '#7627C5',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#1a1a2e',
      }}
    >
      <Header title="Wild Spawns" cartCount={totalItems} />

      <div
        style={{
          padding: '12px 16px',
          backgroundColor: 'rgba(26, 26, 46, 0.95)',
          borderBottom: '1px solid rgba(128, 128, 128, 0.2)',
          flexShrink: 0,
        }}
      >
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search Pokemon..."
            style={{
              width: '100%',
              padding: '8px 16px',
              backgroundColor: '#2a2a3e',
              color: '#ffffff',
              borderRadius: '12px',
              border: '2px solid transparent',
              outline: 'none',
              fontSize: '14px',
              fontFamily: 'inherit',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#7627C5';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'transparent';
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: '#888888',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div
        style={{
          padding: '8px 16px',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          backgroundColor: 'rgba(26, 26, 46, 0.95)',
          borderBottom: '1px solid rgba(128, 128, 128, 0.2)',
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => setShowFilters(true)}
          style={{
            padding: '4px 12px',
            backgroundColor: '#7627C5',
            color: '#ffffff',
            border: 'none',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          🔽 Filter
        </button>
        {Object.values(filters).some((v) => v) && (
          <button
            onClick={() =>
              setFilters({
                regional: false,
                shundo: false,
                shiny164: false,
                greatLeague: false,
                ultraLeague: false,
                masterLeague: false,
                premierCup: false,
                ultraPremier: false,
              })
            }
            style={{
              padding: '4px 12px',
              backgroundColor: '#F44336',
              color: '#ffffff',
              border: 'none',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Clear All
          </button>
        )}
        <span
          style={{
            color: '#888888',
            fontSize: '14px',
            marginLeft: 'auto',
            alignSelf: 'center',
          }}
        >
          {filteredPokemon.length} / {allPokemon.length}
        </span>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px 16px',
        }}
      >
        {filteredPokemon.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#888888',
            }}
          >
            <p style={{ fontSize: '18px' }}>No spawns found</p>
            <p style={{ fontSize: '14px', marginTop: '4px' }}>Try adjusting your filters</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {filteredPokemon.map((pokemon: any) => (
              <SpawnCard
                key={pokemon.id}
                pokemon={pokemon}
                onClick={() => handlePokemonClick(pokemon)}
              />
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          padding: '8px 16px',
          backgroundColor: 'rgba(26, 26, 46, 0.95)',
          borderTop: '1px solid rgba(128, 128, 128, 0.2)',
          flexShrink: 0,
        }}
      >
        <p
          style={{
            color: '#FFA500',
            fontSize: '12px',
            textAlign: 'center',
            margin: 0,
          }}
        >
          *Only Spawn Rates of 0.45% or Higher, with a Shiny Variant can be Shundo Hunted.
        </p>
      </div>

      <SpawnFilterDialog
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFilterChange={setFilters}
      />

      <SpawnOrderDialog
        isOpen={showOrderDialog}
        pokemon={selectedPokemon}
        onClose={() => {
          setShowOrderDialog(false);
          setSelectedPokemon(null);
        }}
      />
    </div>
  );
}