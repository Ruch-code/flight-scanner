import type { Context } from '@netlify/functions';

const YAHOO = 'https://query1.finance.yahoo.com/v8/finance/chart';

interface CompactBar {
  date: string;
  o: number;
  h: number;
  l: number;
  c: number;
}

function toBars(timestamps: number[], quote: any): CompactBar[] {
  const out: CompactBar[] = [];
  if (!quote || !Array.isArray(quote.open)) return out;
  for (let i = 0; i < timestamps.length; i++) {
    const o = quote.open[i], h = quote.high[i], l = quote.low[i], c = quote.close[i];
    if (o == null || h == null || l == null || c == null) continue;
    out.push({
      date: new Date(timestamps[i] * 1000).toISOString().slice(0, 10),
      o,
      h,
      l,
      c,
    });
  }
  return out;
}

async function fetchBars(symbol: string, range: string): Promise<CompactBar[]> {
  const res = await fetch(`${YAHOO}/${encodeURIComponent(symbol)}?range=${range}&interval=1d&events=history`, {
    headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Yahoo ${res.status} for ${symbol}`);
  const json = await res.json();
  const result = json?.chart?.result?.[0];
  if (!result) throw new Error(`No data for ${symbol}`);
  return toBars(result.timestamp || [], result.indicators?.quote?.[0] || {});
}

function round(n: number, d = 2): number {
  return Math.round(n * 10 ** d) / 10 ** d;
}

let cache: { key: string; at: number; data: string } | null = null;
const CACHE_TTL = 5 * 60 * 1000;

interface CommodityDef {
  key: string;
  symbol: string;
  name: string;
  unit: string;
}

const COMMODITIES: CommodityDef[] = [
  { key: 'brent', symbol: 'BZ=F', name: 'Brent Crude', unit: 'US$/bbl' },
  { key: 'wti', symbol: 'CL=F', name: 'WTI Crude', unit: 'US$/bbl' },
  { key: 'gold', symbol: 'GC=F', name: 'Gold', unit: 'US$/oz' },
  { key: 'silver', symbol: 'SI=F', name: 'Silver', unit: 'US$/oz' },
  { key: 'usdinr', symbol: 'INR=X', name: 'US$ / ₹', unit: '₹ per US$' },
];

export default async (req: Request, _ctx: Context) => {
  if (req.method !== 'GET') return new Response(JSON.stringify({ error: 'METHOD_NOT_ALLOWED' }), { status: 405 });

  if (cache && Date.now() - cache.at < CACHE_TTL) {
    return new Response(cache.data, { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=240' } });
  }

  let nifty: any = null;
  let commodities: any[] = [];
  const errors: string[] = [];

  try {
    const bars = await fetchBars('^NSEI', '1y');
    const last = bars[bars.length - 1];
    const prev = bars[bars.length - 2];
    const week = bars.slice(-260);
    const week52high = Math.max(...week.map((b) => b.h));
    const week52low = Math.min(...week.map((b) => b.l));
    const recent3m = Math.max(...bars.slice(-60).map((b) => b.h));

    const H = prev.h, L = prev.l, C = prev.c;
    const P = (H + L + C) / 3;
    const levels = {
      pivot: round(P),
      r1: round(2 * P - L),
      s1: round(2 * P - H),
      r2: round(P + (H - L)),
      s2: round(P - (H - L)),
      r3: round(H + 2 * (P - L)),
      s3: round(L - 2 * (H - P)),
    };

    nifty = {
      symbol: '^NSEI',
      name: 'NIFTY 50',
      last: round(last.c),
      prevClose: round(prev.c),
      dayChangePct: round((last.c / prev.c - 1) * 100),
      open: round(last.o),
      high: round(last.h),
      low: round(last.l),
      lastBarDate: last.date,
      week52high: round(week52high),
      week52low: round(week52low),
      recent3mHigh: round(recent3m),
      levels,
      pctFromHigh: round((last.c / week52high - 1) * 100),
      pctFromLow: round((last.c / week52low - 1) * 100),
    };
  } catch (e: any) {
    errors.push(`nifty: ${e.message}`);
  }

  await Promise.all(
    COMMODITIES.map(async (c) => {
      try {
        const bars = await fetchBars(c.symbol, '5d');
        const lastB = bars[bars.length - 1];
        const prevB = bars[bars.length - 2];
        if (!lastB || !prevB) return;
        commodities.push({
          key: c.key,
          name: c.name,
          unit: c.unit,
          price: round(lastB.c, c.key === 'usdinr' ? 3 : 2),
          change: round(lastB.c - prevB.c, c.key === 'usdinr' ? 3 : 2),
          changePct: round((lastB.c / prevB.c - 1) * 100),
          date: lastB.date,
        });
      } catch (e: any) {
        errors.push(`${c.key}: ${e.message}`);
      }
    })
  );

  commodities.sort((a, b) => a.key.localeCompare(b.key));

  const payload = JSON.stringify({ nifty, commodities, errors, ts: Date.now() });
  cache = { key: 'all', at: Date.now(), data: payload };
  return new Response(payload, { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=240' } });
};