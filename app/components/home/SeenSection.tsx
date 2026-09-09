import {Link} from 'react-router';

const DROP_TEASERS = [{name: 'Signal Hoodie'}, {name: 'Static Tee'}, {name: 'Void Cargos'}];

export function SeenSection() {
  return (
    <section className="relative overflow-hidden bg-black px-6 py-20 text-paper sm:px-10">
      <div
        aria-hidden="true"
        className="absolute -left-16 top-1/2 h-64 w-64 -translate-y-1/2 rounded-[50%_50%_40%_60%/60%_40%_60%_40%] bg-paper/10"
      />
      <div className="relative mx-auto flex max-w-[1400px] flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative">
          <h2 className="-rotate-2 font-display text-[24vw] leading-[1.1] text-signal sm:text-[10vw]">
            Seen
          </h2>
          <p className="mt-4 font-mono text-xs uppercase tracking-widest text-paper/60">
            Same city
            <br />
            different minds
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:max-w-xl">
          {DROP_TEASERS.map((product) => (
            <Link
              key={product.name}
              to="/collections/all"
              prefetch="intent"
              className="block rounded-2xl bg-steel/60 p-4"
            >
              <div className="aspect-[3/4] w-full rounded-xl bg-steel" />
              <h3 className="mt-3 font-mono text-xs uppercase tracking-widest">
                {product.name}
              </h3>
              <span className="mt-1 inline-block font-mono text-[10px] uppercase tracking-widest text-signal">
                Drop 02 →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
