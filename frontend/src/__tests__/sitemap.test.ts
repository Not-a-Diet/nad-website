import sitemap from '@/app/sitemap';
import { fetchAPI } from '@/app/[lang]/utils/fetch-api';
import { SITE_URL } from '@/app/[lang]/utils/constants';

jest.mock('@/app/[lang]/utils/fetch-api', () => ({ fetchAPI: jest.fn() }));

it('includes the team directory and localized dietitian URLs in every language', async () => {
  jest.mocked(fetchAPI).mockImplementation(async (path, params) => ({
    data: path === '/dietitians' ? [
      { slug: `profile-${params?.locale}`, updatedAt: '2026-10-03T12:00:00.000Z' },
      { slug: null },
    ] : [],
  }));
  const entries = await sitemap();
  for (const locale of ['en', 'it', 'pt']) {
    expect(entries).toContainEqual(expect.objectContaining({
      url: `${SITE_URL}/${locale}/team`,
      alternates: { languages: {
        en: `${SITE_URL}/en/team`, it: `${SITE_URL}/it/team`,
        pt: `${SITE_URL}/pt/team`, 'x-default': `${SITE_URL}/en/team`,
      } },
    }));
    expect(entries).toContainEqual(expect.objectContaining({
      url: `${SITE_URL}/${locale}/team/profile-${locale}`,
      lastModified: new Date('2026-10-03T12:00:00.000Z'),
    }));
    expect(fetchAPI).toHaveBeenCalledWith('/dietitians', expect.objectContaining({
      locale, filters: { listed: true },
    }), expect.any(Object));
  }
  expect(entries.filter(entry => entry.url.includes('/team/'))).toHaveLength(3);
});
