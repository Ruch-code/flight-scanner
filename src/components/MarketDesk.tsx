import { useMemo } from 'react';
import { useMarketSnapshot } from '../hooks/useMarketData';
import type { Commodity } from '../hooks/useMarketData';

function arrowCls(v: number) {
  return v >= 0 ? 'text-green-600' : 'text-red-600';
}
function arrowIcon(v: number) {
  return v > 0 ? '▲' : v < 0 ? '▼' : '•';
}
function fmtPct(v: number) {
  return `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`;
}

function levelRow(label: string, value: number, tone: string) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[10px] uppercase tracking-wide text-gray-500">{label}</span>
      <span className={`font-mono font-bold text-xs ${tone}`}>{Math.round(value).toLocaleString('en-IN')}</span>
    </div>
  );
}

function buildNarrative(nifty: Nifty | null): string {
  if (!nifty) return '';
  const parts: string[] = [];
  if (nifty.dayChangePct >= 0.3) parts.push(`NIFTY is up ${fmtPct(nifty.dayChangePct)} today — a strong risk-on session.`);
  else if (nifty.dayChangePct <= -0.3) parts.push(`NIFTY is down ${fmtPct(nifty.dayChangePct)} — a risk-off day so far.`);
  else parts.push(`NIFTY is flat (${fmtPct(nifty.dayChangePct)}) — a cautious, sideways session.`);

  if (nifty.levels) {
    if (nifty.last > nifty.levels.pivot) parts.push(`Above day pivot ${Math.round(nifty.levels.pivot).toLocaleString('en-IN')}, bias stays with buyers unless it slips below S1 ${Math.round(nifty.levels.s1).toLocaleString('en-IN')}.`);
    else parts.push(`Sitting under the day pivot ${Math.round(nifty.levels.pivot).toLocaleString('en-IN')}; a close above it could open the door to R1.`);
  }
  parts.push(`Watch a break of R1 ${Math.round(nifty.levels?.r1 || 0).toLocaleString('en-IN')} for fresh longs, and S2 ${Math.round(nifty.levels?.s2 || 0).toLocaleString('en-IN')} as the first stop area.`);

  return parts.join(' ');
}

type Nifty = NonNullable<NonNullable<ReturnType<typeof useMarketSnapshot>['snapshot']>['nifty']>;

const COMODITY_BLURBS: Record<string, string> = {
  gold: 'Gold up = haven bid; often pressures high-beta IT & auto names while lifting miners/gold ETFs.',
  silver: 'Silver is more industrial — rallies favour solar/electronics demand stocks, dips flag global slowdown worry.',
  brent: 'Oil up lifts ONGC/Oil India & RIL refining, but squeezes airline, paints, and tyre margins.',
  wti: 'US crude mirrors brent — cheaper crude is the biggest single tailwind for Indian airlines and FMCG.',
  usdinr: 'Rupee depreciation lifts IT & pharma exporters but hits any dollar-cost businesses; check your imports.',
};

