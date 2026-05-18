import type { Metadata } from "next";
import { cache } from "react";
import "./globals.css";
import { getStrapiMedia, getStrapiURL } from "./utils/api-helpers";
import { fetchAPI } from "./utils/fetch-api";
import { i18n } from "../../../i18n-config";
import Banner from "./components/Banner";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { FALLBACK_SEO } from "@/app/[lang]/utils/constants";
import { Inter } from "next/font/google"
import ErrorComponent from "./components/Error";
import GA4CookieConsentBanner from "./components/cookie-consent-banner";

const GA_MEASUREMENT_ID = "G-223FTH8TYJ";

const getGlobal = cache(async (lang: string): Promise<any> => {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  if (!token) throw new Error("The Strapi API Token environment variable is not set.");

  const path = `/global`;
  const options = { headers: { Authorization: `Bearer ${token}` } };

  const urlParamsObject = {
    populate: {
      metadata: { populate: "*" },
      favicon: true,
      notificationBanner: { populate: { link: true } },
      navbar: { populate: { links: true, navbarLogo: { populate: { logoImg: true } } } },
      footer: { populate: { footerLogo: { populate: { logoImg: true } }, menuLinks: true, legalLinks: true, socialLinks: true, categories: true } },
    },
    locale: lang,
  };
  return await fetchAPI(path, urlParamsObject, options);
});

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const meta = await getGlobal(lang);

  if (!meta.data) return FALLBACK_SEO;

  const metadata = meta.data.metadata;
  const faviconUrl = meta.data.favicon?.url;

  return {
    title: metadata?.metaTitle ?? FALLBACK_SEO.title,
    description: metadata?.metaDescription ?? FALLBACK_SEO.description,
    ...(faviconUrl ? {
      icons: {
        icon: [new URL(faviconUrl, getStrapiURL())],
      },
    } : {}),
  };
}

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // optional: CSS variable
});


export default async function RootLayout({
  children,
  params,
}: {
  readonly children: React.ReactNode;
  readonly params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const global = await getGlobal(lang);
  if (!global.data) return (<> <ErrorComponent /> </>);

  const { notificationBanner, navbar, footer } = global.data;

  const navbarLogoUrl = getStrapiMedia(
    navbar?.navbarLogo?.logoImg?.url ?? ''
  );

  const footerLogoUrl = getStrapiMedia(
    footer?.footerLogo?.logoImg?.url ?? ''
  );


  return (
    <html lang={lang} className={`${inter.variable} ${inter.className}`}>
      <body suppressHydrationWarning>
        <Navbar
          links={navbar.links}
          logoUrl={navbarLogoUrl}
          logoText={navbar.navbarLogo.logoText}
        />

        <main className="bg-anti-flash_white text-black min-h-screen">
          {children}
        </main>

        <Banner data={notificationBanner} />
        <Footer
          logoUrl={footerLogoUrl}
          logoText={footer.footerLogo.logoText}
          description={footer.description}
          menuLinks={footer.menuLinks}
          categoryLinks={footer.categories}
          legalLinks={footer.legalLinks}
          socialLinks={footer.socialLinks}
        />
        <GA4CookieConsentBanner measurementId={GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}
