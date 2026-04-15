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

const mockPush = jest.fn()
const mockReplace = jest.fn()
const mockRefresh = jest.fn()

jest.mock('next/navigation', () => ({
  usePathname: () => '/en',
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    refresh: mockRefresh,
  }),
  useParams: () => ({ lang: 'en' }),
  notFound: () => {
    const error = new Error('NOT_FOUND')
    error.digest = 'NEXT_NOT_FOUND'
    throw error
  },
}))

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))
