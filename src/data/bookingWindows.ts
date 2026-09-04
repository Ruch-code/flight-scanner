import { BookingWindowAdvice } from '../types';

const bookingWindows: Record<string, BookingWindowAdvice> = {
  'domestic-india': {
    routeType: 'domestic-india',
    optimalDays: '2–8 weeks before departure',
    tip: 'Book 2–8 weeks before for best prices. Last-minute fares spike 20–40% within 3 weeks of departure.',
    priceLevel: 'typical',
    bestMonths: ['January', 'February', 'March', 'September', 'October', 'November'],
    avoidMonths: ['June', 'July', 'December'],
    dayOfWeekTip: 'Fly on Tuesday or Wednesday to save 13–14% vs Sunday departures.',
  },
  'domestic-us': {
    routeType: 'domestic-us',
    optimalDays: '1–3 months before (sweet spot: 43 days)',
    tip: 'Book 1–3 months in advance. The advance purchase window matters 3–5x more than which day you buy.',
    priceLevel: 'typical',
    bestMonths: ['January', 'February', 'March', 'September', 'October'],
    avoidMonths: ['June', 'July', 'December'],
    dayOfWeekTip: 'Friday is now cheapest to book (14% cheaper than Sunday). Fly midweek.',
  },
  'international': {
    routeType: 'international',
    optimalDays: '2–8 months before departure',
    tip: 'Book 2–8 months ahead. Europe: 4–6 months. Asia: 3–4 months. Peak season: add 1–2 months.',
    priceLevel: 'typical',
    bestMonths: ['January', 'February', 'March', 'September', 'October', 'November'],
    avoidMonths: ['June', 'July', 'December'],
    dayOfWeekTip: 'Tuesday and Wednesday flights are typically 13–14% cheaper than Sunday.',
  },
};

export function getBookingAdvice(routeType: 'domestic-india' | 'domestic-us' | 'international'): BookingWindowAdvice {
  return bookingWindows[routeType];
}

export function getPriceLevelColor(level: 'low' | 'typical' | 'high'): { bg: string; text: string; label: string } {
  switch (level) {
    case 'low':
      return { bg: 'bg-green-100', text: 'text-green-800', label: 'Great Deal' };
    case 'typical':
      return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Fair Price' };
    case 'high':
      return { bg: 'bg-red-100', text: 'text-red-800', label: 'Above Average' };
  }
}

export function getBestBookingWindow(routeType: string): { daysInAdvance: number; label: string } {
  switch (routeType) {
    case 'domestic-india':
      return { daysInAdvance: 35, label: '~5 weeks' };
    case 'domestic-us':
      return { daysInAdvance: 43, label: '~6 weeks' };
    default:
      return { daysInAdvance: 120, label: '~4 months' };
  }
}
