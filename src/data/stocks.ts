export interface StockPick {
  symbol: string;
  name: string;
  exchange: 'NSE' | 'US';
  sector: string;
  whyStrong: string;
  currency: 'INR' | 'USD';
}

export const stockPicks: StockPick[] = [
  // ── India (NSE) ─────────────────────────────────────────
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries', exchange: 'NSE', sector: 'Diversified', currency: 'INR', whyStrong: 'Retail + Jio FCF engine, new-energy ramp; ~40% consumer RoE.' },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', exchange: 'NSE', sector: 'Banking', currency: 'INR', whyStrong: '2% ROA bank with cleanest loan book & strong deposit franchise.' },
  { symbol: 'INFY.NS', name: 'Infosys', exchange: 'NSE', sector: 'IT', currency: 'INR', whyStrong: '~20% RoE, zero net debt, giant cash pile, steady buybacks.' },
  { symbol: 'TCS.NS', name: 'TCS', exchange: 'NSE', sector: 'IT', currency: 'INR', whyStrong: '30%+ operating margin, no debt, 80% payout — quality compounder.' },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank', exchange: 'NSE', sector: 'Banking', currency: 'INR', whyStrong: 'Best-in-class cost/income, rising ROA, strong capital.' },
  { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel', exchange: 'NSE', sector: 'Telecom', currency: 'INR', whyStrong: 'ARPU up-cycle, strong FCF, pan-India 5G coverage.' },
  { symbol: 'TMPV.NS', name: 'Tata Motors Passenger', exchange: 'NSE', sector: 'Autos', currency: 'INR', whyStrong: 'PV entity post-demerger (TMCV is the CV arm) with strong SUV mix & EV ramp.' },
  { symbol: 'SUNPHARMA.NS', name: 'Sun Pharma', exchange: 'NSE', sector: 'Pharma', currency: 'INR', whyStrong: 'Deep generics base, US specialty pipeline, consistent earnings.' },
  { symbol: 'LT.NS', name: 'Larsen & Toubro', exchange: 'NSE', sector: 'Infra', currency: 'INR', whyStrong: 'Record order book riding the infra capex supercycle.' },
  { symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance', exchange: 'NSE', sector: 'Consumer Finance', currency: 'INR', whyStrong: '20%+ RoE, disciplined underwriting, wide product moat.' },
  { symbol: 'TITAN.NS', name: 'Titan Company', exchange: 'NSE', sector: 'Consumer', currency: 'INR', whyStrong: 'Premium jewellery + watch compounding, richly branded, high RoCE.' },
  { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever', exchange: 'NSE', sector: 'FMCG', currency: 'INR', whyStrong: 'Household brands, >3x ROE, fortress balance sheet.' },
  { symbol: 'AXISBANK.NS', name: 'Axis Bank', exchange: 'NSE', sector: 'Banking', currency: 'INR', whyStrong: 'Post-merger ROA improving steadily on a big deposit base.' },
  { symbol: 'MARUTI.NS', name: 'Maruti Suzuki', exchange: 'NSE', sector: 'Autos', currency: 'INR', whyStrong: 'SUV-led cycle driving volume + capacity utilisation.' },
  { symbol: 'COALINDIA.NS', name: 'Coal India', exchange: 'NSE', sector: 'Energy', currency: 'INR', whyStrong: 'Generates huge FCF, pays out >90% — a value + dividend play.' },
  { symbol: 'POWERGRID.NS', name: 'Power Grid Corp', exchange: 'NSE', sector: 'Utilities', currency: 'INR', whyStrong: 'Regulated 15%+ RoE returns, dependable high dividend.' },

  // ── United States ──────────────────────────────────────
  { symbol: 'AAPL', name: 'Apple', exchange: 'US', sector: 'Tech — Hardware', currency: 'USD', whyStrong: 'Installed-base ecosystem with enormous FCF and buybacks.' },
  { symbol: 'MSFT', name: 'Microsoft', exchange: 'US', sector: 'Tech — Cloud/AI', currency: 'USD', whyStrong: 'Azure + Office annuities; 40%+ margins and 3x ROE.' },
  { symbol: 'NVDA', name: 'Nvidia', exchange: 'US', sector: 'Tech — AI Chips', currency: 'USD', whyStrong: 'AI compute leader with industry-leading margins. Valuation-rich.' },
  { symbol: 'GOOGL', name: 'Alphabet', exchange: 'US', sector: 'Tech — Platform', currency: 'USD', whyStrong: 'Search + Cloud + YouTube cashflows at a reasonable multiple.' },
  { symbol: 'META', name: 'Meta Platforms', exchange: 'US', sector: 'Tech — Social', currency: 'USD', whyStrong: 'Unmatched ad margins, AI-driven engagement and returns.' },
  { symbol: 'AMZN', name: 'Amazon', exchange: 'US', sector: 'E-commerce/Cloud', currency: 'USD', whyStrong: 'Retail-to-AWS flywheel; margins expanding on both.' },
  { symbol: 'JPM', name: 'JPMorgan', exchange: 'US', sector: 'Banking', currency: 'USD', whyStrong: 'Best-run global bank; 15%+ RoE across cycles.' },
  { symbol: 'V', name: 'Visa', exchange: 'US', sector: 'Payments', currency: 'USD', whyStrong: 'Payments duopoly, near-50% margins, compounding volume.' },
  { symbol: 'COST', name: 'Costco', exchange: 'US', sector: 'Retail', currency: 'USD', whyStrong: 'Membership moat with 25%+ RoE and loyal wallet share.' },
  { symbol: 'PG', name: 'Procter & Gamble', exchange: 'US', sector: 'FMCG', currency: 'USD', whyStrong: 'Dividend aristocrat; defensive staples with steady repricing.' },
];

export function getStockLookup() {
  const map = new Map<string, StockPick>();
  stockPicks.forEach((s) => map.set(s.symbol, s));
  return map;
}