import {Link} from 'react-router';

export function BrandConnection() {
  return (
    <section className="border-t border-paper/10 bg-black px-6 py-20 text-paper sm:px-10">
      <div className="mx-auto grid max-w-[1800px] grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-signal">
            Two obsessions, one eye
          </p>
          <h2 className="-rotate-1 font-display text-4xl leading-[1.05] sm:text-5xl">
            Same hands. Different
            <br />
            kind of rare.
          </h2>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-paper/80">
            FYE.CO started as sketches in a notebook -- graphics built for
            people who notice what everyone else walks past. FYE.EXOTICS grew
            out of the same instinct, just pointed somewhere colder: years of
            actually keeping, studying, and breeding reptiles most people
            never look twice at.
          </p>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-paper/80">
            It&rsquo;s not a side project bolted onto the brand. It&rsquo;s
            the same person paying attention -- to a pattern on a hoodie, to
            a pattern on a python. FYE.EXOTICS is the behind-the-scenes half
            of FYE.CO: the archive, the species files, the breeding projects,
            the part of the obsession that doesn&rsquo;t fit on a t-shirt.
          </p>
          <Link
            to="/exotics"
            prefetch="intent"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3 font-mono text-xs uppercase tracking-widest text-paper transition-opacity hover:opacity-90"
          >
            Explore FYE.EXOTICS <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative col-span-2 flex aspect-[16/9] flex-col justify-end overflow-hidden rounded-2xl">
            <img
              src="/exotics/exotics-python.webp"
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"
            />
            <div className="relative z-10 p-6">
              <span className="font-exotic-headline text-2xl uppercase tracking-wide text-acid">
                FYE.EXOTICS
              </span>
              <span className="mt-1 block font-mono text-[10px] uppercase tracking-widest text-paper/60">
                Cold Blooded Division / Est. 2026
              </span>
            </div>
          </div>
          <div className="relative flex aspect-square flex-col justify-end overflow-hidden rounded-2xl">
            <img
              src="/exotics/exotics-frog.webp"
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"
            />
            <div className="relative z-10 p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-paper/60">
                Fact Files
              </p>
              <p className="mt-2 text-sm text-paper">
                Rotating reptile facts, updated weekly.
              </p>
            </div>
          </div>
          <div className="relative flex aspect-square flex-col justify-end overflow-hidden rounded-2xl">
            <img
              src="/exotics/exotics-ball-python.webp"
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"
            />
            <div className="relative z-10 p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-paper/60">
                Live Archive
              </p>
              <p className="mt-2 text-sm text-paper">
                Captive-bred specimens, coming soon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
