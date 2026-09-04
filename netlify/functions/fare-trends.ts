import type { Context } from '@netlify/functions';

interface IgnavItinerary {
  price: { amount: number; currency: string; status: string };
}

interface IgnavFareResponse {
  itineraries?: IgnavItinerary[];
}

interface FareCandle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

const BASE_URL = 'https://ignav.com/api';
const DAY_MS = 24 * 60 * 60 * 1000;
const SAMPLE_STEP = 7;
const HORIZON_DAYS = 91;
const MAX_SAMPLES = 16;
const CACHE_TTL_MS = 10 * 60 * 1000;

const cache = new Map<string, { at: number; payload: unknown }>();

function isoFromDaysFromNow(n: number): string {
  return new Date(Date.now() + n * DAY_MS).toISOString().slice(0, 10);
}

function addDaysIso(dateStr: string, n: number): string {
  const ms = Date.parse(`${dateStr}T00:00:00Z`);
  return new Date(ms + n * DAY_MS).toISOString().slice(0, 10);
}

function isoDaysDiff(a: string, b: string): number {
  return Math.round((Date.parse(`${a}T00:00:00Z`) - Date.parse(`${b}T00:00:00Z`)) / DAY_MS);
}

function median(nums: number[]): number {
  const s = [...nums].sort((x, y) => x - y);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function rounded(n: number): number {
  return Math.round(n * 100) / 100;
}

function buildSampleDates(userDepartureDate: string): string[] {
  const dates = new Set<string>();
  dates.add(userDepartureDate);
  for (let d = SAMPLE_STEP; d <= HORIZON_DAYS; d += SAMPLE_STEP) {
    dates.add(isoFromDaysFromNow(d));
    if (dates.size >= MAX_SAMPLES) break;
  }
  return [...dates].sort();
}

function cabinClass(param: string): string {
  if (param === 'premium-economy' || param === 'premium_economy') return 'premium_economy';
  return (param || 'economy') as string;
}

async function fetchPrices(
  endpoint: string,
  body: Record<string, unknown>,
  apiKey: string
): Promise<{ prices: number[]; currency: string }> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'X-Api-Key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) return { prices: [], currency: '' };

  const parsed: IgnavFareResponse = await response.json().catch(() => ({}));
  const itineraries = parsed.itineraries || [];
  const prices = itineraries
    .map((it) => it.price?.amount)
    .filter((a): a is number => Number.isFinite(a) && a > 0);

  if (prices.length === 0) return { prices: [], currency: '' };
  return { prices, currency: itineraries[0].price?.currency || 'USD' };
}

