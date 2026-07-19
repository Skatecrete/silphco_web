import { useEffect, useState } from 'react';
import { LeekDuckEvent } from '@/services/leekDuckApi';
import { EventCard } from './EventCard';

interface CurrentEventsProps {
  events: LeekDuckEvent[];
}

export function CurrentEvents({ events }: CurrentEventsProps) {
  const [currentEvents, setCurrentEvents] = useState<LeekDuckEvent[]>([]);

  useEffect(() => {
    const now = new Date();
    const filtered = events.filter((event) => {
      const start = new Date(event.start);
      const end = new Date(event.end);
      return start <= now && end >= now;
    });
    setCurrentEvents(filtered);
  }, [events]);

  if (currentEvents.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 0', color: '#888888' }}>
        <p style={{ fontSize: '18px' }}>No current events</p>
        <p style={{ fontSize: '14px', marginTop: '4px' }}>Check back later</p>
      </div>
    );
  }

  const today = new Date();
  const startingToday = currentEvents.filter((e) => {
    const start = new Date(e.start);
    return start.toDateString() === today.toDateString();
  });
  const ongoing = currentEvents.filter((e) => {
    const start = new Date(e.start);
    return start.toDateString() !== today.toDateString();
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {startingToday.length > 0 && (
        <div>
          <p style={{ color: '#ffffff', fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>🎯 EVENTS STARTING TODAY 🎯</p>
          {startingToday.map((event, index) => (
            <EventCard key={`${event.name}-${index}`} event={event} />
          ))}
        </div>
      )}

      {ongoing.length > 0 && (
        <div>
          <p style={{ color: '#ffffff', fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>🔄 ON-GOING EVENTS 🔄</p>
          {ongoing.map((event, index) => (
            <EventCard key={`${event.name}-${index}`} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}