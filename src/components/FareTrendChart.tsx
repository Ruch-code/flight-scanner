import { useEffect, useMemo, useRef, useState } from 'react';
import {
  createChart,
  CandlestickSeries,
  createSeriesMarkers,
  type IChartApi,
  type ISeriesApi,
  type ISeriesMarkersPluginApi,
  type Time,
} from 'lightweight-charts';
import { formatPrice } from '../utils/currency';
import { FareTrends, trendPriceToDisplay } from '../hooks/useFareTrends';

interface Props {
  trends: FareTrends;
  currency: 'USD' | 'INR';
  userDate: string;
}

interface HoverState {
  x: number;
  y: number;
  time: string;
  candle: FareTrends['candles'][number];
  daysOut: number;
  vsAvgPct: number;
  isUserDate: boolean;
  isCheapest: boolean;
}

function isoDaysDiff(a: string, b: string): number {
  return Math.round((Date.parse(`${a}T00:00:00Z`) - Date.parse(`${b}T00:00:00Z`)) / 86400000);
}

function fmtDate(d: string): string {
  return new Date(`${d}T00:00:00Z`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

export default function FareTrendChart({ trends, currency, userDate }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const markersRef = useRef<ISeriesMarkersPluginApi<Time> | null>(null);
  const [hover, setHover] = useState<HoverState | null>(null);

  const medianLow = useMemo(() => {
    const lows = trends.candles.map((c) => c.low).sort((a, b) => a - b);
    const mid = Math.floor(lows.length / 2);
    return lows.length % 2 ? lows[mid] : (lows[mid - 1] + lows[mid]) / 2;
  }, [trends.candles]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chart = createChart(el, {
      autoSize: true,
      layout: {
        background: { color: 'transparent' },
        textColor: '#4b5563',
        fontFamily: "'Architects Daughter', cursive",
        fontSize: 12,
      },
      grid: {
        vertLines: { color: 'rgba(31,41,55,0.06)' },
        horzLines: { color: 'rgba(31,41,55,0.06)' },
      },
      rightPriceScale: { borderColor: 'rgba(31,41,55,0.12)' },
      timeScale: { borderColor: 'rgba(31,41,55,0.12)', rightOffset: 2 },
      crosshair: { mode: 0 },
      localization: {
        priceFormatter: (p: number) =>
          formatPrice(trendPriceToDisplay(p, trends.nativeCurrency, currency), currency),
      },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#15803d',
      downColor: '#e11d48',
      wickUpColor: '#15803d',
      wickDownColor: '#e11d48',
      borderVisible: false,
      priceFormat: { type: 'price', precision: 0, minMove: 1 },
    });

    chartRef.current = chart;
    seriesRef.current = series;
    markersRef.current = createSeriesMarkers(series, []);

    const onMove = (param: any) => {
      const time = param.time as string;
      const point = param.point;
      if (!time) {
        setHover(null);
        return;
      }
      const candle = trends.candles.find((c) => c.time === time);
      if (!candle) {
        setHover(null);
        return;
      }
      const vsAvgPct = medianLow > 0 ? Math.round(((candle.low - medianLow) / medianLow) * 100) : 0;
      setHover({
        x: point?.x ?? 0,
        y: point?.y ?? 0,
        time,
        candle,
        daysOut: isoDaysDiff(time, new Date().toISOString().slice(0, 10)),
        vsAvgPct,
        isUserDate: time === userDate,
        isCheapest: time === trends.cheapestDate,
      });
    };
    chart.subscribeCrosshairMove(onMove);

    return () => {
      chart.unsubscribeCrosshairMove(onMove);
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
      markersRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDate, trends.nativeCurrency, currency]);

  useEffect(() => {
    const series = seriesRef.current;
    const markers = markersRef.current;
    if (!series || !markers) return;

    const data = trends.candles.map((c) => ({
      time: c.time,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
      color: c.low <= medianLow ? '#15803d' : '#e11d48',
      wickColor: c.low <= medianLow ? '#15803d' : '#e11d48',
    }));
    series.setData(data);

    const ms: { time: Time; position: 'aboveBar' | 'belowBar'; color: string; shape: 'arrowDown' | 'circle'; text: string }[] = [];
    if (trends.candles.some((c) => c.time === userDate)) {
      ms.push({ time: userDate as Time, position: 'aboveBar', color: '#f59e0b', shape: 'circle', text: 'Your date' });
    }
    ms.push({ time: trends.cheapestDate as Time, position: 'belowBar', color: '#15803d', shape: 'arrowDown', text: 'Cheapest' });
    markers.setMarkers(ms);

    chartRef.current?.timeScale().fitContent();
  }, [trends, medianLow, userDate]);

  const cheapestDisplay = trendPriceToDisplay(trends.cheapestPrice, trends.nativeCurrency, currency);

  const trendSentence =
    trends.trend === 'falling'
      ? 'Fares are easing further out — a cheaper date may still open up.'
      : trends.trend === 'rising'
        ? 'Fares climb the closer you get to departure — booking early wins.'
        : 'Fares are holding fairly steady across the next few months.';

  const userDateSentence = (() => {
    if (trends.userPercentile == null) return null;
    if (trends.userPercentile <= 20)
      return 'Your date is among the cheapest in this window — great timing!';
    if (trends.userPercentile <= 60)
      return 'Your date sits mid-range — fine, but a nearby date could be cheaper.';
    return 'Your date is on the pricey side — shifting even a week could save you a good chunk.';
  })();

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
          📈 Live fare trend · cheapest flight per departure date
        </h4>
        <span className="text-[11px] text-gray-400 font-dood">
          sampled live from {trends.samples} dates over the next ~3 months
        </span>
      </div>

      <div className="relative w-full bg-white/60 rounded-xl border border-gray-200 p-2">
        <div ref={containerRef} style={{ height: 260 }} className="w-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3">
        <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2">
          <div className="text-[11px] font-bold text-green-800 uppercase tracking-wide">Cheapest window</div>
          <div className="font-black text-lg text-green-700">
            {fmtDate(trends.cheapestDate)} · {formatPrice(cheapestDisplay, currency)}
          </div>
          <div className="text-xs text-green-700 font-dood">
            {trends.daysToCheapest === 0 ? 'for travel today' : `~${trends.daysToCheapest} days from now`}
          </div>
        </div>
        <div className="bg-primary-50 border border-primary-200 rounded-xl px-3 py-2">
          <div className="text-[11px] font-bold text-primary-800 uppercase tracking-wide">Day-of-week tip</div>
          <div className="text-sm font-semibold text-gray-900">
            {trends.trend === 'rising' ? '⏰ Prices rise as you wait' : trends.trend === 'falling' ? '🪂 Prices easing further out' : '➖ Prices fairly stable'}
          </div>
          <div className="text-xs text-gray-600 font-dood">{trendSentence}</div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
          <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">Your date</div>
          <div className="text-sm font-semibold text-gray-900 capitalize">
            {userDateSentence ?? 'outside the sampled window — check the calendar closest to it'}
          </div>
        </div>
      </div>

      {hover && (
        <div
          className="pointer-events-none fixed z-50 bg-white/95 border border-gray-300 rounded-lg shadow-lg px-3 py-2 text-xs w-64"
          style={{
            left: Math.min(hover.x + 16, window.innerWidth - 280),
            top: Math.max(hover.y + 12, 8),
          }}
        >
          <div className="font-bold text-gray-800 mb-1">
            {fmtDate(hover.time)}
            {hover.isUserDate && <span className="ml-1 text-amber-600">⭐ your date</span>}
            {hover.isCheapest && <span className="ml-1 text-green-700">💸 cheapest</span>}
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-gray-600 font-mono text-[11px]">
            <span>Cheapest <b className="text-green-700">{formatPrice(trendPriceToDisplay(hover.candle.low, trends.nativeCurrency, currency), currency)}</b></span>
            <span>Top option <b>{formatPrice(trendPriceToDisplay(hover.candle.high, trends.nativeCurrency, currency), currency)}</b></span>
            <span>Typical <b>{formatPrice(trendPriceToDisplay(hover.candle.close, trends.nativeCurrency, currency), currency)}</b></span>
            <span>vs window <b className={hover.vsAvgPct <= 0 ? 'text-green-700' : 'text-red-700'}>
              {hover.vsAvgPct <= 0 ? `${Math.abs(hover.vsAvgPct)}% cheaper` : `${hover.vsAvgPct}% pricier`}
            </b></span>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-200 text-gray-600 font-dood leading-snug">
            {hover.daysOut >= 0
              ? hover.isCheapest
                ? 'The cheapest travel date in this window — target this one.'
                : hover.vsAvgPct <= 0
                  ? 'A good-value departure date — fares sit below the window average.'
                  : 'A pricier date — nearby dates are likely cheaper.'
              : 'Date has already passed.'}
          </div>
        </div>
      )}
    </div>
  );
}