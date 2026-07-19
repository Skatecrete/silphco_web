interface FilterState {
  regional: boolean;
  shundo: boolean;
  shiny164: boolean;
  greatLeague: boolean;
  ultraLeague: boolean;
  masterLeague: boolean;
  premierCup: boolean;
  ultraPremier: boolean;
}

interface SpawnFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function SpawnFilterDialog({
  isOpen,
  onClose,
  filters,
  onFilterChange,
}: SpawnFilterDialogProps) {
  if (!isOpen) return null;

  const toggleFilter = (key: keyof FilterState) => {
    onFilterChange({ ...filters, [key]: !filters[key] });
  };

  const clearAll = () => {
    onFilterChange({
      regional: false,
      shundo: false,
      shiny164: false,
      greatLeague: false,
      ultraLeague: false,
      masterLeague: false,
      premierCup: false,
      ultraPremier: false,
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 16px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#2a2a3e',
          borderRadius: '16px',
          padding: '24px',
          width: '100%',
          maxWidth: '400px',
          maxHeight: '80vh',
          overflowY: 'auto',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: 700, margin: 0 }}>
            Filter Spawns
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#888888',
              fontSize: '24px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ffffff', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={filters.regional}
              onChange={() => toggleFilter('regional')}
              style={{ width: '20px', height: '20px', accentColor: '#7627C5' }}
            />
            <span>🌍 Regional</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ffffff', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={filters.shundo}
              onChange={() => toggleFilter('shundo')}
              style={{ width: '20px', height: '20px', accentColor: '#7627C5' }}
            />
            <span>✨ Shundo (0.65%+ Spawn)</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ffffff', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={filters.shiny164}
              onChange={() => toggleFilter('shiny164')}
              style={{ width: '20px', height: '20px', accentColor: '#7627C5' }}
            />
            <span>⭐ 1/64 Shiny Odds</span>
          </label>

          <div style={{ borderTop: '1px solid #444', margin: '8px 0' }} />

          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ffffff', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={filters.greatLeague}
              onChange={() => toggleFilter('greatLeague')}
              style={{ width: '20px', height: '20px', accentColor: '#7627C5' }}
            />
            <span>🏆 Great League</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ffffff', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={filters.ultraLeague}
              onChange={() => toggleFilter('ultraLeague')}
              style={{ width: '20px', height: '20px', accentColor: '#7627C5' }}
            />
            <span>🏆 Ultra League</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ffffff', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={filters.masterLeague}
              onChange={() => toggleFilter('masterLeague')}
              style={{ width: '20px', height: '20px', accentColor: '#7627C5' }}
            />
            <span>🏆 Master League</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ffffff', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={filters.premierCup}
              onChange={() => toggleFilter('premierCup')}
              style={{ width: '20px', height: '20px', accentColor: '#7627C5' }}
            />
            <span>🏆 Premier Cup</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ffffff', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={filters.ultraPremier}
              onChange={() => toggleFilter('ultraPremier')}
              style={{ width: '20px', height: '20px', accentColor: '#7627C5' }}
            />
            <span>🏆 Ultra Premier</span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button
            onClick={clearAll}
            style={{
              flex: 1,
              padding: '8px',
              backgroundColor: '#F44336',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '8px',
              backgroundColor: '#7627C5',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}