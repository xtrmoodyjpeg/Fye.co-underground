import {Suspense} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';

interface HeaderProps {
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
}

const NAV_LINKS = [
  {label: 'Home', to: '/'},
  {label: 'Shop', to: '/shop'},
  {label: 'Story', to: '/story'},
  {label: 'Exotics', to: '/exotics'},
  {label: 'Contact', to: '/contact'},
];

export function Header({cart}: HeaderProps) {
  return (
    <div className="sticky top-0 z-40 bg-black text-paper">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-2 font-mono text-[10px] uppercase tracking-widest text-paper/60 sm:px-10">
        <span>Drops / Exotics / Contact</span>
        <span className="hidden sm:inline">
          Made for the ones who see different
        </span>
        <span aria-hidden="true">◎ ♪ ▶</span>
      </div>
      <header className="mx-auto flex max-w-[1400px] items-center justify-between border-t border-paper/10 px-6 py-4 sm:px-10">
        <NavLink
          prefetch="intent"
          to="/"
          end
          className="flex items-center gap-2 font-display text-xl tracking-wide text-paper"
        >
          <img
            src="/fc-logo-lockup.webp"
            alt=""
            className="h-7 w-auto object-contain"
          />
          FYE.CO
        </NavLink>
        <nav
          className="hidden items-center gap-8 font-mono text-xs uppercase tracking-widest sm:flex"
          aria-label="Primary"
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end={link.to === '/'}
              className="hover:text-signal"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <HeaderCtas cart={cart} />
      </header>
    </div>
  );
}

export function HeaderMenu() {
  const {close} = useAside();

  return (
    <nav className="flex flex-col gap-4 font-mono text-sm uppercase tracking-widest text-ink">
      {NAV_LINKS.map((link) => (
        <NavLink
          key={link.label}
          to={link.to}
          end={link.to === '/'}
          onClick={close}
          prefetch="intent"
          style={activeLinkStyle}
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}

function HeaderCtas({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <div className="flex items-center gap-4 text-paper">
      <SearchToggle />
      <CartToggle cart={cart} />
      <HeaderMenuMobileToggle />
    </div>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      type="button"
      className="reset text-lg sm:hidden"
      onClick={() => open('mobile')}
      aria-label="Open menu"
    >
      ☰
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button
      type="button"
      className="reset text-lg"
      onClick={() => open('search')}
      aria-label="Search"
    >
      ⌕
    </button>
  );
}

function CartBadge({count}: {count: number}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      className="font-mono text-xs uppercase tracking-widest hover:text-signal"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
    >
      Cart {String(count).padStart(2, '0')}
    </a>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}
