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
    ? '#4CAF50' 
    : '#FFA500';

  const handleEventClick = (e: React.MouseEvent) => {
    if (rsvp.eventLink) {
      e.stopPropagation();
      window.open(rsvp.eventLink, '_blank');
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#2a2a3e',
        borderRadius: '12px',
        padding: '12px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              color: rsvp.eventLink ? '#2196F3' : '#ffffff',
              fontSize: '14px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              cursor: rsvp.eventLink ? 'pointer' : 'default',
            }}
            onClick={handleEventClick}
          >
            {rsvp.eventName}
          </p>
          <p style={{ color: '#888888', fontSize: '12px' }}>{rsvp.customer}</p>
          <p style={{ color: '#555555', fontSize: '10px' }}>📅 {rsvp.eventDate}</p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '8px' }}>
          <p style={{ color: statusColor, fontSize: '12px', fontWeight: 700 }}>{rsvp.status}</p>
          <p style={{ color: '#555555', fontSize: '10px' }}>RSVP'd: {rsvp.date.split(' ')[0]}</p>
        </div>
      </div>
    </div>
  );
}