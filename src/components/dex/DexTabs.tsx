interface DexTabsProps {
  currentTab: 'Normal' | 'Shiny';
  onTabChange: (tab: 'Normal' | 'Shiny') => void;
}

export function DexTabs({ currentTab, onTabChange }: DexTabsProps) {
  return (
    <div className="px-4 py-2 bg-dark-bg/95 border-b border-gray-800/50">
      <div className="flex rounded-xl overflow-hidden bg-dark-card p-1">
        <button
          onClick={() => onTabChange('Normal')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${
            currentTab === 'Normal'
              ? 'bg-purple-500 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          📖 Normal
        </button>
        <button
          onClick={() => onTabChange('Shiny')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${
            currentTab === 'Shiny'
              ? 'bg-purple-500 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          ✨ Shiny
        </button>
      </div>
    </div>
  );
}