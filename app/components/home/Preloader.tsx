import {useEffect, useState} from 'react';

const SESSION_KEY = 'fye-co-home-preloader-seen';
const REVEAL_AT_MS = 50;
const FADE_AT_MS = 1700;
const DONE_AT_MS = 2200;

export function Preloader() {
  const [visible, setVisible] = useState(false);
  const [stage, setStage] = useState<'enter' | 'shown' | 'fading'>('enter');

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const alreadySeen = window.sessionStorage.getItem(SESSION_KEY);

    if (reduceMotion || alreadySeen) {
      window.sessionStorage.setItem(SESSION_KEY, '1');
      return;
    }

    setVisible(true);
    document.body.style.overflow = 'hidden';

    const revealTimer = setTimeout(() => setStage('shown'), REVEAL_AT_MS);
    const fadeTimer = setTimeout(() => setStage('fading'), FADE_AT_MS);
    const doneTimer = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = '';
      window.sessionStorage.setItem(SESSION_KEY, '1');
    }, DONE_AT_MS);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = '';
    };
  }, []);

  function skip() {
    setVisible(false);
    document.body.style.overflow = '';
    window.sessionStorage.setItem(SESSION_KEY, '1');
  }

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={skip}
      aria-label="Skip intro animation"
      className={`fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-black transition-opacity duration-500 ${
        stage === 'fading' ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div
        className={`flex flex-col items-center gap-4 transition-all duration-700 ease-out ${
          stage === 'enter' ? 'scale-90 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <img
          src="/fye-co-logo-gator.webp"
          alt="FYE.CO"
          className="h-24 w-auto object-contain sm:h-32"
        />
        <span className="font-display text-2xl tracking-wide text-paper sm:text-3xl">
          FYE.CO
        </span>
      </div>
    </button>
  );
}
