import { useEffect, useRef, useState } from 'react';
import {
  createChart,
  CandlestickSeries,
  createSeriesMarkers,
  type IChartApi,
  type ISeriesApi,
  type ISeriesMarkersPluginApi,
  type Time,
} from 'lightweight-charts';
import type { Candle, DetectedPattern } from '../utils/candlestick';

interface Props {
  candles: Candle[];
  patterns: DetectedPattern[];
  height?: number;
}

export default function CandlestickChart({ candles, patterns, height = 280 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const markersRef = useRef<ISeriesMarkersPluginApi<Time> | null>(null);
  const [hover, setHover] = useState<{ x: number; y: number; candle: Candle; pattern: DetectedPattern | null } | null>(null);

  const lastPattern = patterns.length ? patterns[0] : null;

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
      localization: { priceFormatter: (p: number) => p.toLocaleString('en-IN') },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#15803d',
      downColor: '#dc2626',
      wickUpColor: '#15803d',
      wickDownColor: '#dc2626',
      borderVisible: false,
      priceFormat: { type: 'price', precision: 2, minMove: 0.01 },
    });

    chartRef.current = chart;
    seriesRef.current = series;

    const markersPlugin = createSeriesMarkers(series, []);
    markersRef.current = markersPlugin;

    const onMove = (param: any) => {
      const time = param.time as string;
      const candle = candles.find((c) => c.time === time);
      const point = param.point;
      if (!candle) {
        setHover(null);
        return;
      }
      setHover({
        x: point?.x ?? 0,
        y: point?.y ?? 0,
        candle,
        pattern: lastPattern && candles[candles.length - 1]?.time === time ? lastPattern : null,
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
  }, []);

  useEffect(() => {
    const series = seriesRef.current;
    const markers = markersRef.current;
    if (!series || !markers) return;
    series.setData(
      candles.map((c) => ({ time: c.time, open: c.open, high: c.high, low: c.low, close: c.close }))
    );
    if (lastPattern && candles.length) {
      const lastTime = candles[candles.length - 1].time;
      markers.setMarkers([
        {
          time: lastTime as Time,
          position: lastPattern.bull ? 'belowBar' : 'aboveBar',
          color: lastPattern.bull ? '#15803d' : '#dc2626',
          shape: lastPattern.bull ? 'arrowUp' : 'arrowDown',
          text: lastPattern.name,
        },
      ]);
    } else {
      markers.setMarkers([]);
    }
    chartRef.current?.timeScale().fitContent();
  }, [candles, patterns, lastPattern]);

  return (
    <div className="relative w-full">
      <div ref={containerRef} style={{ height }} className="w-full" />

      {lastPattern && (
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${lastPattern.bull ? 'bg-green-50 text-green-700 border-green-300' : 'bg-red-50 text-red-700 border-red-300'}`}>
            {lastPattern.emoji} {lastPattern.name} on latest candle
          </span>
          <span className="text-xs text-gray-600 font-dood">{lastPattern.meaning}</span>
        </div>
      )}

      {hover && (
        <div
          className="pointer-events-none fixed z-50 bg-white/95 border border-gray-300 rounded-lg shadow-lg px-3 py-2 text-xs w-64"
          style={{
            left: Math.min(hover.x + 16, window.innerWidth - 280),
            top: Math.max(hover.y + 12, 8),
          }}
        >
          <div className="font-bold text-gray-800 mb-1">{hover.candle.time}</div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-gray-600 font-mono">
            <span>O <b>{hover.candle.open.toLocaleString('en-IN')}</b></span>
            <span>H <b className="text-green-700">{hover.candle.high.toLocaleString('en-IN')}</b></span>
            <span>L <b className="text-red-700">{hover.candle.low.toLocaleString('en-IN')}</b></span>
            <span>C <b>{hover.candle.close.toLocaleString('en-IN')}</b></span>
          </div>
          {hover.pattern && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="font-bold text-gray-900">{hover.pattern.emoji} {hover.pattern.name}</div>
              <div className="text-gray-600 leading-snug mt-0.5">{hover.pattern.meaning}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}