import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Contact from '@/app/[lang]/components/Contact'

const baseData = {
  title: 'Get in Touch',
  description: 'We would love to hear from you.',
  contactLinks: [
    { text: 'Instagram', url: 'https://instagram.com/nad', social: 'INSTAGRAM', newTab: true },
    { text: 'Email', url: 'mailto:hello@nad.it', social: 'EMAIL', newTab: false },
  ],
  hours: {
    id: 1,
    title: 'Opening Hours',
    description: 'Monday–Friday, 9am–6pm',
    locations: [{ address: '123 Fitness St, Rome' }],
  },
}

const bookingCalendar = {
  bookingTitle: 'Book your session',
  persons: [
    {
      name: 'Alice',
      locations: [
        { name: 'Studio', embedUrl: 'https://calendar.example.com/alice-studio' },
        { name: 'Online', embedUrl: 'https://calendar.example.com/alice-online' },
      ],
    },
    {
      name: 'Bob',
      locations: [{ name: 'Studio', embedUrl: 'https://calendar.example.com/bob-studio' }],
    },
  ],
  personLabel: 'Coach',
  locationLabel: 'Location',
  selectPersonPlaceholder: 'Pick a coach',
  selectLocationPlaceholder: 'Pick a location',
  viewCalendarButtonText: 'View Calendar',
  backButtonText: 'Back',
}

describe('Contact', () => {
  it('renders title and description', () => {
    render(<Contact data={{ ...baseData }} />)

    expect(screen.getByText('Get in Touch')).toBeInTheDocument()
    expect(screen.getByText('We would love to hear from you.')).toBeInTheDocument()
  })

  it('renders contact link texts', () => {
    render(<Contact data={{ ...baseData }} />)

    expect(screen.getByText('Instagram')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('renders hours title and description', () => {
    render(<Contact data={{ ...baseData }} />)

    expect(screen.getByText('Opening Hours')).toBeInTheDocument()
    expect(screen.getByText('Monday–Friday, 9am–6pm')).toBeInTheDocument()
  })

  it('renders location address as link', () => {
    render(<Contact data={{ ...baseData }} />)

    const addressLink = screen.getByText('123 Fitness St, Rome')
    expect(addressLink.tagName).toBe('A')
    expect(addressLink).toHaveAttribute('href', expect.stringContaining('google.com/maps'))
  })

  it('renders without booking calendar when omitted', () => {
    render(<Contact data={{ ...baseData }} />)

    expect(screen.queryByText('Book your session')).not.toBeInTheDocument()
  })
})

describe('BookingSelector inside Contact', () => {
  it('renders booking title', () => {
    render(<Contact data={{ ...baseData, bookingCalendar }} />)

    expect(screen.getByText('Book your session')).toBeInTheDocument()
  })

  it('renders person options in select', () => {
    render(<Contact data={{ ...baseData, bookingCalendar }} />)

    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('location select is disabled before person is chosen', () => {
    render(<Contact data={{ ...baseData, bookingCalendar }} />)

    const locationSelect = screen.getByLabelText('Location')
    expect(locationSelect).toBeDisabled()
  })

  it('location select becomes enabled after person selection', () => {
    render(<Contact data={{ ...baseData, bookingCalendar }} />)

    const personSelect = screen.getByLabelText('Coach')
    fireEvent.change(personSelect, { target: { value: '0' } })

    const locationSelect = screen.getByLabelText('Location')
    expect(locationSelect).not.toBeDisabled()
  })

  it('location options update to match selected person', () => {
    render(<Contact data={{ ...baseData, bookingCalendar }} />)

    const personSelect = screen.getByLabelText('Coach')
    fireEvent.change(personSelect, { target: { value: '0' } })

    expect(screen.getByText('Studio')).toBeInTheDocument()
    expect(screen.getByText('Online')).toBeInTheDocument()
  })

  it('"View Calendar" button disabled until both person and location chosen', () => {
    render(<Contact data={{ ...baseData, bookingCalendar }} />)

    const button = screen.getByText('View Calendar')
    expect(button).toBeDisabled()

    const personSelect = screen.getByLabelText('Coach')
    fireEvent.change(personSelect, { target: { value: '0' } })

    expect(button).toBeDisabled()
  })

  it('"View Calendar" button enabled after both selections', () => {
    render(<Contact data={{ ...baseData, bookingCalendar }} />)

    const personSelect = screen.getByLabelText('Coach')
    fireEvent.change(personSelect, { target: { value: '0' } })

    const locationSelect = screen.getByLabelText('Location')
    fireEvent.change(locationSelect, { target: { value: '0' } })

    const button = screen.getByText('View Calendar')
    expect(button).not.toBeDisabled()
  })

  it('clicking "View Calendar" shows iframe with correct src', () => {
    render(<Contact data={{ ...baseData, bookingCalendar }} />)

    const personSelect = screen.getByLabelText('Coach')
    fireEvent.change(personSelect, { target: { value: '0' } })

    const locationSelect = screen.getByLabelText('Location')
    fireEvent.change(locationSelect, { target: { value: '0' } })

    fireEvent.click(screen.getByText('View Calendar'))

    const iframe = screen.getByTitle(/Alice/)
    expect(iframe).toBeInTheDocument()
    expect(iframe).toHaveAttribute('src', 'https://calendar.example.com/alice-studio')
  })

  it('"Back" button returns to selection view', () => {
    render(<Contact data={{ ...baseData, bookingCalendar }} />)

    const personSelect = screen.getByLabelText('Coach')
    fireEvent.change(personSelect, { target: { value: '0' } })
    fireEvent.change(screen.getByLabelText('Location'), { target: { value: '0' } })
    fireEvent.click(screen.getByText('View Calendar'))

    fireEvent.click(screen.getByText(/Back/))

    expect(screen.getByLabelText('Coach')).toBeInTheDocument()
    expect(screen.queryByTitle(/Alice/)).not.toBeInTheDocument()
  })

  it('location resets when person changes', () => {
    render(<Contact data={{ ...baseData, bookingCalendar }} />)

    const personSelect = screen.getByLabelText('Coach')
    fireEvent.change(personSelect, { target: { value: '0' } })
    const locationSelect = screen.getByLabelText('Location')
    fireEvent.change(locationSelect, { target: { value: '0' } })

    fireEvent.change(personSelect, { target: { value: '1' } })

    expect(screen.getByText('View Calendar')).toBeDisabled()
  })
})
