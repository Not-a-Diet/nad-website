"use client";
import Logo from "./Logo";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState, useTransition } from "react";
import { languages } from "i18n-config";

interface NavLink {
  id: number;
  url: string;
  newTab: boolean;
  text: string;
}

interface MobileNavLink extends NavLink {
  closeMenu: () => void;
}

function NavLink({ url, text, newTab }: NavLink) {
  const path = usePathname();

  return (
    <li className="flex">
      <Link
        href={url}
        target={newTab ? "_blank" : "_self"}
        className={`flex items-center mx-4 -mb-1 border-b-2 border-transparent hover:text-secondary-500 font-bold ${path === url && "text-night border-night"
          }}`}
      >
        {text}
      </Link>
    </li>
  );
}
// === OPTION 1: Using Next.js App Router (Recommended) ===
function LanguageSelector({ id }: { id: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const locales = languages;

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;

    // Persist preference
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

    // Build new path
    const segments = pathname.split('/').filter(Boolean);
    const currentLocale = segments[0];

    // Replace locale or add if missing
    if (locales.some(l => l.code === currentLocale)) {
      segments[0] = newLocale;
    } else {
      segments.unshift(newLocale);
    }

    const newPath = '/' + segments.join('/');

    // Use startTransition for smooth updates
    startTransition(() => {
      router.push(newPath);
      router.refresh(); // Refresh to load new translations
    });
  };

  const currentLocale = pathname.split('/')[1] || 'en';

  return (
    <li className="flex">
      <select
        name="Language"
        value={currentLocale}
        id={id}
        className="rounded-2xl bg-gray-300 p-2 lg:focus:outline-none disabled:opacity-50"
        onChange={handleLocaleChange}
        disabled={isPending}
      >
        {locales.map(l => (
          <option key={l.code} value={l.code}>
            {l.flag} {l.label}
          </option>
        ))}
      </select>
      {isPending && <span className="ml-2">⏳</span>}
    </li>
  );
}


function MobileNavLink({ url, text, closeMenu }: MobileNavLink) {
  const path = usePathname();
  const handleClick = () => {
    closeMenu();
  };
  return (
    <div className="flex">
      <Link
        href={url}
        onClick={handleClick}
        className={`-mx-3 block rounded-lg px-3 py-2 text-base font-bold leading-7 text-black hover:bg-secondary ${path === url && "text-anti-flash_white border-night"
          }}`}
      >
        {text}
      </Link>
    </div>
  );
}

export default function Navbar({
  links,
  logoUrl,
  logoText,
}: {
  links: Array<NavLink>;
  logoUrl: string | null;
  logoText: string | null;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const closeMenu = () => {
    setMobileMenuOpen(false);
  };
  const scrolledTransition = 'transition delay-150 duration-300 rounded-full scale-75 drop-shadow-xl bg-anti-flash_white'
  const notscrolledTransition = 'transition delay-150 duration-300 scale-100 bg-anti-flash_white'
  return (
    <div className={`p-4 ${mobileMenuOpen! ? 'fixed' : ''} fixed top-0 left-0 right-0 z-50 ${scrolled ? scrolledTransition : notscrolledTransition}`}>
      <div className="container flex justify-between h-16 mx-auto px-0 sm:px-6">
        <Logo src={logoUrl}>
          <h2 className="text-m font-sans font-bold">{logoText}</h2>
        </Logo>

        <div className="items-center text-m flex-shrink-0 hidden lg:flex">
          <ul className="items-stretch hidden space-x-3 lg:flex">
            {links.map((item: NavLink) => (
              <NavLink key={item.id} {...item} />
            ))}
            <LanguageSelector key="language-selector" id="language-selector" />
          </ul>
        </div>


        <Dialog
          as="div"
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={closeMenu}
        >
          <div className="fixed inset-0 z-100 w-2/3" />{" "}
          {/* Overlay */}
          <Dialog.Panel className="fixed inset-y-0 rtl:left-0 ltr:right-0 z-50 w-full overflow-y-auto transition delay-150 duration-300 bg-gray-200 shadow-lg px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-inset sm:ring-white/10">
            <div className="flex items-center justify-between">

              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Not A Diet</span>
                {logoUrl && <img className="h-16 w-16" src={logoUrl} alt="" />}
              </a>

              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-black"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>

            </div>

            <div className="mt-6 flow-root">

              <div className="-my-6 divide-y divide-anti-flash_white/10">

                <div className="space-y-2 py-6">
                  {links.map((item) => (
                    <MobileNavLink
                      key={item.id}
                      closeMenu={closeMenu}
                      {...item}
                    />
                  ))}
                </div>
                <LanguageSelector key="mobile-lang-selector" id="mobile-lang-selector" />
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
        <button
          className="p-4 lg:hidden"
          onClick={() => mobileMenuOpen ? setMobileMenuOpen(false) : setMobileMenuOpen((true))}
        >
          <Bars3Icon className="h-7 w-7 text-night" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
