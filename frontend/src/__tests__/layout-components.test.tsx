import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

const mockNavbarProps = {
  links: [
    { id: 1, url: '/en/about', newTab: false, text: 'About' },
    { id: 2, url: '/en/blog', newTab: false, text: 'Blog' },
  ],
  logoUrl: 'https://example.com/logo.png',
  logoText: 'Not A Diet',
}

const mockFooterProps = {
  logoUrl: 'https://example.com/logo.png',
  logoText: 'Not A Diet',
  description: 'Test footer description',
  menuLinks: [{ id: 1, url: '/en', newTab: false, text: 'Home' }],
  categoryLinks: [],
  legalLinks: [{ id: 2, url: '/en/privacy', newTab: false, text: 'Privacy' }],
  socialLinks: [{ id: 3, url: 'https://instagram.com', newTab: true, text: 'Instagram', social: 'INSTAGRAM' }],
}

describe('Layout Components', () => {
  describe('Navbar', () => {
    it('renders logo text and navigation links', async () => {
      const Navbar = (await import('@/app/[lang]/components/Navbar')).default

      render(<Navbar {...mockNavbarProps} />)

      expect(screen.getByText('Not A Diet')).toBeTruthy()
      expect(screen.getByText('About')).toBeTruthy()
      expect(screen.getByText('Blog')).toBeTruthy()
    })

    it('renders mobile menu button', async () => {
      const Navbar = (await import('@/app/[lang]/components/Navbar')).default

      const { container } = render(<Navbar {...mockNavbarProps} />)

      const buttons = container.querySelectorAll('button')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })

  describe('Footer', () => {
    it('renders footer with copyright and links', async () => {
      const Footer = (await import('@/app/[lang]/components/Footer')).default

      render(<Footer {...mockFooterProps} />)

      expect(screen.getByText(/All rights reserved/)).toBeTruthy()
      expect(screen.getByText('Privacy')).toBeTruthy()
    })

    it('renders social links', async () => {
      const Footer = (await import('@/app/[lang]/components/Footer')).default

      render(<Footer {...mockFooterProps} />)

      expect(screen.getByTitle('Instagram')).toBeTruthy()
    })
  })

  describe('Banner', () => {
    it('returns null when data is null', async () => {
      const Banner = (await import('@/app/[lang]/components/Banner')).default

      const { container } = render(<Banner data={null} />)

      expect(container.firstChild).toBeNull()
    })

    it('returns null when show is false', async () => {
      const Banner = (await import('@/app/[lang]/components/Banner')).default

      const { container } = render(
        <Banner
          data={{
            show: false,
            type: 'info',
            heading: 'Test',
            text: 'Test text',
            link: { id: 1, url: '/test', newTab: false, text: 'Test' },
          }}
        />
      )

      expect(container.firstChild).toBeNull()
    })

    it('renders banner when show is true', async () => {
      const Banner = (await import('@/app/[lang]/components/Banner')).default

      render(
        <Banner
          data={{
            show: true,
            type: 'info',
            heading: 'Announcement',
            text: 'Check this out',
            link: { id: 1, url: '/test', newTab: false, text: 'Learn more' },
          }}
        />
      )

      expect(screen.getByText('Announcement')).toBeTruthy()
    })
  })

  describe('Loader', () => {
    it('renders loading spinner', async () => {
      const Loader = (await import('@/app/[lang]/components/Loader')).default

      const { container } = render(<Loader />)

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Error', () => {
    it('renders error message', async () => {
      const Error = (await import('@/app/[lang]/components/Error')).default

      render(<Error />)

      expect(screen.getByRole('heading')).toBeTruthy()
    })
  })
})
