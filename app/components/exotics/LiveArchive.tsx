import {useState} from 'react';
import {specimens} from '~/data/specimens';
import {SpecimenCard} from './SpecimenCard';
import {SpecimenModal} from './SpecimenModal';
import type {Specimen} from '~/data/specimens';

export function LiveArchive() {
  const [activeSpecimen, setActiveSpecimen] = useState<Specimen | null>(null);

  return (
    <section
      id="archive"
      className="scroll-mt-20 border-t border-black/10 bg-bone px-5 py-20 text-black sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-[1400px]">
        <p className="font-mono text-xs uppercase tracking-widest text-black/50">
          Live Archive
        </p>
        <h2 className="mt-3 font-exotic-headline text-[13vw] uppercase leading-[0.85] sm:text-6xl lg:text-7xl">
          Available
          <br />
          soon.
        </h2>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-black/70 sm:text-lg">
          Future live-reptile releases, documented specimens, and
          responsibly maintained animals will appear here.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {specimens.map((specimen) => (
            <SpecimenCard
              key={specimen.id}
              specimen={specimen}
              onOpen={setActiveSpecimen}
            />
          ))}
        </div>
      </div>

      <SpecimenModal
        specimen={activeSpecimen}
        onClose={() => setActiveSpecimen(null)}
      />
    </section>
  );
}
