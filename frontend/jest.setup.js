require('@testing-library/jest-dom')

jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage(props) {
    const { src, alt, ...rest } = props
    return <img src={src} alt={alt} {...rest} />
  },
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: function MockLink({ children, ...rest }) {
    return <a {...rest}>{children}</a>
  },
}))

jest.mock('next/navigation', () => ({
  usePathname: () => '/en',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
  useParams: () => ({ lang: 'en' }),
}))

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))
