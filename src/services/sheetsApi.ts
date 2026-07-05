// Add these functions to the existing file

export interface OrderItem {
  huntType: string;
  raidType: string;
  pokemon: string;
  quantity: string;
  coins: string;
  price: number;
}

export interface OrderDetail {
  orderId: string;
  date: string;
  customer: string;
  paymentMethod: string;
  otherRequests: string;
  total: number;
  status: string;
  assignedAdmin: string;
  items: OrderItem[];
}

export interface RSVPDetail {
  id: number;
  date: string;
  customer: string;
  eventName: string;
  eventDate: string;
  eventLink?: string;
  status: string;
  assignedAdmin?: string;
}

export async function getCustomerOrders(customerName: string, ingameName: string): Promise<OrderDetail[]> {
  try {
    const fullName = `${customerName} (${ingameName})`;
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'getCustomerOrders',
        customerName: fullName,
      }),
    });
    const data = await response.json();
    if (data.status === 'success' && data.orders) {
      return data.orders;
    }
    return [];
  } catch (e) {
    console.error('Error fetching customer orders:', e);
    return [];
  }
}

export async function getCustomerRSVPs(customerName: string, ingameName: string): Promise<RSVPDetail[]> {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'getCustomerRSVPs',
        customerName,
        ingameName,
      }),
    });
    const data = await response.json();
    if (data.status === 'success' && data.rsvps) {
      return data.rsvps;
    }
    return [];
  } catch (e) {
    console.error('Error fetching customer RSVPs:', e);
    return [];
  }
}