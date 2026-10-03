import { getPageBySlug } from '@/app/[lang]/utils/get-page-by-slug';
import { fetchAPI } from '@/app/[lang]/utils/fetch-api';
import { getDietitians } from '@/app/[lang]/utils/get-dietitians';

jest.mock('@/app/[lang]/utils/fetch-api', () => ({ fetchAPI: jest.fn() }));
jest.mock('@/app/[lang]/utils/get-dietitians', () => ({ getDietitians: jest.fn() }));
const mockFetch = jest.mocked(fetchAPI);
const mockPeople = jest.mocked(getDietitians);
afterEach(() => jest.clearAllMocks());

it('feeds the same localized collection into both home sections, without changing other content', async () => {
  const profiles = [{ documentId: 'new', slug: 'new-person', name: 'New person', role: 'Dietitian' }];
  const hero = { id: 1, __component: 'sections.hero', title: 'Hello' };
  mockFetch.mockResolvedValue({ data: [{ contentSections: [hero, { id: 2, __component: 'sections.team', layout: 'classic' }, { id: 3, __component: 'sections.contact', bookingCalendar: {} }] }] });
  mockPeople.mockResolvedValue(profiles);
  const result = await getPageBySlug('home', 'pt');
  expect(mockPeople).toHaveBeenCalledWith('pt');
  const sections = result.data[0].contentSections;
  expect(sections[0]).toEqual(hero);
  expect(sections[1].dietitians).toBe(profiles);
  expect(sections[2].dietitians).toBe(profiles);
});

it('preserves page content on CMS failure and skips profile calls for teaser-only pages', async () => {
  const log = jest.spyOn(console, 'error').mockImplementation(() => {});
  const legacy = { data: [{ contentSections: [{ id: 1, __component: 'sections.team', layout: 'classic', member: [{ name: 'Existing' }] }] }] };
  mockFetch.mockResolvedValue(legacy); mockPeople.mockRejectedValue(new Error('CMS unavailable'));
  expect(await getPageBySlug('home', 'it')).toEqual(legacy);
  expect(legacy.data[0].contentSections[0]).not.toHaveProperty('dietitians');
  mockPeople.mockClear(); mockFetch.mockResolvedValue({ data: [{ contentSections: [{ id: 1, __component: "sections.team" }, { id: 2, __component: "sections.contact" }] }] });
  await getPageBySlug('pricing', 'it'); expect(mockPeople).not.toHaveBeenCalled();
  log.mockRestore();
});
