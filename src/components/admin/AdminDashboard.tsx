import { useState, useEffect } from 'react';
import { Header } from '@/components/common/Header';
import { getAllOrders, getAllRSVPs, updateOrderStatus, updateRSVPStatus } from '@/services/sheetsApi';

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
  status: string;
}

interface AdminDashboardProps {
  adminName: string;
  onLogout: () => void;
}

export function AdminDashboard({ adminName, onLogout }: AdminDashboardProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [rsvps, setRSVPs] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'rsvps'>('orders');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersData, rsvpsData] = await Promise.all([
        getAllOrders(),
        getAllRSVPs(),
      ]);

      // Filter for this admin
      const filteredOrders = (ordersData || []).filter(
        (order) => order.assignedAdmin === adminName
      );
      const filteredRSVPs = (rsvpsData || []).filter(
        (rsvp) => rsvp.assignedAdmin === adminName
      );

      setOrders(filteredOrders);
      setRSVPs(filteredRSVPs);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPaid = async (orderId: string) => {
    const success = await updateOrderStatus(orderId, 'Paid');
    if (success) {
      loadData();
    }
  };

  const handleConfirmRSVP = async (rsvpId: number) => {
    const success = await updateRSVPStatus(rsvpId, 'Confirmed');
    if (success) {
      loadData();
    }
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#1a1a2e' }}>
        <Header title="Admin Dashboard" showCart={false} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #333', borderTopColor: '#7627C5', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  const pendingOrders = orders.filter((o) => o.status === 'Pending');
  const pendingRSVPs = rsvps.filter((r) => r.status === 'Pending');

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#1a1a2e', overflow: 'hidden' }}>
      <Header title={`Admin: ${adminName}`} showCart={false} />

      <div style={{ padding: '12px 16px', display: 'flex', gap: '8px', borderBottom: '1px solid #333', flexShrink: 0 }}>
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            flex: 1,
            padding: '8px',
            backgroundColor: activeTab === 'orders' ? '#7627C5' : 'transparent',
            color: activeTab === 'orders' ? '#ffffff' : '#888888',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          📦 Orders ({pendingOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('rsvps')}
          style={{
            flex: 1,
            padding: '8px',
            backgroundColor: activeTab === 'rsvps' ? '#7627C5' : 'transparent',
            color: activeTab === 'rsvps' ? '#ffffff' : '#888888',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          📅 RSVPs ({pendingRSVPs.length})
        </button>
        <button
          onClick={onLogout}
          style={{
            padding: '8px 16px',
            backgroundColor: '#F44336',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
        {activeTab === 'orders' ? (
          orders.length === 0 ? (
            <p style={{ color: '#888888', textAlign: 'center', padding: '32px 0' }}>No orders assigned to you</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {orders.map((order) => (
                <div
                  key={order.orderId}
                  style={{
                    backgroundColor: order.status === 'Pending' ? '#2a1a3e' : '#1a2a1a',
                    borderRadius: '12px',
                    padding: '12px',
                    border: order.status === 'Pending' ? '1px solid #3a2a4e' : '1px solid #2a3a2a',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: '#FFA500', fontWeight: 700, fontSize: '14px' }}>{order.orderId}</p>
                      <p style={{ color: '#ffffff', fontSize: '14px' }}>{order.customer}</p>
                      <p style={{ color: '#888888', fontSize: '12px' }}>
                        {order.items.slice(0, 2).map((item) => {
                          if (item.huntType === 'Coins') return `${item.coins} Coins`;
                          return `${item.huntType}: ${item.pokemon}`;
                        }).join(', ')}
                        {order.items.length > 2 && ` +${order.items.length - 2} more`}
                      </p>
                      <p style={{ color: '#4CAF50', fontWeight: 700, fontSize: '14px' }}>${order.total.toFixed(2)}</p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '8px' }}>
                      <p style={{ color: order.status === 'Pending' ? '#FFA500' : '#4CAF50', fontSize: '12px', fontWeight: 700 }}>
                        {order.status}
                      </p>
                      {order.status === 'Pending' && (
                        <button
                          onClick={() => handleMarkPaid(order.orderId)}
                          style={{
                            marginTop: '8px',
                            padding: '4px 12px',
                            backgroundColor: '#4CAF50',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          rsvps.length === 0 ? (
            <p style={{ color: '#888888', textAlign: 'center', padding: '32px 0' }}>No RSVPs assigned to you</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {rsvps.map((rsvp) => (
                <div
                  key={rsvp.id}
                  style={{
                    backgroundColor: rsvp.status === 'Pending' ? '#2a1a3e' : '#1a2a1a',
                    borderRadius: '12px',
                    padding: '12px',
                    border: rsvp.status === 'Pending' ? '1px solid #3a2a4e' : '1px solid #2a3a2a',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ color: '#2196F3', fontWeight: 700, fontSize: '14px' }}>{rsvp.eventName}</p>
                      <p style={{ color: '#ffffff', fontSize: '14px' }}>{rsvp.customer}</p>
                      <p style={{ color: '#888888', fontSize: '12px' }}>📅 {rsvp.eventDate}</p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '8px' }}>
                      <p style={{ color: rsvp.status === 'Pending' ? '#FFA500' : '#4CAF50', fontSize: '12px', fontWeight: 700 }}>
                        {rsvp.status}
                      </p>
                      {rsvp.status === 'Pending' && (
                        <button
                          onClick={() => handleConfirmRSVP(rsvp.id)}
                          style={{
                            marginTop: '8px',
                            padding: '4px 12px',
                            backgroundColor: '#4CAF50',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Confirm
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}