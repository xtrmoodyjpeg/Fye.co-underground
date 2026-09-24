export function ExoticsHero() {
  return (
    <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-void text-bone">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/exotics/exotics-hero-loop-poster.webp"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
      >
        <source src="/exotics/exotics-hero-loop.mp4" type="video/mp4" />
      </video>

      <div aria-hidden="true" className="absolute inset-0 bg-void/50" />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-60 mix-blend-multiply"
        style={{
          backgroundImage: 'url(/textures/snake-leather.webp)',
          backgroundRepeat: 'repeat',
          backgroundSize: '220px auto',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-void/55 via-transparent to-void/70"
      />

      {/* Field-document labels */}
      <div className="absolute left-5 top-24 hidden font-mono text-[10px] uppercase tracking-widest text-bone/70 [text-shadow:0_1px_3px_rgba(0,0,0,0.8)] sm:left-8 sm:top-28 sm:block">
        <p>Specimen Archive / 001</p>
        <p>Orlando, FL</p>
      </div>
      <div className="absolute right-5 top-24 hidden text-right font-mono text-[10px] uppercase tracking-widest text-bone/70 [text-shadow:0_1px_3px_rgba(0,0,0,0.8)] sm:right-8 sm:top-28 sm:block">
        <p>Est. 2026</p>
        <p>Cold Blooded Division</p>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
        <h1 className="font-exotic-headline text-[clamp(2.75rem,18vw,4.75rem)] uppercase leading-[0.82] tracking-tight sm:text-[13vw] lg:text-[10vw]">
          FYE.
          <br />
          EXOTICS
        </h1>
        <p className="mt-4 font-exotic-serif text-lg italic text-bone/90 sm:text-2xl">
          Weird by nature.
        </p>
      </div>

      <div className="absolute bottom-6 left-5 font-mono text-[10px] uppercase tracking-widest text-bone/80 [text-shadow:0_1px_3px_rgba(0,0,0,0.8)] sm:left-8">
        Private Collection
      </div>
      <div className="absolute bottom-6 right-5 max-w-[11rem] text-right font-mono text-[10px] uppercase leading-relaxed tracking-widest text-bone/80 [text-shadow:0_1px_3px_rgba(0,0,0,0.8)] sm:right-8">
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
