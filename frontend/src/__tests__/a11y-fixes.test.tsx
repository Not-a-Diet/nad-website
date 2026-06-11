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
