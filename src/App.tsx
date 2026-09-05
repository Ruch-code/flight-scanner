import { useState } from 'react';
import SearchForm from './components/SearchForm';
import FlightResults from './components/FlightResults';
import CouponPanel from './components/CouponPanel';
import AboutMe from './components/AboutMe';
import AboutMaker from './components/AboutMaker';
import CurrencyToggle from './components/CurrencyToggle';
import CursorCompanion from './components/CursorCompanion';
import { useFlightSearch } from './hooks/useFlightSearch';
import { useCurrency } from './hooks/useCurrency';
import { FlightSearchParams } from './types';

function App() {
  const { flights, loading, error, note, searchFlights } = useFlightSearch();
  const { currency, setCurrencyValue } = useCurrency();
  const [lastSearch, setLastSearch] = useState<{
    origin: string;
    destination: string;
    departDate: string;
    returnDate?: string;
    passengers: number;
    tripType: 'one-way' | 'round-trip';
    cls: 'economy' | 'premium-economy' | 'business' | 'first';
  } | null>(null);

  const handleSearch = (params: FlightSearchParams) => {
    setLastSearch({
      origin: params.origin,
      destination: params.destination,
      departDate: params.departureDate,
      returnDate: params.returnDate,
      passengers: params.passengers,
      tripType: params.tripType,
      cls: params.class,
    });
    searchFlights({ ...params, currency });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Floating background planes */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <span className="absolute top-20 left-[10%] text-3xl opacity-10 animate-float" style={{ animationDelay: '0s' }}>✈️</span>
        <span className="absolute top-40 right-[15%] text-4xl opacity-10 animate-float" style={{ animationDelay: '1s' }}>✈️</span>
        <span className="absolute bottom-32 left-[20%] text-2xl opacity-10 animate-float" style={{ animationDelay: '2s' }}>✈️</span>
        <span className="absolute bottom-20 right-[25%] text-5xl opacity-10 animate-float" style={{ animationDelay: '0.5s' }}>✈️</span>
        <span className="absolute top-[60%] left-[45%] text-3xl opacity-10 animate-float" style={{ animationDelay: '1.5s' }}>✈️</span>
      </div>

      {/* Paper-plane cursor companion */}
      <CursorCompanion />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-float">✈️</span>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                SkySaver
              </h1>
              <p className="text-xs text-white/80 hidden sm:block">
                Smart flight deals · Ratings · Booking insights
              </p>
            </div>
          </div>
          <CurrencyToggle currency={currency} onChange={setCurrencyValue} />
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 text-white -mt-2 pt-6 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <span className="absolute top-8 left-[15%] text-5xl">🌍</span>
          <span className="absolute top-16 right-[20%] text-4xl">✈️</span>
          <span className="absolute bottom-10 left-[30%] text-3xl">🗺️</span>
        </div>
        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="text-center mb-8 pt-4">
            <h2 className="text-3xl md:text-5xl font-black leading-tight drop-shadow-lg">
              Find the Cheapest Flight,
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200">
                Before Anyone Else Does.
              </span>
            </h2>
            <p className="mt-4 text-white/85 max-w-2xl mx-auto">
              Compare thousands of fares, see airline ratings, get smart booking-window advice,
              and unlock coupons to cut prices further. India & global routes · USD & INR.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <SearchForm onSearch={handleSearch} loading={loading} />
          </div>
        </div>
      </section>

      {/* Results */}
      <main className="max-w-6xl mx-auto px-4 -mt-8 pb-20">
        {lastSearch && (
          <div className="mb-6">
            <FlightResults
              flights={flights}
              loading={loading}
              error={error}
              note={note}
              origin={lastSearch.origin}
              destination={lastSearch.destination}
              currency={currency}
              departureDate={lastSearch.departDate}
              booking={{
                origin: lastSearch.origin,
                destination: lastSearch.destination,
                departureDate: lastSearch.departDate,
                returnDate: lastSearch.returnDate,
                passengers: lastSearch.passengers,
                tripType: lastSearch.tripType,
                class: lastSearch.cls,
              }}
            />
          </div>
        )}

        {/* Coupons */}
        <section className="mt-6">
          <CouponPanel />
        </section>

        {/* Colorful airplane that flies to About */}
        <section className="mt-10">
          <AboutMe />
        </section>

        {/* About section (reveals on hover) */}
        <AboutMaker />
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-primary-700 via-primary-600 to-accent-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">✈️</span>
              <span className="font-bold text-lg">SkySaver</span>
              <span className="text-white/60 text-sm">· Smart flight deals & booking insights</span>
            </div>
            <div className="text-center md:text-right">
              <div className="font-semibold">
                Made by{' '}
                <span className="font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200">
                  Ruchi Kandpal
                </span>
                {' '}💜
              </div>
              <div className="text-xs text-white/60 mt-1">
                Flights · Ratings · Booking window advice · Coupons
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-white/20 text-center text-xs text-white/50 flex flex-col md:flex-row items-center justify-center gap-2">
            <span>© {new Date().getFullYear()} SkySaver by Ruchi Kandpal</span>
            <span className="hidden md:inline">·</span>
            <span>Prices may vary · Deals verified periodically · Travel safe ✈️</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;