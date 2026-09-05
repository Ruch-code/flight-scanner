import { useEffect } from 'react';
import { getBookingAdvice, getPriceLevelColor } from '../data/bookingWindows';
import { useFareTrends } from '../hooks/useFareTrends';
import FareTrendChart from './FareTrendChart';

interface Props {
  routeType: 'domestic-india' | 'domestic-us' | 'international';
  departureDate: string;
  origin: string;
  destination: string;
  currency: 'USD' | 'INR';
  tripType: 'one-way' | 'round-trip';
  returnDate?: string;
  cls: 'economy' | 'premium-economy' | 'business' | 'first';
}

function BookingAdvisor({
  routeType,
  departureDate,
  origin,
  destination,
  currency,
  tripType,
  returnDate,
  cls,
}: Props) {
  const advice = getBookingAdvice(routeType);
  const levelColors = getPriceLevelColor(advice.priceLevel);
  const { data: trends, loading: trendsLoading, error: trendsError, loadTrends } = useFareTrends();

  useEffect(() => {
    if (!origin || !destination || !departureDate) return;
    loadTrends({ origin, destination, departureDate, returnDate, tripType, cls, currency });
  }, [origin, destination, departureDate, returnDate, tripType, cls, currency, loadTrends]);

  const getDaysUntil = () => {
    if (!departureDate) return null;
    const now = new Date();
    const dep = new Date(departureDate);
    return Math.ceil((dep.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const daysUntil = getDaysUntil();

  let urgency: { color: string; label: string } | null = null;
  if (daysUntil !== null && daysUntil >= 0) {
    if (routeType === 'international') {
      if (daysUntil < 45) urgency = { color: 'text-red-700 bg-rose-50 border-rose-300', label: `Only ${daysUntil} days out — book ASAP, prices are rising!` };
      else if (daysUntil <= 150) urgency = { color: 'text-green-800 bg-green-50 border-green-300', label: `✓ ${daysUntil} days out — you're in the sweet spot for International!` };
      else urgency = { color: 'text-amber-700 bg-amber-50 border-amber-300', label: `${daysUntil} days out — a bit early, watch for fare drops.` };
    } else {
      if (daysUntil < 20) urgency = { color: 'text-red-700 bg-rose-50 border-rose-300', label: `Only ${daysUntil} days out — booking NOW is crucial!` };
      else if (daysUntil <= 56) urgency = { color: 'text-green-800 bg-green-50 border-green-300', label: `✓ ${daysUntil} days out — perfect booking window!` };
      else urgency = { color: 'text-amber-700 bg-amber-50 border-amber-300', label: `${daysUntil} days out — a bit early, you can wait for a better fare.` };
    }
  }

  const routeLabel =
    routeType === 'domestic-india' ? '🇮🇳 Domestic India' : routeType === 'domestic-us' ? '🇺🇸 Domestic US' : '🌍 International';

  return (
    <div className="relative">
      <div
        className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-r from-primary-200/40 via-accent-200/40 to-primary-200/40 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl border border-white/70 shadow-xl p-5 sm:p-6">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🧠</span>
            <h3 className="text-xl font-black text-gray-900 tracking-tight">
              Smart Booking Advisor
            </h3>
          </div>
          <span className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-white/90 border border-gray-200 text-gray-600 shadow-sm">
            {routeLabel}
          </span>
        </div>

        {urgency && (
          <div className={`rounded-xl border px-4 py-2.5 text-sm font-bold mb-4 ${urgency.color}`}>
            {urgency.label}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white/80 border border-gray-100 shadow-sm p-4 relative overflow-hidden">
            <span className="absolute top-2.5 right-2.5 flex items-center gap-1 text-[11px] font-black text-amber-600">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" aria-hidden="true" />
              on track
            </span>
            <div className="text-sm font-bold text-amber-700 mb-1">Optimal Booking Window</div>
            <div className="text-lg font-black text-gray-900">{advice.optimalDays}</div>
            <p className="text-sm text-gray-600 mt-1">{advice.tip}</p>
          </div>

          <div className="rounded-2xl bg-white/80 border border-gray-100 shadow-sm p-4 relative overflow-hidden">
            <span className="absolute top-2.5 right-2.5 flex items-center gap-1 text-[11px] font-black text-accent-600">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-400 animate-pulse" aria-hidden="true" />
              fair
            </span>
            <div className="text-sm font-bold text-accent-700 mb-1">Price Level</div>
            <span className={`inline-block text-sm font-bold px-3 py-1 rounded-full mt-0.5 ${levelColors.bg} ${levelColors.text}`}>
              {levelColors.label}
            </span>
            <p className="text-sm text-gray-600 mt-2">{advice.dayOfWeekTip}</p>
          </div>
        </div>

        {trends && <FareTrendChart trends={trends} currency={currency} userDate={departureDate} />}

        {trendsLoading && (
          <div className="mt-6 rounded-2xl bg-white/80 border border-white/70 shadow-sm p-6 flex items-center justify-center gap-2 text-gray-600 font-medium text-sm">
            <span className="animate-float">🎯</span> tuning live fares across the next few months…
          </div>
        )}

        {trendsError && !trendsLoading && (
          <div className="mt-6 rounded-2xl bg-rose-50/90 border border-rose-200 px-4 py-3 text-sm font-medium text-rose-700">
            😢 Live fare trend isn't available right now ({trendsError}). The booking advice above still applies.
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="text-sm font-bold text-gray-800 mb-2">Cheapest Months</div>
            <div className="flex flex-wrap gap-1.5">
              {advice.bestMonths.map((m) => (
                <span key={m} className="text-xs font-bold bg-green-100 text-green-800 px-2.5 py-1 rounded-full border border-green-200">
                  ✓ {m}
                </span>
              ))}
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="text-sm font-bold text-gray-800 mb-2">Most Expensive Months</div>
            <div className="flex flex-wrap gap-1.5">
              {advice.avoidMonths.map((m) => (
                <span key={m} className="text-xs font-bold bg-red-100 text-red-700 px-2.5 py-1 rounded-full border border-red-200">
                  ✗ {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingAdvisor;