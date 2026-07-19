import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { useCart } from '@/hooks/useCart';
import { getCustomerOrders, getCustomerRSVPs } from '@/services/sheetsApi';
import { OrderHistoryItem } from './OrderHistoryItem';
import { RSVPHistoryItem } from './RSVPHistoryItem';
import { OrderDetailDialog } from './OrderDetailDialog';
import { Header } from '@/components/common/Header';

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

export function HistoryPage() {
  const navigate = useNavigate();
  const { userDisplay, isLoggedIn, userName, userIgn } = useUser();
  const { totalItems } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [rsvps, setRSVPs] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  const loadHistory = async () => {
    if (!isLoggedIn || !userName || !userIgn) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const [ordersData, rsvpsData] = await Promise.all([
        getCustomerOrders(userName, userIgn),
        getCustomerRSVPs(userName, userIgn),
      ]);

      setOrders(ordersData || []);
      setRSVPs(rsvpsData || []);
    } catch (err) {
      console.error('Error loading history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [isLoggedIn, userName, userIgn]);

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#1a1a2e' }}>
        <Header title="Order History" cartCount={totalItems} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #333', borderTopColor: '#7627C5', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#1a1a2e', overflow: 'hidden' }}>
      <Header title="Order History" cartCount={totalItems} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
        {!isLoggedIn ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888888' }}>
            <p style={{ fontSize: '18px' }}>Please log in to view your history</p>
            <button
              onClick={() => navigate('/app/login')}
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
              Go to Login
            </button>
          </div>
        ) : (
          <>
            <div style={{ backgroundColor: '#2a2a3e', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              <p style={{ color: '#ffffff', fontWeight: 700 }}>📦 My Orders &amp; RSVPs</p>
              <p style={{ color: '#888888', fontSize: '14px', marginTop: '4px' }}>{userDisplay}</p>
              <p style={{ color: '#FFA500', fontSize: '12px', marginTop: '8px' }}>
                ⚠️ Recent Orders/RSVPs may take up to 30 minutes to populate.
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <p style={{ color: '#ffffff', fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>📦 My Orders ({orders.length})</p>
              {orders.length === 0 ? (
                <p style={{ color: '#888888', fontSize: '14px', textAlign: 'center', padding: '16px 0' }}>No orders found</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {orders.map((order) => (
                    <OrderHistoryItem
                      key={order.orderId}
                      order={order}
                      onClick={() => handleOrderClick(order)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <p style={{ color: '#ffffff', fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>📅 My RSVPs ({rsvps.length})</p>
              {rsvps.length === 0 ? (
                <p style={{ color: '#888888', fontSize: '14px', textAlign: 'center', padding: '16px 0' }}>No RSVPs found</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {rsvps.map((rsvp) => (
                    <RSVPHistoryItem key={rsvp.id} rsvp={rsvp} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <OrderDetailDialog
        isOpen={showOrderDetail}
        order={selectedOrder}
        onClose={() => {
          setShowOrderDetail(false);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
}