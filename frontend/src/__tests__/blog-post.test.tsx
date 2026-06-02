import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Post from '@/app/[lang]/views/post'
import type { Article } from '@/app/[lang]/types/strapi'

// componentResolver uses dynamic imports that can't resolve in test env
jest.mock('@/app/[lang]/utils/component-resolver', () => ({
  __esModule: true,
  default: (section: { __component: string }, index: number) => (
    <div key={index} data-testid={`section-${section.__component}`} />
  ),
}))

const baseArticle: Article = {
  id: 1,
  documentId: 'article-1',
  title: 'How to Stay Healthy',
  description: 'A guide to maintaining a balanced lifestyle.',
  slug: 'how-to-stay-healthy',
  createdAt: '2024-03-01T10:00:00.000Z',
  updatedAt: '2024-03-01T10:00:00.000Z',
  publishedAt: '2024-03-01T10:00:00.000Z',
  blocks: [],
}

describe('Post view', () => {
  it('renders article title', () => {
    render(<Post data={baseArticle} />)

    expect(screen.getByText('How to Stay Healthy')).toBeInTheDocument()
  })

  it('renders article description', () => {
    render(<Post data={baseArticle} />)

    expect(screen.getByText('A guide to maintaining a balanced lifestyle.')).toBeInTheDocument()
  })

  it('renders author name when provided', () => {
    const article: Article = {
      ...baseArticle,
      authorsBio: { name: 'Jane Doe', avatar: { url: 'http://example.com/avatar.jpg' } },
    }

    render(<Post data={article} />)

    expect(screen.getByText(/Jane Doe/)).toBeInTheDocument()
  })

  it('renders formatted published date', () => {
    render(<Post data={baseArticle} />)

    // formatDate('2024-03-01T10:00:00.000Z') → 'March 1, 2024'
    expect(screen.getByText(/March 1, 2024/)).toBeInTheDocument()
  })

  it('renders cover image when URL is absolute', () => {
    const article: Article = {
      ...baseArticle,
      cover: { url: 'http://example.com/cover.jpg', alternativeText: 'Cover' },
    }

    render(<Post data={article} />)

    // alt now uses cover.alternativeText (falls back to title, then a default)
    const img = screen.getByAltText('Cover')
    expect(img).toHaveAttribute('src', 'http://example.com/cover.jpg')
  })

  it('does not render cover image when cover is absent', () => {
    render(<Post data={baseArticle} />)

    expect(screen.queryByAltText('article cover image')).not.toBeInTheDocument()
  })

  it('renders one resolver placeholder per block', () => {
    const article: Article = {
      ...baseArticle,
      blocks: [
        { __component: 'sections.rich-text', id: 1, body: 'Hello' },
        { __component: 'sections.heading', id: 2, heading: 'Title' },
      ],
    }

    render(<Post data={article} />)

    expect(screen.getByTestId('section-sections.rich-text')).toBeInTheDocument()
    expect(screen.getByTestId('section-sections.heading')).toBeInTheDocument()
  })

  it('renders author avatar image when provided', () => {
    const article: Article = {
      ...baseArticle,
      authorsBio: { name: 'Jane Doe', avatar: { url: 'http://example.com/avatar.jpg' } },
    }

    render(<Post data={article} />)

    const img = screen.getByAltText('Jane Doe')
    expect(img).toHaveAttribute('src', 'http://example.com/avatar.jpg')
  })
})
