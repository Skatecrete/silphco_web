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
      <div className="h-screen flex flex-col items-center justify-center bg-dark-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
        <p className="text-gray-400 mt-4">Loading your history...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-dark-bg">
      <Header title="Order History" cartCount={totalItems} />

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {!isLoggedIn ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p className="text-lg">Please log in to view your history</p>
            <button
              onClick={() => navigate('/app/login')}
              className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <>
            <div className="bg-dark-card rounded-xl p-4 mb-4">
              <p className="text-white font-bold">📦 My Orders & RSVPs</p>
              <p className="text-gray-400 text-sm mt-1">{userDisplay}</p>
              <p className="text-orange-500 text-xs mt-2">
                ⚠️ Recent Orders/RSVPs may take up to 30 minutes to populate.
              </p>
            </div>

            <div className="mb-4">
              <p className="text-white font-bold text-sm mb-2">📦 My Orders ({orders.length})</p>
              {orders.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">No orders found</p>
              ) : (
                <div className="space-y-2">
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
              <p className="text-white font-bold text-sm mb-2">📅 My RSVPs ({rsvps.length})</p>
              {rsvps.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">No RSVPs found</p>
              ) : (
                <div className="space-y-2">
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