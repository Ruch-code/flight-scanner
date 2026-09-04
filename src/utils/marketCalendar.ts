export type MarketId = 'NSE' | 'US';

export type MarketStatusKind =
  | 'open'
  | 'pre-open'
  | 'after-hours'
  | 'closed'
  | 'weekend'
  | 'holiday';

export interface MarketStatus {
  kind: MarketStatusKind;
  label: string;
  detail: string;
  isEarlyClose: boolean;
  holidayName?: string;
  nextOpenMs: number | null;
  nextOpenLabel: string | null;
  tzNow: string;
}

interface Holiday {
  date: string; // YYYY-MM-DD
  name: string;
}

// Official NSE trading holidays 2026 (Circular NSE/CMTR/71775)
export const NSE_HOLIDAYS_2026: Holiday[] = [
  { date: '2026-01-15', name: 'Maharashtra Election' },
  { date: '2026-01-26', name: 'Republic Day' },
  { date: '2026-03-03', name: 'Holi' },
  { date: '2026-03-26', name: 'Ram Navami' },
  { date: '2026-03-31', name: 'Mahavir Jayanti' },
  { date: '2026-04-03', name: 'Good Friday' },
  { date: '2026-04-14', name: 'Ambedkar Jayanti' },
  { date: '2026-05-01', name: 'Maharashtra Day' },
  { date: '2026-05-28', name: 'Bakri Id' },
  { date: '2026-06-26', name: 'Muharram' },
  { date: '2026-09-14', name: 'Ganesh Chaturthi' },
  { date: '2026-10-02', name: 'Gandhi Jayanti' },
  { date: '2026-10-20', name: 'Dussehra' },
  { date: '2026-11-10', name: 'Diwali (Balipratipada)' },
  { date: '2026-11-24', name: 'Guru Nanak Jayanti' },
  { date: '2026-12-25', name: 'Christmas' },
];

// NYSE / NASDAQ holidays 2026 (identical schedules)
export const US_HOLIDAYS_2026: Holiday[] = [
  { date: '2026-01-01', name: "New Year's Day" },
  { date: '2026-01-19', name: 'MLK Jr. Day' },
  { date: '2026-02-16', name: "Presidents' Day" },
  { date: '2026-04-03', name: 'Good Friday' },
  { date: '2026-05-25', name: 'Memorial Day' },
  { date: '2026-06-19', name: 'Juneteenth' },
  { date: '2026-07-03', name: 'Independence Day (observed)' },
  { date: '2026-09-07', name: 'Labor Day' },
  { date: '2026-11-26', name: 'Thanksgiving' },
  { date: '2026-12-25', name: 'Christmas' },
];

export const US_EARLY_CLOSE_2026 = new Set(['2026-11-27', '2026-12-24']);

const MARKET_TZ: Record<MarketId, string> = {
  NSE: 'Asia/Kolkata',
  US: 'America/New_York',
};

function session(market: MarketId, early: boolean) {
  if (market === 'NSE') return { open: 9 * 60 + 15, close: 15 * 60 + 30 };
  return { open: 9 * 60 + 30, close: (early ? 13 : 16) * 60 };
}

interface Parts {
  y: number;
  mo: number; // 1-12
  d: number;
  h: number;
  min: number;
  wd: number; // 0 Sun .. 6 Sat
  str: string; // YYYY-MM-DD
}

function tzParts(date: Date, tz: string): Parts {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    weekday: 'short',
  });
  const vals: Record<string, string> = {};
  fmt.formatToParts(date).forEach((p) => (vals[p.type] = p.value));
  let h = Number(vals.hour);
  if (h === 24) h = 0; // some engines emit 24 for midnight
  const y = Number(vals.year);
  const mo = Number(vals.month);
  const d = Number(vals.day);
  const wdMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return { y, mo, d, h, min: Number(vals.minute), wd: wdMap[vals.weekday] ?? 0, str: `${vals.year}-${vals.month}-${vals.day}` };
}

function isWeekend(p: Parts): boolean {
  return p.wd === 0 || p.wd === 6;
}

function holidayFor(market: MarketId, str: string): Holiday | undefined {
  const list = market === 'NSE' ? NSE_HOLIDAYS_2026 : US_HOLIDAYS_2026;
  return list.find((h) => h.date === str);
}

function dayDelta(y: number, mo: number, d: number, days: number): Parts {
  const dt = new Date(Date.UTC(y, mo - 1, d + days, 12, 0, 0));
  const iso = dt.toISOString().slice(0, 10);
  const [yy, mm, dd] = iso.split('-').map(Number);
  return { y: yy, mo: mm, d: dd, h: 0, min: 0, wd: dt.getUTCDay(), str: iso };
}

function nextTradingDay(market: MarketId, p: Parts): Parts {
  let n = dayDelta(p.y, p.mo, p.d, 1);
  let guard = 0;
  while (guard < 40) {
    if (!isWeekend(n) && !holidayFor(market, n.str)) return n;
    n = dayDelta(n.y, n.mo, n.d, 1);
    guard++;
  }
  return n;
}

