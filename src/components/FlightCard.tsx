import { useState } from 'react';
import { Flight } from '../types';
import { getAirlineRating } from '../data/airlines';
import { formatPrice } from '../utils/currency';
import { BookingContext } from '../utils/bookingLinks';
import RatingBadge from './RatingBadge';
import CheckoutModal from './CheckoutModal';

interface Props {
  flight: Flight;
  currency: 'USD' | 'INR';
  booking: BookingContext;
  isCheapest?: boolean;
}

function FlightCard({ flight, currency, booking, isCheapest }: Props) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const airline = getAirlineRating(flight.airlineCode);
  const displayPrice = currency === flight.currency ? flight.price : currency === 'INR' ? Math.round(flight.price * 83.5) : Math.round(flight.price / 83.5);

  return (
    <div className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border ${isCheapest ? 'border-green-300 ring-2 ring-green-200' : 'border-gray-100'}`}>
      <div className="p-5">
        {isCheapest && (
          <div className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
            🏆 Cheapest Option
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Airline info */}
          <div className="flex items-center gap-3 min-w-[180px]">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
              {flight.airlineCode.slice(0, 1)}
            </div>
            <div>
              <div className="font-bold text-gray-900">{airline.name}</div>
              <div className="text-xs text-gray-500">{airline.type}</div>
              <button
                type="button"
                title={airline.country}
                className="text-xs text-primary-600 font-medium"
              >
                {flight.flightNumber}
              </button>
            </div>
          </div>

          {/* Route */}
          <div className="flex items-center gap-3 flex-1 min-w-[220px]">
            <div className="text-center">
              <div className="font-bold text-xl text-gray-900">{flight.origin}</div>
              <div className="text-xs text-gray-500">{flight.departureTime}</div>
            </div>
            <div className="flex-1 flex flex-col items-center px-2">
              <div className="text-xs text-gray-500 uppercase">
                {flight.stops === 0 ? 'Direct' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
              </div>
              <div className="flex items-center w-full my-1">
                <div className="h-px flex-1 bg-gray-300" />
                <svg className="w-4 h-4 text-primary-500 mx-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
                <div className="h-px flex-1 bg-gray-300" />
              </div>
              <div className="text-xs text-gray-500">
                {flight.duration}
              </div>
            </div>
            <div className="text-center">
              <div className="font-bold text-xl text-gray-900">{flight.destination}</div>
              <div className="text-xs text-gray-500">{flight.arrivalTime}</div>
            </div>
          </div>

          {/* Price */}
          <div className="flex flex-col items-end gap-1 min-w-[120px]">
            <div className="text-2xl font-black text-primary-700">
              {formatPrice(displayPrice, currency)}
            </div>
            <div className="text-xs text-gray-400 uppercase">{flight.class} · {currency}</div>
            <div className="text-xs text-gray-500">per person</div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
          <RatingBadge airline={airline} />
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 mr-1">Already the cheapest? Save more:</span>
            <button
              type="button"
              onClick={() => setCheckoutOpen(true)}
              className="text-sm font-bold bg-gradient-to-r from-primary-600 to-accent-500 hover:from-primary-700 hover:to-accent-600 text-white px-4 py-2 rounded-lg shadow transition-all"
            >
              Apply Coupons & Book ↪
            </button>
          </div>
        </div>
      </div>

      {checkoutOpen && (
        <CheckoutModal
          flight={flight}
          currency={currency}
          booking={booking}
          onClose={() => setCheckoutOpen(false)}
        />
      )}
    </div>
  );
}

export default FlightCard;