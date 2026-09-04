import { useState } from 'react';
import { getCouponsForRegion, bankWeekends, majorSalePeriods, getActiveBankOffers } from '../data/coupons';

type Region = 'india' | 'us';

function CouponPanel() {
  const [region, setRegion] = useState<Region>('india');
  const regionCoupons = getCouponsForRegion(region);
  const activeOffers = getActiveBankOffers();

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎟️</span>
          <h3 className="text-xl font-bold text-gray-900">Coupons & Deals</h3>
        </div>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setRegion('india')}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${region === 'india' ? 'bg-white text-orange-600 shadow' : 'text-gray-500'}`}
          >
            🇮🇳 India
          </button>
          <button
            onClick={() => setRegion('us')}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${region === 'us' ? 'bg-white text-blue-600 shadow' : 'text-gray-500'}`}
          >
            🇺🇸 US
          </button>
        </div>
      </div>

      {region === 'india' && activeOffers.length > 0 && (
        <div className="mb-5">
          <div className="text-xs font-bold uppercase tracking-wide text-green-700 bg-green-50 inline-block px-2 py-1 rounded mb-2">
            🔥 Currently Active This Week
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeOffers.map((offer) => (
              <div key={offer.bank} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3">
                <div className="text-xs font-bold text-green-800 uppercase">{offer.weekend}</div>
                <div className="font-bold text-gray-900">{offer.bank}</div>
                <div className="text-sm text-gray-600">{offer.offer}</div>
                <div className="text-sm font-bold text-green-700 mt-1">{offer.discount}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {regionCoupons.map((coupon) => (
          <div
            key={coupon.id}
            className={`border rounded-xl p-4 transition-all hover:shadow-md ${coupon.working ? 'border-green-200 bg-white' : 'border-gray-200 opacity-50'}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="flex-shrink-0">🏷️</span>
                <div className="min-w-0">
                  <div className="font-bold text-gray-900 truncate">{coupon.platform}</div>
                  <div className="text-xs text-gray-500">{coupon.description}</div>
                </div>
              </div>
              <span className={`flex-shrink-0 text-xs font-bold px-2 py-1 rounded-full ${coupon.working ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                {coupon.working ? `${coupon.successRate}% success` : 'Expired'}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <code className="bg-gray-100 border-2 border-dashed border-primary-300 text-primary-700 font-mono font-bold px-3 py-1 rounded-lg tracking-wider">
                {coupon.code}
              </code>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(coupon.code)}
                className="text-xs font-semibold text-primary-600 hover:text-primary-800"
              >
                Copy
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-600">
              <span className="bg-primary-50 text-primary-700 font-medium px-2 py-0.5 rounded">{coupon.discount}</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded">
                Min spend: {coupon.minSpend > 0 ? (region === 'india' ? `₹${coupon.minSpend.toLocaleString('en-IN')}` : `$${coupon.minSpend}`) : 'None'}
              </span>
              {coupon.maxDiscount < 999 && (
                <span className="bg-gray-100 px-2 py-0.5 rounded">
                  Max: {region === 'india' ? `₹${coupon.maxDiscount.toLocaleString('en-IN')}` : `$${coupon.maxDiscount}`}
                </span>
              )}
              <span className="bg-gray-100 px-2 py-0.5 rounded truncate max-w-full">{coupon.paymentMethod}</span>
            </div>

            <div className="mt-2 text-xs text-gray-400">
              Expires: {coupon.expiry} · {coupon.routeType === 'both' ? 'Domestic + International' : coupon.routeType.charAt(0).toUpperCase() + coupon.routeType.slice(1)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <div className="text-sm font-bold text-gray-700 mb-3">📅 Bank Offer Calendar (India)</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {bankWeekends.map((b) => (
            <div key={b.bank} className="bg-gray-50 rounded-xl p-3 border border-gray-200">
              <div className="text-xs font-bold text-primary-700 uppercase">{b.weekend}</div>
              <div className="font-bold text-gray-900 text-sm">{b.bank}</div>
              <div className="text-xs text-gray-600 mt-1">{b.offer}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="text-sm font-bold text-gray-700 mb-3">📆 Major Sale Periods</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {majorSalePeriods.map((s) => (
            <div key={s.event} className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-3 border border-orange-100">
              <div className="flex items-center justify-between">
                <div className="font-bold text-gray-900">{s.event}</div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  s.region === 'india' ? 'bg-orange-100 text-orange-700' : s.region === 'us' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {s.region.toUpperCase()}
                </span>
              </div>
              <div className="text-sm text-gray-600">{s.month}</div>
              <div className="text-sm font-bold text-green-700">{s.discount} off</div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-400">
        Coupons are curated and may vary. Always verify at checkout before booking. Deals updated periodically.
      </p>
    </div>
  );
}

export default CouponPanel;