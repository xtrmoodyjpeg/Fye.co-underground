import {animalContent} from '~/data/animalContent';
import {AnimalContentCard} from './AnimalContentCard';

export function AnimalContent() {
  return (
    <section
      id="species"
      className="scroll-mt-20 border-t border-bone/10 bg-void px-5 py-20 text-bone sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-[1800px]">
        <p className="font-mono text-xs uppercase tracking-widest text-acid">
          Meet The Fam
        </p>
        <h2 className="mt-3 font-exotic-headline text-[13vw] uppercase leading-[0.85] sm:text-6xl lg:text-7xl">
          The ones we&rsquo;re
          <br />
          obsessed with.
        </h2>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-bone/70 sm:text-lg">
          Some of these are already ours, some are still just crushes -- but
          we can&rsquo;t stop talking about any of them. Not everyone here is
          for sale. Some of them are just too weird and too cool not to gush
          about.
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
