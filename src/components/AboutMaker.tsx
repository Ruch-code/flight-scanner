import FeedbackPopup from './FeedbackPopup';

export default function AboutMaker() {
  return (
    <section id="about" className="mt-6 scroll-mt-20 group">
      <div className="relative">
        <button
          type="button"
          tabIndex={0}
          className="sketch-card paper px-5 py-2.5 font-marker font-bold text-gray-900 flex items-center gap-2 relative cursor-pointer"
        >
          <span className="text-lg">👩‍💻</span> About the Maker
          <span className="text-[11px] text-gray-500 font-dood font-normal normal-case">· hover me to peek</span>
        </button>
        <span className="pointer-events-none absolute -bottom-6 left-24 font-dood text-xs text-gray-400 animate-pulse whitespace-nowrap">
          🙋 step closer…
        </span>

        <div className="hidden group-hover:block group-focus-within:block absolute left-0 right-0 top-full mt-4 z-30">
          <div className="sketch-card paper p-6 md:p-8 relative overflow-visible">
            <span className="tape absolute -top-3 right-10 h-7 w-24 -rotate-2" aria-hidden="true" />

            <h3 className="font-marker text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>👩‍💻</span> About the Maker
              <span className="text-[11px] text-gray-400 font-dood font-normal normal-case">(pulling back the curtain)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Hi! I'm <strong>Ruchi Kandpal</strong>. I built SkySaver because I love finding
                  insanely good travel deals — and I wanted everyone to have the same superpowers.
                  This tool hunts for the cheapest flights, flashes airline ratings so you're not
                  chasing rock-bottom fares on a bad airline, tells you exactly <em>when</em> to
                  book for the best price, and surfaces coupons that slice even more off the total.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Whether you're flying domestic in India or going international, SkySaver works in
                  both ₹ (INR) and $ (USD). Made with 💜 to make travel smarter, not harder.
                </p>
              </div>
              <div className="group/fb relative">
                <div className="relative min-h-[240px] rounded-xl border border-white/70 bg-transparent overflow-hidden flex flex-col items-center justify-center text-center px-6">
                  <span className="rainbow-glow absolute -inset-10 rounded-full" aria-hidden="true" />

                  <span className="cloud" style={{ top: '16%', width: 56, height: 20, opacity: 0.95, animationDuration: '14s' }} aria-hidden="true" />
                  <span className="cloud" style={{ top: '48%', width: 44, height: 16, opacity: 0.85, transform: 'scale(0.8)', animationDuration: '11s', animationDelay: '-5s' }} aria-hidden="true" />
                  <span className="cloud" style={{ top: '72%', width: 66, height: 22, opacity: 0.9, transform: 'scale(0.65)', animationDuration: '18s', animationDelay: '-9s' }} aria-hidden="true" />

                  <span className="plane-cross text-2xl" aria-hidden="true">✈️</span>

                  <div className="relative z-10 flex flex-col items-center cursor-pointer" tabIndex={0}>
                    <div className="text-5xl mb-3 fb-plane">✈️</div>
                    <div className="rainbow-text font-black text-2xl text-white">
                      Ruchi Kandpal
                    </div>
                    <div className="text-sm text-gray-600 mt-1 font-dood">Creator · SkySaver</div>
                    <div className="flex items-center gap-1 text-sm font-semibold text-gray-700 mt-3">
                      <span>Fly smart.</span>
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-green-500 to-blue-500 font-bold">Save more.</span>
                      <span>Travel further. 💫</span>
                    </div>
                    <span className="pointer-events-none font-dood text-[11px] text-gray-500 mt-2 animate-pulse">
                      hover the plane to send feedback 💌
                    </span>
                  </div>
                </div>

                <div className="hidden group-hover/fb:block group-focus-within/fb:block absolute top-0 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-full md:mr-3 z-40">
                  <FeedbackPopup />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}