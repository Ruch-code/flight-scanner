import { useState, useCallback } from 'react';
import { Flight, FlightSearchParams } from '../types';

export function useFlightSearch() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'mock' | 'ignav' | 'scrappa'>('mock');

  const searchFlights = useCallback(async (params: FlightSearchParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/.netlify/functions/search-flights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: params.origin,
          destination: params.destination,
          departureDate: params.departureDate,
          returnDate: params.returnDate,
          passengers: params.passengers,
          currency: params.currency,
          tripType: params.tripType,
          cls: params.class,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to search flights');
      }

      const data = await response.json();
      setFlights(data.flights || []);
      setSource(data.source || 'mock');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setFlights([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setFlights([]);
    setError(null);
  }, []);

  return { flights, loading, error, source, searchFlights, clearResults };
}
