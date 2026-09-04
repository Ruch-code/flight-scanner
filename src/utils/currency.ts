const RATES: Record<string, number> = {
  'USD_INR': 83.50,
  'INR_USD': 0.012,
};

export function convertCurrency(amount: number, from: 'USD' | 'INR', to: 'USD' | 'INR'): number {
  if (from === to) return amount;
  const key = `${from}_${to}`;
  const rate = RATES[key];
  if (!rate) return amount;
  return Math.round(amount * rate * 100) / 100;
}

export function formatPrice(amount: number, currency: 'USD' | 'INR'): string {
  if (currency === 'USD') {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function getPriceRange(currency: 'USD' | 'INR'): { cheap: number; mid: number; expensive: number } {
  if (currency === 'USD') {
    return { cheap: 200, mid: 500, expensive: 1000 };
  }
  return { cheap: 5000, mid: 15000, expensive: 40000 };
}
