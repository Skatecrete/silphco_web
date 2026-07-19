interface DexTabsProps {
  currentTab: 'Normal' | 'Shiny';
  onTabChange: (tab: 'Normal' | 'Shiny') => void;
}

export function DexTabs({ currentTab, onTabChange }: DexTabsProps) {
  return (
    <div style={{ padding: '8px 16px', backgroundColor: 'rgba(26,26,46,0.95)', borderBottom: '1px solid rgba(128,128,128,0.2)' }}>
      <div style={{ display: 'flex', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#2a2a3e', padding: '4px' }}>
        <button
          onClick={() => onTabChange('Normal')}
          style={{
            flex: 1,
            padding: '8px',
            backgroundColor: currentTab === 'Normal' ? '#7627C5' : 'transparent',
            color: currentTab === 'Normal' ? '#ffffff' : '#888888',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background-color 0.2s, color 0.2s',
          }}
        >
          📖 Normal
        </button>
        <button
          onClick={() => onTabChange('Shiny')}
          style={{
            flex: 1,
            padding: '8px',
            backgroundColor: currentTab === 'Shiny' ? '#7627C5' : 'transparent',
            color: currentTab === 'Shiny' ? '#ffffff' : '#888888',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background-color 0.2s, color 0.2s',
          }}
        >
          ✨ Shiny
        </button>
      </div>
    </div>
  );
}