function CommodityCard({ c }: { c: Commodity }) {
  const up = c.changePct >= 0;
  return (
    <div className="sketch-card paper p-3 flex flex-col">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wide truncate mr-2">{c.name}</span>
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${up ? 'text-red-700 bg-red-50 border border-red-200' : 'text-green-700 bg-green-50 border border-green-200'}`}>
          {fmtPct(c.changePct)}
        </span>
      </div>
      <div className="flex items-baseline gap-1 mt-1">
        <span className="font-mono text-lg font-black text-gray-900">{c.price.toLocaleString('en-IN', { maximumFractionDigits: c.key === 'usdinr' ? 3 : 2 })}</span>
        <span className="text-[10px] text-gray-500">{c.unit}</span>
      </div>
      <div className={`text-[11px] font-mono ${arrowCls(c.change)}`}>
        {arrowIcon(c.change)} {Math.abs(c.change).toLocaleString('en-IN')} ({fmtPct(c.changePct)})
      </div>
      <p className="text-[10px] text-gray-600 mt-1.5 leading-snug font-dood">{COMODITY_BLURBS[c.key] || ''}</p>
    </div>
  );
}

export default function MarketDesk() {
  const { snapshot, loading, error } = useMarketSnapshot();
  const nifty = snapshot?.nifty ?? null;
  const narrative = useMemo(() => (nifty ? buildNarrative(nifty) : ''), [nifty]);

  if (loading && !snapshot) {
    return (
      <section className="mt-10">
        <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
          <span>📊</span> Live Market Desk <span className="text-sm font-normal text-gray-400 animate-pulse">· brining real NIFTY & commodities…</span>
        </h2>
        <div className="sketch-card paper p-8 text-center text-gray-500 font-dood">loading live NIFTY 50 & commodities…</div>
      </section>
    );
  }

  return (
    <section id="market-desk" className="mt-10 scroll-mt-20">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <span>📊</span> Live Market Desk
        </h2>
        <span className="text-[11px] text-gray-400 font-dood">Educational only · refs refresh every ~5 min</span>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          Couldn't load live data: {error}
        </div>
      )}

      {/* NIFTY card with levels */}
      <div className="sketch-card paper p-4 sm:p-5 mb-4 relative overflow-hidden">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🇮🇳</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-gray-900">NIFTY 50</span>
              </div>
              {nifty && (
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-3xl font-black ${nifty.dayChangePct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.round(nifty.last).toLocaleString('en-IN')}
                  </span>
                  <span className={`font-mono font-bold text-sm ${arrowCls(nifty.dayChangePct)}`}>
                    {arrowIcon(nifty.dayChangePct)} {fmtPct(nifty.dayChangePct)}
                  </span>
                </div>
              )}
              {!nifty && !snapshot && <div className="text-sm text-gray-400 animate-pulse">loading…</div>}
            </div>
          </div>
          {nifty && (
            <div className="text-right text-[11px] text-gray-500">
              <div>Open {Math.round(nifty.open).toLocaleString('en-IN')}</div>
              <div>High <span className="text-green-700">{Math.round(nifty.high).toLocaleString('en-IN')}</span> · Low <span className="text-red-700">{Math.round(nifty.low).toLocaleString('en-IN')}</span></div>
              <div className={nifty.pctFromHigh > -3 ? 'text-amber-600' : ''}>
                <span className="text-gray-400">vs 52wk high</span>{" "}{fmtPct(nifty.pctFromHigh)}
              </div>
            </div>
          )}
        </div>

        {nifty && (
          <>
            {/* Level bands */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4">
              <div className="bg-red-50/70 border border-red-200 rounded-lg p-2 space-y-1">
                <div className="text-[10px] font-bold text-red-700 mb-1">● Resistance (sell zone)</div>
                {levelRow('R3', nifty.levels.r3, 'text-red-600')}
                {levelRow('R2', nifty.levels.r2, 'text-red-600')}
                {levelRow('R1', nifty.levels.r1, 'text-red-600')}
              </div>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-2 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-[10px] text-gray-400 uppercase tracking-wide">Pivot</div>
                  <div className="font-mono font-black text-lg text-gray-900">{Math.round(nifty.levels.pivot).toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-gray-400">(prev day H/L/C)</div>
                </div>
              </div>
              <div className="bg-green-50/70 border border-green-200 rounded-lg p-2 space-y-1">
                <div className="text-[10px] font-bold text-green-700 mb-1">● Support (buy zone)</div>
                {levelRow('S1', nifty.levels.s1, 'text-green-600')}
                {levelRow('S2', nifty.levels.s2, 'text-green-600')}
                {levelRow('S3', nifty.levels.s3, 'text-green-600')}
              </div>
              <div className="col-span-2 sm:col-span-2 bg-white/60 border border-dashed border-gray-300 rounded-lg p-2 space-y-1">
                <div className="text-[10px] font-bold text-gray-500 mb-1">Reference bands</div>
                <div className="flex justify-between"><span className="text-[10px] text-gray-500">52wk High</span><span className="font-mono text-xs text-gray-700">{Math.round(nifty.week52high).toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between"><span className="text-[10px] text-gray-500">52wk Low</span><span className="font-mono text-xs text-gray-700">{Math.round(nifty.week52low).toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between"><span className="text-[10px] text-gray-500">3-mo High</span><span className="font-mono text-xs text-gray-700">{Math.round(nifty.recent3mHigh).toLocaleString('en-IN')}</span></div>
              </div>
            </div>

            {/* Mini chart: today's candle as a big bar */}
            <div className="mt-4 bg-white/40 border border-gray-200 rounded-lg p-3">
              <div className="text-[10px] uppercase tracking-wide text-gray-500 mb-2">Today's NIFTY candle</div>
              <MiniNiftyBar nifty={nifty} />
            </div>

            {/* Auto narrative */}
            <p className="mt-4 text-sm text-gray-700 leading-relaxed font-dood bg-white/50 border-l-4 border-amber-400 rounded-r-lg p-3">
              {narrative}
            </p>

            {nifty.lastBarDate && (
              <div className="mt-2 text-[10px] text-gray-400">Data as of {nifty.lastBarDate} · last close {Math.round(nifty.last).toLocaleString('en-IN')}</div>
            )}
          </>
        )}
      </div>

      {/* Commodities strip */}
      {snapshot && snapshot.commodities.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {snapshot.commodities.map((c) => (
            <CommodityCard key={c.key} c={c} />
          ))}
        </div>
      )}
    </section>
  );
}

function MiniNiftyBar({ nifty }: { nifty: NonNullable<ReturnType<typeof useMarketSnapshot>['snapshot']>['nifty'] }) {
  if (!nifty) return null;
  const o = nifty.open, h = nifty.high, l = nifty.low, c = nifty.last;
  const span = Math.max(h - l, 1);
  const bodyTop = ((h - Math.max(c, o)) / span) * 100;
  const bodyH = (Math.abs(c - o) / span) * 100;
  const up = c >= o;
  const color = up ? '#15803d' : '#dc2626';
  return (
    <div className="flex items-center gap-4">
      <div className="relative" style={{ height: 56, width: 40 }}>
        <div className="absolute left-1/2 -translate-x-1/2 top-0" style={{ height: '100%', width: 2, background: color }} />
        <div className="absolute left-1/2 -translate-x-1/2" style={{ top: `${bodyTop}%`, height: Math.max(bodyH, 2), width: 24, background: color, borderRadius: 2 }} />
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px]">{Math.round(h).toLocaleString('en-IN')}</span>
        <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px]">{Math.round(l).toLocaleString('en-IN')}</span>
      </div>
      <div className="text-[11px] text-gray-600 leading-tight">
        <div><b className="text-gray-900">Open</b> {Math.round(o).toLocaleString('en-IN')}</div>
        <div><b className="text-green-700">High</b> {Math.round(h).toLocaleString('en-IN')}</div>
        <div><b className="text-red-700">Low</b> {Math.round(l).toLocaleString('en-IN')}</div>
        <div><b className="text-gray-900">Last</b> {Math.round(c).toLocaleString('en-IN')}</div>
      </div>
    </div>
  );
}