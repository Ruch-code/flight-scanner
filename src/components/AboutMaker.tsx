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
              <div className="bg-gradient-to-br from-primary-50 via-accent-50 to-pink-50 rounded-xl p-6 border border-primary-100 flex flex-col items-center justify-center text-center">
                <div className="text-5xl mb-3">✈️</div>
                <div className="font-black text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">
                  Ruchi Kandpal
                </div>
                <div className="text-sm text-gray-600 mt-1">Creator · SkySaver</div>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-3">
                  <span>Fly smart.</span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-green-500 to-blue-500 font-bold">Save more.</span>
                  <span>Travel further. 💫</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}