export default async (req: Request, context: Context) => {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' }), { status: 405 });
  }

  const apiKey = process.env.IGNAV_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'NO_API_KEY', message: 'Live fare data is not configured. Add the IGNAV_API_KEY environment variable on Netlify.' }),
      { status: 503 }
    );
  }

  try {
    const url = new URL(req.url);
    const origin = url.searchParams.get('origin') || '';
    const destination = url.searchParams.get('destination') || '';
    const departureDate = url.searchParams.get('departureDate') || '';
    const returnDate = url.searchParams.get('returnDate');
    const tripType = url.searchParams.get('tripType') || 'one-way';
    const cls = url.searchParams.get('cls') || 'economy';
    const currency = url.searchParams.get('currency') || 'USD';

    if (!origin || !destination || !departureDate) {
      return new Response(JSON.stringify({ error: 'INVALID_INPUT', message: 'Missing origin, destination or departureDate' }), { status: 400 });
    }

    const cacheKey = [origin, destination, departureDate, returnDate || '', tripType, cls, currency].join('|');
    const hit = cache.get(cacheKey);
    if (hit && Date.now() - hit.at < CACHE_TTL_MS) {
      return new Response(JSON.stringify(hit.payload), { headers: { 'Content-Type': 'application/json' } });
    }

    const isRoundTrip = tripType === 'round-trip' && !!returnDate;
    const tripLen = isRoundTrip ? isoDaysDiff(returnDate!, departureDate) : 0;
    const endpoint = isRoundTrip ? `${BASE_URL}/fares/round-trip` : `${BASE_URL}/fares/one-way`;
    const markets = currency === 'INR' ? ['IN', 'US'] : ['US'];

    let marketUsed = markets[0];
    const candles: FareCandle[] = [];
    const nativeCurrencies = new Set<string>();
    const startedAt = Date.now();

    for (let i = 0; i < buildSampleDates(departureDate).length; i += 7) {
      if (Date.now() - startedAt > 20000) break;
      const chunk = buildSampleDates(departureDate).slice(i, i + 7);
      const chunkResults = await Promise.all(
        chunk.map(async (date) => {
          const body: Record<string, unknown> = {
            origin,
            destination,
            departure_date: date,
            adults: 1,
            cabin_class: cabinClass(cls),
            market: marketUsed,
          };
          if (isRoundTrip) body.return_date = addDaysIso(date, tripLen);

          let result = await fetchPrices(endpoint, body, apiKey);
          if (result.prices.length === 0 && markets.length > 1) {
            result = await fetchPrices(endpoint, { ...body, market: markets[1] }, apiKey);
            if (result.prices.length > 0) marketUsed = markets[1];
          }
          return { date, result };
        })
      );

      for (const { date, result } of chunkResults) {
        if (result.prices.length < 2) continue;
        const low = rounded(Math.min(...result.prices));
        const high = rounded(Math.max(...result.prices));
        const close = rounded(median(result.prices));
        nativeCurrencies.add(result.currency);
        candles.push({ time: date, open: low, high, low, close });
      }
    }

    if (candles.length < 3) {
      return new Response(
        JSON.stringify({ error: 'NO_TREND_DATA', message: 'Not enough live fare data for this route right now. Please try again shortly.' }),
        { status: 502 }
      );
    }

    candles.sort((a, b) => a.time.localeCompare(b.time));

    const cheapest = candles.reduce((acc, c) => (c.low < acc.low ? c : acc), candles[0]);
    const lows = candles.map((c) => c.low);
    const third = Math.max(Math.floor(candles.length / 3), 1);
    const nearAvg = lows.slice(0, third).reduce((s, v) => s + v, 0) / third;
    const farAvg = lows.slice(-third).reduce((s, v) => s + v, 0) / third;
    const trendPct = farAvg > 0 ? Math.round(((nearAvg - farAvg) / farAvg) * 1000) / 10 : 0;
    const trend = trendPct > 6 ? 'rising' : trendPct < -6 ? 'falling' : 'flat';

    const sortedLows = [...lows].sort((a, b) => a - b);
    const userCandle = candles.find((c) => c.time === departureDate);
    const userPercentile =
      sortedLows.length && userCandle
        ? Math.round((sortedLows.indexOf(userCandle.low) / sortedLows.length) * 100)
        : null;

    const daysToCheapest = isoDaysDiff(cheapest.time, isoFromDaysFromNow(0));
    const nativeCurrency = nativeCurrencies.size === 1 ? [...nativeCurrencies][0] : marketUsed === 'IN' ? 'INR' : 'USD';

    const payload = {
      candles,
      cheapestDate: cheapest.time,
      cheapestPrice: cheapest.low,
      daysToCheapest,
      trend,
      trendPct,
      userPercentile,
      userDaysOut: isoDaysDiff(departureDate, isoFromDaysFromNow(0)),
      samples: candles.length,
      nativeCurrency,
      marketUsed,
      marketFallback: marketUsed !== markets[0],
      source: 'ignav',
    };

    cache.set(cacheKey, { at: Date.now(), payload });

    return new Response(JSON.stringify(payload), { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('fare-trends error:', error);
    return new Response(
      JSON.stringify({ error: 'SERVER_ERROR', message: 'Something went wrong while building fare trends. Please try again.' }),
      { status: 500 }
    );
  }
};