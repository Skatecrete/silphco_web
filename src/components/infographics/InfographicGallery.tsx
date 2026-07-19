import { useState, useEffect } from 'react';

interface InfographicItem {
  name: string;
  url: string;
}

export function InfographicGallery() {
  const [infographics, setInfographics] = useState<InfographicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    loadInfographics();
  }, []);

  const loadInfographics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://api.github.com/repos/Skatecrete/infographics/contents/images');
      if (!response.ok) throw new Error('Failed to fetch infographics');
      const data = await response.json();
      const items = data
        .filter((item: any) => item.name !== 'placeholder.png')
        .map((item: any) => ({
          name: item.name,
          url: item.download_url,
        }));
      setInfographics(items);
    } catch (err) {
      setError('Failed to load infographics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openFullscreen = (url: string) => {
    setSelectedImage(url);
  };

  const closeFullscreen = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid #333', borderTopColor: '#7627C5', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <p style={{ color: '#F44336', fontSize: '16px', textAlign: 'center' }}>{error}</p>
        <button
          onClick={loadInfographics}
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
    );
  }

  if (infographics.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888888' }}>
        <p style={{ fontSize: '16px' }}>No infographics available</p>
      </div>
    );
  }

  return (
    <>
      {/* Gallery Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
        }}
      >
        {infographics.map((item) => (
          <div
            key={item.name}
            onClick={() => openFullscreen(item.url)}
            style={{
              backgroundColor: '#2a2a3e',
              borderRadius: '12px',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.02)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'; }}
          >
            <img
              src={item.url}
              alt={item.name}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%237627C5"/%3E%3Ctext x="50" y="55" text-anchor="middle" fill="white" font-size="14"%3E📸%3C/text%3E%3C/svg%3E';
              }}
            />
            <p style={{ color: '#888888', fontSize: '12px', padding: '8px', textAlign: 'center' }}>
              {item.name}
            </p>
          </div>
        ))}
      </div>

      {/* Fullscreen Viewer */}
      {selectedImage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={closeFullscreen}
        >
          <button
            onClick={closeFullscreen}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '48px',
              height: '48px',
              backgroundColor: '#F44336',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50%',
              fontSize: '24px',
              fontWeight: 700,
              cursor: 'pointer',
              zIndex: 101,
            }}
          >
            ✕
          </button>
          <img
            src={selectedImage}
            alt="Fullscreen"
            style={{
              maxWidth: '100%',
              maxHeight: '90vh',
              objectFit: 'contain',
            }}
          />
        </div>
      )}
    </>
  );
}