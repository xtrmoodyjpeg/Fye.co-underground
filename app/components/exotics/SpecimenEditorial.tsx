const SCIENTIFIC_DETAILS = [
  {label: 'Class', value: 'Reptilia'},
  {label: 'Status', value: 'Observed'},
  {label: 'Temperament', value: 'Species Dependent'},
  {label: 'Handling', value: 'Experienced Keepers'},
  {label: 'Environment', value: 'Controlled Habitat'},
];

export function SpecimenEditorial() {
  return (
    <section className="border-t border-bone/10 bg-void px-5 py-20 text-bone sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-start justify-between gap-6 border-b border-bone/15 pb-8">
          <h2 className="font-exotic-headline text-[13vw] uppercase leading-[0.85] sm:text-6xl lg:text-7xl">
            Not your
            <br />
            average pet.
          </h2>
          <span
            aria-hidden="true"
            className="hidden shrink-0 font-exotic-headline text-6xl text-bone/10 lg:block lg:text-8xl"
          >
            002
          </span>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_0.7fr_1fr] lg:gap-0">
          <div className="aspect-[4/5] w-full overflow-hidden border border-bone/15 lg:border-r-0">
            <img
              src="/exotics/exotics-gecko.webp"
              alt="A leopard gecko held in an open palm, documented for the FYE.EXOTICS specimen archive."
              className="h-full w-full object-cover"
              loading="lazy"
              width={1500}
              height={2000}
            />
          </div>

          <div className="border border-bone/15 p-6 lg:border-l-0 lg:border-r-0">
            <p className="font-mono text-xs uppercase tracking-widest text-acid">
              Specimen Study / 002
            </p>
            <dl className="mt-6 space-y-4">
              {SCIENTIFIC_DETAILS.map((detail) => (
                <div
                  key={detail.label}
                  className="border-b border-bone/10 pb-3 font-mono text-[11px] uppercase tracking-widest"
                >
                  <dt className="text-fog">{detail.label}</dt>
                  <dd className="mt-1 text-bone">{detail.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="border border-bone/15 p-6">
            <p className="text-lg leading-relaxed text-bone/90 sm:text-xl">
              These animals are not accessories. Every pattern, movement, and
              survival response tells a story shaped by millions of years of
              adaptation.
            </p>
            <p className="mt-8 font-exotic-serif text-base italic text-bone/70">
              Respect the animal before you admire the pattern.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
