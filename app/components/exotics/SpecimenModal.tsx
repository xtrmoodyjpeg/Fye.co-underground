import {useEffect, useRef} from 'react';
import type {Specimen} from '~/data/specimens';

const DETAIL_ROWS: Array<{label: string; key: keyof Specimen}> = [
  {label: 'Sex', key: 'sex'},
  {label: 'Hatch Date', key: 'hatchDate'},
  {label: 'Age', key: 'age'},
  {label: 'Morph', key: 'morph'},
  {label: 'Weight', key: 'weight'},
  {label: 'Feeding Status', key: 'feedingStatus'},
  {label: 'Diet', key: 'diet'},
  {label: 'Location', key: 'location'},
];

export function SpecimenModal({
  specimen,
  onClose,
}: {
  specimen: Specimen | null;
  onClose: () => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!specimen) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const controller = new AbortController();
    document.addEventListener(
      'keydown',
      (event) => {
        if (event.key === 'Escape') onClose();
      },
      {signal: controller.signal},
    );

    return () => {
      controller.abort();
      previouslyFocused.current?.focus();
    };
  }, [specimen, onClose]);

  if (!specimen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="specimen-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-8"
    >
      <button
        type="button"
        aria-label="Close specimen file"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto border border-bone/20 bg-void text-bone">
        <div className="flex items-center justify-between border-b border-bone/15 px-6 py-4">
          <p className="font-mono text-xs uppercase tracking-widest text-acid">
            {specimen.archiveNumber} / Specimen File
          </p>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close specimen file"
            className="flex h-10 w-10 items-center justify-center border border-bone/30 text-lg hover:bg-charcoal"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 p-6 sm:grid-cols-2 sm:p-10">
          <div className="aspect-square w-full overflow-hidden border border-bone/15">
            <img
              src={specimen.coverImage}
              alt={`${specimen.commonName} (${specimen.scientificName})`}
              className="h-full w-full object-cover"
              width={1200}
              height={1200}
            />
          </div>

          <div>
            <h2
              id="specimen-modal-title"
              className="font-exotic-headline text-3xl uppercase leading-none"
            >
              {specimen.commonName}
            </h2>
            <p className="font-exotic-serif text-base italic text-bone/70">
              {specimen.scientificName}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-bone/85">
              {specimen.description}
            </p>

            <dl className="mt-6 space-y-3 border-t border-bone/10 pt-4">
              {DETAIL_ROWS.map((row) => (
                <div
                  key={row.label}
                  className="flex justify-between gap-4 border-b border-bone/10 pb-2 font-mono text-[11px] uppercase tracking-widest"
                >
                  <dt className="text-fog">{row.label}</dt>
                  <dd className="text-right text-bone">
                    {String(specimen[row.key])}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-4 text-xs leading-relaxed text-fog">
              {specimen.healthNotes}
            </p>

            <div className="mt-6 flex items-center justify-between border border-bone/20 px-4 py-3 font-mono text-xs uppercase tracking-widest">
              <span className="text-fog">Price</span>
              <span className="text-acid">{specimen.price}</span>
            </div>

            <a
              href={`mailto:hello@fye.co?subject=${encodeURIComponent(
                `Specimen inquiry — ${specimen.archiveNumber} ${specimen.commonName}`,
              )}`}
              className="mt-4 flex min-h-[44px] w-full items-center justify-center border border-acid bg-acid px-4 py-3 font-mono text-xs font-bold uppercase tracking-widest text-black transition-colors hover:bg-void hover:text-acid"
            >
              Inquire about this specimen
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
