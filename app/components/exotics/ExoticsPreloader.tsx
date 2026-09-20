import {useEffect, useState} from 'react';

const SESSION_KEY = 'fye-exotics-preloader-seen';
const MORPH_AT_MS = 650;
const FADE_AT_MS = 1900;
const DONE_AT_MS = 2500;

export function ExoticsPreloader() {
  const [visible, setVisible] = useState(false);
  const [stage, setStage] = useState<'wordmark' | 'morphed' | 'fading'>(
    'wordmark',
  );

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

    const morphTimer = setTimeout(() => setStage('morphed'), MORPH_AT_MS);
    const fadeTimer = setTimeout(() => setStage('fading'), FADE_AT_MS);
    const doneTimer = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = '';
      window.sessionStorage.setItem(SESSION_KEY, '1');
    }, DONE_AT_MS);

    return () => {
      clearTimeout(morphTimer);
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

  const morphed = stage === 'morphed' || stage === 'fading';

  return (
    <button
      type="button"
      onClick={skip}
      aria-label="Skip intro animation"
      className={`fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-void transition-opacity duration-500 ${
        stage === 'fading' ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative flex h-28 w-full max-w-xs flex-col items-center justify-center sm:h-32">
        <span
          className={`absolute font-display text-4xl tracking-wide text-bone transition-all duration-700 ease-out sm:text-5xl ${
            morphed ? 'scale-90 opacity-0' : 'scale-100 opacity-100'
          }`}
        >
          FYE.CO
        </span>

        <div
          className={`absolute flex flex-col items-center gap-3 transition-all duration-700 ease-out ${
            morphed
              ? 'scale-100 opacity-100'
              : 'scale-110 opacity-0'
          }`}
        >
          <img
            src="/exotics/exotics-logo-frog.webp"
            alt=""
            className="h-16 w-16 object-contain sm:h-20 sm:w-20"
          />
          <span className="font-exotic-headline text-2xl uppercase tracking-wide text-acid sm:text-3xl">
            FYE.EXOTICS
          </span>
        </div>
      </div>
    </button>
  );
}
