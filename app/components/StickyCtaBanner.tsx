import {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router';
import type {BannerConfig} from '~/lib/banner.server';

const REVEAL_AFTER_PX = 400;
const SCROLL_THRESHOLD_PX = 2;

export function StickyCtaBanner({banner}: {banner: BannerConfig}) {
  const [visible, setVisible] = useState(false);
  const suppressed = useRef(false);
  const lastY = useRef(0);

  useEffect(() => {
    if (!banner.enabled || !banner.message) return;
    lastY.current = window.scrollY;

    function handleScroll() {
      const y = window.scrollY;
      const goingDown = y > lastY.current + SCROLL_THRESHOLD_PX;
      const goingUp = y < lastY.current - SCROLL_THRESHOLD_PX;

      if (goingDown) {
        suppressed.current = false;
        setVisible(false);
      } else if (goingUp && y > REVEAL_AFTER_PX && !suppressed.current) {
        setVisible(true);
      }

      lastY.current = y;
    }

    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, [banner.enabled, banner.message]);

  if (!banner.enabled || !banner.message) return null;

  function dismiss() {
    suppressed.current = true;
    setVisible(false);
  }

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-paper/10 bg-black/95 backdrop-blur transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-4 px-5 py-3 sm:px-10">
        <p className="font-mono text-[11px] uppercase tracking-widest text-paper sm:text-xs">
          {banner.message}
        </p>
        <div className="flex items-center gap-3">
          {banner.ctaLabel && banner.ctaHref && (
            <Link
              to={banner.ctaHref}
              prefetch="intent"
              className="inline-flex items-center gap-1 rounded-full bg-signal px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-paper hover:opacity-90 sm:px-5 sm:py-2.5 sm:text-xs"
            >
              {banner.ctaLabel} →
            </Link>
          )}
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss banner"
            className="reset flex h-8 w-8 items-center justify-center text-paper/60 hover:text-paper"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
