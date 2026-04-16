import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import PostList from '@/app/[lang]/views/blog-list'

const mockArticlesResponse = {
  data: [
    {
      id: 1,
      attributes: {
        title: 'Test Article',
        description: 'Test description',
        slug: 'test-article',
        publishedAt: '2024-01-01T00:00:00.000Z',
        cover: { data: { attributes: { url: '/cover.jpg' } } },
        category: {
          data: {
            attributes: { name: 'Health', slug: 'health' },
          },
        },
        authorsBio: {
          data: {
            attributes: {
              name: 'Test Author',
              avatar: { data: { attributes: { url: '/avatar.jpg' } } },
            },
          },
        },
      },
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
    global.fetch = jest.fn((url: string) => {
      if (url.includes('/articles')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockArticlesResponse),
        } as Response)
      }
      if (url.includes('/blog-headers')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: [{ attributes: { heading: 'Our Blog', text: 'Latest articles' } }],
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
    expect(result.data[0].attributes.title).toBe('Test Article')
    expect(result.meta.pagination.total).toBe(1)
  })

  it('blog list view renders articles', () => {
    render(<PostList data={mockArticlesResponse.data} />)

    expect(screen.getByText('Test Article')).toBeInTheDocument()
    expect(screen.getByText('Test Author')).toBeInTheDocument()
  })
})