function weekdayName(isoDate: string): string {
  return new Date(`${isoDate}T12:00:00Z`).toLocaleDateString('en-US', { weekday: 'long' });
}

// "Wall clock" ms treating exchange-local time as UTC — used only for countdown diffs.
function wallMs(p: Parts): number {
  return Date.UTC(p.y, p.mo - 1, p.d, p.h, p.min, 0);
}

const OPEN_LABEL: Record<MarketId, string> = { NSE: '9:15 AM IST', US: '9:30 AM ET' };

export function getMarketStatus(market: MarketId, now: Date = new Date()): MarketStatus {
  const tz = MARKET_TZ[market];
  const p = tzParts(now, tz);
  const nowWall = wallMs(p);
  const timeMin = p.h * 60 + p.min;
  const early = !(market === 'NSE') && US_EARLY_CLOSE_2026.has(p.str);
  const sess = session(market, early);
  const isNse = market === 'NSE';

  const clock = `${openClock(sess.open)} – ${openClock(sess.close)} (${isNse ? 'IST' : 'ET'})`;

  const base = {
    isEarlyClose: early,
    tzNow: `${String(p.h).padStart(2, '0')}:${String(p.min).padStart(2, '0')}`,
  };

  if (isWeekend(p)) {
    return {
      ...base,
      kind: 'weekend',
      label: 'Weekend',
      detail: `${market} is closed on weekends. Regular hours ${clock}.`,
      nextOpenMs: wallMs({ ...nextSessionOpen(market, p, sess), h: 0 }) + offsetToOpen(sess) - nowWall,
      nextOpenLabel: openLabel(market, p),
    };
  }

  const hol = holidayFor(market, p.str);
  if (hol) {
    return {
      ...base,
      kind: 'holiday',
      label: 'Holiday',
      detail: `${market} closed today — ${hol.name}.`,
      holidayName: hol.name,
      nextOpenMs: wallMs({ ...nextSessionOpen(market, p, sess), h: 0 }) + offsetToOpen(sess) - nowWall,
      nextOpenLabel: openLabel(market, p),
    };
  }

  const preStart = isNse ? 9 * 60 : 4 * 60;
  if (timeMin >= preStart && timeMin < sess.open) {
    return {
      ...base,
      kind: 'pre-open',
      label: 'Pre-open',
      detail: `${market} pre-open session · regular ${clock}.`,
      nextOpenMs: (sess.open - timeMin) * 60 * 1000,
      nextOpenLabel: OPEN_LABEL[market],
    };
  }

  if (timeMin >= sess.open && timeMin < sess.close) {
    const minsLeft = sess.close - timeMin;
    return {
      ...base,
      kind: 'open',
      label: early ? 'Open · early close' : 'Live',
      detail: `${market} trading now · closes in ${Math.floor(minsLeft / 60)}h ${String(minsLeft % 60).padStart(2, '0')}m${early ? ' (1:00 PM ET early close)' : ''}.`,
      nextOpenMs: null,
      nextOpenLabel: null,
    };
  }

  if (!isNse && timeMin >= sess.close && timeMin < 20 * 60) {
    return {
      ...base,
      kind: 'after-hours',
      label: 'After-hours',
      detail: `${market} regular session over · after-hours until 8:00 PM ET.`,
      nextOpenMs: wallMs({ ...nextSessionOpen(market, p, sess), h: 0 }) + offsetToOpen(sess) - nowWall,
      nextOpenLabel: openLabel(market, p),
    };
  }

  // Closed but a trading day before pre-open → opens today; otherwise scan
  let nextDay: Parts;
  let label: string;
  if (timeMin < sess.open) {
    nextDay = { ...p };
    label = `${OPEN_LABEL[market]} · later today`;
  } else {
    nextDay = nextSessionOpen(market, p, sess);
    label = openLabel(market, p);
  }
  return {
    ...base,
    kind: 'closed',
    label: 'Closed',
    detail: `${market} closed ${timeMin < sess.open ? '— opens later today' : 'for the day'} · regular ${clock}.`,
    nextOpenMs: wallMs(nextDay) + offsetToOpen(sess) - nowWall,
    nextOpenLabel: label,
  };
}

function nextSessionOpen(market: MarketId, p: Parts, _sess: { open: number; close: number }): Parts {
  return nextTradingDay(market, p);
}

// ms from midnight to session open
function offsetToOpen(sess: { open: number }): number {
  return sess.open * 60 * 1000;
}

function openClock(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m).padStart(2, '0')} ${period}`;
}

function openLabel(market: MarketId, p: Parts): string {
  const nxt = nextTradingDay(market, p);
  const isTomorrow = dayDelta(p.y, p.mo, p.d, 1).str === nxt.str;
  return `${OPEN_LABEL[market]} · ${isTomorrow ? 'tomorrow' : weekdayName(nxt.str)}`;
}

export function formatCountdown(ms: number): string {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
  return `${m}m ${String(s).padStart(2, '0')}s`;
}