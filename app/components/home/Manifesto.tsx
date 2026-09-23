import {Link} from 'react-router';

export function Manifesto() {
  return (
    <section className="border-t border-paper/10 bg-black px-6 py-24 text-paper sm:px-10">
      <div className="mx-auto max-w-[1800px]">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-signal">
            The Manifesto
          </p>
          <h2 className="-rotate-1 mt-3 font-display text-4xl leading-[1.05] sm:text-5xl">
            Not built to blend in.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-paper/80 sm:text-lg">
            FYE.CO started because everything else looked the same. Every
            piece begins as a sketch before it&rsquo;s ever a product -- built
            for people who&rsquo;d rather stand out in their own city than fit
            in anywhere else.
          </p>
          <Link
            to="/story"
            prefetch="intent"
            className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-signal hover:text-paper"
          >
            Read the full story <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
