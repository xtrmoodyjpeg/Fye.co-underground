import type {Route} from './+types/story';

export const meta: Route.MetaFunction = () => {
  return [{title: 'FYE.CO | Story'}];
};

export default function StoryRoute() {
  return (
    <div className="-mx-4 -mb-4 bg-black text-paper">
      <section className="mx-auto max-w-[1400px] px-6 py-20 sm:px-10">
        <p className="font-mono text-xs uppercase tracking-widest text-signal">
          Our story
        </p>
        <h1 className="-rotate-1 font-display text-[16vw] leading-[1.05] sm:text-[9vw]">
          Made for the ones
          <br />
          who see different
        </h1>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start">
          <p className="max-w-lg text-sm leading-relaxed text-paper/80">
            {
              'Clothing for a louder inside. FYE.CO exists for the ones who see different — same city, different minds. What began as drawings in a sketchbook became a uniform for the ones who refuse to disappear.'
            }
          </p>
          <p className="max-w-lg font-mono text-xs uppercase leading-relaxed tracking-widest text-paper/60">
            Every drop starts the same way: a sketch, a question, and a
            refusal to blend in. We build for people who would rather stand
            out in their own city than fit in anywhere else.
          </p>
        </div>
      </section>
    </div>
  );
}
