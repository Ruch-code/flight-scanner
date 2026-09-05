import { getDestinationForIata } from '../data/destinations';
import { convertCurrency, formatPrice } from '../utils/currency';

interface Props {
  destination: string;
  currency: 'USD' | 'INR';
}

function SightCard({
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
  const rot = index % 2 === 0 ? 0.7 : -0.7;
  return (
    <div className="sketch-card h-full" style={{ transform: `rotate(${rot}deg)` }}>
      <div className="paper paper-lined rounded-lg p-3 h-full pop-in relative" style={{ animationDelay: `${index * 60}ms` }}>
        <span className="absolute -top-1.5 left-3 h-4 w-8 tape opacity-70 rotate-2" aria-hidden="true" />
        <div className="text-2xl mb-1">{emoji}</div>
        <div className="font-dood font-bold text-gray-900 leading-tight text-sm">{name}</div>
        <span className="inline-block text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-gray-900/5 text-gray-500 mt-1">
          {category}
        </span>
        <p className="text-xs text-gray-600 mt-1 font-dood leading-snug">{blurb}</p>
        <div className="flex gap-2 mt-2 text-[10px] font-bold">
          <span className={`px-1.5 py-0.5 rounded ${entryCostUsd === 0 ? 'bg-green-100 text-green-700' : 'bg-primary-100 text-primary-700'}`}>
            {entryCostUsd === 0 ? 'FREE' : formatPrice(convertCurrency(entryCostUsd, 'USD', currency), currency)}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">⏱ {hours}</span>
        </div>
      </div>
    </div>
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
      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
        <h2 className="font-marker text-2xl font-black text-gray-900 flex items-center gap-2">
          <span className="wiggle">🖍️</span> Destination Sketchbook
          <span className="text-lg">{guide.flag}</span>
        </h2>
        <span className="font-dood text-sm text-gray-500 scribble-underline">what {guide.city} is famous for · drawn fresh ✏️</span>
      </div>

      <div className="sketch-card paper p-5 sm:p-7 relative overflow-hidden">
        <span className="tape absolute -top-3 left-1/2 -translate-x-1/2 h-7 w-28 -rotate-1" aria-hidden="true" />

        <p className="font-dood text-base text-gray-700 mb-5 max-w-2xl">{guide.intro}</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {sights.map((a, i) => (
            <SightCard
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

        <div className="mt-6">
          <div className="font-hand text-lg font-bold text-amber-900 mb-2">🍽️ must eat</div>
          <div className="flex flex-wrap gap-2">
            {guide.foodHighlights.map((f) => (
              <span
                key={f.name}
                className="wiggle inline-flex items-center gap-1 font-dood text-xs font-bold bg-white/70 border border-gray-900/25 rounded-full px-3 py-1 text-gray-800"
              >
                {f.emoji} {f.name}
                <span className="text-gray-400 font-normal">· {formatPrice(convertCurrency(f.costUsd, 'USD', currency), currency)}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="sketch-card paper-lined p-4 relative">
            <div className="font-hand text-lg font-bold text-primary-900 mb-2">📌 local know-how</div>
            <ul className="space-y-1.5">
              {guide.tips.map((tip) => (
                <li key={tip} className="font-dood text-sm text-gray-700 flex gap-2">
                  <span aria-hidden="true">✎</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="sketch-card paper-lined p-4 relative flex flex-col">
            <div className="font-hand text-lg font-bold text-accent-900 mb-2">🛂 before you fly</div>
            <p className="font-dood text-sm text-gray-700">{guide.visaNote}</p>
            <span className="mt-auto pt-3 font-marker text-sm text-gray-400">check current rules — they update!</span>
          </div>
        </div>
      </div>
    </section>
  );
}