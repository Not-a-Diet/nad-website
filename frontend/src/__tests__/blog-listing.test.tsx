import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import PostList from '@/app/[lang]/views/blog-list'

const mockArticlesResponse = {
  data: [
    {
      id: 1,
      documentId: 'test-doc-1',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      title: 'Test Article',
      description: 'Test description',
      slug: 'test-article',
      publishedAt: '2024-01-01T00:00:00.000Z',
      cover: { url: '/cover.jpg' },
      category: {
        id: 1,
        name: 'Health',
        slug: 'health',
      },
      authorsBio: {
        name: 'Test Author',
        avatar: { url: '/avatar.jpg' },
      },
      blocks: [],
    },
  ],
  meta: {
    pagination: {
      start: 0,
      limit: 6,
      total: 1,
    },
  },
}

describe('Blog Listing Page', () => {
  beforeEach(() => {
    jest.resetModules()
    global.fetch = jest.fn((url: string | URL | Request, init?: RequestInit) => {
      const urlStr = typeof url === 'string' ? url : url.toString()
      if (urlStr.includes('/articles')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockArticlesResponse),
        } as Response)
      }
      if (urlStr.includes('/blog-headers')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: [{ heading: 'Our Blog', text: 'Latest articles' }],
          }),
        } as Response)
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: [] }),
      } as Response)
    })
  })

  it('fetches articles and returns data', async () => {
    const { fetchAPI } = await import('@/app/[lang]/utils/fetch-api')

    const token = 'test-token'
    const options = { headers: { Authorization: `Bearer ${token}` } }
    const result = await fetchAPI('/articles', {
      sort: { createdAt: 'desc' },
      populate: { cover: { fields: ['url'] } },
      pagination: { start: 0, limit: 6 },
    }, options)

    expect(result.data).toHaveLength(1)
    expect(result.data[0].title).toBe('Test Article')
    expect(result.meta.pagination.total).toBe(1)
  })

  it('blog list view renders articles', () => {
    render(<PostList data={mockArticlesResponse.data} />)

    expect(screen.getByText('Test Article')).toBeInTheDocument()
    expect(screen.getByText('Test Author')).toBeInTheDocument()
  })
})
