import { useState } from 'react';
import { REGIONS } from '@/utils/regionHelper';

interface RegionFilterProps {
  selectedRegion: string | null;
  onRegionSelect: (region: string | null) => void;
  onClear: () => void;
}

export function RegionFilter({ selectedRegion, onRegionSelect, onClear }: RegionFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getDisplayName = () => {
    if (!selectedRegion) return 'Filter by Region';
    const region = REGIONS.find((r) => r.name === selectedRegion);
    return region ? region.displayName : 'Filter by Region';
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '6px 12px',
          backgroundColor: selectedRegion ? '#FFA500' : '#7627C5',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        }}
      >
        {getDisplayName()}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '4px',
            backgroundColor: '#2a2a3e',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            border: '1px solid #444',
            padding: '8px',
            zIndex: 50,
            width: '224px',
            maxHeight: '240px',
            overflowY: 'auto',
          }}
        >
          {REGIONS.map((region) => (
            <button
              key={region.name}
              onClick={() => {
                onRegionSelect(region.name);
                setIsOpen(false);
              }}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '8px 12px',
                backgroundColor: selectedRegion === region.name ? '#7627C5' : 'transparent',
                color: selectedRegion === region.name ? '#ffffff' : '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                if (selectedRegion !== region.name) {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#1a1a2e';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedRegion !== region.name) {
                  (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
                }
              }}
            >
              {region.displayName}
            </button>
          ))}
          {selectedRegion && (
            <button
              onClick={() => {
                onClear();
                setIsOpen(false);
              }}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '8px 12px',
                marginTop: '8px',
                borderTop: '1px solid #444',
                paddingTop: '12px',
                backgroundColor: 'transparent',
                color: '#F44336',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = '#1a1a2e';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
              }}
            >
              Clear Filter
            </button>
          )}
        </div>
      )}
    </div>
  );
}