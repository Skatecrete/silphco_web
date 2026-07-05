import { motion, AnimatePresence } from 'framer-motion';

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
    ? 'text-green-400' 
    : 'text-orange-400';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70" onClick={onClose} />

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="relative bg-dark-card rounded-2xl w-full max-w-sm p-6 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-xl font-bold">📦 Order Details</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">
                ✕
              </button>
            </div>

            <div className="bg-dark-bg rounded-xl p-3 mb-4">
              <p className="text-orange-400 font-bold text-sm">{order.orderId}</p>
              <p className="text-white text-sm">Customer: {order.customer}</p>
              <p className="text-gray-400 text-sm">Date: {order.date}</p>
              <p className="text-gray-400 text-sm">Payment: {order.paymentMethod || 'N/A'}</p>
              <p className={`text-sm font-bold ${statusColor}`}>Status: {order.status}</p>
              {order.assignedAdmin && (
                <p className="text-gray-400 text-sm">Admin: {order.assignedAdmin}</p>
              )}
            </div>

            <div className="bg-dark-bg rounded-xl p-3 mb-4">
              <p className="text-white font-bold text-sm mb-2">📋 Items</p>
              {order.items.length === 0 ? (
                <p className="text-gray-400 text-sm">No items</p>
              ) : (
                <div className="space-y-1">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-300">
                        {item.huntType === 'Coins' 
                          ? `${item.coins} Coins x${item.quantity}`
                          : `${item.huntType}: ${item.pokemon} x${item.quantity}`
                        }
                      </span>
                      <span className="text-green-400">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center border-t border-gray-700 pt-3 mb-4">
              <span className="text-white font-bold">Total:</span>
              <span className="text-green-400 font-bold text-lg">${order.total.toFixed(2)}</span>
            </div>

            {order.otherRequests && (
              <div className="bg-dark-bg rounded-xl p-3 mb-4">
                <p className="text-orange-400 text-sm font-bold">📝 Notes</p>
                <p className="text-gray-300 text-sm">{order.otherRequests}</p>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}