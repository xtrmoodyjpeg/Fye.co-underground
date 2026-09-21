import {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router';

const SESSION_KEY = 'fye-co-cta-banner-dismissed';
const REVEAL_AFTER_PX = 400;

export function StickyCtaBanner() {
  const [dismissed, setDismissed] = useState(true);
  const [visible, setVisible] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    if (window.sessionStorage.getItem(SESSION_KEY)) return;
    setDismissed(false);
    lastY.current = window.scrollY;

    function handleScroll() {
      const y = window.scrollY;
      const scrollingUp = y < lastY.current;
      lastY.current = y;
      setVisible(scrollingUp && y > REVEAL_AFTER_PX);
    }

    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function dismiss() {
    setDismissed(true);
    window.sessionStorage.setItem(SESSION_KEY, '1');
  }

  if (dismissed) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-paper/10 bg-black/95 backdrop-blur transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 py-3 sm:px-10">
        <p className="font-mono text-[11px] uppercase tracking-widest text-paper sm:text-xs">
          Drop 02 is live <span className="text-paper/50">— new pieces just dropped</span>
        </p>
        <div className="flex items-center gap-3">
          <Link
            to="/shop"
            prefetch="intent"
            className="inline-flex items-center gap-1 rounded-full bg-signal px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-paper hover:opacity-90 sm:px-5 sm:py-2.5 sm:text-xs"
          >
            Shop now →
          </Link>
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
