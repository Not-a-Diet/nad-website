import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

jest.mock('@/app/[lang]/components/FloatingFood', () => ({
  __esModule: true,
  default: () => null,
  COMPACT_FLOAT_POSITIONS: [],
}))

// react-markdown is ESM-only; mock it so Jest (CJS) can import RichText
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => <div>{children}</div>,
}))
jest.mock('remark-gfm', () => ({ __esModule: true, default: () => {} }))
jest.mock('rehype-sanitize', () => ({ __esModule: true, default: () => {} }))

describe('BracketHighlight', () => {
  it('wraps [bracketed] text in span with highlight class', async () => {
    const BracketHighlight = (await import('@/app/[lang]/components/BracketHighlight')).default

    render(<BracketHighlight text="Start [Highlight] End" highlightClass="text-primary" />)

    const span = screen.getByText('Highlight')
    expect(span.tagName).toBe('SPAN')
    expect(span).toHaveClass('text-primary')
  })

  it('renders plain text without any span', async () => {
    const BracketHighlight = (await import('@/app/[lang]/components/BracketHighlight')).default

    const { container } = render(
      <BracketHighlight text="No brackets here" highlightClass="text-primary" />
    )

    expect(container.querySelectorAll('span')).toHaveLength(0)
    expect(container).toHaveTextContent('No brackets here')
  })

  it('returns null when text is undefined', async () => {
    const BracketHighlight = (await import('@/app/[lang]/components/BracketHighlight')).default

    const { container } = render(
      <BracketHighlight text={undefined} highlightClass="text-primary" />
    )

    expect(container.firstChild).toBeNull()
  })

  it('handles multiple bracketed segments', async () => {
    const BracketHighlight = (await import('@/app/[lang]/components/BracketHighlight')).default

    render(<BracketHighlight text="[First] and [Second]" highlightClass="text-secondary" />)

    expect(screen.getByText('First')).toHaveClass('text-secondary')
    expect(screen.getByText('Second')).toHaveClass('text-secondary')
  })
})

describe('RichText', () => {
  it('renders body string via Markdown component', async () => {
    const RichText = (await import('@/app/[lang]/components/RichText')).default

    render(<RichText data={{ body: 'Hello World content here.' }} />)

    expect(screen.getByText('Hello World content here.')).toBeInTheDocument()
  })

  it('wraps content in a section element', async () => {
    const RichText = (await import('@/app/[lang]/components/RichText')).default

    const { container } = render(<RichText data={{ body: 'Test body' }} />)

    expect(container.querySelector('section')).toBeInTheDocument()
  })
})

describe('Pricing', () => {
  const mockData = {
    id: '1',
    title: 'Choose Your Plan',
    plans: [
      {
        id: 'plan-1',
        name: 'Starter',
        description: 'Great for beginners',
        price: 29,
        pricePeriod: '/month',
        isRecommended: false,
        product_features: [{ id: 'f1', name: 'Feature A' }],
      },
      {
        id: 'plan-2',
        name: 'Pro',
        description: 'For serious users',
        price: 79,
        pricePeriod: '/month',
        isRecommended: true,
        product_features: [
          { id: 'f2', name: 'Feature B' },
          { id: 'f3', name: 'Feature C' },
        ],
      },
    ],
  }

  it('renders section title', async () => {
    const Pricing = (await import('@/app/[lang]/components/Pricing')).default

    render(<Pricing data={mockData} />)

    expect(screen.getByText('Choose Your Plan')).toBeInTheDocument()
  })

  it('renders all plan names', async () => {
    const Pricing = (await import('@/app/[lang]/components/Pricing')).default

    render(<Pricing data={mockData} />)

    expect(screen.getByText('Starter')).toBeInTheDocument()
    expect(screen.getByText('Pro')).toBeInTheDocument()
  })

  it('renders plan prices', async () => {
    const Pricing = (await import('@/app/[lang]/components/Pricing')).default

    render(<Pricing data={mockData} />)

    expect(screen.getByText('29')).toBeInTheDocument()
    expect(screen.getByText('79')).toBeInTheDocument()
  })

  it('renders feature names', async () => {
    const Pricing = (await import('@/app/[lang]/components/Pricing')).default

    render(<Pricing data={mockData} />)

    expect(screen.getByText('Feature A')).toBeInTheDocument()
    expect(screen.getByText('Feature B')).toBeInTheDocument()
    expect(screen.getByText('Feature C')).toBeInTheDocument()
  })

  it('applies recommended bg class to recommended plan card', async () => {
    const Pricing = (await import('@/app/[lang]/components/Pricing')).default

    const { container } = render(<Pricing data={mockData} />)

    const cards = container.querySelectorAll('.bg-violet-600')
    expect(cards).toHaveLength(1)
  })
})

