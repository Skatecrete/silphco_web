// ========== CORS PROXY ==========
const CORS_PROXY = 'https://corsproxy.io/?url=';

// ========== SCRIPT URLS ==========
// Main script (has doPost, getDexProgress for POST, etc.)
const MAIN_SCRIPT_ID = 'AKfycbx6i6Yn7ezXqwJKgZF3Mbq_MbgNeb4mQ8weT0Qipu0c9ASFRVK6l-HIdH83xFbJOeI4';
const MAIN_SCRIPT_URL = CORS_PROXY + 'https://script.google.com/macros/s/' + MAIN_SCRIPT_ID + '/exec';

// Export script (has doGet for GET requests)
const EXPORT_SCRIPT_ID = 'AKfycbwDM7VQdfNc8ADsJEL81Z1bW1JWjZ_-8LFJa3AaZFuQf0rO4ojc5OMJ97GKjTnNPbI9ng';
const EXPORT_SCRIPT_URL = CORS_PROXY + 'https://script.google.com/macros/s/' + EXPORT_SCRIPT_ID + '/exec';

// ========== TYPES ==========
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

// ========== PRICING ==========
export async function fetchPricing(): Promise<Record<string, number>> {
  try {
    const response = await fetch(MAIN_SCRIPT_URL, {
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

// ========== ADDITIONAL SERVICES ==========
export async function getAdditionalServices(): Promise<any[]> {
  try {
    const response = await fetch(MAIN_SCRIPT_URL, {
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

// ========== ORDERS ==========
export async function submitOrder(orderData: any): Promise<any> {
  try {
    const response = await fetch(MAIN_SCRIPT_URL, {
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

export async function getCustomerOrders(customerName: string, ingameName: string): Promise<OrderDetail[]> {
  try {
    const fullName = customerName + ' (' + ingameName + ')';
    const response = await fetch(MAIN_SCRIPT_URL, {
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

export async function getAllOrders(): Promise<OrderDetail[]> {
  try {
    const response = await fetch(MAIN_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'getAllOrders' }),
    });
    const data = await response.json();
    if (data.status === 'success' && data.orders) {
      return data.orders;
    }
    return [];
  } catch (e) {
    console.error('Error fetching all orders:', e);
    return [];
  }
}

export async function updateOrderStatus(orderId: string, newStatus: string): Promise<boolean> {
  try {
    const response = await fetch(MAIN_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'updateOrderStatus',
        orderId: orderId,
        status: newStatus,
      }),
    });
    const data = await response.json();
    return data.status === 'success';
  } catch (e) {
    console.error('Error updating order status:', e);
    return false;
  }
}

// ========== RSVPs ==========
export async function getCustomerRSVPs(customerName: string, ingameName: string): Promise<RSVPDetail[]> {
  try {
    const response = await fetch(MAIN_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'getCustomerRSVPs',
        customerName: customerName,
        ingameName: ingameName,
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

export async function getAllRSVPs(): Promise<RSVPDetail[]> {
  try {
    const response = await fetch(MAIN_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'getRSVPs' }),
    });
    const data = await response.json();
    if (data.status === 'success' && data.rsvps) {
      return data.rsvps;
    }
    return [];
  } catch (e) {
    console.error('Error fetching all RSVPs:', e);
    return [];
  }
}

export async function updateRSVPStatus(rsvpId: number, newStatus: string): Promise<boolean> {
  try {
    const response = await fetch(MAIN_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'updateRSVPStatus',
        rsvpId: rsvpId,
        status: newStatus,
      }),
    });
    const data = await response.json();
    return data.status === 'success';
  } catch (e) {
    console.error('Error updating RSVP status:', e);
    return false;
  }
}

// ========== DEX FUNCTIONS ==========

// ========== GET (USES EXPORT SCRIPT - GET WORKS HERE) ==========
export async function getDexProgress(customerDisplay: string, listType: string): Promise<any[]> {
  try {
    const baseUrl = 'https://script.google.com/macros/s/' + EXPORT_SCRIPT_ID + '/exec';
    const params = new URLSearchParams({
      type: 'getDexProgress',
      customerDisplay: customerDisplay,
      listType: listType,
    });
    
    const url = CORS_PROXY + encodeURIComponent(baseUrl + '?' + params.toString());
    
    console.log('📡 Sending dex GET request to export script:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: { 
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('❌ HTTP error:', response.status);
      return [];
    }

    const rawText = await response.text();
    console.log('📡 Raw GET response:', rawText);

    if (rawText.trim().startsWith('<!DOCTYPE') || rawText.trim().startsWith('<html')) {
      console.error('❌ Received HTML instead of JSON.');
      return [];
    }

    const data = JSON.parse(rawText);
    if (data.status === 'success' && data.dex) {
      console.log('✅ Dex data:', data.dex);
      return data.dex;
    }
    return [];
  } catch (e) {
    console.error('❌ Error fetching dex:', e);
    return [];
  }
}

// ========== ADD (USES MAIN SCRIPT - POST) ==========
export async function addDexPokemon(
  customerDisplay: string,
  pokemonId: number,
  pokemonName: string,
  listType: string
): Promise<boolean> {
  try {
    const payload = {
      type: 'addDexPokemon',
      customerDisplay: customerDisplay.trim(),
      pokemonId: pokemonId,
      pokemonName: pokemonName.trim(),
      listType: listType.trim(),
    };

    console.log('📡 Sending add dex request to main script:', payload);

    const response = await fetch(MAIN_SCRIPT_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const rawText = await response.text();
    console.log('📡 Raw add response:', rawText);

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      console.error('❌ Failed to parse add response:', rawText);
      return false;
    }

    return data.status === 'success';
  } catch (e) {
    console.error('❌ Error adding dex pokemon:', e);
    return false;
  }
}

// ========== REMOVE (USES MAIN SCRIPT - POST) ==========
export async function removeDexPokemon(
  customerDisplay: string,
  pokemonId: number,
  listType: string
): Promise<boolean> {
  try {
    const payload = {
      type: 'removeDexPokemon',
      customerDisplay: customerDisplay.trim(),
      pokemonId: pokemonId,
      listType: listType.trim(),
    };

    console.log('📡 Sending remove dex request to main script:', payload);

    const response = await fetch(MAIN_SCRIPT_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const rawText = await response.text();
    console.log('📡 Raw remove response:', rawText);

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      console.error('❌ Failed to parse remove response:', rawText);
      return false;
    }

    return data.status === 'success';
  } catch (e) {
    console.error('❌ Error removing dex pokemon:', e);
    return false;
  }
}