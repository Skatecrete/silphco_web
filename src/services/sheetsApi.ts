const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx6i6Yn7ezXqwJKgZF3Mbq_MbgNeb4mQ8weT0Qipu0c9ASFRVK6l-HIdH83xFbJOeI4/exec';

export interface PricingResponse {
  status: string;
  prices: Record<string, number>;
}

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

export async function fetchPricing(): Promise<Record<string, number>> {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'getPricing' }),
    });
    const data = await response.json();
    if (data.status === 'success' && data.prices) {
      return data.prices;
    }
    return {};
  } catch (e) {
    console.error('Error fetching pricing:', e);
    return {};
  }
}

export async function getAdditionalServices(): Promise<any[]> {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'getAdditionalServices' }),
    });
    const data = await response.json();
    if (data.status === 'success' && data.services) {
      return data.services;
    }
    return [];
  } catch (e) {
    console.error('Error fetching services:', e);
    return [];
  }
}

export async function submitOrder(orderData: any): Promise<any> {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    return await response.json();
  } catch (e) {
    console.error('Error submitting order:', e);
    return { status: 'error', message: 'Network error' };
  }
}

export async function getDexProgress(customerDisplay: string, listType: string): Promise<any[]> {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'getDexProgress',
        customerDisplay,
        listType,
      }),
    });
    const data = await response.json();
    if (data.status === 'success' && data.dex) {
      return data.dex;
    }
    return [];
  } catch (e) {
    console.error('Error fetching dex:', e);
    return [];
  }
}

export async function addDexPokemon(
  customerDisplay: string,
  pokemonId: number,
  pokemonName: string,
  listType: string
): Promise<boolean> {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'addDexPokemon',
        customerDisplay,
        pokemonId,
        pokemonName,
        listType,
      }),
    });
    const data = await response.json();
    return data.status === 'success';
  } catch (e) {
    console.error('Error adding dex pokemon:', e);
    return false;
  }
}

export async function removeDexPokemon(
  customerDisplay: string,
  pokemonId: number,
  listType: string
): Promise<boolean> {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'removeDexPokemon',
        customerDisplay,
        pokemonId,
        listType,
      }),
    });
    const data = await response.json();
    return data.status === 'success';
  } catch (e) {
    console.error('Error removing dex pokemon:', e);
    return false;
  }
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