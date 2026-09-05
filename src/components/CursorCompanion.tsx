import { useEffect, useRef } from 'react';

export default function CursorCompanion() {
  const planeRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    const coarsePointer = window.matchMedia?.('(pointer: coarse)')?.matches;
    if (prefersReduced || coarsePointer) return;

    const plane = planeRef.current;
    const trail = trailRef.current;
    if (!plane || !trail) return;

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx;
    let y = ty;
    let vx = 0;
    let vy = 0;
    let heading = -45;
    let onInteractive = false;
    let boostingUntil = 0;
    const hist: { x: number; y: number }[] = [];
    let raf = 0;

    const isInteractive = (el: Element | null): boolean =>
      !!el && !!el.closest && !!el.closest('a, button, [role="button"], input, select, textarea, label, summary');

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      onInteractive = isInteractive(e.target as Element | null);
    };

    const onDown = () => {
      boostingUntil = performance.now() + 350;
    };

    const step = () => {
      const k = onInteractive ? 0.32 : 0.15;
      vx += (tx - x) * k;
      vy += (ty - y) * k;
      vx *= 0.7;
      vy *= 0.7;
      x += vx;
      y += vy;

      const speed = Math.hypot(vx, vy);
      const now = performance.now();
      const boosting = now < boostingUntil;

      let desired = speed > 1.5 ? Math.atan2(vy, vx) * (180 / Math.PI) : heading;
      let diff = desired - heading;
      while (diff > 180) diff -= 360;
      while (diff < -180) diff += 360;
      heading += diff * 0.18;

      const bob = Math.sin(now / 260) * 2;
      const scale = Math.min(1.15, 0.85 + speed / 16) * (boosting ? 1.25 : 1);
      plane.style.transform = `translate3d(${x - 16}px, ${y - 16 + bob}px, 0) rotate(${heading}deg) scale(${scale})`;
      plane.style.opacity = boosting ? '0.85' : '1';

      hist.push({ x, y });
      if (hist.length > 44) hist.shift();
      trail.setAttribute(
        'd',
        hist
          .filter((_, i) => i % 2 === 0)
          .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
          .join('')
      );

      raf = requestAnimationFrame(step);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
      <svg className="absolute left-0 top-0 h-full w-full" style={{ overflow: 'visible' }}>
        <path
          ref={trailRef}
          fill="none"
          stroke="rgba(99,102,241,0.28)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeDasharray="0.1 7"
        />
      </svg>
      <div
        ref={planeRef}
        className="absolute left-0 top-0 text-[26px] leading-none will-change-transform"
        style={{ filter: 'drop-shadow(0 2px 3px rgba(79,70,229,0.35))' }}
      >
        ✈️
      </div>
    </div>
  );
}