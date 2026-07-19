import { useState, useMemo, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { useDex } from '@/hooks/useDex';
import { useUser } from '@/hooks/useUser';
import { DexCard } from './DexCard';
import { DexTabs } from './DexTabs';
import { RegionFilter } from './RegionFilter';
import { Header } from '@/components/common/Header';
import { REGIONS } from '@/utils/regionHelper';
import { getDexProgress } from '@/services/sheetsApi';

export function DexPage() {
  const { totalItems } = useCart();
  const { userDisplay, isLoggedIn } = useUser();
  const [listType, setListType] = useState<'Normal' | 'Shiny'>('Normal');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const { 
    pokemon, 
    loading, 
    error, 
    pendingRemovals, 
    togglePokemon, 
    confirmRemovals, 
    cancelRemovals, 
    hasPendingRemovals,
    refreshDex 
  } = useDex(listType);
  const [dexMatchPopupShown, setDexMatchPopupShown] = useState(false);
  const [dexCheckComplete, setDexCheckComplete] = useState(false);

  // ========== FILTERED POKEMON ==========
  const filteredPokemon = useMemo(() => {
    let result = pokemon;

    // If NOT searching and no region filter, show ONLY checked Pokémon
    if (!searchQuery.trim() && !selectedRegion) {
      result = result.filter((p) => p.onList === true);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(query) || p.id.toString().includes(query)
      );
    }

    // Region filter
    if (selectedRegion) {
      const region = REGIONS.find((r) => r.name === selectedRegion);
      if (region) {
        result = result.filter((p) => p.id >= region.startId && p.id <= region.endId);
      }
    }

    // Shiny tab filter
    if (listType === 'Shiny') {
      result = result.filter((p) => p.isShinyAvailable);
    }

    return result.sort((a, b) => a.id - b.id);
  }, [pokemon, searchQuery, selectedRegion, listType]);

  const totalOnList = pokemon.filter((p) => p.onList).length;
  const totalPending = pendingRemovals.length;

  // Refresh dex when tab changes
  useEffect(() => {
    refreshDex();
  }, [listType]);

  // ========== DEX MATCH POPUP (lightweight check) ==========
  useEffect(() => {
    // Only run once when dex is loaded and user is logged in
    if (!loading && pokemon.length > 0 && isLoggedIn && userDisplay && !dexMatchPopupShown && !dexCheckComplete) {
      setDexCheckComplete(true);
      checkDexMatches();
    }
  }, [loading, pokemon, isLoggedIn, userDisplay]);

  const checkDexMatches = () => {
    // Get the list of checked Pokémon IDs
    const checkedIds = pokemon.filter(p => p.onList).map(p => p.id);
    
    // If no checked Pokémon, skip
    if (checkedIds.length === 0) return;

    // Get spawns data from GitHub (lightweight, no hook)
    fetch('https://raw.githubusercontent.com/Skatecrete/pogo-raid-data/main/spawns.json')
      .then(res => res.json())
      .then(data => {
        const spawns = data.spawns || [];
        const matches = spawns.filter((s: any) => checkedIds.includes(s.id));
        
        if (matches.length > 0) {
          showDexMatchPopup(matches);
        }
      })
      .catch(() => {
        // Silent fail - dex match check is non-critical
        console.debug('Dex match check skipped');
      });
  };

  const showDexMatchPopup = (matches: any[]) => {
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

    modal.innerHTML = `
      <h2 style="color: #FFA500; font-size: 20px; font-weight: 700; margin-bottom: 12px;">🎯 DEX MATCH FOUND!</h2>
      <p style="color: #ffffff; font-size: 14px; margin-bottom: 20px;">
        ${matches.length} Pokémon in your dex are currently spawning in the wild!
      </p>
      <button id="dexViewSpawnsBtn" style="
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
        👀 View in Spawns (${matches.length})
      </button>
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
        Close
      </button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const viewBtn = document.getElementById('dexViewSpawnsBtn');
    const closeBtn = document.getElementById('dexCloseBtn');

    if (viewBtn) {
      viewBtn.addEventListener('click', () => {
        document.body.removeChild(overlay);
        const names = matches.map((p: any) => p.name).join(' ');
        sessionStorage.setItem('spawns_search', names);
        window.location.hash = '#/app/spawns';
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

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#1a1a2e' }}>
        <Header title="My Lists" cartCount={totalItems} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #333', borderTopColor: '#7627C5', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#1a1a2e' }}>
        <Header title="My Lists" cartCount={totalItems} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
          <p style={{ color: '#F44336', fontSize: '16px', textAlign: 'center' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '16px',
              padding: '8px 24px',
              backgroundColor: '#7627C5',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#1a1a2e', overflow: 'hidden' }}>
      <Header title="My Lists" cartCount={totalItems} />

      <DexTabs currentTab={listType} onTabChange={setListType} />

      <div style={{ padding: '4px 16px', backgroundColor: 'rgba(26,26,46,0.95)', borderBottom: '1px solid rgba(128,128,128,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#FFA500', fontSize: '12px' }}>
          {totalOnList} on list
          {totalPending > 0 && ` | ⏳ ${totalPending} pending`}
        </span>
        {searchQuery && (
          <span style={{ color: '#888888', fontSize: '12px' }}>
            🔍 {searchQuery}
          </span>
        )}
        <button
          onClick={() => refreshDex()}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#888888',
            cursor: 'pointer',
            fontSize: '14px',
            padding: '4px 8px',
          }}
        >
          🔄
        </button>
      </div>

      <div style={{ padding: '8px 16px', backgroundColor: 'rgba(26,26,46,0.95)', borderBottom: '1px solid rgba(128,128,128,0.2)' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search Pokemon by name or ID"
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
            onFocus={(e) => { e.target.style.borderColor = '#7627C5'; }}
            onBlur={(e) => { e.target.style.borderColor = 'transparent'; }}
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

      <div style={{ padding: '8px 16px', display: 'flex', gap: '8px', backgroundColor: 'rgba(26,26,46,0.95)', borderBottom: '1px solid rgba(128,128,128,0.2)', alignItems: 'center' }}>
        <RegionFilter
          selectedRegion={selectedRegion}
          onRegionSelect={setSelectedRegion}
          onClear={() => setSelectedRegion(null)}
        />
        <span style={{ color: '#888888', fontSize: '14px', marginLeft: 'auto' }}>
          {filteredPokemon.length} shown
        </span>
      </div>

      {hasPendingRemovals && (
        <div style={{ padding: '8px 16px', display: 'flex', gap: '8px', backgroundColor: 'rgba(26,26,46,0.95)', borderBottom: '1px solid rgba(128,128,128,0.2)' }}>
          <button
            onClick={async () => {
              const result = await confirmRemovals();
              if (result && result.successCount > 0) {
                refreshDex();
              }
            }}
            style={{
              flex: 1,
              padding: '8px',
              backgroundColor: '#4CAF50',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ✅ Confirm ({totalPending})
          </button>
          <button
            onClick={cancelRemovals}
            style={{
              flex: 1,
              padding: '8px',
              backgroundColor: '#F44336',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ❌ Cancel
          </button>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px' }}>
        {filteredPokemon.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888888', textAlign: 'center' }}>
            <p style={{ fontSize: '18px' }}>Your list is empty</p>
            <p style={{ fontSize: '14px', marginTop: '4px' }}>
              Search above by Name or ID to add some!
            </p>
            <p style={{ fontSize: '14px', marginTop: '4px', color: '#FFA500' }}>
              Once a Pokemon is checked, it autosaves to your list.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {filteredPokemon.map((p) => (
              <DexCard
                key={p.id}
                pokemon={p}
                onToggle={(checked) => togglePokemon(p.id, checked)}
              />
            ))}
          </div>
        )}
      </div>

      {listType === 'Shiny' && (
        <div style={{ padding: '8px 16px', backgroundColor: 'rgba(26,26,46,0.95)', borderTop: '1px solid rgba(128,128,128,0.2)', flexShrink: 0 }}>
          <p style={{ color: '#FFA500', fontSize: '12px', textAlign: 'center', margin: 0 }}>
            ⚠️ Disclaimer: Some Pokémon on this list may not have a shiny variant released yet.
          </p>
        </div>
      )}
    </div>
  );
}