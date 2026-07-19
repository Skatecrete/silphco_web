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

interface OrderDetailDialogProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
}

export function OrderDetailDialog({ isOpen, order, onClose }: OrderDetailDialogProps) {
  if (!isOpen || !order) return null;

  const statusColor = order.status === 'Paid' || order.status === 'Completed' 
    ? '#4CAF50' 
    : '#FFA500';

  return (
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
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#2a2a3e',
          borderRadius: '16px',
          padding: '24px',
          width: '100%',
          maxWidth: '400px',
          maxHeight: '85vh',
          overflowY: 'auto',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: 700 }}>📦 Order Details</h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#888888',
              fontSize: '24px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ backgroundColor: '#1a1a2e', borderRadius: '12px', padding: '12px', marginBottom: '16px' }}>
          <p style={{ color: '#FFA500', fontWeight: 700, fontSize: '14px' }}>{order.orderId}</p>
          <p style={{ color: '#ffffff', fontSize: '14px' }}>Customer: {order.customer}</p>
          <p style={{ color: '#888888', fontSize: '14px' }}>Date: {order.date}</p>
          <p style={{ color: '#888888', fontSize: '14px' }}>Payment: {order.paymentMethod || 'N/A'}</p>
          <p style={{ color: statusColor, fontSize: '14px', fontWeight: 700 }}>Status: {order.status}</p>
          {order.assignedAdmin && (
            <p style={{ color: '#888888', fontSize: '14px' }}>Admin: {order.assignedAdmin}</p>
          )}
        </div>

        <div style={{ backgroundColor: '#1a1a2e', borderRadius: '12px', padding: '12px', marginBottom: '16px' }}>
          <p style={{ color: '#ffffff', fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>📋 Items</p>
          {order.items.length === 0 ? (
            <p style={{ color: '#888888', fontSize: '14px' }}>No items</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {order.items.map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#cccccc' }}>
                    {item.huntType === 'Coins' 
                      ? `${item.coins} Coins x${item.quantity}`
                      : `${item.huntType}: ${item.pokemon} x${item.quantity}`
                    }
                  </span>
                  <span style={{ color: '#4CAF50' }}>${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #444', paddingTop: '12px', marginBottom: '16px' }}>
          <span style={{ color: '#ffffff', fontWeight: 700 }}>Total:</span>
          <span style={{ color: '#4CAF50', fontWeight: 700, fontSize: '18px' }}>${order.total.toFixed(2)}</span>
        </div>

        {order.otherRequests && (
          <div style={{ backgroundColor: '#1a1a2e', borderRadius: '12px', padding: '12px', marginBottom: '16px' }}>
            <p style={{ color: '#FFA500', fontSize: '14px', fontWeight: 700 }}>📝 Notes</p>
            <p style={{ color: '#cccccc', fontSize: '14px' }}>{order.otherRequests}</p>
          </div>
        )}

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#2196F3',
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
  );
}