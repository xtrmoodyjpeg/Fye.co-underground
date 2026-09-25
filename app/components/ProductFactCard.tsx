export function ProductFactCard({descriptionHtml}: {descriptionHtml: string}) {
  return (
    <div className="relative mt-10 -rotate-1">
      <div className="torn-paper-edge torn-paper-edge-top" aria-hidden="true" />
      <div className="torn-paper px-6 py-8 shadow-[0_18px_30px_rgba(0,0,0,0.45)] sm:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-steel">
          Product Facts &amp; Materials
        </p>
        <div
          className="mt-4 max-w-none text-sm leading-relaxed text-ink/90 [&_p]:mb-3 [&_p:last-child]:mb-0"
          dangerouslySetInnerHTML={{__html: descriptionHtml}}
        />
      </div>
      <div className="torn-paper-edge torn-paper-edge-bottom" aria-hidden="true" />
    </div>
  );
}
