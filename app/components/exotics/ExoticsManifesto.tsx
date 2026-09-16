const VALUES = [
  'Education Before Ownership',
  'Responsible Care',
  'Accurate Species Information',
  'Documented Health',
  'Respect For The Animal',
  'Transparent Availability',
];

export function ExoticsManifesto() {
  return (
    <section
      id="about"
      className="scroll-mt-20 border-t border-bone/10 bg-void px-5 py-20 text-bone sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-[1100px]">
        <p className="font-mono text-xs uppercase tracking-widest text-acid">
          About
        </p>
        <h2 className="mt-4 font-exotic-headline text-[9vw] uppercase leading-[0.95] sm:text-5xl lg:text-6xl">
          FYE.EXOTICS exists to document the animals most people
          misunderstand.
        </h2>
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-bone/80 sm:text-lg">
          This is a living archive of reptiles, patterns, behavior, care, and
          controlled chaos. Built from genuine fascination — not fear,
          trends, or novelty.
        </p>

        <div className="mt-14 border-t border-bone/15">
          {VALUES.map((value) => (
            <div
              key={value}
              className="flex items-center justify-between border-b border-bone/15 py-4 font-mono text-xs uppercase tracking-widest sm:text-sm"
            >
              <span>{value}</span>
              <span aria-hidden="true" className="text-acid">
                +
              </span>
            </div>
          ))}
        </div>

        <p className="mt-10 max-w-xl font-mono text-[11px] uppercase leading-relaxed tracking-widest text-fog">
          Live-animal availability will depend on health, maturity, feeding
          consistency, local regulations, and responsible placement.
        </p>
      </div>
    </section>
  );
}
