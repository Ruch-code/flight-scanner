import { useCallback, useEffect, useState } from 'react';

export interface NiftyLevels {
  pivot: number;
  r1: number;
  s1: number;
  r2: number;
  s2: number;
  r3: number;
  s3: number;
}

export interface NiftyData {
  symbol: string;
  name: string;
  last: number;
  prevClose: number;
  dayChangePct: number;
  open: number;
  high: number;
  low: number;
  lastBarDate: string;
  week52high: number;
  week52low: number;
  recent3mHigh: number;
  levels: NiftyLevels;
  pctFromHigh: number;
  pctFromLow: number;
}

export interface Commodity {
  key: string;
  name: string;
  unit: string;
  price: number;
  change: number;
  changePct: number;
  date: string;
}

export interface MarketSnapshot {
  nifty: NiftyData | null;
  commodities: Commodity[];
  errors?: string[];
}

export function useMarketSnapshot() {
  const [snapshot, setSnapshot] = useState<MarketSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/.netlify/functions/market-snapshot');
      if (!res.ok) throw new Error(`Market data ${res.status}`);
      setSnapshot(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { snapshot, loading, error, refresh };
}

export interface StockSignal {
  symbol: string;
  name: string;
  exchange: 'NSE' | 'US';
  sector: string;
  currency: 'INR' | 'USD';
  whyStrong: string;
  price: number;
  dayChangePct: number;
  dipFromHigh: number;
  rsi: number | null;
  volRatio: number;
  patterns: { id: string; name: string; emoji: string; bull: boolean; meaning: string }[];
  candles: { time: string; open: number; high: number; low: number; close: number; volume?: number }[];
}

export function useStockSignals() {
  const [data, setData] = useState<{ picks: StockSignal[]; errors?: string[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/.netlify/functions/stock-signals');
      if (!res.ok) throw new Error(`Stock data ${res.status}`);
      setData(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}