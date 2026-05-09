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
      links: [],
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
      description: 'Test',
      menuLinks: [],
      legalLinks: [],
      socialLinks: [],
      categories: [],
    },
  },
}

const mockPageResponse = {
  data: [
    {
      id: 1,
      documentId: 'page-1',
      contentSections: [
        {
          __component: 'sections.heading',
          id: 1,
          heading: 'About Us',
          description: 'Learn about our mission',
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
    if (urlStr.includes('/pages')) {
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
      params: Promise.resolve({ lang: 'en', slug: ['about'] }),
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
      params: Promise.resolve({ lang: 'en', slug: ['nonexistent'] }),
    })).rejects.toThrow('NOT_FOUND')
  })
})