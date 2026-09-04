import { AirlineRating } from '../types';

export const airlineRatings: Record<string, AirlineRating> = {
  '6E': { code: '6E', name: 'IndiGo', onTimePercent: 86.1, safetyRating: 7, userRating: 7.8, type: 'LCC', country: 'India' },
  'SG': { code: 'SG', name: 'SpiceJet', onTimePercent: 78.2, safetyRating: 5, userRating: 6.2, type: 'LCC', country: 'India' },
  'AI': { code: 'AI', name: 'Air India', onTimePercent: 84.7, safetyRating: 6, userRating: 7.2, type: 'Full-Service', country: 'India' },
  'G8': { code: 'G8', name: 'GoFirst', onTimePercent: 75.8, safetyRating: 5, userRating: 6.0, type: 'LCC', country: 'India' },
  'IX': { code: 'IX', name: 'Air India Express', onTimePercent: 82.3, safetyRating: 6, userRating: 6.8, type: 'LCC', country: 'India' },
  'QP': { code: 'QP', name: 'Akasa Air', onTimePercent: 84.0, safetyRating: 7, userRating: 7.5, type: 'LCC', country: 'India' },
  'DL': { code: 'DL', name: 'Delta Air Lines', onTimePercent: 72.3, safetyRating: 7, userRating: 8.0, type: 'Full-Service', country: 'United States' },
  'UA': { code: 'UA', name: 'United Airlines', onTimePercent: 72.8, safetyRating: 7, userRating: 7.5, type: 'Full-Service', country: 'United States' },
  'AA': { code: 'AA', name: 'American Airlines', onTimePercent: 69.4, safetyRating: 7, userRating: 7.2, type: 'Full-Service', country: 'United States' },
  'WN': { code: 'WN', name: 'Southwest Airlines', onTimePercent: 74.1, safetyRating: 7, userRating: 8.2, type: 'LCC', country: 'United States' },
  'B6': { code: 'B6', name: 'JetBlue Airways', onTimePercent: 71.5, safetyRating: 7, userRating: 7.8, type: 'Full-Service', country: 'United States' },
  'NK': { code: 'NK', name: 'Spirit Airlines', onTimePercent: 65.2, safetyRating: 5, userRating: 5.5, type: 'Ultra-LCC', country: 'United States' },
  'F9': { code: 'F9', name: 'Frontier Airlines', onTimePercent: 67.8, safetyRating: 5, userRating: 5.8, type: 'Ultra-LCC', country: 'United States' },
  'SQ': { code: 'SQ', name: 'Singapore Airlines', onTimePercent: 82.5, safetyRating: 7, userRating: 9.2, type: 'Full-Service', country: 'Singapore' },
  'EK': { code: 'EK', name: 'Emirates', onTimePercent: 80.1, safetyRating: 7, userRating: 8.8, type: 'Full-Service', country: 'UAE' },
  'QR': { code: 'QR', name: 'Qatar Airways', onTimePercent: 81.3, safetyRating: 7, userRating: 9.0, type: 'Full-Service', country: 'Qatar' },
  'EY': { code: 'EY', name: 'Etihad Airways', onTimePercent: 79.8, safetyRating: 7, userRating: 8.5, type: 'Full-Service', country: 'UAE' },
  'BA': { code: 'BA', name: 'British Airways', onTimePercent: 76.4, safetyRating: 7, userRating: 7.8, type: 'Full-Service', country: 'United Kingdom' },
  'LH': { code: 'LH', name: 'Lufthansa', onTimePercent: 78.9, safetyRating: 7, userRating: 7.6, type: 'Full-Service', country: 'Germany' },
  'AF': { code: 'AF', name: 'Air France', onTimePercent: 74.2, safetyRating: 7, userRating: 7.4, type: 'Full-Service', country: 'France' },
  'KL': { code: 'KL', name: 'KLM Royal Dutch Airlines', onTimePercent: 77.5, safetyRating: 7, userRating: 7.7, type: 'Full-Service', country: 'Netherlands' },
  'TG': { code: 'TG', name: 'Thai Airways', onTimePercent: 80.2, safetyRating: 7, userRating: 8.0, type: 'Full-Service', country: 'Thailand' },
  'MH': { code: 'MH', name: 'Malaysia Airlines', onTimePercent: 78.1, safetyRating: 6, userRating: 7.5, type: 'Full-Service', country: 'Malaysia' },
  'TK': { code: 'TK', name: 'Turkish Airlines', onTimePercent: 76.8, safetyRating: 7, userRating: 8.2, type: 'Full-Service', country: 'Turkey' },
  'QF': { code: 'QF', name: 'Qantas', onTimePercent: 84.9, safetyRating: 7, userRating: 8.5, type: 'Full-Service', country: 'Australia' },
  'AC': { code: 'AC', name: 'Air Canada', onTimePercent: 73.6, safetyRating: 7, userRating: 7.6, type: 'Full-Service', country: 'Canada' },
  'CX': { code: 'CX', name: 'Cathay Pacific', onTimePercent: 81.0, safetyRating: 7, userRating: 8.6, type: 'Full-Service', country: 'Hong Kong' },
  'JL': { code: 'JL', name: 'Japan Airlines', onTimePercent: 82.5, safetyRating: 7, userRating: 8.8, type: 'Full-Service', country: 'Japan' },
  'NH': { code: 'NH', name: 'All Nippon Airways', onTimePercent: 81.8, safetyRating: 7, userRating: 8.7, type: 'Full-Service', country: 'Japan' },
  'KE': { code: 'KE', name: 'Korean Air', onTimePercent: 80.5, safetyRating: 7, userRating: 8.4, type: 'Full-Service', country: 'South Korea' },
  'UL': { code: 'UL', name: 'SriLankan Airlines', onTimePercent: 74.0, safetyRating: 5, userRating: 6.5, type: 'Full-Service', country: 'Sri Lanka' },
  'AI_X': { code: 'AI_X', name: 'AirAsia India', onTimePercent: 80.0, safetyRating: 6, userRating: 7.0, type: 'LCC', country: 'India' },
};

export function getAirlineRating(code: string): AirlineRating {
  return airlineRatings[code] || {
    code,
    name: code,
    onTimePercent: 75.0,
    safetyRating: 5,
    userRating: 6.5,
    type: 'Full-Service',
    country: 'Unknown',
  };
}

export function getOtpColor(otp: number): string {
  if (otp >= 80) return 'text-green-600';
  if (otp >= 70) return 'text-yellow-600';
  return 'text-red-500';
}

export function getSafetyStars(rating: number): string {
  return '★'.repeat(Math.min(rating, 7)) + '☆'.repeat(7 - Math.min(rating, 7));
}
