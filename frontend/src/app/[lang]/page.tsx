import LangRedirect from './components/LangRedirect';
import componentResolver from './utils/component-resolver';
import {getPageBySlug} from "@/app/[lang]/utils/get-page-by-slug";
import { i18n } from 'i18n-config';
import type { Section } from './types/strapi';


export default async function RootRoute({params}: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    try {
      const page = await getPageBySlug('home', lang)
      if (page.error && page.error.status == 401) throw new Error(
          'Missing or invalid credentials. Have you created an access token using the Strapi admin panel?'
      )

      if (page.data.length == 0 && lang !== i18n.defaultLocale) return <LangRedirect />
      if (page.data.length === 0) return null
      const contentSections = page.data[0].contentSections
      return contentSections.map((section: Section, index: number) =>
        componentResolver(section, index, lang)
      )
    } catch (error) {
      if (error instanceof Error && error.message.includes('401')) {
        throw error
      }
      throw error
    }
}
