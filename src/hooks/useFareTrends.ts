import { useState, useCallback } from 'react';

export interface FareCandle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface FareTrends {
  candles: FareCandle[];
  cheapestDate: string;
  cheapestPrice: number;
  daysToCheapest: number;
  trend: 'rising' | 'falling' | 'flat';
  trendPct: number;
  userPercentile: number | null;
  userDaysOut: number;
  samples: number;
  nativeCurrency: 'USD' | 'INR';
}

export interface FareTrendParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  tripType: 'one-way' | 'round-trip';
  cls: 'economy' | 'premium-economy' | 'business' | 'first';
  currency: 'USD' | 'INR';
}

export function useFareTrends() {
  const [data, setData] = useState<FareTrends | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTrends = useCallback(async (params: FareTrendParams) => {
    setLoading(true);
    setError(null);

    try {
      const qs = new URLSearchParams({
        origin: params.origin,
        destination: params.destination,
        departureDate: params.departureDate,
        tripType: params.tripType,
        cls: params.cls,
        currency: params.currency,
      });
      if (params.returnDate) qs.set('returnDate', params.returnDate);

      const response = await fetch(`/.netlify/functions/fare-trends?${qs}`);
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || 'Could not load fare trends right now.');
      }

      setData(result as FareTrends);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load fare trends.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearTrends = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, loadTrends, clearTrends };
}

export function trendPriceToDisplay(amount: number, nativeCurrency: 'USD' | 'INR', display: 'USD' | 'INR'): number {
  if (nativeCurrency === display) return amount;
  return display === 'INR' ? Math.round(amount * 83.5) : Math.round(amount / 83.5);
}