import { render, screen } from '@testing-library/react';
import TeamDetails, { type TeamProfile } from '@/app/[lang]/components/TeamDetails';

// Match the RichText tests: Jest runs CommonJS, while these packages are ESM.
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => <div>{children}</div>,
}));
jest.mock('rehype-sanitize', () => ({ __esModule: true, default: () => {} }));

jest.mock('next/image', () => ({ __esModule: true, default: (props: any) => {
  const imageProps = { ...props }; delete imageProps.unoptimized;
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...imageProps} />;
} }));

const member: TeamProfile = { name: 'Vanessa Pirro', slug: 'vanessa-pirro' };
const originalUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
beforeEach(() => { process.env.NEXT_PUBLIC_STRAPI_API_URL = 'http://localhost:1337'; });
afterEach(() => {
  if (originalUrl === undefined) delete process.env.NEXT_PUBLIC_STRAPI_API_URL;
  else process.env.NEXT_PUBLIC_STRAPI_API_URL = originalUrl;
});

it('resolves local Strapi image formats against the CMS rather than the frontend', () => {
  render(<TeamDetails lang="it" member={{ ...member, profilePhoto: {
    url: '/uploads/original.jpg', formats: { medium: { url: '/uploads/medium.jpg' } },
  } }} />);
  expect(screen.getByAltText(member.name)).toHaveAttribute('src', 'http://localhost:1337/uploads/medium.jpg');
});

it('preserves absolute CDN photo URLs', () => {
  const url = 'https://media.notadiet.life/profile.jpg';
  render(<TeamDetails lang="it" member={{ ...member, profilePhoto: { url } }} />);
  expect(screen.getByAltText(member.name)).toHaveAttribute('src', url);
});

it('renders the profile without a photo', () => {
  render(<TeamDetails lang="it" member={{ ...member, profilePhoto: null }} />);
  expect(screen.getByRole('heading', { name: member.name, level: 1 })).toBeInTheDocument();
  expect(screen.queryByRole('img')).not.toBeInTheDocument();
});
