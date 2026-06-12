import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

jest.mock('next/navigation', () => ({
  usePathname: () => '/it',
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
  useParams: () => ({ lang: 'it' }),
}))

describe('Reviews accessibility', () => {
  const data = {
    id: 1,
    showSummary: true,
    summaryAverage: 5,
    summaryCount: 30,
    summaryLabel: 'reviews',
    reviews: [
      { id: 1, authorName: 'Anna B', rating: 5, comment: 'Great', platform: 'google' as const },
    ],
  }

  it('exposes star ratings as role=img with an accessible name', async () => {
    const Reviews = (await import('@/app/[lang]/components/Reviews')).default
    render(<Reviews data={data} lang="it" />)
    expect(
      screen.getAllByRole('img', { name: '5 out of 5 stars' }).length
    ).toBeGreaterThan(0)
  })
})

describe('Footer heading order', () => {
  it('renders the Menu heading as h2 (no skipped levels after page h2/h3s)', async () => {
    const Footer = (await import('@/app/[lang]/components/Footer')).default
    render(
      <Footer
        logoUrl={null}
        logoText="Not a Diet"
        description="desc"
        menuLinks={[]}
        categoryLinks={[]}
        legalLinks={[]}
        socialLinks={[]}
      />
    )
    expect(screen.getByRole('heading', { level: 2, name: 'Menu' })).toBeInTheDocument()
  })
})

describe('Logo link accessible name', () => {
  it('includes the visible brand text in the aria-label (WCAG 2.5.3 label-in-name)', async () => {
    const Logo = (await import('@/app/[lang]/components/Logo')).default
    render(<Logo src={null}><h2>Not a Diet</h2></Logo>)
    expect(screen.getByRole('link').getAttribute('aria-label')).toMatch(/Not a Diet/)
  })
})
