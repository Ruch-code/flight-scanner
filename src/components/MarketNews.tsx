import { useMarketNews, relativeTime, categorize } from '../hooks/useMarketNews';

const CAT_COLOR: Record<string, string> = {
  Commodities: 'bg-amber-100 text-amber-700 border-amber-300',
  'FII/DII': 'bg-sky-100 text-sky-700 border-sky-300',
  Indices: 'bg-indigo-100 text-indigo-700 border-indigo-300',
  Corporate: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300',
  Markets: 'bg-gray-100 text-gray-600 border-gray-300',
};

const HEADLINE_EMOJI = ['📌', '✒️', '🗞️', '📰', '🖊️'];

export default function MarketNews() {
  const { topic, setTopic, items, loading, error, topics } = useMarketNews();

  return (
    <section id="news" className="mt-10 scroll-mt-20">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <span>🖋️</span> The Daily Finance Paper
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {topics.map((t) => (
            <button
              key={t.id}
              onClick={() => setTopic(t.id)}
              className={`px-2.5 py-1 text-xs font-bold rounded-full border transition ${
                topic === t.id
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-rose-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          Couldn't fetch news right now — try again shortly. ({error})
        </div>
      )}

      <div className="sketch-card paper p-4 sm:p-6">
        {/* Masthead */}
        <div className="flex items-center justify-between border-b-2 border-gray-900 pb-2 mb-4">
          <div className="font-marker text-2xl text-gray-900 leading-none">The Finance Paper</div>
          <div className="text-[10px] font-mono text-gray-500 text-right leading-tight">
            <div>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
            <div>Early Edition · Markets Desk</div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 animate-pulse">
                <div className="h-6 w-6 rounded bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-2 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center text-sm text-gray-400 font-dood py-6">No headlines for this topic yet — pick another.</div>
        ) : (
          <div className="space-y-3">
            {items.map((item, i) => {
              const cat = categorize(item.title);
              return (
                <a
                  key={item.link + i}
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3 group"
                >
                  <span className="text-lg mt-0.5 group-hover:scale-125 transition-transform origin-top-left">
                    {HEADLINE_EMOJI[i % HEADLINE_EMOJI.length]}
                  </span>
                  <div className="flex-1 leading-tight">
                    <div className="text-[11px] font-mono text-gray-400 mb-0.5">
                      {relativeTime(item.pubDate)} · <span className={CAT_COLOR[cat] + ' border px-1 rounded'}>{cat}</span>
                    </div>
                    <h3 className="text-[15px] font-semibold text-gray-800 group-hover:text-rose-700 leading-snug">
                      {item.title}
                    </h3>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      <span className="font-bold text-gray-700">{item.source || 'Wire'}</span>
                      <span className="mx-1">·</span>
                      <span className="underline decoration-dotted group-hover:text-rose-500">read more →</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        <div className="mt-4 pt-2 border-t border-dashed border-gray-300 text-[10px] text-gray-400 font-dood text-center">
          Headlines via Google News · for general information only .
        </div>
      </div>
    </section>
  );
}