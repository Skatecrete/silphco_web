import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { useServices } from '@/hooks/useServices';
import { getAdditionalServices } from '@/services/sheetsApi';
import { Header } from '@/components/common/Header';
import { Service } from '@/hooks/useServices';

export function ServicesPage() {
  const { addItem, totalItems } = useCart();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadServices() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAdditionalServices();
        setServices(data);
      } catch (err) {
        setError('Failed to load services');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  const getServiceImageSlug = (serviceName: string): string => {
    const mapping: Record<string, string> = {
      'Go Fest': 'go_fest',
      'Go Fest Global': 'go_fest',
      'Go Tour': 'go_tour',
      'City-Specific Ticketed Event': 'ticketed_events',
      'Spotlight Hour': 'spotlight_hour',
      'Community Day': 'community_day',
      'Rocket Task': 'rocket',
      'Limited Time Mon': 'limited_time',
      'Half-Priced Store Purchase': 'store_purchase',
      'Stardust': 'stardust',
      'Egg Hatching per km': 'egg_hatching',
      'Candy': 'candy',
    };
    return mapping[serviceName] || serviceName.toLowerCase().replace(/ /g, '_').replace(/[^a-z0-9_]/g, '');
  };

  const handleAddService = (service: Service) => {
    addItem({
      id: `service-${Date.now()}`,
      type: 'service',
      pokemonName: service.serviceName,
      quantity: 1,
      price: service.price,
      serviceName: service.serviceName,
    });
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#1a1a2e' }}>
        <Header title="Additional Services" cartCount={totalItems} />
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
        <Header title="Additional Services" cartCount={totalItems} />
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
      <Header title="Additional Services" cartCount={totalItems} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
        <p style={{ color: '#FFA500', fontSize: '12px', textAlign: 'center', marginBottom: '16px' }}>
          *Pricing may vary depending on the event.
        </p>

        {services.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888888' }}>
            <p style={{ fontSize: '18px' }}>No services available</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
            }}
          >
            {services.map((service, index) => (
              <div
                key={index}
                onClick={() => handleAddService(service)}
                style={{
                  backgroundColor: '#2a2a3e',
                  borderRadius: '12px',
                  padding: '12px',
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
                  src={`https://raw.githubusercontent.com/Skatecrete/infographics/main/services_pics/${getServiceImageSlug(service.serviceName)}.png`}
                  alt={service.serviceName}
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'contain',
                    margin: '0 auto 8px',
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%237627C5"/%3E%3Ctext x="50" y="55" text-anchor="middle" fill="white" font-size="14"%3E😎%3C/text%3E%3C/svg%3E';
                  }}
                />
                <p style={{ color: '#ffffff', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                  {service.serviceName}
                </p>
                <p style={{ color: '#4CAF50', fontSize: '12px', fontWeight: 700 }}>
                  ${service.price.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}

        <p style={{ color: '#FFA500', fontSize: '12px', textAlign: 'center', marginTop: '16px' }}>
          *Pricing may vary depending on the event.
        </p>
      </div>
    </div>
  );
}