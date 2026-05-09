import '@testing-library/jest-dom'

const mockGlobalResponse = {
  data: {
    id: 1,
    documentId: 'global-1',
    metadata: {
      metaTitle: 'Test Site',
      metaDescription: 'Test description',
    },
    favicon: { url: '/favicon.png' },
    notificationBanner: {
      show: false,
      type: 'info',
      heading: '',
      text: '',
      link: { url: '', newTab: false, text: '' },
    },
    navbar: {
      links: [
        { id: 1, url: '/en/about', newTab: false, text: 'About' },
      ],
      navbarLogo: {
        logoImg: { url: '/logo.png' },
        logoText: 'Not A Diet',
      },
    },
    footer: {
      footerLogo: {
        logoImg: { url: '/logo.png' },
        logoText: 'Not A Diet',
      },
      description: 'Test footer',
      menuLinks: [{ id: 1, url: '/en', newTab: false, text: 'Home' }],
      legalLinks: [{ id: 2, url: '/en/privacy', newTab: false, text: 'Privacy' }],
      socialLinks: [],
      categories: [],
    },
  },
}

const mockHomePageResponse = {
  data: [
    {
      id: 1,
      documentId: 'home-1',
      contentSections: [
        {
          __component: 'sections.hero',
          id: 1,
          title: 'Welcome [Home]',
          description: 'Test description',
          picture: [
            {
              url: '/hero1.png',
              name: 'hero1',
              alternativeText: 'Hero image',
            },
          ],
          buttons: [
            { id: 1, url: '/en/about', newTab: false, text: 'Learn More', type: 'primary' },
          ],
        },
        {
          __component: 'sections.features',
          id: 2,
          heading: 'Our Features',
          description: 'What we offer',
          feature: [],
        },
      ],
    },
  ],
}

beforeEach(() => {
  jest.resetModules()
  global.fetch = jest.fn((url: string | URL | Request, init?: RequestInit) => {
    const urlStr = typeof url === 'string' ? url : url.toString()
    if (urlStr.includes('/global')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockGlobalResponse),
      } as Response)
    }
    if (urlStr.includes('/pages') && urlStr.includes('home')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockHomePageResponse),
      } as Response)
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ data: [] }),
    } as Response)
  })
})

describe('Home Page', () => {
  it('renders hero section with title and buttons', async () => {
    const RootRoute = (await import('@/app/[lang]/page')).default

    const result = await RootRoute({ params: Promise.resolve({ lang: 'en' }) })

    expect(result).toBeTruthy()
  })

  it('shows lang redirect when no data for non-en locale', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: [] }),
      } as Response)
    )

    const RootRoute = (await import('@/app/[lang]/page')).default
    const result = await RootRoute({ params: Promise.resolve({ lang: 'it' }) })

    expect(result).toBeTruthy()
  })

  it('returns null when no home page data for en locale', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: [] }),
      } as Response)
    )

    const RootRoute = (await import('@/app/[lang]/page')).default
    const result = await RootRoute({ params: Promise.resolve({ lang: 'en' }) })

    expect(result).toBeNull()
  })
})