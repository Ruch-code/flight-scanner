import { Flight } from '../types';
import { getAirportByIata } from '../data/airports';

export type RouteRegion = 'india' | 'us' | 'intl';

export interface BookingContext {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  tripType: 'one-way' | 'round-trip';
  class: 'economy' | 'premium-economy' | 'business' | 'first';
}

export interface BookingPortal {
  id: string;
  name: string;
  icon: string;
  description: string;
  regions: RouteRegion[];
  couponPlatforms: string[];
  buildUrl: (params: BookingContext, currency: 'USD' | 'INR') => string;
}

const fmtCompact = (d: string) => d.replace(/-/g, '');
const fmtSlash = (d: string) => d.split('-').reverse().join('/');
const fmtDmy = (d: string) => {
  const [y, m, dd] = d.split('-');
  return `${dd}${m}${y}`;
};
const fmtDmyShort = (d: string) => {
  const [, m, dd] = d.split('-');
  return `${dd}${m}${d.slice(2, 4)}`;
};

export function classCode(pClass: BookingContext['class']): string {
  switch (pClass) {
    case 'economy': return 'E';
    case 'premium-economy': return 'PE';
    case 'business': return 'B';
    case 'first': return 'F';
  }
}

export function getRouteRegion(origin: string, destination: string): RouteRegion {
  const o = getAirportByIata(origin);
  const d = getAirportByIata(destination);
  if (o && d) {
    if (o.region === 'domestic-india' && d.region === 'domestic-india') return 'india';
    if (o.region === 'domestic-us' && d.region === 'domestic-us') return 'us';
  }
  return 'intl';
}

export const airlineBookingSites: Record<string, string> = {
  '6E': 'https://www.goindigo.in/',
  'QP': 'https://www.akasaair.com/',
  'SG': 'https://www.spicejet.com/',
  'AI': 'https://www.airindia.com/',
  'IX': 'https://www.airindiaexpress.com/',
  'DL': 'https://www.delta.com/',
  'UA': 'https://www.united.com/',
  'AA': 'https://www.aa.com/',
  'WN': 'https://www.southwest.com/',
  'B6': 'https://www.jetblue.com/',
  'NK': 'https://www.spirit.com/',
  'F9': 'https://www.flyfrontier.com/',
  'SQ': 'https://www.singaporeair.com/',
  'EK': 'https://www.emirates.com/',
  'QR': 'https://www.qatarairways.com/',
  'EY': 'https://www.etihad.com/',
  'BA': 'https://www.britishairways.com/',
  'LH': 'https://www.lufthansa.com/',
  'AF': 'https://www.airfrance.com/',
  'KL': 'https://www.klm.com/',
  'TK': 'https://www.turkishairlines.com/',
  'QF': 'https://www.qantas.com/',
  'CX': 'https://www.cathaypacific.com/',
  'JL': 'https://www.jal.co.jp/',
  'NH': 'https://www.ana.co.jp/',
  'KE': 'https://www.koreanair.com/',
  'TG': 'https://www.thaiairways.com/',
  'MH': 'https://www.malaysiaairlines.com/',
  'AC': 'https://www.aircanada.com/',
  'UL': 'https://www.srilankan.com/',
};

