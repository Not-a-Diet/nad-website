import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { i18n } from '../i18n-config';

import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

function getLocale(request: NextRequest): string | undefined {
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
    if (cookieLocale && i18n.locales.includes(cookieLocale as any)) {
        return cookieLocale;
    }

    // Negotiator expects plain object so we need to transform headers
    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

    // Use negotiator and intl-localematcher to get best locale
    const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
    // @ts-expect-error locales are readonly
    const locales: string[] = i18n.locales;
    try {
        return matchLocale(languages, locales, i18n.defaultLocale);
      } catch {
        // Invalid accept-language header
        return i18n.defaultLocale;
      }
}

export default function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Check if there is any supported locale in the pathname
    const pathnameIsMissingLocale = i18n.locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
        const locale = getLocale(request);

        // pathname already starts with "/", so prefix the locale directly.
        // e.g. "/products" -> "/en/products", and "/" -> "/en" (no trailing
        // slash, avoiding a second redirect hop and the old "/en//" bug).
        const newPath = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
        return NextResponse.redirect(new URL(newPath, request.url));
    }
}

export const config = {
    // Skip `/_next/` and any path with a file extension (e.g. /sitemap.xml,
    // /robots.txt, /llms.txt, /manifest.webmanifest, favicon.ico) so metadata
    // routes aren't locale-redirected into a 404.
    matcher: ['/((?!_next|.*\\.[^/]+$).*)'],
};
