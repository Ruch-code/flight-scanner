import { useEffect, useState } from 'react';
import { Flight } from '../types';
import { formatPrice } from '../utils/currency';
import { getAirlineRating } from '../data/airlines';
import { coupons } from '../data/coupons';
import { getRouteRegion, getPortalsForRoute, getAirlineBookingSite, buildPortalUrl, BookingContext } from '../utils/bookingLinks';

interface Props {
  flight: Flight;
  currency: 'USD' | 'INR';
  booking: BookingContext;
  onClose: () => void;
}

function CheckoutModal({ flight, currency, booking, onClose }: Props) {
  const region = getRouteRegion(booking.origin, booking.destination);
  const routeTypeTag = region === 'intl' ? 'international' : 'domestic';
  const routePortals = getPortalsForRoute(booking.origin, booking.destination);
  const airline = getAirlineRating(flight.airlineCode);
  const airlineSite = getAirlineBookingSite(flight);
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedPortal, setSelectedPortal] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const relevantCoupons = (portal: { couponPlatforms: string[] }) =>
    coupons.filter(
      (c) =>
        c.working &&
        portal.couponPlatforms.includes(c.platform) &&
        (c.region === region || c.region === 'both' || (region === 'us' && c.region === 'us')) &&
        (c.routeType === routeTypeTag || c.routeType === 'both')
    );

  const displayPrice = currency === flight.currency ? flight.price : currency === 'INR' ? Math.round(flight.price * 83.5) : Math.round(flight.price / 83.5);

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      setCopied(null);
    }
  };

  const openPortal = (url: string, portalName: string) => {
    window.open(url, '_blank', 'noopener');
    setSelectedPortal(portalName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h3 className="text-lg font-black text-gray-900">Checkout & Apply Coupons</h3>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              {airline.name} · {flight.flightNumber} · {flight.origin} → {flight.destination}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="font-black text-primary-700 text-lg">{formatPrice(displayPrice, currency)}</div>
              <div className="text-[10px] text-gray-400 uppercase">per person</div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 text-xl transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-5 bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-100 rounded-xl px-4 py-3 text-sm text-gray-700">
            🎯 <strong>Tip:</strong> Open a portal below, pick this flight, then paste the coupon code at
            checkout to slash the price further.
          </div>

          {/* Airline direct */}
          {airlineSite && (
            <div className="mb-4">
              <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">🎫 Book Direct</div>
              <div className="border border-gray-200 rounded-xl p-4 hover:border-primary-300 hover:shadow-md transition-all bg-white flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold shrink-0">
                    {flight.airlineCode.slice(0, 1)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-gray-900">{airline.name} — Official Site</div>
                    <div className="text-xs text-gray-500">
                      Best seat selection, baggage, and loyalty points. Fares often match OTAs.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => openPortal(airlineSite, airline.name)}
                  className="flex-shrink-0 text-sm font-semibold bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Go to site ↗
                </button>
              </div>
            </div>
          )}

          {/* Portals */}
          <div className="mb-4">
            <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">🛒 Compare & Book on a Portal</div>
            <div className="flex flex-col gap-3">
              {routePortals.map((portal) => {
                const portalCoupons = relevantCoupons(portal);
                const url = buildPortalUrl(portal, booking, currency);
                const isSelected = selectedPortal === portal.name;
                return (
                  <div
                    key={portal.id}
                    className={`border rounded-xl p-4 transition-all ${
                      isSelected ? 'border-green-300 ring-2 ring-green-200 bg-green-50/40' : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl shake shrink-0">{portal.icon}</span>
                        <div className="min-w-0">
                          <div className="font-bold text-gray-900">{portal.name}</div>
                          <div className="text-xs text-gray-500">{portal.description}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => openPortal(url, portal.name)}
                        className="flex-shrink-0 text-sm font-bold bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg shadow transition-colors"
                      >
                        Open & Book ↗
                      </button>
                    </div>

                    {isSelected && (
                      <div className="mt-2 text-xs font-semibold text-green-700 bg-green-100 inline-block px-2 py-1 rounded">
                        ✓ Opened in new tab — apply code below at checkout
                      </div>
                    )}

                    {portalCoupons.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="text-xs font-semibold text-gray-600 mb-2">🔖 Coupons that work on {portal.name}:</div>
                        <div className="flex flex-wrap gap-2">
                          {portalCoupons.map((c) => (
                            <div key={c.id} className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5">
                              <button
                                onClick={() => handleCopy(c.code)}
                                className="font-mono font-bold text-xs bg-white border border-dashed border-primary-300 text-primary-700 px-2 py-1 rounded hover:bg-primary-50 transition-colors"
                                title="Copy code"
                              >
                                {c.code}
                              </button>
                              <span className="text-xs text-gray-700 font-medium whitespace-nowrap">{c.discount}</span>
                              {copied === c.code && (
                                <span className="text-[10px] font-bold text-green-700">✓ copied!</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bank offer hint */}
          {region === 'india' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 text-sm text-yellow-900">
              💳 <strong>Bank weekend offers:</strong> HDFC (1st weekend) · Axis (2nd) · ICICI (3rd) · SBI (4th).
              Pay with the matching card at any of the portals above for extra ₹500–₹1,500 off.
            </div>
          )}

          <p className="mt-4 text-xs text-gray-400">
            Deep links open the portal with your route, dates & cabin pre-filled. Prices at the portal may differ
            slightly from the estimate shown here.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CheckoutModal;