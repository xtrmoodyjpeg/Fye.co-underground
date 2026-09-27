import type {Route} from './+types/lookbook';

export const meta: Route.MetaFunction = () => {
  return [{title: 'FYE.CO | Lookbook'}];
};

const PORTRAITS = Array.from({length: 6}, (_, i) => ({
  id: `portrait-${i + 1}`,
  label: 'Model portrait',
}));

export default function LookbookRoute() {
  return (
    <div className="-mx-4 -mb-4 bg-black text-paper">
      <section className="mx-auto max-w-[1800px] px-6 py-20 sm:px-10">
        <p className="font-mono text-xs uppercase tracking-widest text-signal">
          Drop 02
        </p>
        <h1 className="font-heading text-[16vw] leading-[1.05] sm:text-[clamp(3rem,9vw,6.5rem)]">
          Lookbook
        </h1>
        <p className="mt-4 max-w-sm font-mono text-xs uppercase tracking-widest text-paper/60">
          Same city, different minds.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {PORTRAITS.map((portrait) => (
            <div
              key={portrait.id}
              className="flex aspect-[3/4] items-center justify-center rounded-2xl bg-steel/60 text-center font-mono text-[10px] uppercase tracking-widest text-paper/70"
            >
              {portrait.label}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
