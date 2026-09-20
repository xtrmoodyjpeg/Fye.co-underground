import {animalContent} from '~/data/animalContent';
import {AnimalContentCard} from './AnimalContentCard';

export function AnimalContent() {
  return (
    <section
      id="species"
      className="scroll-mt-20 border-t border-bone/10 bg-void px-5 py-20 text-bone sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-[1400px]">
        <p className="font-mono text-xs uppercase tracking-widest text-acid">
          Animal Content / Field Library
        </p>
        <h2 className="mt-3 font-exotic-headline text-[13vw] uppercase leading-[0.85] sm:text-6xl lg:text-7xl">
          Species we
          <br />
          work with.
        </h2>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-bone/70 sm:text-lg">
          A growing field library of the animals FYE.EXOTICS is documenting,
          caring for, and in some cases working toward a captive bred
          breeding program with. Not all of them are for sale -- some are
          simply worth understanding.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {animalContent.map((animal, index) => (
            <AnimalContentCard key={animal.id} animal={animal} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
