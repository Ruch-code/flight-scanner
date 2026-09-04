import { useState } from 'react';
import AirportSearch from './AirportSearch';
import { FlightSearchParams } from '../types';

interface Props {
  onSearch: (params: FlightSearchParams) => void;
  loading: boolean;
}

const flightClasses = [
  { value: 'economy', label: 'Economy' },
  { value: 'premium-economy', label: 'Premium Economy' },
  { value: 'business', label: 'Business' },
  { value: 'first', label: 'First' },
];

function SearchForm({ onSearch, loading }: Props) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [cls, setCls] = useState<'economy' | 'premium-economy' | 'business' | 'first'>('economy');
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way');
  const [error, setError] = useState<string | null>(null);

  const handleSwap = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!origin || !destination) {
      setError('Please select both origin and destination airports');
      return;
    }
    if (origin === destination) {
      setError('Origin and destination cannot be the same');
      return;
    }
    if (!departureDate) {
      setError('Please select a departure date');
      return;
    }
    if (tripType === 'round-trip' && !returnDate) {
      setError('Please select a return date for round-trip');
      return;
    }
    if (tripType === 'round-trip' && returnDate < departureDate) {
      setError('Return date must be after departure date');
      return;
    }

    onSearch({
      origin,
      destination,
      departureDate,
      returnDate: tripType === 'round-trip' ? returnDate : undefined,
      passengers,
      class: cls,
      tripType,
      currency: 'INR',
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-6 md:p-8"
    >
      {/* Trip type + passenger toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-2">
          {(['one-way', 'round-trip'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTripType(t)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                tripType === t
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t === 'one-way' ? 'One Way' : 'Round Trip'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700 font-medium">Passengers</label>
          <select
            value={passengers}
            onChange={(e) => setPassengers(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 bg-white"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Origin / Destination */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
        <div>
          <AirportSearch label="From" value={origin} onChange={setOrigin} placeholder="Search city or airport" />
        </div>
        <button
          type="button"
          onClick={handleSwap}
          className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 hover:scale-110 transition-all mb-1"
          title="Swap"
        >
          ⇄
        </button>
        <div className="md:hidden" />
        <div>
          <AirportSearch label="To" value={destination} onChange={setDestination} placeholder="Search city or airport" />
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Departure</label>
          <input
            type="date"
            value={departureDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setDepartureDate(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 bg-white placeholder:text-gray-400"
          />
        </div>
        {tripType === 'round-trip' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Return</label>
            <input
              type="date"
              value={returnDate}
              min={departureDate || new Date().toISOString().split('T')[0]}
              onChange={(e) => setReturnDate(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 bg-white placeholder:text-gray-400"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
          <select
            value={cls}
            onChange={(e) => setCls(e.target.value as typeof cls)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 bg-white placeholder:text-gray-400"
          >
            {flightClasses.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 hover:from-primary-700 hover:via-primary-600 hover:to-accent-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Searching cheapest flights...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            ✈️ Find Cheapest Flights
          </span>
        )}
      </button>

      <p className="mt-3 text-center text-xs text-gray-500">
        Compare prices across all airlines · Ratings included · Booking advice & coupons
      </p>
    </form>
  );
}

export default SearchForm;