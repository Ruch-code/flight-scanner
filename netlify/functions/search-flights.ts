import type { Context } from '@netlify/functions';

interface IgnavSegment {
  marketing_carrier_code?: string | null;
  flight_number?: string | null;
  operating_carrier_name?: string | null;
  departure_airport: string;
  departure_time_local?: string | null;
  arrival_airport: string;
  arrival_time_local?: string | null;
  duration_minutes?: number | null;
}

interface IgnavLeg {
  carrier?: string | null;
  duration_minutes?: number | null;
  segments: IgnavSegment[];
}

interface IgnavItinerary {
  price: { amount: number; currency: string; status: string };
  outbound?: IgnavLeg;
  inbound?: IgnavLeg | null;
  legs?: IgnavLeg[];
  cabin_class?: string | null;
  ignav_id?: string | null;
}

interface IgnavFareResponse {
  itineraries?: IgnavItinerary[];
}

const BASE_URL = 'https://ignav.com/api';

function to12h(time: string): string {
  const match = /T(\d{2}):(\d{2})/.exec(time || '');
  const raw = match ? `${match[1]}:${match[2]}` : '—';
  const [h, m] = raw.split(':').map(Number);
  if (isNaN(h)) return raw;
  const period = h >= 12 ? 'PM' : 'AM';
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${String(hr).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
}

function minutesToDuration(minutes?: number | null): string {
  if (minutes == null) return '—';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function normalizeItinerary(it: IgnavItinerary, origin: string, destination: string): any {
  const outbound = it.outbound || (it.legs && it.legs[0]);
  const segments = (outbound?.segments || []).filter((s) => s.departure_airport || s.arrival_airport);
  const first = segments[0];
  const last = segments[segments.length - 1];

  const airlineCode = first?.marketing_carrier_code || outbound?.carrier || '—';
  const airlineName = first?.operating_carrier_name || outbound?.carrier || airlineCode;
  const depTime = to12h(first?.departure_time_local || '');
  const arrTime = to12h(last?.arrival_time_local || '');
  const stops = Math.max(segments.length - 1, 0);

  return {
    id: it.ignav_id || `${airlineCode}${first?.flight_number || ''}-${origin}-${destination}`,
    ignavId: it.ignav_id || null,
    airline: airlineName,
    airlineCode,
    flightNumber: `${airlineCode}${first?.flight_number || ''}`,
    origin: first?.departure_airport || origin,
    destination: last?.arrival_airport || destination,
    departureTime: depTime,
    arrivalTime: arrTime,
    duration: minutesToDuration(outbound?.duration_minutes),
    stops,
    price: it.price.amount,
    currency: it.price.currency,
    class: (it.cabin_class || 'economy') === 'premium_economy' ? 'premium-economy' : (it.cabin_class || 'economy'),
  };
}

function cabinClass(param: string): string {
  if (param === 'premium-economy' || param === 'premium_economy') return 'premium_economy';
  return (param || 'economy') as string;
}

export default async (req: Request, context: Context) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' }), { status: 405 });
  }

  const apiKey = process.env.IGNAV_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: 'NO_API_KEY',
        message: 'Live flight data is not configured. Add the IGNAV_API_KEY environment variable on Netlify.',
      }),
      { status: 503 }
    );
  }

  try {
    const { origin, destination, departureDate, returnDate, passengers, currency, tripType, cls } = await req.json();

    if (!origin || !destination || !departureDate) {
      return new Response(JSON.stringify({ error: 'INVALID_INPUT', message: 'Missing required fields' }), { status: 400 });
    }

    const requestedMarket = currency === 'INR' ? 'IN' : 'US';
    const endpoint = tripType === 'round-trip' && returnDate ? `${BASE_URL}/fares/round-trip` : `${BASE_URL}/fares/one-way`;

    const baseBody: Record<string, unknown> = {
      origin,
      destination,
      departure_date: departureDate,
      adults: passengers || 1,
      cabin_class: cabinClass(cls),
    };

    if (tripType === 'round-trip' && returnDate) {
      baseBody.return_date = returnDate;
    }

    // Ignav's INR fare engine intermittently returns 424 for some international
    // one-way routes. Fall back to USD pricing (client converts it for display).
    const markets = requestedMarket === 'IN' ? ['IN', 'US'] : ['US'];

    let lastStatus = 0;
    let lastDetail: string | null = null;
    let data: IgnavFareResponse = {};
    let marketUsed = requestedMarket;

    for (const market of markets) {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'X-Api-Key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...baseBody, market }),
      });

      const parsed: IgnavFareResponse = await response.json().catch(() => ({}));

      if (response.ok) {
        data = parsed;
        marketUsed = market;
        break;
      }

      lastStatus = response.status;
      const err = (parsed as any).error;
      lastDetail = (parsed as any).detail || (err && err.message) || null;
    }

    if (lastStatus !== 0 && !data.itineraries) {
      return new Response(
        JSON.stringify({
          error: 'UPSTREAM_ERROR',
          message: lastDetail || `Flight data provider returned ${lastStatus}. Please try again.`,
        }),
        { status: 502 }
      );
    }

    const itineraries = data.itineraries || [];
    const flights = itineraries.map((it) => normalizeItinerary(it, origin, destination));

    return new Response(
      JSON.stringify({
        flights,
        source: 'ignav',
        marketUsed,
        marketFallback: marketUsed !== requestedMarket,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('search-flights error:', error);
    return new Response(
      JSON.stringify({ error: 'SERVER_ERROR', message: 'Something went wrong while fetching flights. Please try again.' }),
      { status: 500 }
    );
  }
};