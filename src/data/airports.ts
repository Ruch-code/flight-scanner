import { Airport } from '../types';

type AirportSeed = [string, string, string, string];

const INDIA_SEEDS: AirportSeed[] = [
  ['DEL', 'Indira Gandhi International', 'New Delhi', 'India'],
  ['BOM', 'Chhatrapati Shivaji Maharaj International', 'Mumbai', 'India'],
  ['BLR', 'Kempegowda International', 'Bangalore', 'India'],
  ['MAA', 'Chennai International', 'Chennai', 'India'],
  ['CCU', 'Netaji Subhas Chandra Bose International', 'Kolkata', 'India'],
  ['HYD', 'Rajiv Gandhi International', 'Hyderabad', 'India'],
  ['GOI', 'Goa Dabolim International', 'Goa', 'India'],
  ['GOX', 'Goa Mopa International', 'Goa', 'India'],
  ['COK', 'Cochin International', 'Kochi', 'India'],
  ['PNQ', 'Pune Airport', 'Pune', 'India'],
  ['AMD', 'Sardar Vallabhbhai Patel International', 'Ahmedabad', 'India'],
  ['JAI', 'Jaipur International', 'Jaipur', 'India'],
  ['LKO', 'Chaudhary Charan Singh International', 'Lucknow', 'India'],
  ['TRV', 'Trivandrum International', 'Thiruvananthapuram', 'India'],
  ['IXC', 'Chandigarh Airport', 'Chandigarh', 'India'],
  ['PAT', 'Lok Nayak Jayaprakash Airport', 'Patna', 'India'],
  ['BHO', 'Raja Bhoj Airport', 'Bhopal', 'India'],
  ['NAG', 'Dr. Babasaheb Ambedkar International', 'Nagpur', 'India'],
  ['GAU', 'Lokpriya Gopinath Bordoloi International', 'Guwahati', 'India'],
  ['DED', 'Jolly Grant Airport', 'Dehradun', 'India'],
  ['SXR', 'Sheikh ul-Alam International', 'Srinagar', 'India'],
  ['IXL', 'Kushok Bakula Rimpochee Airport', 'Leh', 'India'],
  ['ATQ', 'Sri Guru Ram Dass Jee International', 'Amritsar', 'India'],
  ['VNS', 'Lal Bahadur Shastri Airport', 'Varanasi', 'India'],
  ['IDR', 'Devi Ahilya Bai Holkar Airport', 'Indore', 'India'],
  ['RPR', 'Swami Vivekananda Airport', 'Raipur', 'India'],
  ['IXR', 'Birsa Munda Airport', 'Ranchi', 'India'],
  ['IXB', 'Bagdogra Airport', 'Bagdogra', 'India'],
  ['BBI', 'Biju Patnaik International', 'Bhubaneswar', 'India'],
  ['VGA', 'Vijayawada Airport', 'Vijayawada', 'India'],
  ['VTZ', 'Visakhapatnam International', 'Visakhapatnam', 'India'],
  ['IXM', 'Madurai International', 'Madurai', 'India'],
  ['CJB', 'Coimbatore International', 'Coimbatore', 'India'],
  ['IXE', 'Mangaluru International', 'Mangaluru', 'India'],
  ['TRZ', 'Tiruchirappalli International', 'Tiruchirappalli', 'India'],
  ['CCJ', 'Kozhikode International', 'Kozhikode', 'India'],
  ['IXA', 'Maharaja Bir Bikram Airport', 'Agartala', 'India'],
  ['IMF', 'Imphal International', 'Imphal', 'India'],
  ['IXZ', 'Veer Savarkar International', 'Port Blair', 'India'],
  ['UDR', 'Maharana Pratap Airport', 'Udaipur', 'India'],
  ['JDH', 'Jodhpur Airport', 'Jodhpur', 'India'],
  ['IXU', 'Aurangabad Airport', 'Aurangabad', 'India'],
  ['IXD', 'Prayagraj Airport', 'Prayagraj', 'India'],
  ['STV', 'Surat International', 'Surat', 'India'],
  ['BHJ', 'Bhuj Airport', 'Bhuj', 'India'],
  ['GWL', 'Rajmata Vijayaraje Scindia Airport', 'Gwalior', 'India'],
  ['TIR', 'Tirupati International', 'Tirupati', 'India'],
  ['HBX', 'Hubballi Airport', 'Hubballi', 'India'],
  ['IXG', 'Belagavi Airport', 'Belagavi', 'India'],
  ['SHL', 'Shillong Airport', 'Shillong', 'India'],
  ['AJL', 'Lengpui Airport', 'Aizawl', 'India'],
  ['RAJ', 'Rajkot International', 'Rajkot', 'India'],
  ['PGH', 'Pantnagar Airport', 'Pantnagar', 'India'],
  ['BPM', 'Begumpet Airport', 'Hyderabad', 'India'],
];

