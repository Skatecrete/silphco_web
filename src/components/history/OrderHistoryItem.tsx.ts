import { motion } from 'framer-motion';

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
    ? 'text-green-400' 
    : 'text-orange-400';

  const itemSummary = order.items.slice(0, 2).map((item) => {
    if (item.huntType === 'Coins') return `${item.coins} Coins`;
    if (item.huntType === 'Raid') return `${item.pokemon} (${item.raidType})`;
    return `${item.huntType}: ${item.pokemon}`;
  }).join(', ');

  const moreItems = order.items.length > 2 ? ` +${order.items.length - 2} more` : '';

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-dark-card rounded-xl p-3 cursor-pointer hover:bg-[#33334a] transition-colors"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-orange-400 font-bold text-xs">{order.orderId}</span>
            <span className={`text-xs font-bold ${statusColor}`}>{order.status}</span>
          </div>
          <p className="text-white text-sm font-bold truncate">{order.customer}</p>
          <p className="text-gray-400 text-xs truncate">
            {itemSummary}{moreItems}
          </p>
        </div>
        <div className="text-right flex-shrink-0 ml-2">
          <p className="text-green-400 font-bold text-sm">${order.total.toFixed(2)}</p>
          <p className="text-gray-500 text-[10px]">{order.date.split(' ')[0]}</p>
        </div>
      </div>
    </motion.div>
  );
}