describe('PricingTeaser', () => {
  const base = {
    id: '1',
    eyebrow: 'Pricing',
    headline: 'Get [started] today',
    lede: 'Simple transparent pricing.',
    ctaText: 'Book now',
    ctaUrl: '/book',
    firstVisitLabel: 'First visit',
    firstVisitPrice: '€50',
    followUpLabel: 'Follow-up',
    followUpPrice: '€40',
    decoration: null,
    mascot: null,
  }

  it('card variant (default) renders eyebrow and lede', async () => {
    const PricingTeaser = (await import('@/app/[lang]/components/PricingTeaser')).default

    render(<PricingTeaser data={{ ...base, variant: 'card' }} />)

    expect(screen.getByText('Pricing')).toBeInTheDocument()
    expect(screen.getByText('Simple transparent pricing.')).toBeInTheDocument()
  })

  it('card variant renders CTA link', async () => {
    const PricingTeaser = (await import('@/app/[lang]/components/PricingTeaser')).default

    render(<PricingTeaser data={{ ...base, variant: 'card' }} />)

    expect(screen.getByText(/Book now/)).toBeInTheDocument()
  })

  it('band variant renders price labels', async () => {
    const PricingTeaser = (await import('@/app/[lang]/components/PricingTeaser')).default

    render(<PricingTeaser data={{ ...base, variant: 'band' }} />)

    expect(screen.getByText('First visit')).toBeInTheDocument()
    expect(screen.getByText('Follow-up')).toBeInTheDocument()
  })

  it('inline variant renders both price pills', async () => {
    const PricingTeaser = (await import('@/app/[lang]/components/PricingTeaser')).default

    render(<PricingTeaser data={{ ...base, variant: 'inline' }} />)

    expect(screen.getByText('First visit')).toBeInTheDocument()
    expect(screen.getByText('Follow-up')).toBeInTheDocument()
  })

  it('inline variant renders secondary link when provided', async () => {
    const PricingTeaser = (await import('@/app/[lang]/components/PricingTeaser')).default

    render(
      <PricingTeaser
        data={{
          ...base,
          variant: 'inline',
          secondaryLinkText: 'Learn more',
          secondaryLinkUrl: '/about',
        }}
      />
    )

    expect(screen.getByText('Learn more')).toBeInTheDocument()
  })

  it('defaults to card variant when variant is omitted', async () => {
    const PricingTeaser = (await import('@/app/[lang]/components/PricingTeaser')).default

    render(<PricingTeaser data={{ ...base }} />)

    expect(screen.getByText('Pricing')).toBeInTheDocument()
  })

  it('shows studio and online labels in card variant', async () => {
    const PricingTeaser = (await import('@/app/[lang]/components/PricingTeaser')).default

    render(
      <PricingTeaser
        data={{
          ...base,
          variant: 'card',
          showStudio: true,
          studioLabel: 'In Studio',
          showOnline: true,
          onlineLabel: 'Online',
        }}
      />
    )

    expect(screen.getByText('In Studio')).toBeInTheDocument()
    expect(screen.getByText('Online')).toBeInTheDocument()
  })
})

describe('Hero', () => {
  const mockData = {
    id: '1',
    title: 'Welcome to [NAD]',
    description: 'Your {health} journey starts here',
    picture: [],
    buttons: [
      { id: '1', url: '/en/about', text: 'Get Started', type: 'primary', newTab: false },
      { id: '2', url: '/en/contact', text: 'Contact Us', type: 'secondary', newTab: false },
    ],
  }

  it('renders highlighted title word', async () => {
    const Hero = (await import('@/app/[lang]/components/Hero')).default

    render(<Hero data={mockData} />)

    expect(screen.getByText('NAD')).toBeInTheDocument()
  })

  it('renders all CTA buttons as links', async () => {
    const Hero = (await import('@/app/[lang]/components/Hero')).default

    render(<Hero data={mockData} />)

    expect(screen.getByText('Get Started').closest('a')).toHaveAttribute('href', '/en/about')
    expect(screen.getByText('Contact Us').closest('a')).toHaveAttribute('href', '/en/contact')
  })

  it('opens new-tab buttons with target _blank', async () => {
    const Hero = (await import('@/app/[lang]/components/Hero')).default

    const data = {
      ...mockData,
      buttons: [{ id: '3', url: '/external', text: 'External', type: 'primary', newTab: true }],
    }

    render(<Hero data={data} />)

    expect(screen.getByText('External').closest('a')).toHaveAttribute('target', '_blank')
  })
})
