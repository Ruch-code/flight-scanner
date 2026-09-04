import type { Context } from '@netlify/functions';

interface Flight {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  stopCities?: string[];
  price: number;
  currency: string;
  class: string;
}

const AIRLINE_NAMES: Record<string, string> = {
  '6E': 'IndiGo', 'SG': 'SpiceJet', 'AI': 'Air India', 'G8': 'GoFirst',
  'IX': 'Air India Express', 'QP': 'Akasa Air', 'DL': 'Delta', 'UA': 'United',
  'AA': 'American Airlines', 'WN': 'Southwest', 'B6': 'JetBlue', 'NK': 'Spirit',
  'F9': 'Frontier', 'SQ': 'Singapore Airlines', 'EK': 'Emirates', 'QR': 'Qatar Airways',
  'BA': 'British Airways', 'LH': 'Lufthansa', 'AF': 'Air France', 'TK': 'Turkish Airlines',
  'QF': 'Qantas', 'CX': 'Cathay Pacific', 'JL': 'Japan Airlines', 'KE': 'Korean Air',
};

const AIRLINES_BY_REGION: Record<string, string[]> = {
  'domestic-india': ['6E', 'SG', 'AI', 'G8', 'IX', 'QP'],
  'domestic-us': ['DL', 'UA', 'AA', 'WN', 'B6', 'NK', 'F9'],
  'international': ['SQ', 'EK', 'QR', 'BA', 'LH', 'AF', 'TK', 'QF', 'CX', 'JL', 'KE'],
};

function generateMockFlights(origin: string, destination: string, date: string, passengers: number, currency: string): Flight[] {
  const isDomesticIndia = ['DEL', 'BOM', 'BLR', 'MAA', 'CCU', 'HYD', 'GOI', 'COK', 'PNQ', 'AMD', 'JAI', 'LKO', 'TRV', 'IXC', 'PAT', 'BHO', 'NAG', 'GAU'].includes(origin) &&
    ['DEL', 'BOM', 'BLR', 'MAA', 'CCU', 'HYD', 'GOI', 'COK', 'PNQ', 'AMD', 'JAI', 'LKO', 'TRV', 'IXC', 'PAT', 'BHO', 'NAG', 'GAU'].includes(destination);

  const isDomesticUS = ['JFK', 'LAX', 'ORD', 'ATL', 'DFW', 'DEN', 'SFO', 'SEA', 'MIA', 'BOS', 'IAH', 'PHX', 'LAS', 'MSP', 'DTW'].includes(origin) &&
    ['JFK', 'LAX', 'ORD', 'ATL', 'DFW', 'DEN', 'SFO', 'SEA', 'MIA', 'BOS', 'IAH', 'PHX', 'LAS', 'MSP', 'DTW'].includes(destination);

  let region = 'international';
  let basePrice = currency === 'INR' ? 25000 : 400;
  if (isDomesticIndia) {
    region = 'domestic-india';
    basePrice = currency === 'INR' ? 3500 : 60;
  } else if (isDomesticUS) {
    region = 'domestic-us';
    basePrice = currency === 'INR' ? 20000 : 250;
  }

  const airlines = AIRLINES_BY_REGION[region] || AIRLINES_BY_REGION['international'];
  const flights: Flight[] = [];

  const hours = [6, 8, 10, 12, 14, 16, 18, 20, 22];

  for (let i = 0; i < 8; i++) {
    const airlineCode = airlines[i % airlines.length];
    const flightNum = 1000 + Math.floor(Math.random() * 9000);
    const depHour = hours[i % hours.length];
    const durationHrs = isDomesticIndia ? 1 + Math.floor(Math.random() * 3) : isDomesticUS ? 2 + Math.floor(Math.random() * 5) : 5 + Math.floor(Math.random() * 12);
    const durationMins = Math.floor(Math.random() * 60);
    const arrHour = (depHour + durationHrs) % 24;
    const arrMin = durationMins;

    const stops = Math.random() > 0.5 ? 0 : Math.random() > 0.7 ? 2 : 1;
    const stopCities = stops === 1 ? [stops === 1 ? 'Connecting' : ''] : stops === 2 ? ['Stop 1', 'Stop 2'] : [];

    const priceMultiplier = 1 + (Math.random() * 0.6 - 0.3);
    const stopsDiscount = stops === 0 ? 1.2 : stops === 1 ? 1 : 0.85;
    const timeDiscount = depHour >= 6 && depHour <= 8 ? 1.1 : depHour >= 20 ? 0.9 : 1;
    const price = Math.round(basePrice * priceMultiplier * stopsDiscount * timeDiscount);

    flights.push({
      id: `${airlineCode}${flightNum}-${date}`,
      airline: AIRLINE_NAMES[airlineCode] || airlineCode,
      airlineCode,
      flightNumber: `${airlineCode}${flightNum}`,
      origin,
      destination,
      departureTime: `${String(depHour).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      arrivalTime: `${String(arrHour).padStart(2, '0')}:${String(arrMin).padStart(2, '0')}`,
      duration: `${durationHrs}h ${durationMins}m`,
      stops,
      stopCities: stops > 0 ? stopCities : undefined,
      price,
      currency,
      class: 'economy',
    });
  }

  flights.sort((a, b) => a.price - b.price);
  return flights;
}

export default async (req: Request, context: Context) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { origin, destination, departureDate, passengers, currency, tripType, cls } = await req.json();

    if (!origin || !destination || !departureDate) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const IGNAV_API_KEY = process.env.IGNAV_API_KEY;

    if (IGNAV_API_KEY) {
      try {
        const response = await fetch('https://api.ignav.com/v1/flights/search', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${IGNAV_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            origin,
            destination,
            date: departureDate,
            passengers: passengers || 1,
            currency: currency || 'USD',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return new Response(JSON.stringify({ flights: data.flights || [], source: 'ignav' }), {
            headers: { 'Content-Type': 'application/json' },
          });
        }
      } catch (e) {
        console.log('Ignav API failed, falling back to mock data');
      }
    }

    const mockFlights = generateMockFlights(origin, destination, departureDate, passengers || 1, currency || 'USD');
    return new Response(JSON.stringify({ flights: mockFlights, source: 'mock' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};
