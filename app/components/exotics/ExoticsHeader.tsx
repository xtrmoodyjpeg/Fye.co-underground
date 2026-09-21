import {useState} from 'react';
import {Link} from 'react-router';

const NAV_LINKS = [
  {label: 'Fact Files', href: '#facts'},
  {label: 'Live Archive', href: '#archive'},
  {label: 'Species', href: '#species'},
  {label: 'About', href: '#about'},
];

export function ExoticsHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-bone/15 bg-void text-bone">
      <div className="mx-auto flex max-w-[1900px] items-center justify-between px-5 py-4 sm:px-8">
        <Link
          to="/exotics"
          className="font-exotic-headline text-xl tracking-wide sm:text-2xl"
        >
          FYE.EXOTICS
        </Link>

        <nav
          className="hidden items-center gap-6 font-mono text-xs uppercase tracking-widest lg:flex lg:gap-8"
          aria-label="Primary"
        >
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-acid">
              {link.label}
            </a>
          ))}
          <Link to="/" className="hover:text-acid">
            FYE.CO <span aria-hidden="true">↗</span>
          </Link>
        </nav>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center border border-bone/30 font-mono text-xs uppercase tracking-widest lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="exotics-mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="exotics-mobile-menu"
          className="flex flex-col border-t border-bone/15 bg-void font-mono text-sm uppercase tracking-widest lg:hidden"
          aria-label="Primary"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="min-h-[44px] border-b border-bone/10 px-5 py-3 hover:bg-charcoal hover:text-acid"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/"
            className="min-h-[44px] px-5 py-3 hover:bg-charcoal hover:text-acid"
            onClick={() => setMenuOpen(false)}
          >
            FYE.CO <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      )}
    </header>
  );
}
