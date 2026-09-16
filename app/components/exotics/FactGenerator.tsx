import {useEffect, useRef, useState} from 'react';
import {reptileFacts} from '~/data/reptileFacts';
import {FactProgress} from './FactProgress';

const FACTS = reptileFacts.filter((fact) => fact.published);
const ROTATE_INTERVAL_MS = 8000;

function pickNextIndex(excludeIndex: number, length: number): number {
  if (length <= 1) return 0;
  let next = excludeIndex;
  while (next === excludeIndex) {
    next = Math.floor(Math.random() * length);
  }
  return next;
}

export function FactGenerator() {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const indexRef = useRef(index);
  indexRef.current = index;

  useEffect(() => {
    function handleVisibility() {
      setIsPlaying(document.visibilityState === 'visible');
    }
    handleVisibility();
    document.addEventListener('visibilitychange', handleVisibility);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      setIndex((current) => pickNextIndex(current, FACTS.length));
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
    // Depending on `index` (unused in the body) is intentional: it re-arms
    // the timer whenever the fact changes, so manually generating a new
    // fact also resets the 8s countdown instead of firing early.
  }, [isPlaying, index]);

  const fact = FACTS[index];

  function handleShowAnother() {
    setIndex((current) => pickNextIndex(current, FACTS.length));
  }

  return (
    <section
      id="facts"
      className="scroll-mt-20 border-t border-bone/10 bg-void px-5 py-20 text-bone sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-[1200px]">
        <p className="font-mono text-xs uppercase tracking-widest text-acid">
          Fact Files / Auto-Generated Archive
        </p>
        <h2 className="mt-3 font-exotic-headline text-[13vw] uppercase leading-[0.9] sm:text-6xl lg:text-7xl">
          Things they don&rsquo;t
          <br />
          teach you.
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-10 border border-bone/15 p-6 sm:p-10 lg:grid-cols-[auto_1fr]">
          <div className="font-mono text-sm uppercase tracking-widest text-fog">
            Fact {String(fact.factNumber).padStart(3, '0')}
          </div>

          <div>
            <div
              key={fact.id}
              aria-live="polite"
              aria-atomic="true"
              className="motion-safe:animate-[fact-fade-in_400ms_ease-out]"
            >
              <p className="font-exotic-headline text-2xl uppercase leading-tight sm:text-4xl">
                {fact.headline}
              </p>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-bone/85 sm:text-lg">
                {fact.body}
              </p>

              <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[11px] uppercase tracking-widest text-fog">
                <div className="flex gap-2">
                  <dt>Species</dt>
                  <dd className="text-bone/80">{fact.species}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-exotic-serif italic normal-case tracking-normal">
                    {fact.scientificName}
                  </dt>
                </div>
                <div className="flex gap-2">
                  <dt>Category</dt>
                  <dd className="text-acid">{fact.category}</dd>
                </div>
              </dl>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleShowAnother}
                className="flex min-h-[44px] items-center justify-center gap-2 border border-acid bg-acid px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-black transition-colors hover:bg-void hover:text-acid"
              >
                Show me another
                <span aria-hidden="true">→</span>
              </button>

              <div className="sm:w-64">
                <FactProgress
                  current={index}
                  total={FACTS.length}
                  cycleKey={fact.id}
                  playing={isPlaying}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
