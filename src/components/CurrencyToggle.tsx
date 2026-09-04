import { useState } from 'react';
import { Currency } from '../types';

interface Props {
  currency: Currency;
  onChange: (currency: Currency) => void;
}

function CurrencyToggle({ currency, onChange }: Props) {
  return (
    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-lg p-1">
      {(['INR', 'USD'] as Currency[]).map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${
            currency === c
              ? 'bg-white text-primary-700 shadow'
              : 'text-white/80 hover:text-white'
          }`}
        >
          {c === 'INR' ? '₹ INR' : '$ USD'}
        </button>
      ))}
    </div>
  );
}

export default CurrencyToggle;