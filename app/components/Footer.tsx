import {Suspense} from 'react';
import {Await, Link, NavLink} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

const FOOTER_COLUMNS = [
  {
    heading: 'Collections',
    links: [
      {label: 'Sketch Series', to: '/collections/all'},
      {label: 'Heavyweight', to: '/collections/all'},
      {label: 'After Dark', to: '/collections/all'},
      {label: 'Essentials', to: '/collections/all'},
    ],
  },
  {
    heading: 'Shop',
    links: [
      {label: 'All products', to: '/shop'},
      {label: 'Outerwear', to: '/shop'},
      {label: 'Tops', to: '/shop'},
      {label: 'Bottoms', to: '/shop'},
    ],
  },
  {
    heading: 'Story',
    links: [
      {label: 'Our Vision', to: '/story'},
      {label: 'The People', to: '/story'},
      {label: 'Journal', to: '/blogs/news'},
      {label: 'Lookbook', to: '/lookbook'},
    ],
  },
];

const FOLLOW_LINKS = ['Instagram', 'TikTok', 'YouTube', 'Newsletter'];

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <footer className="bg-black px-6 pt-16 text-paper sm:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_repeat(4,1fr)]">
          <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-2xl bg-steel/60 p-6 text-center font-display text-2xl leading-none sm:aspect-auto sm:h-full">
            Good ideas
            <br />
            late nights
          </div>
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.heading}>
              <h3 className="border-b-2 border-signal pb-2 font-mono text-xs uppercase tracking-widest">
                {column.heading}
              </h3>
              <ul className="mt-4 space-y-2 font-mono text-xs uppercase tracking-widest text-paper/60">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="hover:text-paper">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="border-b-2 border-signal pb-2 font-mono text-xs uppercase tracking-widest">
              Follow
            </h3>
            <ul className="mt-4 space-y-2 font-mono text-xs uppercase tracking-widest text-paper/60">
              {FOLLOW_LINKS.map((link) => (
                <li key={link}>{link}</li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-16 select-none border-t border-paper/10 py-6 text-center font-display text-[18vw] leading-none sm:text-[9vw]">
          FYE.CO
        </p>

        <Suspense>
          <Await resolve={footerPromise}>
            {(footer) =>
              footer?.menu &&
              header.shop.primaryDomain?.url && (
                <FooterMenu
                  menu={footer.menu}
                  primaryDomainUrl={header.shop.primaryDomain.url}
                  publicStoreDomain={publicStoreDomain}
                />
              )
            }
          </Await>
        </Suspense>

        <div className="border-t border-paper/10 py-4 text-center">
          <Link
            to="/admin/products"
            className="font-mono text-[10px] uppercase tracking-widest text-paper/30 hover:text-paper/60"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-6 border-t border-paper/10 py-6 font-mono text-xs uppercase tracking-widest text-paper/60"
      role="navigation"
    >
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a
            className="hover:text-paper"
            href={url}
            key={item.id}
            rel="noopener noreferrer"
            target="_blank"
          >
            {item.title}
          </a>
        ) : (
          <NavLink
            className="hover:text-paper"
            end
            key={item.id}
            prefetch="intent"
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};