const US_SEEDS: AirportSeed[] = [
  ['JFK', 'John F. Kennedy International', 'New York', 'United States'],
  ['EWR', 'Newark Liberty International', 'Newark', 'United States'],
  ['LGA', 'LaGuardia Airport', 'New York', 'United States'],
  ['LAX', 'Los Angeles International', 'Los Angeles', 'United States'],
  ['ORD', "O'Hare International", 'Chicago', 'United States'],
  ['MDW', 'Chicago Midway International', 'Chicago', 'United States'],
  ['ATL', 'Hartsfield-Jackson Atlanta International', 'Atlanta', 'United States'],
  ['DFW', 'Dallas/Fort Worth International', 'Dallas', 'United States'],
  ['DAL', 'Dallas Love Field', 'Dallas', 'United States'],
  ['DEN', 'Denver International', 'Denver', 'United States'],
  ['SFO', 'San Francisco International', 'San Francisco', 'United States'],
  ['SEA', 'Seattle-Tacoma International', 'Seattle', 'United States'],
  ['MIA', 'Miami International', 'Miami', 'United States'],
  ['BOS', 'Boston Logan International', 'Boston', 'United States'],
  ['IAH', 'George Bush Intercontinental', 'Houston', 'United States'],
  ['HOU', 'William P. Hobby Airport', 'Houston', 'United States'],
  ['PHX', 'Phoenix Sky Harbor International', 'Phoenix', 'United States'],
  ['LAS', 'Harry Reid International', 'Las Vegas', 'United States'],
  ['MSP', 'Minneapolis-Saint Paul International', 'Minneapolis', 'United States'],
  ['DTW', 'Detroit Metropolitan Wayne County', 'Detroit', 'United States'],
  ['BWI', 'Baltimore/Washington International', 'Baltimore', 'United States'],
  ['DCA', 'Ronald Reagan Washington National', 'Washington D.C.', 'United States'],
  ['IAD', 'Washington Dulles International', 'Washington D.C.', 'United States'],
  ['PHL', 'Philadelphia International', 'Philadelphia', 'United States'],
  ['CLT', 'Charlotte Douglas International', 'Charlotte', 'United States'],
  ['MCO', 'Orlando International', 'Orlando', 'United States'],
  ['FLL', 'Fort Lauderdale-Hollywood International', 'Fort Lauderdale', 'United States'],
  ['TPA', 'Tampa International', 'Tampa', 'United States'],
  ['RDU', 'Raleigh-Durham International', 'Raleigh', 'United States'],
  ['AUS', 'Austin-Bergstrom International', 'Austin', 'United States'],
  ['PDX', 'Portland International', 'Portland', 'United States'],
  ['SLC', 'Salt Lake City International', 'Salt Lake City', 'United States'],
  ['SAN', 'San Diego International', 'San Diego', 'United States'],
  ['STL', 'St. Louis Lambert International', 'St. Louis', 'United States'],
  ['MCI', 'Kansas City International', 'Kansas City', 'United States'],
  ['BNA', 'Nashville International', 'Nashville', 'United States'],
  ['MSY', 'Louis Armstrong New Orleans International', 'New Orleans', 'United States'],
  ['CLE', 'Cleveland Hopkins International', 'Cleveland', 'United States'],
  ['CVG', 'Cincinnati/Northern Kentucky International', 'Cincinnati', 'United States'],
  ['IND', 'Indianapolis International', 'Indianapolis', 'United States'],
  ['PIT', 'Pittsburgh International', 'Pittsburgh', 'United States'],
  ['ANC', 'Ted Stevens Anchorage International', 'Anchorage', 'United States'],
  ['HNL', 'Daniel K. Inouye International', 'Honolulu', 'United States'],
  ['OGG', 'Kahului Airport', 'Maui', 'United States'],
];