const portals: BookingPortal[] = [
  {
    id: 'makemytrip',
    name: 'MakeMyTrip',
    icon: '🟠',
    description: 'Apply MMT + bank coupons at checkout. Big savings on India routes.',
    regions: ['india', 'intl'],
    couponPlatforms: ['MakeMyTrip'],
    buildUrl: (p, currency) => {
      const trip = p.tripType === 'round-trip' ? 'R' : 'O';
      const itinerary = `${p.origin}-${p.destination}-${fmtDmy(p.departureDate)}${p.returnDate ? '-' + fmtDmy(p.returnDate) : ''}`;
      return `https://www.makemytrip.com/flight/search?itinerary=${itinerary}&tripType=${trip}&pax=A:${p.passengers}&cabinClass=${classCode(p.class)}&intl=${p.origin === 'DEL' || p.origin === 'BOM' || p.origin === 'BLR' ? 'false' : 'false'}`;
    },
  },
  {
    id: 'cleartrip',
    name: 'Cleartrip',
    icon: '🔵',
    description: 'Zero-convenience-fee bookings on many flights. Stack bank offers.',
    regions: ['india', 'intl'],
    couponPlatforms: ['Cleartrip'],
    buildUrl: (p, currency) => {
      let url = `https://www.cleartrip.com/flights/results?origin=${p.origin}&destination=${p.destination}&departDate=${p.departureDate}&adults=${p.passengers}&class=${capitalizeClass(p.class)}`;
      if (p.returnDate) url += `&returnDate=${p.returnDate}&returnAdults=${p.passengers}`;
      return url;
    },
  },
  {
    id: 'yatra',
    name: 'Yatra',
    icon: '🔴',
    description: 'Frequent flat-discount codes on domestic round-trips.',
    regions: ['india'],
    couponPlatforms: ['Yatra'],
    buildUrl: (p, currency) =>
      `https://www.yatra.com/flight-booking/results?origin=${p.origin}&destination=${p.destination}&startDate=${fmtSlash(p.departureDate)}&adultCount=${p.passengers}&class=${capitalizeClass(p.class)}`,
  },
  {
    id: 'goibibo',
    name: 'Goibibo',
    icon: '🔷',
    description: 'Instant GoCash cashback on flight bookings.',
    regions: ['india'],
    couponPlatforms: ['Goibibo'],
    buildUrl: (p, currency) =>
      `https://www.goibibo.com/flights/?itinerary=${p.origin}-${p.destination}-${fmtCompact(p.departureDate)}`,
  },
  {
    id: 'expedia',
    name: 'Expedia',
    icon: '💙',
    description: 'Bundle + reward points. Watch for weekly flight coupons.',
    regions: ['us', 'intl'],
    couponPlatforms: ['Expedia'],
    buildUrl: (p, currency) => {
      let url = `https://www.expedia.com/Flights-Search?trip=${p.tripType === 'round-trip' ? 'roundtrip' : 'oneway'}&leg1=from:${p.origin},to:${p.destination},departure:${fmtCompact(p.departureDate)}TANYT&passengers=adults:${p.passengers}`;
      if (p.tripType === 'round-trip' && p.returnDate) {
        url += `&leg2=from:${p.destination},to:${p.origin},departure:${fmtCompact(p.returnDate)}TANYT`;
      }
      return url;
    },
  },
  {
    id: 'kayak',
    name: 'KAYAK',
    icon: '🟨',
    description: 'Price comparison + fare alerts across hundreds of OTAs.',
    regions: ['us', 'intl'],
    couponPlatforms: ['KAYAK'],
    buildUrl: (p, currency) => {
      let url = `https://www.kayak.com/flights/${p.origin}-${p.destination}/${fmtCompact(p.departureDate)}?sort=price_a`;
      if (p.tripType === 'round-trip' && p.returnDate) {
        url = `https://www.kayak.com/flights/${p.origin}-${p.destination}/${fmtCompact(p.departureDate)}/${fmtCompact(p.returnDate)}?sort=price_a`;
      }
      return url;
    },
  },
  {
    id: 'skyscanner',
    name: 'Skyscanner',
    icon: '🔍',
    description: '"Cheapest price across the whole month" coverage & price alerts.',
    regions: ['india', 'us', 'intl'],
    couponPlatforms: ['Skyscanner'],
    buildUrl: (p, currency) =>
      `https://www.skyscanner.net/transport/flights/${p.origin.toLowerCase()}/${p.destination.toLowerCase()}/${fmtDmyShort(p.departureDate)}/?adultsv2=${p.passengers}&cabinclass=${p.class === 'economy' ? 'economy' : p.class}&currency=${currency}`,
  },
  {
    id: 'google-flights',
    name: 'Google Flights',
    icon: '🅿️',
    description: 'See price insights & tracking. Best for verifying the "typical" fare.',
    regions: ['india', 'us', 'intl'],
    couponPlatforms: ['Google Flights'],
    buildUrl: (p, currency) =>
      `https://www.google.com/travel/flights?q=Flights+from+${p.origin}+to+${p.destination}+on+${fmtCompact(p.departureDate)}&curr=${currency}`,
  },
];

function capitalizeClass(pClass: BookingContext['class']): string {
  return pClass.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
}

export function getPortalsForRoute(origin: string, destination: string): BookingPortal[] {
  const region = getRouteRegion(origin, destination);
  return portals.filter((p) => p.regions.includes(region));
}

export function getAirlineBookingSite(flight: Flight): string | undefined {
  return airlineBookingSites[flight.airlineCode];
}

export function buildPortalUrl(portal: BookingPortal, context: BookingContext, currency: 'USD' | 'INR'): string {
  return portal.buildUrl(context, currency);
}