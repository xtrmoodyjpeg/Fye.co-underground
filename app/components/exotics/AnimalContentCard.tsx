import type {AnimalProfile} from '~/data/animalContent';

const DATA_ROWS: Array<{
  label: string;
  key: 'location' | 'lifestyle' | 'diet' | 'behavior';
}> = [
  {label: 'Location', key: 'location'},
  {label: 'Lifestyle', key: 'lifestyle'},
  {label: 'Diet', key: 'diet'},
  {label: 'Behavior', key: 'behavior'},
];

export function AnimalContentCard({
  animal,
  index,
}: {
  animal: AnimalProfile;
  index: number;
}) {
  const hasPhoto = animal.images.length > 0;

  return (
    <article className="border border-bone/15">
      <div className="flex items-center justify-between border-b border-bone/15 px-5 py-3 font-mono text-[11px] uppercase tracking-widest text-fog">
        <span>
          Species File / {String(index + 1).padStart(3, '0')}
        </span>
        <span>{animal.category}</span>
      </div>

      <div className="relative flex aspect-[4/3] items-center justify-center border-b border-bone/15 bg-charcoal">
        {hasPhoto ? (
          <img
            src={animal.images[0]}
            alt={animal.commonName}
            loading="lazy"
            className="h-full w-full object-contain p-6"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-fog">
            <span aria-hidden="true" className="text-xl text-bone/20">
              +
            </span>
            <span>Field Photo Pending</span>
            <span className="text-bone/30">Documentation In Progress</span>
          </div>
        )}
      </div>

      <div className="p-6 sm:p-7">
        <h3 className="font-exotic-headline text-2xl uppercase leading-none text-bone sm:text-3xl">
          {animal.commonName}
        </h3>
        {animal.scientificName && (
          <p className="mt-2 font-exotic-serif text-sm italic text-bone/60">
            {animal.scientificName}
          </p>
        )}

        <dl className="mt-6 flex flex-col gap-4 border-t border-bone/10 pt-6">
          {DATA_ROWS.map(({label, key}) => {
            const value = animal[key];
            if (!value) return null;
            return (
              <div key={key}>
                <dt className="font-mono text-[11px] uppercase tracking-widest text-acid">
                  {label}
                </dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-bone/75">
                  {value}
                </dd>
              </div>
            );
          })}
        </dl>

        {animal.funFact && (
          <p className="mt-6 border-t border-bone/10 pt-6 font-exotic-serif text-sm italic leading-relaxed text-bone/70">
            {animal.funFact}
          </p>
        )}

        {animal.breedingNote && (
          <p className="mt-6 border border-acid/30 bg-acid/5 p-4 font-mono text-xs uppercase leading-relaxed tracking-wide text-acid">
            {animal.breedingNote}
          </p>
        )}
      </div>
    </article>
  );
}
