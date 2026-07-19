interface Order {
  orderId: string;
  date: string;
  customer: string;
  items: any[];
  total: number;
  status: string;
  paymentMethod?: string;
  otherRequests?: string;
  assignedAdmin?: string;
}

interface OrderHistoryItemProps {
  order: Order;
  onClick: () => void;
}

export function OrderHistoryItem({ order, onClick }: OrderHistoryItemProps) {
  const statusColor = order.status === 'Paid' || order.status === 'Completed' 
    ? '#4CAF50' 
    : '#FFA500';

  const itemSummary = order.items.slice(0, 2).map((item) => {
    if (item.huntType === 'Coins') return `${item.coins} Coins`;
    if (item.huntType === 'Raid') return `${item.pokemon} (${item.raidType})`;
    return `${item.huntType}: ${item.pokemon}`;
  }).join(', ');

  const moreItems = order.items.length > 2 ? ` +${order.items.length - 2} more` : '';

  return (
    <div
      style={{
        backgroundColor: '#2a2a3e',
        borderRadius: '12px',
        padding: '12px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = '#33334a'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = '#2a2a3e'; }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#FFA500', fontWeight: 700, fontSize: '12px' }}>{order.orderId}</span>
            <span style={{ color: statusColor, fontSize: '12px', fontWeight: 700 }}>{order.status}</span>
          </div>
          <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {order.customer}
          </p>
          <p style={{ color: '#888888', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {itemSummary}{moreItems}
          </p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '8px' }}>
          <p style={{ color: '#4CAF50', fontWeight: 700, fontSize: '14px' }}>${order.total.toFixed(2)}</p>
          <p style={{ color: '#555555', fontSize: '10px' }}>{order.date.split(' ')[0]}</p>
        </div>
      </div>
    </div>
  );
}