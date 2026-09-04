import { useState } from 'react';

export interface NewsItem {
  title: string;
  source: string;
  link: string;
  pubDate: string;
}

const TOPICS = [
  { id: 'markets', label: 'Markets', query: 'NIFTY OR Sensex OR "Indian stock market"' },
  { id: 'stocks', label: 'Stock ideas', query: '"stocks to buy" OR "stock market today"' },
  { id: 'commodities', label: 'Gold & Crude', query: 'gold price OR crude oil price OR commodity markets' },
  { id: 'us', label: 'Wall Street', query: 'Nasdaq OR "S&P 500" OR "Wall Street"' },
];

export function useMarketNews() {
  const [topic, setTopic] = useState('markets');
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (id: string = topic) => {
    const t = TOPICS.find((x) => x.id === id) || TOPICS[0];
    setTopic(t.id);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/.netlify/functions/market-news?q=${encodeURIComponent(t.query)}&limit=10`);
      if (!res.ok) throw new Error(`News ${res.status}`);
      const json = await res.json();
      setItems(json.items || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return { topic, setTopic: load, items, loading, error, topics: TOPICS };
}

export function relativeTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function categorize(title: string): string {
  const t = title.toLowerCase();
  if (/(crude|oil|gold|commodity|metal|energy)/.test(t)) return 'Commodities';
  if (/(fii|dii|foreign|selling|flow)/.test(t)) return 'FII/DII';
  if (/(ipo|listing|elss|dividend|results|earnings|quarterly)/.test(t)) return 'Corporate';
  if (/(nifty|sensex|index|benchmark)/.test(t)) return 'Indices';
  return 'Markets';
}