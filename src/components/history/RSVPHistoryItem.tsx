import { motion } from 'framer-motion';

interface RSVP {
  id: number;
  date: string;
  customer: string;
  eventName: string;
  eventDate: string;
  eventLink?: string;
  status: string;
  assignedAdmin?: string;
}

interface RSVPHistoryItemProps {
  rsvp: RSVP;
}

export function RSVPHistoryItem({ rsvp }: RSVPHistoryItemProps) {
  const statusColor = rsvp.status === 'Confirmed' 
    ? 'text-green-400' 
    : 'text-orange-400';

  const handleEventClick = (e: React.MouseEvent) => {
    if (rsvp.eventLink) {
      e.stopPropagation();
      window.open(rsvp.eventLink, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-dark-card rounded-xl p-3"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <p 
            className={`text-sm font-bold truncate ${rsvp.eventLink ? 'text-blue-400 cursor-pointer hover:underline' : 'text-white'}`}
            onClick={handleEventClick}
          >
            {rsvp.eventName}
          </p>
          <p className="text-gray-400 text-xs">{rsvp.customer}</p>
          <p className="text-gray-500 text-[10px]">📅 {rsvp.eventDate}</p>
        </div>
        <div className="text-right flex-shrink-0 ml-2">
          <p className={`text-xs font-bold ${statusColor}`}>{rsvp.status}</p>
          <p className="text-gray-500 text-[10px]">RSVP'd: {rsvp.date.split(' ')[0]}</p>
        </div>
      </div>
    </motion.div>
  );
}