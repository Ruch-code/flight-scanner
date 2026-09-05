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
    <div className="sketch-card paper p-5 sm:p-6 relative overflow-hidden">
      <span className="tape absolute -top-3 left-1/2 -translate-x-1/2 h-7 w-24 -rotate-1" aria-hidden="true" />

      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🧠</span>
          <h3 className="font-marker text-xl font-bold text-gray-900 tracking-tight">
            Smart Booking Advisor
          </h3>
        </div>
        <span className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-white/70 border border-gray-900/30 font-dood uppercase tracking-wide">
          {routeLabel}
        </span>
      </div>

      {urgency && (
        <div className={`font-dood border-l-4 rounded-r-lg px-4 py-2.5 text-sm font-bold mb-4 ${urgency.color}`}>
          {urgency.label}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="sketch-card paper-lined p-4 relative wiggle-host">
          <span className="stamp absolute top-2 right-2 font-marker text-amber-700 bg-amber-100/80 border-2 border-amber-700/60 px-2 py-0.5 rounded">✎ on track</span>
          <div className="font-hand text-lg font-bold text-amber-900 mb-1">Optimal Booking Window</div>
          <div className="font-marker font-bold text-gray-900 text-lg">{advice.optimalDays}</div>
          <p className="font-dood text-sm text-gray-700 mt-1">{advice.tip}</p>
        </div>

        <div className="sketch-card paper-lined p-4 relative wiggle-host">
          <span className="stamp absolute top-2 right-2 font-marker text-accent-700 bg-accent-100/80 border-2 border-accent-700/60 px-2 py-0.5 rounded">≈ fair</span>
          <div className="font-hand text-lg font-bold text-accent-900 mb-1">Price Level</div>
          <span className={`inline-block text-sm font-bold px-3 py-1 rounded-full mt-0.5 ${levelColors.bg} ${levelColors.text}`}>
            {levelColors.label}
          </span>
          <p className="font-dood text-sm text-gray-700 mt-2">{advice.dayOfWeekTip}</p>
        </div>
      </div>

      {trends && <FareTrendChart trends={trends} currency={currency} userDate={departureDate} />}

      {trendsLoading && (
        <div className="mt-6 sketch-card paper p-6 flex items-center justify-center gap-2 text-gray-600 font-dood text-sm">
          <span className="animate-float">✈️</span> sketching live fares across the next few months…
        </div>
      )}

      {trendsError && !trendsLoading && (
        <div className="mt-6 rounded-lg bg-rose-50 border border-rose-300 font-dood px-4 py-3 text-sm text-rose-700">
          😢 Live fare trend isn't available right now ({trendsError}). The sketch above still applies.
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="font-hand text-base font-bold text-gray-800 mb-2">Cheapest Months</div>
          <div className="flex flex-wrap gap-1.5">
            {advice.bestMonths.map((m) => (
              <span key={m} className="font-dood text-xs font-bold bg-green-100 text-green-800 px-2.5 py-1 rounded-full border border-green-300">
                ✓ {m}
              </span>
            ))}
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <div className="font-hand text-base font-bold text-gray-800 mb-2">Most Expensive Months</div>
          <div className="flex flex-wrap gap-1.5">
            {advice.avoidMonths.map((m) => (
              <span key={m} className="font-dood text-xs font-bold bg-red-100 text-red-700 px-2.5 py-1 rounded-full border border-red-300">
                ✗ {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingAdvisor;