import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { fetchEvents, fetchDebuts, LeekDuckEvent, DebutData } from '@/services/leekDuckApi';
import { CurrentEvents } from './CurrentEvents';
import { UpcomingEvents } from './UpcomingEvents';
import { DebutBanner } from './DebutBanner';
import { Header } from '@/components/common/Header';

export function EventsPage() {
  const { totalItems } = useCart();
  const [currentTab, setCurrentTab] = useState<'current' | 'upcoming'>('current');
  const [events, setEvents] = useState<LeekDuckEvent[]>([]);
  const [activeDebut, setActiveDebut] = useState<DebutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRSVP, setShowRSVP] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<LeekDuckEvent | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        const [eventsData, debutsData] = await Promise.all([
          fetchEvents(),
          fetchDebuts(),
        ]);

        setEvents(eventsData);

        if (debutsData && debutsData.debuts.length > 0) {
          setActiveDebut(debutsData.debuts[0]);
        }
      } catch (err) {
        setError('Failed to load events');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleRSVPClick = (event: LeekDuckEvent) => {
    setSelectedEvent(event);
    setShowRSVP(true);
  };

  const handleViewDebuts = () => {
    // Show debut details in modal
    if (activeDebut) {
      alert(`Debut Pokémon:\n${activeDebut.new_pokemon.join(', ')}\n\nShiny Debuts:\n${activeDebut.new_shiny.join(', ')}`);
    }
  };

  const handleViewEvent = () => {
    if (activeDebut) {
      window.open('https://leekduck.com/events/', '_blank');
    }
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#1a1a2e' }}>
        <Header title="Events" cartCount={totalItems} />
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
        <Header title="Events" cartCount={totalItems} />
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
      <Header title="Events" cartCount={totalItems} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
        {/* Debut Banner */}
        <DebutBanner
          debut={activeDebut}
          onViewDebuts={handleViewDebuts}
          onViewEvent={handleViewEvent}
        />

        {/* Tabs */}
        <div style={{ display: 'flex', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#2a2a3e', padding: '4px', marginBottom: '16px' }}>
          <button
            onClick={() => setCurrentTab('current')}
            style={{
              flex: 1,
              padding: '8px',
              backgroundColor: currentTab === 'current' ? '#7627C5' : 'transparent',
              color: currentTab === 'current' ? '#ffffff' : '#888888',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background-color 0.2s, color 0.2s',
            }}
          >
            📅 Current
          </button>
          <button
            onClick={() => setCurrentTab('upcoming')}
            style={{
              flex: 1,
              padding: '8px',
              backgroundColor: currentTab === 'upcoming' ? '#7627C5' : 'transparent',
              color: currentTab === 'upcoming' ? '#ffffff' : '#888888',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background-color 0.2s, color 0.2s',
            }}
          >
            📅 Upcoming
          </button>
        </div>

        {currentTab === 'current' ? (
          <CurrentEvents events={events} />
        ) : (
          <UpcomingEvents events={events} onRSVPClick={handleRSVPClick} />
        )}

        <p style={{ color: '#444444', fontSize: '12px', textAlign: 'center', marginTop: '16px' }}>
          Event data provided by LeekDuck.com
        </p>
      </div>

      {/* RSVP Dialog */}
      {showRSVP && selectedEvent && (
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
          onClick={() => setShowRSVP(false)}
        >
          <div
            style={{
              backgroundColor: '#2a2a3e',
              borderRadius: '16px',
              padding: '24px',
              width: '100%',
              maxWidth: '400px',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: 700, marginBottom: '16px', textAlign: 'center' }}>
              RSVP for {selectedEvent.name}
            </h2>
            <p style={{ color: '#FFA500', fontSize: '14px', textAlign: 'center', marginBottom: '16px' }}>
              Feature coming soon!
            </p>
            <button
              onClick={() => setShowRSVP(false)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#7627C5',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}