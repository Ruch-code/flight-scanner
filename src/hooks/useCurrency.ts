import { useState, useCallback } from 'react';
import { Currency } from '../types';

export function useCurrency() {
  const [currency, setCurrency] = useState<Currency>('INR');

  const toggleCurrency = useCallback(() => {
    setCurrency((prev) => (prev === 'USD' ? 'INR' : 'USD'));
  }, []);

  const setCurrencyValue = useCallback((val: Currency) => {
    setCurrency(val);
  }, []);

  return { currency, toggleCurrency, setCurrencyValue };
}
