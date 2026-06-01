import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import SectionErrorBoundary from '@/app/[lang]/components/SectionErrorBoundary'

function ThrowingComponent(): never {
  throw new Error('test section crash')
}

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('SectionErrorBoundary', () => {
  it('renders children normally when no error', () => {
    render(
      <SectionErrorBoundary>
        <div>section content</div>
      </SectionErrorBoundary>
    )

    expect(screen.getByText('section content')).toBeInTheDocument()
  })

  it('shows fallback message when child throws', () => {
    render(
      <SectionErrorBoundary>
        <ThrowingComponent />
      </SectionErrorBoundary>
    )

    expect(screen.getByText('This section failed to load.')).toBeInTheDocument()
  })

  it('hides children after child throws', () => {
    render(
      <SectionErrorBoundary>
        <ThrowingComponent />
      </SectionErrorBoundary>
    )

    expect(screen.queryByText('section content')).not.toBeInTheDocument()
  })
})
