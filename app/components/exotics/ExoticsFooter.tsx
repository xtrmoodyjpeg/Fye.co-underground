import {Link} from 'react-router';

const FOOTER_LINKS = [
  {label: 'Fact Files', href: '#facts'},
  {label: 'Live Archive', href: '#archive'},
  {label: 'About', href: '#about'},
];

export function ExoticsFooter() {
  return (
    <footer className="border-t border-bone/15 bg-void px-5 pb-8 pt-16 text-bone sm:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 gap-10 border-b border-bone/15 pb-12 sm:grid-cols-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-acid">
              Navigate
            </p>
            <nav className="mt-4 flex flex-col gap-2 font-mono text-sm uppercase tracking-widest">
              {FOOTER_LINKS.map((link) => (
                <a key={link.href} href={link.href} className="hover:text-acid">
                  {link.label}
                </a>
              ))}
              <Link to="/" className="hover:text-acid">
                FYE.CO <span aria-hidden="true">↗</span>
              </Link>
            </nav>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-acid">
              Field Contact
            </p>
            <div className="mt-4 flex flex-col gap-2 font-mono text-sm uppercase tracking-widest text-bone/80">
              <span>@fye.exotics</span>
              <a href="mailto:hello@fye.co" className="hover:text-acid">
                hello@fye.co
              </a>
            </div>
          </div>

          <div className="font-exotic-serif text-base italic text-bone/70 sm:text-right">
            Stay weird. Stay cold.
          </div>
        </div>

        <p
          aria-hidden="true"
          className="mt-10 select-none text-center font-exotic-headline text-[16vw] uppercase leading-none text-bone/10 sm:text-[8vw]"
        >
          FYE.EXOTICS
        </p>

        <div className="mt-10 flex flex-col gap-2 font-mono text-[10px] uppercase tracking-widest text-fog sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 FYE.CO / FYE.EXOTICS</span>
          <span className="max-w-md normal-case tracking-normal sm:text-right">
            Educational archive and future availability platform. Species
            information should not replace professional veterinary guidance.
          </span>
        </div>
      </div>
    </footer>
  );
}
