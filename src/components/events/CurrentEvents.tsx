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
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <p className="text-lg">No current events</p>
        <p className="text-sm mt-1">Check back later</p>
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
    <div className="space-y-4">
      {startingToday.length > 0 && (
        <div>
          <p className="text-white font-bold text-sm mb-2">🎯 EVENTS STARTING TODAY 🎯</p>
          {startingToday.map((event, index) => (
            <EventCard key={`${event.name}-${index}`} event={event} />
          ))}
        </div>
      )}

      {ongoing.length > 0 && (
        <div>
          <p className="text-white font-bold text-sm mb-2">🔄 ON-GOING EVENTS 🔄</p>
          {ongoing.map((event, index) => (
            <EventCard key={`${event.name}-${index}`} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}