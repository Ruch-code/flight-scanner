import { getBookingAdvice, getPriceLevelColor } from '../data/bookingWindows';

interface Props {
  routeType: 'domestic-india' | 'domestic-us' | 'international';
  departureDate: string;
}

function BookingAdvisor({ routeType, departureDate }: Props) {
  const advice = getBookingAdvice(routeType);
  const levelColors = getPriceLevelColor(advice.priceLevel);

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
      if (daysUntil < 45) urgency = { color: 'text-red-600 bg-red-50 border-red-200', label: `⚠️ Only ${daysUntil} days out — book ASAP, prices are rising!` };
      else if (daysUntil <= 150) urgency = { color: 'text-green-600 bg-green-50 border-green-200', label: `✓ ${daysUntil} days out — you're in the sweet spot for International!` };
      else urgency = { color: 'text-yellow-600 bg-yellow-50 border-yellow-200', label: `ℹ️ ${daysUntil} days out — a bit early, watch for fare drops.` };
    } else {
      if (daysUntil < 20) urgency = { color: 'text-red-600 bg-red-50 border-red-200', label: `⚠️ Only ${daysUntil} days out — booking NOW is crucial!` };
      else if (daysUntil <= 56) urgency = { color: 'text-green-600 bg-green-50 border-green-200', label: `✓ ${daysUntil} days out — perfect booking window!` };
      else urgency = { color: 'text-yellow-600 bg-yellow-50 border-yellow-200', label: `ℹ️ ${daysUntil} days out — a bit early, you can wait for a better fare.` };
    }
  }

  const routeLabel =
    routeType === 'domestic-india' ? '🇮🇳 Domestic India' : routeType === 'domestic-us' ? '🇺🇸 Domestic US' : '🌍 International';

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🧠</span>
          <h3 className="text-lg font-bold text-gray-900">Smart Booking Advisor</h3>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary-100 text-primary-700 uppercase tracking-wide">
          {routeLabel}
        </span>
      </div>

      {urgency && (
        <div className={`border rounded-xl px-4 py-3 text-sm font-semibold mb-4 ${urgency.color}`}>
          {urgency.label}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-primary-50 rounded-xl p-4 border border-primary-100">
          <div className="text-sm font-semibold text-primary-700 mb-1">Optimal Booking Window</div>
          <div className="font-bold text-gray-900 text-lg">{advice.optimalDays}</div>
          <p className="text-sm text-gray-600 mt-1">{advice.tip}</p>
        </div>

        <div className="bg-accent-50 rounded-xl p-4 border border-accent-100">
          <div className="text-sm font-semibold text-accent-700 mb-1">Price Level</div>
          <span className={`inline-block text-sm font-bold px-3 py-1 rounded-full mt-1 ${levelColors.bg} ${levelColors.text}`}>
            {levelColors.label}
          </span>
          <p className="text-sm text-gray-600 mt-2">{advice.dayOfWeekTip}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="text-sm font-semibold text-gray-700 mb-2">Cheapest Months</div>
          <div className="flex flex-wrap gap-1.5">
            {advice.bestMonths.map((m) => (
              <span key={m} className="text-xs font-medium bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
                ✓ {m}
              </span>
            ))}
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <div className="text-sm font-semibold text-gray-700 mb-2">Most Expensive Months</div>
          <div className="flex flex-wrap gap-1.5">
            {advice.avoidMonths.map((m) => (
              <span key={m} className="text-xs font-medium bg-red-100 text-red-700 px-2.5 py-1 rounded-full">
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