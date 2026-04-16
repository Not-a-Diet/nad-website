import '@testing-library/jest-dom'

const mockGlobalResponse = {
  data: {
    attributes: {
      metadata: {
        metaTitle: 'Test Site',
        metaDescription: 'Test description',
      },
      favicon: { data: { attributes: { url: '/favicon.png' } } },
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
          logoImg: { data: { attributes: { url: '/logo.png' } } },
          logoText: 'Not A Diet',
        },
      },
      footer: {
        footerLogo: {
          logoImg: { data: { attributes: { url: '/logo.png' } } },
          logoText: 'Not A Diet',
        },
        description: 'Test footer',
        menuLinks: [{ id: 1, url: '/en', newTab: false, text: 'Home' }],
        legalLinks: [{ id: 2, url: '/en/privacy', newTab: false, text: 'Privacy' }],
        socialLinks: [],
        categories: { data: [] },
      },
    },
  },
}

const mockHomePageResponse = {
  data: [
    {
      attributes: {
        contentSections: [
          {
            __component: 'sections.hero',
            id: 1,
            title: 'Welcome [Home]',
            description: 'Test description',
            picture: {
              data: [
                {
                  attributes: {
                    url: '/hero1.png',
                    name: 'hero1',
                    alternativeText: 'Hero image',
                  },
                },
              ],
            },
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
    },
  ],
}

beforeEach(() => {
  jest.resetModules()
  global.fetch = jest.fn((url: string) => {
    if (url.includes('/global')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockGlobalResponse),
      } as Response)
    }
    if (url.includes('/pages') && url.includes('home')) {
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

    const result = await RootRoute({ params: { lang: 'en' } })

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
    const result = await RootRoute({ params: { lang: 'it' } })

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
    const result = await RootRoute({ params: { lang: 'en' } })

    expect(result).toBeNull()
  })
})
