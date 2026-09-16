export function FactProgress({
  current,
  total,
  cycleKey,
  playing,
}: {
  current: number;
  total: number;
  cycleKey: string | number;
  playing: boolean;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="font-mono text-[11px] uppercase tracking-widest text-fog">
        {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
      <div
        className="h-[3px] flex-1 bg-charcoal"
        role="progressbar"
        aria-label="Time until next fact"
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {playing && (
          <span
            key={cycleKey}
            className="block h-full w-full origin-left scale-x-0 bg-acid motion-safe:animate-[fact-progress_8s_linear_forwards]"
          />
        )}
      </div>
    </div>
  );
}
