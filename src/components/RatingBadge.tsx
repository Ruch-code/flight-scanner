import { AirlineRating } from '../types';

interface Props {
  airline: AirlineRating;
}

function RatingBadge({ airline }: Props) {
  const otpColor = airline.onTimePercent >= 80 ? 'bg-green-100 text-green-800' : airline.onTimePercent >= 70 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-1">
        <span className="text-sm font-semibold text-yellow-600">
          {'★'.repeat(Math.round(airline.userRating / 2))}
          <span className="text-gray-300">
            {'★'.repeat(5 - Math.round(airline.userRating / 2))}
          </span>
        </span>
        <span className="text-xs text-gray-600 font-medium">{airline.userRating.toFixed(1)}/10</span>
      </div>
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${otpColor}`}>
        {airline.onTimePercent}% on-time
      </span>
      <span className="text-xs text-amber-600 font-semibold">
        Safety: {airline.safetyRating}/7
      </span>
    </div>
  );
}

export default RatingBadge;