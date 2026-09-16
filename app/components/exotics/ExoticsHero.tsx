export function ExoticsHero() {
  return (
    <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-void text-bone">
      <img
        src="/exotics/exotics-python.webp"
        alt="Two juvenile pythons coiled together on wood-shaving substrate, documented for the FYE.EXOTICS specimen archive."
        className="absolute inset-0 h-full w-full object-cover object-center"
        // React 18's DOM types don't recognize fetchPriority as camelCase
        // yet, so it has to go through as a raw lowercase DOM attribute.
        {...{fetchpriority: 'high'}}
      />

      <div aria-hidden="true" className="absolute inset-0 bg-void/35" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-void/55 via-transparent to-void/70"
      />

      {/* Field-document labels */}
      <div className="absolute left-5 top-24 font-mono text-[10px] uppercase tracking-widest text-bone/70 sm:left-8 sm:top-28">
        <p>Specimen Archive / 001</p>
        <p>Orlando, FL</p>
      </div>
      <div className="absolute right-5 top-24 text-right font-mono text-[10px] uppercase tracking-widest text-bone/70 sm:right-8 sm:top-28">
        <p>Est. 2026</p>
        <p>Cold Blooded Division</p>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
        <h1 className="font-exotic-headline text-[22vw] uppercase leading-[0.82] tracking-tight sm:text-[13vw] lg:text-[10vw]">
          FYE.
          <br />
          EXOTICS
        </h1>
        <p className="mt-4 font-exotic-serif text-lg italic text-bone/90 sm:text-2xl">
          Weird by nature.
        </p>
      </div>

      <div className="absolute bottom-6 left-5 font-mono text-[10px] uppercase tracking-widest text-bone/60 sm:left-8">
        Private Collection
      </div>
      <div className="absolute bottom-6 right-5 max-w-[11rem] text-right font-mono text-[10px] uppercase leading-relaxed tracking-widest text-bone/60 sm:right-8">
        Observe. Document. Respect.
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-bone/60 sm:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest">
          Scroll
        </span>
        <span className="h-8 w-px bg-bone/40" />
      </div>
    </section>
  );
}
