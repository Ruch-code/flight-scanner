import type { Context } from '@netlify/functions';

interface NewsItem {
  title: string;
  source: string;
  link: string;
  pubDate: string;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .trim();
}

function parseRSS(xml: string, limit: number): NewsItem[] {
  const items: NewsItem[] = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  let m: RegExpExecArray | null;
  while ((m = itemRe.exec(xml))) {
    const block = m[1];
    const get = (tag: string) => {
      const t = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`).exec(block);
      return t ? decodeEntities(t[1].replace(/\s+/g, ' ')) : '';
    };
    let title = get('title');
    let source = get('source');
    if (!source) {
      const dash = title.lastIndexOf(' - ');
      if (dash > -1) {
        source = title.slice(dash + 3);
        title = title.slice(0, dash);
      }
    }
    const link = (new RegExp('<link>(.*?)</link>').exec(block)?.[1] || '').trim();
    const pubDate = get('pubDate');
    items.push({ title, source, link, pubDate });
    if (items.length >= limit) break;
  }
  return items.filter((i) => i.title && i.link);
}

let cache: { key: string; at: number; data: string } | null = null;
const CACHE_TTL = 3 * 60 * 1000;

export default async (req: Request, _ctx: Context) => {
  if (req.method !== 'GET') return new Response(JSON.stringify({ error: 'METHOD_NOT_ALLOWED' }), { status: 405 });

  const url = new URL(req.url);
  const q = url.searchParams.get('q') || 'NIFTY OR Sensex OR "Indian stock market"';
  const limit = Math.min(Number(url.searchParams.get('limit') || 14), 30);
  const cacheKey = `${q}|${limit}`;

  if (cache && cache.key === cacheKey && Date.now() - cache.at < CACHE_TTL) {
    return new Response(cache.data, { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=160' } });
  }

  try {
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-IN&gl=IN&ceid=IN:en`;
    const res = await fetch(rssUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) throw new Error(`Google News ${res.status}`);
    const xml = await res.text();
    const items = parseRSS(xml, limit);
    const payload = JSON.stringify({ items, q, ts: Date.now() });
    cache = { key: cacheKey, at: Date.now(), data: payload };
    return new Response(payload, { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=160' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: 'NEWS_ERROR', message: e.message, items: [] }), { status: 502 });
  }
};