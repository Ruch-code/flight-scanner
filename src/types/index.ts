export interface Airport {
  iata: string;
  name: string;
  city: string;
  country: string;
  region: 'domestic-india' | 'domestic-us' | 'international';
}

export interface AirlineRating {
  code: string;
  name: string;
  onTimePercent: number;
  safetyRating: number;
  userRating: number;
  type: 'LCC' | 'Full-Service' | 'Ultra-LCC';
  country: string;
}

export interface Flight {
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
  class: 'economy' | 'premium-economy' | 'business' | 'first';
  deepLink?: string;
}

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  class: 'economy' | 'premium-economy' | 'business' | 'first';
  tripType: 'one-way' | 'round-trip';
  currency: 'USD' | 'INR';
}

export interface BookingWindowAdvice {
  routeType: 'domestic-india' | 'domestic-us' | 'international';
  optimalDays: string;
  tip: string;
  priceLevel: 'low' | 'typical' | 'high';
  bestMonths: string[];
  avoidMonths: string[];
  dayOfWeekTip: string;
}

export interface Coupon {
  id: string;
  code: string;
  platform: string;
  description: string;
  discount: string;
  minSpend: number;
  maxDiscount: number;
  paymentMethod: string;
  expiry: string;
  routeType: 'domestic' | 'international' | 'both';
  region: 'india' | 'us' | 'both';
  working: boolean;
  successRate: number;
}

export interface BankWeekend {
  weekend: string;
  bank: string;
  offer: string;
  discount: string;
  region: 'india' | 'us';
}

export type Currency = 'USD' | 'INR';
