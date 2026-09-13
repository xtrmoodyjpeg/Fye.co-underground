import {Link} from 'react-router';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-black px-6 pb-16 pt-16 text-paper sm:px-10">
      <div
        aria-hidden="true"
        className="absolute -left-24 top-10 h-72 w-72 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-steel/40"
      />
      <div
        aria-hidden="true"
        className="absolute left-1/3 top-24 h-64 w-56 -translate-x-1/2 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-black ring-1 ring-paper/10"
      />

      <div className="relative mx-auto max-w-[1400px]">
        <div className="relative text-center">
          <h1 className="font-display text-[18vw] leading-[0.85] sm:text-[9vw]">
            FYE.CO
          </h1>
          <p className="mt-2 font-display text-[7vw] uppercase leading-none text-paper/90 sm:text-[3.2vw]">
            For your eyes
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3 font-mono text-xs uppercase tracking-widest text-paper transition-opacity hover:opacity-90"
          >
            Shop drop 02
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="relative z-10 mt-12 flex justify-center">
          <div className="w-full max-w-[280px]">
            <div className="aspect-[9/16] overflow-hidden rounded-2xl ring-1 ring-paper/10">
              <video
                className="h-full w-full object-cover"
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
            </div>
            <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-widest text-paper/50">
              Behind the drop
            </p>
          </div>
        </div>

        <p className="relative z-10 mt-10 max-w-sm font-mono text-[11px] uppercase leading-relaxed tracking-widest text-paper/60">
          Clothing for a louder inside. FYE.CO exists for the ones who see
          different.
        </p>
      </div>
    </section>
  );
}
