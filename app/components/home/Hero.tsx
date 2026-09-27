import {Link} from 'react-router';

export function Hero() {
  return (
    <section className="bg-black px-6 py-20 text-paper sm:px-10">
      <div className="mx-auto max-w-[1800px]">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-paper/10 sm:aspect-[16/9] lg:aspect-[21/9]">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            poster="/videos/hero-loop-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src="/videos/hero-loop.webm" type="video/webm" />
            <source src="/videos/hero-loop.mp4" type="video/mp4" />
          </video>

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/60"
          />

          <span className="absolute left-4 top-4 hidden font-mono text-[10px] uppercase tracking-widest text-paper/60 sm:block sm:left-6 sm:top-6">
            Behind the drop
          </span>

          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <h1 className="font-heading text-[13vw] leading-[0.85] sm:text-[clamp(3.5rem,7vw,8rem)]">
              FYE.CO
            </h1>
            <p className="mt-1 font-heading text-[5vw] uppercase leading-none text-paper/90 sm:mt-2 sm:text-[clamp(1.25rem,2.4vw,2.75rem)]">
              For your eyes
            </p>
            <Link
              to="/shop"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3 font-mono text-xs uppercase tracking-widest text-paper transition-opacity hover:opacity-90 sm:mt-8"
            >
              Shop drop 02
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <p className="relative z-10 mt-8 max-w-sm font-mono text-[11px] uppercase leading-relaxed tracking-widest text-paper/60">
          Clothing for a louder inside. FYE.CO exists for the ones who see
          different.
        </p>
      </div>
    </section>
  );
}
