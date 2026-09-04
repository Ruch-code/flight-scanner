import { useMemo, useState } from 'react';
import { useStockSignals, type StockSignal } from '../hooks/useMarketData';
import CandlestickChart from './CandlestickChart';

function rsiTone(rsi: number | null): { label: string; cls: string } {
  if (rsi == null) return { label: '—', cls: 'text-gray-400' };
  if (rsi >= 70) return { label: `${rsi} Overbought`, cls: 'text-red-600' };
  if (rsi <= 30) return { label: `${rsi} Oversold`, cls: 'text-green-600' };
  return { label: `${rsi} Neutral`, cls: 'text-gray-600' };
}

function dipTone(v: number) {
  if (v <= -10) return 'text-rose-700';
  if (v <= -5) return 'text-rose-500';
  return 'text-amber-600';
}

function ImpactBar({ pick }: { pick: StockSignal }) {
  const up = pick.dayChangePct >= 0;
  return (
    <div className="flex items-center gap-1.5 text-[11px] font-mono">
      <span className={`font-bold ${up ? 'text-green-600' : 'text-red-600'}`}>
        {up ? '▲' : '▼'} {Math.abs(pick.dayChangePct).toFixed(2)}%
      </span>
      <span className="text-gray-400">today</span>
    </div>
  );
}

export default function StockSignals() {
  const { data, loading, error, refresh } = useStockSignals();
  const [tab, setTab] = useState<'bought' | 'oversold'>('bought');
  const [selected, setSelected] = useState<StockSignal | null>(null);

  const picks = useMemo(() => data?.picks ?? [], [data]);

  const mostBought = useMemo(() => {
    const withData = picks.filter((p) => p.price != null && p.dayChangePct != null);
    // "Most bought today" proxy: biggest intraday gains (buyers in control), volume chip confirms
    return [...withData].sort((a, b) => b.dayChangePct - a.dayChangePct);
  }, [picks]);

  const oversold = useMemo(() => {
    return picks
      .filter((p) => p.rsi != null && p.rsi <= 45)
      .sort((a, b) => (a.rsi ?? 100) - (b.rsi ?? 100));
  }, [picks]);

  const list = tab === 'bought' ? mostBought : oversold;
  const active = selected || (list[0] ?? null);

  if (loading && !data) {
    return (
      <section className="mt-10">
        <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
          <span>🕯️</span> Stock Signals <span className="text-sm font-normal text-gray-400 animate-pulse">· finding live picks…</span>
        </h2>
        <div className="sketch-card paper p-10 text-center text-gray-500 font-dood">
          pulling live candlesticks from the exchanges…
        </div>
      </section>
    );
  }

  return (
    <section id="stock-signals" className="mt-10 scroll-mt-20">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <span>🕯️</span> Stock Signals
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400 font-dood hidden sm:block">
            Fundamental-strong universe · daily candles
          </span>
          <button
            onClick={refresh}
            className="text-xs font-semibold text-primary-600 hover:text-primary-800 border border-primary-200 px-2.5 py-1 rounded-md bg-white/60 hover:bg-white transition"
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          Couldn't load stock data: {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab('bought')}
          className={`px-3 py-1.5 rounded-full text-sm font-bold border transition ${
            tab === 'bought'
              ? 'bg-green-600 text-white border-green-600 shadow'
              : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'
          }`}
        >
          🔥 Most Bought Today
        </button>
        <button
          onClick={() => setTab('oversold')}
          className={`px-3 py-1.5 rounded-full text-sm font-bold border transition ${
            tab === 'oversold'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow'
              : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
          }`}
        >
          🎯 Oversold (RSI &lt; 40)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="space-y-2.5">
          {loading && <div className="text-sm text-gray-400 animate-pulse">refreshing…</div>}
          {list.length === 0 && !loading && (
            <div className="sketch-card paper p-6 text-center text-sm text-gray-500 font-dood">No picks matching this view right now.</div>
          )}
          {list.map((p) => {
            const isSel = active?.symbol === p.symbol;
            const tone = rsiTone(p.rsi);
            return (
              <button
                key={p.symbol}
                onClick={() => setSelected(p)}
                className={`w-full text-left sketch-card paper p-3 transition ${
                  isSel ? 'ring-2 ring-primary-400 border-primary-300' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">{p.exchange === 'NSE' ? '🇮🇳' : '🇺🇸'}</span>
                    <span className="font-black text-gray-900">{p.symbol.replace('.NS', '')}</span>
                    <ImpactBar pick={p} />
                  </div>
                  <span className={`font-mono font-bold text-xs text-gray-900`}>
                    {p.currency === 'INR' ? '₹' : '$'}{Math.round(p.price).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 font-dood truncate mt-0.5">{p.name} · {p.sector}</div>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className={`text-[10px] font-mono font-bold ${dipTone(p.dipFromHigh)}`}>
                    ⤵ {p.dipFromHigh.toFixed(1)}% vs 30d high
                  </span>
                  <span className={`text-[10px] font-mono font-bold ${tone.cls}`}>
                    RSI {tone.label}
                  </span>
                  {p.volRatio > 1.6 && (
                    <span className="text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 px-1 rounded">
                      ×{p.volRatio} volume
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail / chart */}
        <div className="lg:col-span-2">
          {active ? (
            <div className="sketch-card paper p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{active.exchange === 'NSE' ? '🇮🇳' : '🇺🇸'}</span>
                    <span className="font-black text-xl text-gray-900">{active.symbol.replace('.NS', '')}</span>
                    <span className="font-mono text-lg text-gray-700">
                      {active.currency === 'INR' ? '₹' : '$'}{active.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </span>
                    <ImpactBar pick={active} />
                  </div>
                  <div className="text-sm text-gray-500 font-dood">{active.name} · {active.sector} · {active.exchange}</div>
                </div>
                <div className="text-right text-[11px] text-gray-500 space-y-0.5">
                  <div><span className="text-gray-400">30d high dip:</span> <b className={dipTone(active.dipFromHigh)}>{active.dipFromHigh.toFixed(1)}%</b></div>
                  <div><span className="text-gray-400">RSI-14:</span> <b className={rsiTone(active.rsi).cls}>{active.rsi ?? '—'}</b></div>
                  <div><span className="text-gray-400">vs avg vol:</span> <b className={active.volRatio > 1.5 ? 'text-purple-700' : 'text-gray-600'}>×{active.volRatio}</b></div>
                </div>
              </div>

              <div className="rounded-lg overflow-hidden bg-white/50 border border-gray-200">
                {active.candles?.length ? (
                  <CandlestickChart candles={active.candles} patterns={active.patterns ?? []} />
                ) : (
                  <div className="p-8 text-center text-gray-400 text-sm font-dood">No candle data yet.</div>
                )}
              </div>

              <div className="mt-3 bg-white/60 border-l-4 border-emerald-400 rounded-r-lg p-3">
                <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-0.5">Why it's fundamentally strong</div>
                <p className="text-sm text-gray-700 font-dood">{active.whyStrong}</p>
              </div>

              <p className="mt-2 text-[11px] text-gray-400 font-dood">EDUCATIONAL ONLY — candlestick patterns for study, not investment advice.</p>
            </div>
          ) : (
            <div className="sketch-card paper p-10 text-center text-gray-400 font-dood">Select a stock to see its live candlestick chart & pattern.</div>
          )}
        </div>
      </div>
    </section>
  );
}