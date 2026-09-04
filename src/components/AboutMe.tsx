import { useState } from 'react';

function AboutMe() {
  const [planeFlying, setPlaneFlying] = useState(false);
  const [scrollTarget, setScrollTarget] = useState(false);

  const handlePlaneClick = () => {
    setPlaneFlying(false);
    setTimeout(() => {
      setPlaneFlying(true);
      setTimeout(() => {
        const about = document.getElementById('about');
        if (about) {
          about.scrollIntoView({ behavior: 'smooth' });
        }
        setPlaneFlying(false);
      }, 1400);
    }, 50);
  };

  return (
    <div className="flex items-center justify-center py-3">
      <button
        type="button"
        onClick={handlePlaneClick}
        onMouseEnter={() => setScrollTarget(true)}
        onMouseLeave={() => setScrollTarget(false)}
        className="group relative flex flex-col items-center cursor-pointer select-none"
        title="About the maker"
      >
        {planeFlying && (
          <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
            <span className="text-6xl animate-fly-across" style={{ backgroundImage: 'linear-gradient(90deg, #ef4444, #f59e0b, #22c55e, #06b6d4, #3b82f6, #a855f7)' }}>
              ✈️
            </span>
          </div>
        )}

        {/* Colorful airplane with trail */}
        <div className="relative group-hover:animate-plane-hover animate-float">
          <div className="absolute inset-0 rounded-full blur-md opacity-60 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 to-blue-400 group-hover:opacity-90 group-hover:blur-lg transition-all duration-300" />

          {scrollTarget && !planeFlying && (
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="absolute -inset-x-4 -inset-y-1 bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-500 via-green-500 via-teal-500 to-blue-500 rounded-full opacity-80 blur">
              </span>
              <span className="relative text-xs font-bold text-white px-3 py-1 rounded-full">
                ✈️ About Me
              </span>
            </div>
          )}

          <span
            className="text-4xl md:text-5xl relative transition-all duration-300 cursor-pointer"
            style={{
              backgroundImage: 'linear-gradient(90deg, #ef4444, #f59e0b, #22c55e, #06b6d4, #3b82f6, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: scrollTarget ? 'drop-shadow(0 0 12px rgba(168,85,247,0.6))' : 'none',
            }}
          >
            ✈️
          </span>
        </div>

        <span className={`text-xs mt-2 font-semibold transition-colors ${scrollTarget ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-orange-500 to-blue-500 font-extrabold' : 'text-gray-500'}`}>
          Discover the maker
        </span>
      </button>
    </div>
  );
}

export default AboutMe;