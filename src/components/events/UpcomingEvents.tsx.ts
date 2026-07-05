import { useEffect, useState } from 'react';
import { LeekDuckEvent } from '@/services/leekDuckApi';
import { EventCard } from './EventCard';

interface UpcomingEventsProps {
  events: LeekDuckEvent[];
  onRSVPClick: (event: LeekDuckEvent) => void;
}

export function UpcomingEvents({ events, onRSVPClick }: UpcomingEventsProps) {
  const [next7Days, setNext7Days] = useState<LeekDuckEvent[]>([]);
  const [thisMonth, setThisMonth] = useState<LeekDuckEvent[]>([]);
  const [future, setFuture] = useState<LeekDuckEvent[]>([]);

  useEffect(() => {
    const now = new Date();
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const upcoming = events.filter((event) => {
      const start = new Date(event.start);
      return start > now;
    });

    const sevenDays: LeekDuckEvent[] = [];
    const month: LeekDuckEvent[] = [];
    const later: LeekDuckEvent[] = [];

    for (const event of upcoming) {
      const start = new Date(event.start);
      if (start < nextWeek) {
        sevenDays.push(event);
      } else if (start < nextMonth) {
        month.push(event);
      } else {
        const daysUntil = Math.floor((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntil <= 45 || event.name.toLowerCase().includes('go fest')) {
          later.push(event);
        }
      }
    }

    sevenDays.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    month.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    later.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    setNext7Days(sevenDays);
    setThisMonth(month);
    setFuture(later);
  }, [events]);

  const hasEvents = next7Days.length > 0 || thisMonth.length > 0 || future.length > 0;

  if (!hasEvents) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <p className="text-lg">No upcoming events</p>
        <p className="text-sm mt-1">Check back later</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {next7Days.length > 0 && (
        <div>
          <p className="text-white font-bold text-sm mb-2">⏰ IN THE NEXT 7 DAYS ⏰</p>
          {next7Days.map((event, index) => (
            <EventCard
              key={`${event.name}-${index}`}
              event={event}
              showRSVP={true}
              onRSVP={() => onRSVPClick(event)}
            />
          ))}
        </div>
      )}

      {thisMonth.length > 0 && (
        <div>
          <p className="text-white font-bold text-sm mb-2">⏳ THIS MONTH ⏳</p>
          {thisMonth.map((event, index) => (
            <EventCard
              key={`${event.name}-${index}`}
              event={event}
              showRSVP={true}
              onRSVP={() => onRSVPClick(event)}
            />
          ))}
        </div>
      )}

      {future.length > 0 && (
        <div>
          <p className="text-white font-bold text-sm mb-2">🚀 FUTURE 🚀</p>
          {future.map((event, index) => (
            <EventCard
              key={`${event.name}-${index}`}
              event={event}
              showRSVP={true}
              onRSVP={() => onRSVPClick(event)}
            />
          ))}
        </div>
      )}
    </div>
  );
}