import { getDestinationForIata } from '../data/destinations';
import { convertCurrency, formatPrice } from '../utils/currency';

interface Props {
  destination: string;
  currency: 'USD' | 'INR';
}

function PlaceCard({
  name,
  emoji,
  category,
  entryCostUsd,
  hours,
  blurb,
  currency,
  index,
}: {
  name: string;
  emoji: string;
  category: string;
  entryCostUsd: number;
  hours: string;
  blurb: string;
  currency: 'USD' | 'INR';
  index: number;
}) {
  return (
    <article
      className="place-card group relative rounded-2xl bg-white/80 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary-200/70 hover:border-primary-200 hover:-translate-y-1 transition-all duration-200 p-4 pop-in"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <span className="absolute top-3 right-3 text-[10px] font-black text-gray-300">№{index + 1}</span>

      <div className="flex items-start gap-3 mb-2">
        <span className="place-emoji relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 text-2xl">
          {emoji}
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent-400 blur-[5px]" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="font-bold text-gray-900 leading-tight text-[15px]">{name}</h3>
          <span className="inline-block mt-0.5 text-[11px] font-semibold text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
            {category}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-600 leading-snug">{blurb}</p>

      <div className="flex flex-wrap gap-2 mt-3 text-xs font-semibold">
        <span className={`px-2.5 py-1 rounded-full ${entryCostUsd === 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700 border border-primary-100'}`}>
          {entryCostUsd === 0 ? 'FREE' : formatPrice(convertCurrency(entryCostUsd, 'USD', currency), currency)}
        </span>
        <span className="px-2.5 py-1 rounded-full bg-gray-50 text-gray-500 border border-gray-100">⏱ {hours}</span>
      </div>
    </article>
  );
}

export default function DestinationSketchbook({ destination, currency }: Props) {
  const guide = getDestinationForIata(destination);
  if (!guide) return null;

  const sights = guide.suggestedOrder
    .map((id) => guide.attractions.find((a) => a.id === id))
    .filter((a): a is NonNullable<typeof a> => !!a)
    .slice(0, 8);

  return (
    <section className="mt-8">
      <div className="relative">
        <div
          className="absolute -inset-6 rounded-[3rem] bg-gradient-to-r from-primary-200/50 via-accent-200/50 to-primary-200/50 blur-2xl"
          aria-hidden="true"
        />

        <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl border border-white/70 shadow-xl p-6 sm:p-8">
          <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">🗺️</span>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                  Places to visit in{' '}
                  <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                    {guide.city}
                  </span>{' '}
                  {guide.flag}
                </h2>
              </div>
              <p className="text-sm text-gray-500">{guide.intro}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 shadow-sm">
              ✨ best time: {guide.bestTime}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sights.map((a, i) => (
              <PlaceCard
                key={a.id}
                name={a.name}
                emoji={a.emoji}
                category={a.category}
                entryCostUsd={a.entryCostUsd}
                hours={a.hours}
                blurb={a.blurb}
                currency={currency}
                index={i}
              />
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200/70">
            <div className="flex flex-wrap gap-2 mb-3">
              {guide.foodHighlights.map((f) => (
                <span
                  key={f.name}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/90 border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:border-accent-300 hover:-translate-y-0.5 transition-all"
                  title={`${f.name} · ${formatPrice(convertCurrency(f.costUsd, 'USD', currency), currency)}`}
                >
                  {f.emoji} {f.name}
                  <span className="text-gray-400 font-medium">
                    · {formatPrice(convertCurrency(f.costUsd, 'USD', currency), currency)}
                  </span>
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs font-semibold">
              {guide.tips.slice(0, 2).map((tip) => (
                <span
                  key={tip}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary-50/80 text-primary-700 border border-primary-100 px-3 py-1.5"
                >
                  📌 {tip}
                </span>
              ))}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-50/80 text-accent-700 border border-accent-100 px-3 py-1.5">
                🛂 {guide.visaNote}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}