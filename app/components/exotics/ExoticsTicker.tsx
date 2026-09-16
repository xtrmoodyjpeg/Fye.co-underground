const TICKER_TEXT =
  'FYE.EXOTICS — COLD BLOODED BY DESIGN — SPECIMEN ARCHIVE — WEIRD BY NATURE —';

export function ExoticsTicker() {
  // Rendered twice back-to-back so the -50% translateX loop is seamless,
  // same technique as the FYE.CO marquee.
  const repetitions = Array.from({length: 8});

  return (
    <div
      className="overflow-hidden border-b border-black/20 bg-acid py-1.5"
      aria-hidden="true"
    >
      <div className="flex w-max animate-exotics-ticker gap-8 whitespace-nowrap font-mono text-[11px] font-bold uppercase tracking-widest text-black">
        {repetitions.map((_, index) => (
          <span key={`${TICKER_TEXT}-${index}`}>{TICKER_TEXT}</span>
        ))}
      </div>
    </div>
  );
}
