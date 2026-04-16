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
        links: [],
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
        description: 'Test',
        menuLinks: [],
        legalLinks: [],
        socialLinks: [],
        categories: { data: [] },
      },
    },
  },
}

const mockPageResponse = {
  data: [
    {
      attributes: {
        contentSections: [
          {
            __component: 'sections.heading',
            id: 1,
            heading: 'About Us',
            description: 'Learn about our mission',
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
    if (url.includes('/pages')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPageResponse),
      } as Response)
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ data: [] }),
    } as Response)
  })
})

describe('Dynamic Page Route', () => {
  it('renders page sections when page is found', async () => {
    const PageRoute = (await import('@/app/[lang]/[...slug]/page')).default

    const result = await PageRoute({
      params: { lang: 'en', slug: ['about'] },
    })

    expect(result).toBeTruthy()
  })

  it('throws notFound when page is not found', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: [] }),
      } as Response)
    )

    const PageRoute = (await import('@/app/[lang]/[...slug]/page')).default

    await expect(PageRoute({
      params: { lang: 'en', slug: ['nonexistent'] },
    })).rejects.toThrow('NOT_FOUND')
  })
})
