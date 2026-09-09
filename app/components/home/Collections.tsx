import {Link} from 'react-router';

const COLLECTIONS = [
  {name: 'Sketch Series', tagline: 'Hand-drawn attitude', stripes: false},
  {name: 'Heavyweight', tagline: 'Built for real ones', stripes: false},
  {name: 'After Dark', tagline: 'Nights shape us', stripes: true},
];

export function Collections() {
  return (
    <section className="bg-black px-6 py-20 text-paper sm:px-10">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="-rotate-1 font-display text-5xl sm:text-6xl">
          Collections
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {COLLECTIONS.map((collection) => (
            <div
              key={collection.name}
              className="relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl bg-steel/70 p-6"
            >
              {collection.stripes && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 flex -rotate-12 justify-around opacity-80"
                >
                  {Array.from({length: 5}, (_, i) => (
                    <span key={i} className="h-[140%] w-3 bg-signal" />
                  ))}
                </div>
              )}
              <div className="relative z-10">
                <h3 className="font-display text-3xl">{collection.name}</h3>
                <p className="mt-1 font-mono text-xs uppercase tracking-widest text-paper/70">
                  {collection.tagline}
                </p>
                <Link
                  to="/collections/all"
                  prefetch="intent"
                  className="mt-4 inline-flex items-center gap-1 rounded-full bg-signal px-4 py-2 font-mono text-[10px] uppercase tracking-widest"
                >
                  Shop →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
