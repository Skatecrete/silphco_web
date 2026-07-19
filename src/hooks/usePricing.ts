import { useState, useEffect } from 'react';
import { fetchPricing } from '@/services/sheetsApi';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface PricingData {
  shundo: number;
  hundo: number;
  hundoRegional: number;
  shiny: number;
  shinyRegional: number;
  pvp: number;
  normalRegional: number;
  coins5600: number;
  coins15500: number;
  coins31000: number;
  raid10: number;
  raid20: number;
  raid50: number;
  dynamax4: number;
  dynamaxSingle: number;
  serviceDefault: number;
}

const DEFAULT_PRICES: PricingData = {
  shundo: 5.0,
  hundo: 3.0,
  hundoRegional: 8.0,
  shiny: 2.0,
  shinyRegional: 5.0,
  pvp: 5.0,
  normalRegional: 3.0,
  coins5600: 24.0,
  coins15500: 45.0,
  coins31000: 85.0,
  raid10: 7.0,
  raid20: 12.0,
  raid50: 20.0,
  dynamax4: 10.0,
  dynamaxSingle: 2.5,
  serviceDefault: 5.0,
};

export function usePricing() {
  const [prices, setPrices] = useState<PricingData>(DEFAULT_PRICES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  const loadPrices = async (forceRefresh: boolean = false) => {
    const now = Date.now();
    if (!forceRefresh && lastFetchTime > 0 && (now - lastFetchTime) < CACHE_DURATION) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchPricing();
      if (data && Object.keys(data).length > 0) {
        setPrices({
          shundo: data['Spawn_Shundo'] || DEFAULT_PRICES.shundo,
          hundo: data['Spawn_Hundo'] || DEFAULT_PRICES.hundo,
          hundoRegional: data['Spawn_Hundo_Regional'] || DEFAULT_PRICES.hundoRegional,
          shiny: data['Spawn_Shiny'] || DEFAULT_PRICES.shiny,
          shinyRegional: data['Spawn_Shiny_Regional'] || DEFAULT_PRICES.shinyRegional,
          pvp: data['Spawn_PvP'] || DEFAULT_PRICES.pvp,
          normalRegional: data['Spawn_Normal_Regional'] || DEFAULT_PRICES.normalRegional,
          coins5600: data['Coins_5600'] || DEFAULT_PRICES.coins5600,
          coins15500: data['Coins_15500'] || DEFAULT_PRICES.coins15500,
          coins31000: data['Coins_31000'] || DEFAULT_PRICES.coins31000,
          raid10: data['Raid_Normal_10'] || DEFAULT_PRICES.raid10,
          raid20: data['Raid_Normal_20'] || DEFAULT_PRICES.raid20,
          raid50: data['Raid_Normal_50'] || DEFAULT_PRICES.raid50,
          dynamax4: data['Raid_Dynamax_4'] || DEFAULT_PRICES.dynamax4,
          dynamaxSingle: data['Raid_Dynamax_Single'] || DEFAULT_PRICES.dynamaxSingle,
          serviceDefault: data['Service_Default'] || DEFAULT_PRICES.serviceDefault,
        });
        setLastFetchTime(now);
      }
    } catch (err) {
      setError('Failed to load prices');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrices();
  }, []);

  return { prices, loading, error, refreshPrices: () => loadPrices(true) };
}