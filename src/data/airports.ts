import { Airport } from '../types';

export const airports: Airport[] = [
  // India Domestic
  { iata: 'DEL', name: 'Indira Gandhi International', city: 'New Delhi', country: 'India', region: 'domestic-india' },
  { iata: 'BOM', name: 'Chhatrapati Shivaji Maharaj', city: 'Mumbai', country: 'India', region: 'domestic-india' },
  { iata: 'BLR', name: 'Kempegowda International', city: 'Bangalore', country: 'India', region: 'domestic-india' },
  { iata: 'MAA', name: 'Chennai International', city: 'Chennai', country: 'India', region: 'domestic-india' },
  { iata: 'CCU', name: 'Netaji Subhas Chandra Bose', city: 'Kolkata', country: 'India', region: 'domestic-india' },
  { iata: 'HYD', name: 'Rajiv Gandhi International', city: 'Hyderabad', country: 'India', region: 'domestic-india' },
  { iata: 'GOI', name: 'Goa International', city: 'Goa', country: 'India', region: 'domestic-india' },
  { iata: 'COK', name: 'Cochin International', city: 'Kochi', country: 'India', region: 'domestic-india' },
  { iata: 'PNQ', name: 'Pune Airport', city: 'Pune', country: 'India', region: 'domestic-india' },
  { iata: 'AMD', name: 'Sardar Vallabhbhai Patel International', city: 'Ahmedabad', country: 'India', region: 'domestic-india' },
  { iata: 'JAIPUR', name: 'Jaipur International', city: 'Jaipur', country: 'India', region: 'domestic-india' },
  { iata: 'JAI', name: 'Jaipur International', city: 'Jaipur', country: 'India', region: 'domestic-india' },
  { iata: 'LKO', name: 'Chaudhary Charan Singh International', city: 'Lucknow', country: 'India', region: 'domestic-india' },
  { iata: 'TRV', name: 'Trivandrum International', city: 'Thiruvananthapuram', country: 'India', region: 'domestic-india' },
  { iata: 'IXC', name: 'Chandigarh Airport', city: 'Chandigarh', country: 'India', region: 'domestic-india' },
  { iata: 'PAT', name: 'Lok Nayak Jayaprakash Airport', city: 'Patna', country: 'India', region: 'domestic-india' },
  { iata: 'BHO', name: 'Raja Bhoj Airport', city: 'Bhopal', country: 'India', region: 'domestic-india' },
  { iata: 'NAG', name: 'Dr. Babasaheb Ambedkar International', city: 'Nagpur', country: 'India', region: 'domestic-india' },
  { iata: 'IND', name: 'Lokpriya Gopinath Bordoloi International', city: 'Guwahati', country: 'India', region: 'domestic-india' },
  { iata: 'GAU', name: 'Lokpriya Gopinath Bordoloi International', city: 'Guwahati', country: 'India', region: 'domestic-india' },

  // US Domestic
  { iata: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'United States', region: 'domestic-us' },
  { iata: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'United States', region: 'domestic-us' },
  { iata: 'ORD', name: "O'Hare International", city: 'Chicago', country: 'United States', region: 'domestic-us' },
  { iata: 'ATL', name: 'Hartsfield-Jackson Atlanta International', city: 'Atlanta', country: 'United States', region: 'domestic-us' },
  { iata: 'DFW', name: 'Dallas/Fort Worth International', city: 'Dallas', country: 'United States', region: 'domestic-us' },
  { iata: 'DEN', name: 'Denver International', city: 'Denver', country: 'United States', region: 'domestic-us' },
  { iata: 'SFO', name: 'San Francisco International', city: 'San Francisco', country: 'United States', region: 'domestic-us' },
  { iata: 'SEA', name: 'Seattle-Tacoma International', city: 'Seattle', country: 'United States', region: 'domestic-us' },
  { iata: 'MIA', name: 'Miami International', city: 'Miami', country: 'United States', region: 'domestic-us' },
  { iata: 'BOS', name: 'Boston Logan International', city: 'Boston', country: 'United States', region: 'domestic-us' },
  { iata: 'IAH', name: 'George Bush Intercontinental', city: 'Houston', country: 'United States', region: 'domestic-us' },
  { iata: 'PHX', name: 'Phoenix Sky Harbor International', city: 'Phoenix', country: 'United States', region: 'domestic-us' },
  { iata: 'LAS', name: 'Harry Reid International', city: 'Las Vegas', country: 'United States', region: 'domestic-us' },
  { iata: 'MSP', name: 'Minneapolis-Saint Paul International', city: 'Minneapolis', country: 'United States', region: 'domestic-us' },
  { iata: 'DTW', name: 'Detroit Metropolitan Wayne County', city: 'Detroit', country: 'United States', region: 'domestic-us' },

  // International Hubs
  { iata: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom', region: 'international' },
  { iata: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', region: 'international' },
  { iata: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', region: 'international' },
  { iata: 'AMS', name: 'Amsterdam Schiphol', city: 'Amsterdam', country: 'Netherlands', region: 'international' },
  { iata: 'SIN', name: 'Changi Airport', city: 'Singapore', country: 'Singapore', region: 'international' },
  { iata: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE', region: 'international' },
  { iata: 'HKG', name: 'Hong Kong International', city: 'Hong Kong', country: 'Hong Kong', region: 'international' },
  { iata: 'NRT', name: 'Narita International', city: 'Tokyo', country: 'Japan', region: 'international' },
  { iata: 'ICN', name: 'Incheon International', city: 'Seoul', country: 'South Korea', region: 'international' },
  { iata: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand', region: 'international' },
  { iata: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey', region: 'international' },
  { iata: 'SYD', name: 'Sydney Airport', city: 'Sydney', country: 'Australia', region: 'international' },
  { iata: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia', region: 'international' },
  { iata: 'YYZ', name: 'Toronto Pearson International', city: 'Toronto', country: 'Canada', region: 'international' },
  { iata: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland', region: 'international' },
  { iata: 'FCO', name: 'Leonardo da Vinci International', city: 'Rome', country: 'Italy', region: 'international' },
  { iata: 'KUL', name: 'Kuala Lumpur International', city: 'Kuala Lumpur', country: 'Malaysia', region: 'international' },
  { iata: 'CMB', name: 'Bandaranaike International', city: 'Colombo', country: 'Sri Lanka', region: 'international' },
  { iata: 'MLE', name: 'Velana International', city: 'Male', country: 'Maldives', region: 'international' },
  { iata: 'KTM', name: 'Tribhuvan International', city: 'Kathmandu', country: 'Nepal', region: 'international' },
];

export function searchAirports(query: string): Airport[] {
  const q = (query || '').toLowerCase().trim();
  if (!q) return getPopularAirports();
  return airports.filter(
    (a) =>
      a.iata.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q)
  ).slice(0, 8);
}

const POPULAR_AIRPORT_IATAS = ['DEL', 'BOM', 'BLR', 'MAA', 'CCU', 'HYD', 'GOI', 'JFK', 'LAX', 'ORD', 'SFO', 'LHR', 'DXB', 'SIN', 'BKK', 'CDG'];

export function getPopularAirports(): Airport[] {
  const popular = POPULAR_AIRPORT_IATAS.map((iata) => airports.find((a) => a.iata === iata)).filter((a): a is Airport => Boolean(a));
  const rest = airports.filter((a) => !POPULAR_AIRPORT_IATAS.includes(a.iata));
  return [...popular, ...rest];
}

export function getAirportByIata(iata: string): Airport | undefined {
  return airports.find((a) => a.iata === iata);
}

export function getRouteType(origin: string, destination: string): 'domestic-india' | 'domestic-us' | 'international' {
  const o = getAirportByIata(origin);
  const d = getAirportByIata(destination);
  if (!o || !d) return 'international';
  if (o.region === 'domestic-india' && d.region === 'domestic-india') return 'domestic-india';
  if (o.region === 'domestic-us' && d.region === 'domestic-us') return 'domestic-us';
  return 'international';
}
