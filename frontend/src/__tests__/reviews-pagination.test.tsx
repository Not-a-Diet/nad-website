import { fireEvent, render, screen } from '@testing-library/react'
import Reviews from '@/app/[lang]/components/Reviews'

const reviews = Array.from({ length: 19 }, (_, index) => ({
  id: index,
  authorName: `Reviewer ${index + 1}`,
  rating: 5,
  comment: 'A helpful consultation.',
  platform: 'google' as const,
}))

describe('Reviews pagination with many reviews', () => {
  beforeEach(() => {
    jest.spyOn(Element.prototype, 'clientWidth', 'get').mockReturnValue(320)
    jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(280)
  })

  afterEach(() => jest.restoreAllMocks())

  it('updates the compact counter with arrows and swipe events', () => {
    const { container } = render(<Reviews data={{ id: 1, reviews }} />)
    const track = container.querySelector('[data-rv-card]')!.parentElement!
    const scrollTo = jest.fn()
    track.scrollTo = scrollTo

    expect(screen.getByLabelText('Review page 1 of 19')).toHaveTextContent('1 / 19')
    expect(screen.getByRole('button', { name: 'Previous reviews' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Next reviews' }))
    expect(screen.getByLabelText('Review page 2 of 19')).toHaveTextContent('2 / 19')
    expect(scrollTo).toHaveBeenCalledWith({ left: 320, behavior: 'smooth' })

    fireEvent.scroll(track, { target: { scrollLeft: 18 * 320 } })
    expect(screen.getByLabelText('Review page 19 of 19')).toHaveTextContent('19 / 19')
    expect(screen.getByRole('button', { name: 'Next reviews' })).toBeDisabled()
  })

  it('retains direct page selection and looping navigation', () => {
    const { container } = render(<Reviews data={{ id: 1, reviews, loop: true }} />)
    const track = container.querySelector('[data-rv-card]')!.parentElement!
    track.scrollTo = jest.fn()

    fireEvent.click(screen.getByRole('button', { name: 'Previous reviews' }))
    expect(screen.getByLabelText('Review page 19 of 19')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Next reviews' }))
    expect(screen.getByLabelText('Review page 1 of 19')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Go to page 4' }))
    expect(screen.getByLabelText('Review page 4 of 19')).toBeInTheDocument()
  })
})
