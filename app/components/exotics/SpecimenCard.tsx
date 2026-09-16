import type {Specimen} from '~/data/specimens';

export function SpecimenCard({
  specimen,
  onOpen,
}: {
  specimen: Specimen;
  onOpen: (specimen: Specimen) => void;
}) {
  return (
    <div className="group border border-black/15 bg-bone">
      <div className="relative aspect-square w-full overflow-hidden border-b border-black/15">
        <img
          src={specimen.coverImage}
          alt={`${specimen.commonName} (${specimen.scientificName}), archive number ${specimen.archiveNumber}.`}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
          width={1200}
          height={1200}
        />
        <span className="absolute left-0 top-0 bg-acid px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-black">
          {specimen.status}
        </span>
      </div>

      <div className="p-5">
        <div className="font-mono text-[11px] uppercase tracking-widest text-black/50">
          {specimen.archiveNumber}
        </div>

        <h3 className="mt-2 font-exotic-headline text-2xl uppercase leading-none text-black">
          {specimen.commonName}
        </h3>
        <p className="font-exotic-serif text-sm italic text-black/60">
          {specimen.scientificName}
        </p>

        <dl className="mt-4 space-y-1 font-mono text-[11px] uppercase tracking-widest text-black/60">
          <div className="flex justify-between gap-2">
            <dt>Availability</dt>
            <dd>{specimen.availability}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt>Price</dt>
            <dd>{specimen.price}</dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={() => onOpen(specimen)}
          className="mt-5 flex min-h-[44px] w-full items-center justify-center gap-2 border border-black bg-acid px-4 py-3 font-mono text-xs font-bold uppercase tracking-widest text-black transition-colors hover:bg-black hover:text-acid"
        >
          View specimen file
        </button>
      </div>
    </div>
  );
}
