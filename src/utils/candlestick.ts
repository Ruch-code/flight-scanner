export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface DetectedPattern {
  id: string;
  name: string;
  emoji: string;
  bull: boolean;
  strength?: number;
  meaning: string;
}

type O = { open: number; high: number; low: number; close: number };

const body = (c: O) => c.close - c.open;
const upper = (c: O) => c.high - Math.max(c.open, c.close);
const lower = (c: O) => Math.min(c.open, c.close) - c.low;
const range = (c: O) => c.high - c.low;
const realBody = (c: O) => Math.abs(body(c));

const isDoji = (c: O) => range(c) > 0 && realBody(c) <= 0.1 * range(c);
const isBullish = (c: O) => body(c) > 0;
const isBearish = (c: O) => body(c) < 0;
const isLong = (c: O) => realBody(c) > 0.5 * range(c);

interface PatternDef {
  id: string;
  name: string;
  emoji: string;
  bull: boolean;
  strength: number;
  meaning: string;
}

function detectOnLast(candles: O[]): PatternDef | null {
  if (candles.length < 3) return null;
  const cur = candles[candles.length - 1];
  const prev = candles[candles.length - 2];
  const prev2 = candles[candles.length - 3];

  const r = range(cur);
  const found: PatternDef[] = [];

  if (r > 0) {
    // Morning Star (3-candle bullish reversal)
    if (isBearish(prev2) && isLong(prev2) && realBody(prev) <= 0.35 * r && isBullish(cur) && cur.close > prev2.open + 0.3 * realBody(prev2)) {
      found.push({ id: 'morning-star', name: 'Morning Star', emoji: '🌅', bull: true, strength: 95, meaning: 'Downtrend stalled into a small “star” candle, then buyers took control in a strong green candle — a classic bottom signal. Expect upside follow-through; wait for the next candle to confirm.' });
    }
    // Evening Star (3-candle bearish reversal)
    if (isBullish(prev2) && isLong(prev2) && realBody(prev) <= 0.35 * r && isBearish(cur) && cur.close < prev2.open - 0.3 * realBody(prev2)) {
      found.push({ id: 'evening-star', name: 'Evening Star', emoji: '🌆', bull: false, strength: 95, meaning: 'An uptrend faded into a small star candle and sellers overwhelmed — a top signal. Risk-off; consider locking in gains.' });
    }
    // Bullish Engulfing
    if (isBearish(prev) && isBullish(cur) && cur.close > prev.open && cur.open < prev.close && realBody(cur) >= realBody(prev) * 0.95) {
      found.push({ id: 'bull-engulfing', name: 'Bullish Engulfing', emoji: '🟢', bull: true, strength: 85, meaning: 'One green candle completely swallowed the prior red candle — buyers overpowered sellers at the day’s low. Often marks a swing low and the start of a bounce.' });
    }
    // Bearish Engulfing
    if (isBullish(prev) && isBearish(cur) && cur.close < prev.open && cur.open > prev.close && realBody(cur) >= realBody(prev) * 0.95) {
      found.push({ id: 'bear-engulfing', name: 'Bearish Engulfing', emoji: '🔻', bull: false, strength: 85, meaning: 'A red candle completely swallowed the prior green candle — sellers crushed buyers. A warning the recent bounce may be over.' });
    }
    // Hammer (bullish, appears near lows)
    if (isBearish(prev) && isBullish(cur) && lower(cur) >= 2 * realBody(cur) && upper(cur) <= 0.4 * realBody(cur)) {
      found.push({ id: 'hammer', name: 'Hammer', emoji: '🔨', bull: true, strength: 75, meaning: 'Sellers pushed prices down but buyers slammed it back near the open — strong rejection of lower prices after a decline. A bullish reversal hint; confirm with the next green candle.' });
    }
    // Hanging Man (bearish, appears near highs)
    if (isBullish(prev) && isBearish(cur) && lower(cur) >= 2 * realBody(cur) && upper(cur) <= 0.4 * realBody(cur)) {
      found.push({ id: 'hanging-man', name: 'Hanging Man', emoji: '🪢', bull: false, strength: 70, meaning: 'A long lower wick after a rally looks like support but is really sellers testing — classic warning of a potential pullback at the top.' });
    }
    // Shooting Star
    if (isBullish(prev) && upper(cur) >= 2 * realBody(cur) && lower(cur) <= 0.4 * realBody(cur) && isBearish(cur)) {
      found.push({ id: 'shooting-star', name: 'Shooting Star', emoji: '💫', bull: false, strength: 72, meaning: 'Prices spiked to a high but were sold straight back down — hesitation at the top after an up-move. Bears may follow.' });
    }
    // Bullish Harami
    if (isBearish(prev) && isLong(prev) && realBody(cur) <= 0.4 * r && cur.close > prev.close && cur.open < prev.open) {
      found.push({ id: 'bull-harami', name: 'Bullish Harami', emoji: '🤰', bull: true, strength: 60, meaning: 'A small green candle nestled inside a big red one — selling momentum is stalling. A mild reversal hint that needs confirmation.' });
    }
    // Spinning Top (indecision)
    if (realBody(cur) <= 0.3 * r && upper(cur) > 0.4 * realBody(cur) && lower(cur) > 0.4 * realBody(cur) && !isDoji(cur)) {
      found.push({ id: 'spinning-top', name: 'Spinning Top', emoji: '🌀', bull: true, strength: 40, meaning: 'Nearly balanced bodies and wicks — buyers and sellers fought to a draw. The trend may pause here; don’t chase, wait for direction.' });
    }
    // Three White Soldiers (bullish run, on prev2)
    if (isBullish(prev2) && isBullish(prev) && isBullish(cur) && prev.close > prev2.close && cur.close > prev.close) {
      found.push({ id: 'white-soldiers', name: 'Three White Soldiers', emoji: '🎖️', bull: true, strength: 78, meaning: 'Three consecutive strong green candles with rising closes — consistent buying. Momentum trend, but stretched; watch for exhaustion near resistance.' });
    }
    // Three Black Crows
    if (isBearish(prev2) && isBearish(prev) && isBearish(cur) && prev.close < prev2.close && cur.close < prev.close) {
      found.push({ id: 'black-crows', name: 'Three Black Crows', emoji: '🐦‍⬛', bull: false, strength: 78, meaning: 'Three consecutive strong red candles with falling closes — persistent selling pressure. Downtrend momentum; wait for a bottom pattern before buying.' });
    }
    // Doji
    if (isDoji(cur)) {
      found.push({ id: 'doji', name: 'Doji', emoji: '⚖️', bull: true, strength: 35, meaning: 'Open and close at nearly the same price — total indecision. After a sharp drop it can signal a pause; after a rally, caution.' });
    }
  }

  // Highest strength (most reliable) wins the badge
  found.sort((a, b) => (b.strength ?? 0) - (a.strength ?? 0));
  return found[0] || null;
}

export function detectPatterns(bars: Candle[]): DetectedPattern[] {
  const candles = bars.map((b) => ({
    open: b.open,
    high: b.high,
    low: b.low,
    close: b.close,
  }));
  const out: DetectedPattern[] = [];
  const last = detectOnLast(candles);
  if (last) out.push(last);

  // Also check the second-latest candle so a just-formed pattern isn't missed
  if (candles.length >= 4) {
    const prevBar = detectOnLast(candles.slice(0, -1));
    if (prevBar && !out.find((p) => p.id === prevBar.id)) {
      prevBar.id += '-prev';
      out.push(prevBar);
    }
  }
  return out;
}

export function mostRecentPattern(bars: Candle[]): DetectedPattern | null {
  const patterns = detectPatterns(bars);
  if (!patterns.length) return null;
  patterns.sort((a, b) => (b.strength ?? 0) - (a.strength ?? 0));
  return patterns[0];
}