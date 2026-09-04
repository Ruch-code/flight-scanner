import type { Context } from '@netlify/functions';
import { stockPicks } from '../../src/data/stocks';
import { detectPatterns, type Candle } from '../../src/utils/candlestick';
import { rsi } from '../../src/utils/indicators';

const YAHOO = 'https://query1.finance.yahoo.com/v8/finance/chart';

interface YahooQuote {
  open: number[];
  high: number[];
  low: number[];
  close: number[];
  volume?: number[];
}

function cleanBars(timestamps: number[], quote: YahooQuote | undefined | null): Candle[] {
  const out: Candle[] = [];
  if (!quote || !Array.isArray(quote.open)) return out;
  for (let i = 0; i < timestamps.length; i++) {
    const open = quote.open[i], high = quote.high[i], low = quote.low[i], close = quote.close[i];
    if (open == null || high == null || low == null || close == null) continue;
    out.push({
      time: new Date(timestamps[i] * 1000).toISOString().slice(0, 10),
      open,
      high,
      low,
      close,
      volume: quote.volume?.[i] || 0,
    });
  }
  return out;
}

async function fetchBars(symbol: string): Promise<Candle[]> {
  const url = `${YAHOO}/${encodeURIComponent(symbol)}?range=3mo&interval=1d&events=history`;
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' } });
  if (!res.ok) throw new Error(`Yahoo ${res.status} for ${symbol}`);
  const json = await res.json();
  const result = json?.chart?.result?.[0];
  if (!result) throw new Error(`No data for ${symbol}`);
  return cleanBars(result.timestamp || [], result.indicators?.quote?.[0] || {});
}

function avgVolume(bars: Candle[], lookback: number): number {
  const slice = bars.slice(-lookback);
  const sum = slice.reduce((acc, b) => acc + (b.volume || 0), 0);
  return sum / slice.length;
}

function lastClose(bars: Candle[]): number {
  return bars[bars.length - 1]?.close ?? 0;
}

let cache: { key: string; at: number; data: string } | null = null;
const CACHE_TTL = 5 * 60 * 1000;

export default async (req: Request, _ctx: Context) => {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'METHOD_NOT_ALLOWED' }), { status: 405 });
  }

  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get('limit') || stockPicks.length), stockPicks.length);
  const symbolsParam = url.searchParams.get('symbols');
  const symbols = symbolsParam ? symbolsParam.split(',').filter(Boolean) : stockPicks.slice(0, limit).map((s) => s.symbol);

  const cacheKey = symbols.join(',');
  if (cache && cache.key === cacheKey && Date.now() - cache.at < CACHE_TTL) {
    return new Response(cache.data, { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=240' } });
  }

  const picks = stockPicks.filter((s) => symbols.includes(s.symbol));
  const results: any[] = [];
  const errors: string[] = [];
  const concurrency = 6;

  async function process(symbol: string) {
    const pick = picks.find((p) => p.symbol === symbol);
    if (!pick) return;
    try {
      const bars = await fetchBars(symbol);
      if (bars.length < 2) throw new Error('Not enough bars');
      const price = lastClose(bars);
      const prevClose = bars[bars.length - 2]?.close ?? price;
      const lookback = Math.min(bars.length, 30);
      const highN = Math.max(...bars.slice(-lookback).map((b) => b.high));
      const recent = bars.slice(-Math.min(bars.length, 10));
      const volAvg = avgVolume(bars, lookback);
      const lastVol = bars[bars.length - 1]?.volume || 0;
      const closes = bars.map((b) => b.close);

      results.push({
        symbol: pick.symbol,
        name: pick.name,
        exchange: pick.exchange,
        sector: pick.sector,
        currency: pick.currency,
        whyStrong: pick.whyStrong,
        price,
        dayChangePct: Math.round((price / prevClose - 1) * 10000) / 100,
        dipFromHigh: Math.round((price / highN - 1) * 10000) / 100,
        dipFrom5dAgo: bars.length >= 6 ? Math.round((price / closes[bars.length - 6] - 1) * 10000) / 100 : 0,
        rsi: rsi(closes.slice(-Math.min(closes.length, 42))),
        volRatio: volAvg > 0 ? Math.round((lastVol / volAvg) * 10) / 10 : 0,
        patterns: detectPatterns(bars.slice(-Math.min(bars.length, 30))).map(
          ({ id, name, emoji, bull, meaning }: any) => ({ id, name, emoji, bull, meaning })
        ),
        candles: bars.slice(-40),
        pctAway52wHigh: null,
      });
    } catch (e: any) {
      errors.push(`${symbol}: ${e.message}`);
    }
  }

  for (let i = 0; i < symbols.length; i += concurrency) {
    const chunk = symbols.slice(i, i + concurrency);
    await Promise.all(chunk.map(process));
  }

  results.sort((a, b) => (b.dayChangePct ?? 0) - (a.dayChangePct ?? 0));

  const payload = JSON.stringify({ picks: results, errors, ts: Date.now(), source: 'yahoo', note: 'Educational only — not investment advice.' });
  cache = { key: cacheKey, at: Date.now(), data: payload };
  return new Response(payload, { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=240' } });
};