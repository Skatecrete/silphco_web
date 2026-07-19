const STORE_BOXES_URL = 'https://raw.githubusercontent.com/Skatecrete/pogo-raid-data/main/store_boxes.json';

export interface ItemBoxItem {
  name: string;
  count: number;
  image: string;
}

export interface ItemBox {
  box_name: string;
  in_store_price: number;
  silphco_price: number;
  box_image: string;
  items: ItemBoxItem[];
}

export interface StoreBoxesResponse {
  last_updated: string;
  error: boolean;
  total: number;
  boxes: ItemBox[];
}

export async function fetchStoreBoxes(): Promise<StoreBoxesResponse | null> {
  try {
    const response = await fetch(STORE_BOXES_URL);
    if (!response.ok) throw new Error('Failed to fetch store boxes');
    const data = await response.json();
    return data;
  } catch (e) {
    console.error('Error fetching store boxes:', e);
    return null;
  }
}