import { useState, useCallback } from 'react';
import { Flight, FlightSearchParams } from '../types';

export function useFlightSearch() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [source, setSource] = useState<'ignav'>('ignav');

  const searchFlights = useCallback(async (params: FlightSearchParams) => {
    setLoading(true);
    setError(null);
    setNote(null);

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

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || `Search failed (${response.status}). Please try again.`);
      }

      setFlights(data.flights || []);
      setSource(data.source || 'ignav');
      if (data.marketFallback && params.currency === 'INR') {
        setNote('Provider INR fares weren’t available for this route — prices shown are converted from USD at ₹83.5/USD.');
      }
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
    setNote(null);
  }, []);

  return { flights, loading, error, note, source, searchFlights, clearResults };
}
