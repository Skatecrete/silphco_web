import { useState, useEffect } from 'react';
import { getAdditionalServices } from '@/services/sheetsApi';

export interface Service {
  serviceName: string;
  price: number;
  details: string;
}

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadServices() {
      setLoading(true);
      setError(null);

      try {
        const data = await getAdditionalServices();
        setServices(data);
      } catch (err) {
        setError('Failed to load services');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  return { services, loading, error };
}