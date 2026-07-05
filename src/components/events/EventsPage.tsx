import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { fetchEvents, fetchDebuts, LeekDuckEvent, DebutData } from '@/services/leekDuckApi';
import { CurrentEvents } from './CurrentEvents';
import { UpcomingEvents } from './UpcomingEvents';
import { DebutBanner } from './DebutBanner';
import { Header } from '@/components/common/Header';
import { getUltimateGalleryUrl } from '@/services/imageUrlBuilder';

export function EventsPage() {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const [currentTab, setCurrentTab] = useState<'current' | 'upcoming'>('current');
  const [events, setEvents] = useState<LeekDuckEvent[]>([]);
  const [debuts, setDebuts] = useState<DebutData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDebut, setActiveDebut] = useState<DebutData | null>(null);

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
          setDebuts(debutsData.debuts);
          // Find the most recent/current debut
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

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-dark-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
        <p className="text-gray-400 mt-4">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-dark-bg">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-dark-bg">
      <Header title="Events" cartCount={totalItems} />

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {/* Debut Banner */}
        <DebutBanner
          debut={activeDebut}
          onViewDebuts={() => {
            // Show debut details in modal
          }}
          onViewEvent={() => {
            // Open event link
          }}
        />

        {/* Tabs */}
        <div className="flex rounded-xl overflow-hidden bg-dark-card p-1 mb-4">
          <button
            onClick={() => setCurrentTab('current')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${
              currentTab === 'current'
                ? 'bg-purple-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📅 Current
          </button>
          <button
            onClick={() => setCurrentTab('upcoming')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${
              currentTab === 'upcoming'
                ? 'bg-purple-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📅 Upcoming
          </button>
        </div>

        {/* Content */}
        {currentTab === 'current' ? (
          <CurrentEvents events={events} />
        ) : (
          <UpcomingEvents events={events} onRSVPClick={(event) => {
            // Open RSVP dialog
          }} />
        )}

        {/* Attribution */}
        <p className="text-gray-600 text-xs text-center mt-4">
          Event data provided by LeekDuck.com
        </p>
      </div>
    </div>
  );
}