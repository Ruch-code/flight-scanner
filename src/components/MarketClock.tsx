import { useEffect, useState } from 'react';
import { getMarketStatus, formatCountdown, type MarketStatus } from '../utils/marketCalendar';

const KIND_STYLE: Record<string, { dot: string; chip: string; label: string }> = {
  open: { dot: 'bg-green-500 animate-pulse', chip: 'bg-green-100 text-green-800 border-green-300', label: '●' },
  'pre-open': { dot: 'bg-amber-400 animate-pulse', chip: 'bg-amber-100 text-amber-800 border-amber-300', label: '◐' },
  'after-hours': { dot: 'bg-indigo-400', chip: 'bg-indigo-100 text-indigo-800 border-indigo-300', label: '◑' },
  closed: { dot: 'bg-gray-400', chip: 'bg-gray-100 text-gray-700 border-gray-300', label: '○' },
  weekend: { dot: 'bg-gray-400', chip: 'bg-gray-200 text-gray-600 border-gray-300', label: '○' },
  holiday: { dot: 'bg-rose-400', chip: 'bg-rose-100 text-rose-800 border-rose-300', label: '✦' },
};

const FLAG: Record<string, string> = { NSE: '🇮🇳', US: '🇺🇸' };
const EXCHANGE_NAME: Record<string, string> = { NSE: 'NSE India', US: 'NYSE / Nasdaq' };

function ClockCard({ market }: { market: 'NSE' | 'US' }) {
  const [now, setNow] = useState(() => new Date());
  const [status, setStatus] = useState<MarketStatus>(() => getMarketStatus(market));

  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      setNow(d);
      setStatus(getMarketStatus(market, d));
    }, 1000);
    return () => clearInterval(id);
  }, [market]);

  const style = KIND_STYLE[status.kind];

  return (
    <div className="sketch-card paper p-4 flex-1 min-w-[240px] relative overflow-hidden">
      {status.kind === 'open' && (
        <span className="absolute top-2 right-3 stamp-in text-[10px] font-marker text-green-700 border-2 border-green-600/60 rounded px-1 rotate-12">
          LIVE
        </span>
      )}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{FLAG[market]}</span>
          <div>
            <div className="font-black text-gray-900 leading-none">{EXCHANGE_NAME[market]}</div>
            <div className="text-[11px] text-gray-500 font-dood">9:15 AM–3:30 PM IST · 9:30 AM–4:00 PM ET</div>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${style.chip}`}>
          <span className={`w-2 h-2 rounded-full ${style.dot} ${status.kind === 'open' ? 'shadow-[0_0_8px_2px_rgba(34,197,94,0.6)]' : ''}`} />
          {status.label}
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between text-sm text-gray-700">
        <div>
          <div className="font-mono text-lg font-bold text-gray-900">{status.tzNow}</div>
          <div className="text-xs text-gray-500">local exchange time</div>
        </div>
        <div className="text-right text-xs text-gray-600 max-w-[55%]">
          {status.detail}
          {status.nextOpenMs != null && status.nextOpenMs > 0 && (
            <span className="block mt-1 font-semibold text-gray-800">
              Next open in <span className="font-mono text-emerald-700">{formatCountdown(status.nextOpenMs)}</span>
              <span className="block text-gray-500 font-normal">→ {status.nextOpenLabel}</span>
            </span>
          )}
        </div>
      </div>
      <span className="sr-only">{now.getTime()}</span>
    </div>
  );
}

export default function MarketClock() {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <ClockCard market="NSE" />
      <ClockCard market="US" />
    </div>
  );
}