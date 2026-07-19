import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { RegionHelper } from '@/utils/regionHelper';
import { ALL_POKEMON_NAMES } from '@/utils/constants';
import { getUltimateGalleryUrl, getPokeApiUrl } from '@/services/imageUrlBuilder';

interface PokemonEntry {
  id: number;
  name: string;
}

export function ViewAllPokemon() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [pokemonList, setPokemonList] = useState<PokemonEntry[]>([]);
  const [filteredList, setFilteredList] = useState<PokemonEntry[]>([]);

  // Load all Pokemon on mount
  useEffect(() => {
    const list = Object.entries(ALL_POKEMON_NAMES).map(([id, name]) => ({
      id: parseInt(id),
      name,
    }));
    setPokemonList(list);
    setFilteredList(list);
  }, []);

  // Apply filters
  useEffect(() => {
    let result = pokemonList;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.id.toString().includes(query)
      );
    }

    // Region filter
    if (selectedRegion) {
      const region = RegionHelper.regions.find((r) => r.name === selectedRegion);
      if (region) {
        result = result.filter((p) => p.id >= region.startId && p.id <= region.endId);
      }
    }

    setFilteredList(result);
  }, [searchQuery, selectedRegion, pokemonList]);

  const handlePokemonClick = (pokemon: PokemonEntry) => {
    const slug = pokemon.name.toLowerCase().replace(/ /g, '-');
    window.open(`https://www.dittobase.com/pokemon-go/pokedex/${slug}`, '_blank');
  };

  const getPokemonImage = (pokemon: PokemonEntry) => {
    return getUltimateGalleryUrl(pokemon.name) || getPokeApiUrl(pokemon.id);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#1a1a2e', overflow: 'hidden' }}>
      <Header title="All Pokémon" />

      {/* Search Bar */}
      <div style={{ padding: '8px 16px', backgroundColor: 'rgba(26,26,46,0.95)', borderBottom: '1px solid rgba(128,128,128,0.2)' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Name or ID"
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
              paddingRight: '40px',
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

      {/* Region Filter */}
      <div style={{ padding: '8px 16px', display: 'flex', gap: '8px', backgroundColor: 'rgba(26,26,46,0.95)', borderBottom: '1px solid rgba(128,128,128,0.2)', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowRegionDropdown(!showRegionDropdown)}
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
            {selectedRegion
              ? RegionHelper.getRegionDisplayNameByName(selectedRegion)
              : 'Filter by Region'}
          </button>

          {showRegionDropdown && (
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
                width: '192px',
                maxHeight: '240px',
                overflowY: 'auto',
              }}
            >
              {RegionHelper.regions.map((region) => (
                <button
                  key={region.name}
                  onClick={() => {
                    setSelectedRegion(region.name);
                    setShowRegionDropdown(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 12px',
                    backgroundColor: selectedRegion === region.name ? '#7627C5' : 'transparent',
                    color: '#ffffff',
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
                    setSelectedRegion(null);
                    setShowRegionDropdown(false);
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

        <span style={{ color: '#888888', fontSize: '14px', marginLeft: 'auto' }}>
          {filteredList.length} / {pokemonList.length}
        </span>
      </div>

      {/* Grid - Responsive */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
        {filteredList.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888888' }}>
            <p style={{ fontSize: '18px' }}>No Pokémon found</p>
            <p style={{ fontSize: '14px', marginTop: '4px' }}>Try adjusting your filters</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
              gap: '12px',
            }}
          >
            {filteredList.map((pokemon) => (
              <div
                key={pokemon.id}
                onClick={() => handlePokemonClick(pokemon)}
                style={{
                  backgroundColor: '#2a2a3e',
                  borderRadius: '12px',
                  padding: '8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s, transform 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = '#33334a';
                  (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = '#2a2a3e';
                  (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
                }}
              >
                <img
                  src={getPokemonImage(pokemon)}
                  alt={pokemon.name}
                  style={{
                    width: '100%',
                    aspectRatio: '1/1',
                    objectFit: 'contain',
                    marginBottom: '4px',
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getPokeApiUrl(pokemon.id);
                  }}
                />
                <p style={{ color: '#ffffff', fontSize: '10px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {pokemon.name}
                </p>
                <p style={{ color: '#555555', fontSize: '9px' }}>#{String(pokemon.id).padStart(3, '0')}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}