const INTL_SEEDS: AirportSeed[] = [
  ['LHR', 'Heathrow Airport', 'London', 'United Kingdom'],
  ['LGW', 'Gatwick Airport', 'London', 'United Kingdom'],
  ['CDG', 'Charles de Gaulle Airport', 'Paris', 'France'],
  ['FRA', 'Frankfurt Airport', 'Frankfurt', 'Germany'],
  ['MUC', 'Munich Airport', 'Munich', 'Germany'],
  ['AMS', 'Amsterdam Schiphol', 'Amsterdam', 'Netherlands'],
  ['SIN', 'Changi Airport', 'Singapore', 'Singapore'],
  ['DXB', 'Dubai International', 'Dubai', 'UAE'],
  ['DOH', 'Hamad International', 'Doha', 'Qatar'],
  ['HKG', 'Hong Kong International', 'Hong Kong', 'Hong Kong'],
  ['NRT', 'Narita International', 'Tokyo', 'Japan'],
  ['HND', 'Haneda Airport', 'Tokyo', 'Japan'],
  ['ICN', 'Incheon International', 'Seoul', 'South Korea'],
  ['BKK', 'Suvarnabhumi Airport', 'Bangkok', 'Thailand'],
  ['IST', 'Istanbul Airport', 'Istanbul', 'Turkey'],
  ['SYD', 'Sydney Airport', 'Sydney', 'Australia'],
  ['MEL', 'Melbourne Airport', 'Melbourne', 'Australia'],
  ['YYZ', 'Toronto Pearson International', 'Toronto', 'Canada'],
  ['YVR', 'Vancouver International', 'Vancouver', 'Canada'],
  ['ZRH', 'Zurich Airport', 'Zurich', 'Switzerland'],
  ['VIE', 'Vienna International', 'Vienna', 'Austria'],
  ['FCO', 'Leonardo da Vinci International', 'Rome', 'Italy'],
  ['MAD', 'Adolfo Suárez Madrid-Barajas', 'Madrid', 'Spain'],
  ['BCN', 'Barcelona-El Prat', 'Barcelona', 'Spain'],
  ['LIS', 'Humberto Delgado Airport', 'Lisbon', 'Portugal'],
  ['DUB', 'Dublin Airport', 'Dublin', 'Ireland'],
  ['KUL', 'Kuala Lumpur International', 'Kuala Lumpur', 'Malaysia'],
  ['CMB', 'Bandaranaike International', 'Colombo', 'Sri Lanka'],
  ['MLE', 'Velana International', 'Male', 'Maldives'],
  ['KTM', 'Tribhuvan International', 'Kathmandu', 'Nepal'],
  ['PEK', 'Beijing Capital International', 'Beijing', 'China'],
  ['PVG', 'Shanghai Pudong International', 'Shanghai', 'China'],
  ['SGN', 'Tan Son Nhat International', 'Ho Chi Minh City', 'Vietnam'],
  ['HKT', 'Phuket International', 'Phuket', 'Thailand'],
  ['JED', 'King Abdulaziz International', 'Jeddah', 'Saudi Arabia'],
  ['RUH', 'King Khalid International', 'Riyadh', 'Saudi Arabia'],
  ['CAI', 'Cairo International', 'Cairo', 'Egypt'],
  ['JNB', 'O. R. Tambo International', 'Johannesburg', 'South Africa'],
  ['CPT', 'Cape Town International', 'Cape Town', 'South Africa'],
  ['NBO', 'Jomo Kenyatta International', 'Nairobi', 'Kenya'],
  ['GRU', 'São Paulo–Guarulhos International', 'São Paulo', 'Brazil'],
  ['EZE', 'Ministro Pistarini International', 'Buenos Aires', 'Argentina'],
  ['TLV', 'Ben Gurion Airport', 'Tel Aviv', 'Israel'],
  ['ATH', 'Athens International', 'Athens', 'Greece'],
  ['OSL', 'Oslo Gardermoen', 'Oslo', 'Norway'],
  ['CPH', 'Copenhagen Airport', 'Copenhagen', 'Denmark'],
];

export const DOMESTIC_INDIA_IATAS = INDIA_SEEDS.map((s) => s[0]);
export const DOMESTIC_US_IATAS = US_SEEDS.map((s) => s[0]);

function toAirport([iata, name, city, country]: AirportSeed, region: Airport['region']): Airport {
  return { iata, name, city, country, region };
}

export const airports: Airport[] = [
  ...INDIA_SEEDS.map((s) => toAirport(s, 'domestic-india')),
  ...US_SEEDS.map((s) => toAirport(s, 'domestic-us')),
  ...INTL_SEEDS.map((s) => toAirport(s, 'international')),
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

const POPULAR_AIRPORT_IATAS = ['DEL', 'BOM', 'BLR', 'MAA', 'CCU', 'HYD', 'GOI', 'PNQ', 'JFK', 'LAX', 'ORD', 'SFO', 'LHR', 'DXB', 'SIN', 'BKK', 'CDG', 'DOH', 'SYD', 'KTM'];

export function getPopularAirports(): Airport[] {
  const seen = new Set<string>();
  const popular: Airport[] = [];
  for (const iata of POPULAR_AIRPORT_IATAS) {
    const found = airports.find((a) => a.iata === iata);
    if (found) {
      popular.push(found);
      seen.add(iata);
    }
  }
  const rest = airports.filter((a) => !seen.has(a.iata));
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

export function isDomesticIndiaRoute(origin: string, destination: string): boolean {
  return DOMESTIC_INDIA_IATAS.includes(origin) && DOMESTIC_INDIA_IATAS.includes(destination);
}

export function isDomesticUSRoute(origin: string, destination: string): boolean {
  return DOMESTIC_US_IATAS.includes(origin) && DOMESTIC_US_IATAS.includes(destination);
}