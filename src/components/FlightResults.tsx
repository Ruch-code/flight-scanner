import { useState } from 'react';
import { Flight } from '../types';
import FlightCard from './FlightCard';
import { getRouteType } from '../data/airports';
import { BookingContext } from '../utils/bookingLinks';
import BookingAdvisor from './BookingAdvisor';

interface Props {
  flights: Flight[];
  loading: boolean;
  error: string | null;
  origin: string;
  destination: string;
  currency: 'USD' | 'INR';
  departureDate: string;
  booking: BookingContext;
}

type SortKey = 'price' | 'duration' | 'stops' | 'departure';

function FlightResults({ flights, loading, error, origin, destination, currency, departureDate, booking }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('price');
  const [sortAsc, setSortAsc] = useState(true);

  if (loading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center">
        <div className="animate-float">
          <span className="text-6xl animate-rainbow">✈️</span>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Scouring for the cheapest fares...</p>
        <p className="text-sm text-gray-400 mt-1">Checking all airlines, routes & stopovers</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <div className="text-5xl mb-4">😢</div>
        <p className="text-red-600 font-semibold">{error}</p>
        <p className="text-gray-500 text-sm mt-2">Try a different route or check back later.</p>
      </div>
    );
  }

  if (flights.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-gray-600 font-semibold">No flights found</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your search criteria.</p>
      </div>
    );
  }

  const sortedFlights = [...flights].sort((a, b) => {
    let cmp = 0;
    switch (sortKey) {
      case 'price':
        cmp = a.price - b.price;
        break;
      case 'duration': {
        const [ah, am] = a.duration.split('h').map((p) => parseInt(p) || 0);
        const [bh, bm] = b.duration.split('h').map((p) => parseInt(p) || 0);
        cmp = ah * 60 + am - (bh * 60 + bm);
        break;
      }
      case 'stops':
        cmp = a.stops - b.stops;
        break;
      case 'departure':
        cmp = a.departureTime.localeCompare(b.departureTime);
        break;
    }
    return sortAsc ? cmp : -cmp;
  });

  const cheapestFlight = sortedFlights[0];
  const routeType = getRouteType(origin, destination);

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: 'price', label: 'Price' },
    { key: 'duration', label: 'Duration' },
    { key: 'stops', label: 'Stops' },
    { key: 'departure', label: 'Departure' },
  ];

  return (
    <div>
      <BookingAdvisor routeType={routeType} departureDate={departureDate} />

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 mt-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {flights.length} flights found
          </h2>
          <p className="text-sm text-gray-500">
            {origin} → {destination} · Live fares via Ignav API
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600 font-medium">Sort:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {sortOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => {
                  if (sortKey === opt.key) {
                    setSortAsc(!sortAsc);
                  } else {
                    setSortKey(opt.key);
                    setSortAsc(true);
                  }
                }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  sortKey === opt.key ? 'bg-white text-primary-700 shadow' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {opt.label}
                {sortKey === opt.key && (sortAsc ? ' ↑' : ' ↓')}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {sortedFlights.map((flight) => (
          <FlightCard
            key={flight.id}
            flight={flight}
            currency={currency}
            booking={booking}
            isCheapest={flight.id === cheapestFlight.id}
          />
        ))}
      </div>
    </div>
  );
}

export default FlightResults;