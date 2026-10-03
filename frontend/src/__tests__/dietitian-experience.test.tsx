import { render, screen, fireEvent } from '@testing-library/react';
import Team from '@/app/[lang]/components/Team';
import Contact from '@/app/[lang]/components/Contact';
import Post from '@/app/[lang]/views/post';
import type { Dietitian } from '@/app/[lang]/utils/dietitians';
import type { Article } from '@/app/[lang]/types/strapi';

jest.mock('@/app/[lang]/components/Quote', () => ({ __esModule: true, default: () => <div>Philosophy</div> }));
jest.mock('@/app/[lang]/utils/component-resolver', () => ({ __esModule: true, default: () => null }));
jest.mock('next/image', () => ({ __esModule: true, default: (props: any) => {
  const imageProps = { ...props }; delete imageProps.fill;
  // Test double for Next's image optimization.
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...imageProps} />;
} }));

const person: Dietitian = {
  documentId: 'dietitian-1', slug: 'vanessa-pirro', name: 'Vanessa Pirro', role: 'Dietista',
  shortBio: 'Un percorso su misura.', profilePhoto: { url: 'https://example.com/vanessa.jpg' },
  specializations: [{ title: 'Nutrizione sportiva' }], bookingEnabled: true,
  bookingLocations: [{ name: 'Online', embedUrl: 'https://example.com/calendar' }],
};
const teamData = { title: 'Il nostro team', description: 'Ti accompagniamo.', dietitians: [person] };
const contactData = {
  title: 'Contatti', description: 'Prenota una visita', contactLinks: [], hours: { id: 1, title: 'Orari' },
  dietitians: [person, { ...person, documentId: 'other', name: 'Other', slug: 'other', profilePhoto: null }],
  bookingCalendar: { personLabel: 'Dietista', locationLabel: 'Sede', viewCalendarButtonText: 'Prenota' },
};

it('introduces the team without portraits and links to its localized directory', () => {
  render(<Team data={teamData} lang="it" />);
  expect(screen.getByRole('link', { name: /Scopri il team/ })).toHaveAttribute('href', '/it/team');
  expect(screen.queryByRole('img')).not.toBeInTheDocument();
  expect(screen.queryByText(person.shortBio!)).not.toBeInTheDocument();
});

it('keeps the classic layout selectable, populated from the same dietitians', () => {
  render(<Team data={{ ...teamData, layout: 'classic' }} lang="it" />);
  expect(screen.getByText(person.shortBio!)).toBeInTheDocument();
  expect(screen.getByText('Nutrizione sportiva')).toBeInTheDocument();
});

it('keeps the preview photo-free when shared data is unavailable', () => {
  render(<Team data={{ title: 'Team', description: '', dietitians: [] }} lang="en" />);
  expect(screen.queryByText('Existing profile')).not.toBeInTheDocument();
  expect(screen.queryByRole('img')).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Meet the team/ })).toHaveAttribute('href', '/en/team');
});

it('shows photo, quick info and localized profile link, retaining them in the calendar view', () => {
  render(<Contact data={contactData} lang="it" />);
  fireEvent.change(screen.getByLabelText('Dietista'), { target: { value: '0' } });
  expect(screen.getByAltText(person.name)).toHaveAttribute('src', person.profilePhoto!.url);
  expect(screen.getByText(person.shortBio!)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Scopri di più/ })).toHaveAttribute('href', '/it/team/vanessa-pirro');
  fireEvent.change(screen.getByLabelText('Sede'), { target: { value: '0' } });
  fireEvent.click(screen.getByRole('button', { name: 'Prenota' }));
  expect(screen.getByTitle(/Booking calendar for Vanessa/)).toHaveAttribute('src', 'https://example.com/calendar');
  expect(screen.getByRole('link', { name: /Scopri di più/ })).toHaveAttribute('href', '/it/team/vanessa-pirro');
});

it('switching dietitian updates the card and clears the previous calendar selection', () => {
  render(<Contact data={contactData} lang="pt" />);
  fireEvent.change(screen.getByLabelText('Dietista'), { target: { value: '0' } });
  fireEvent.change(screen.getByLabelText('Sede'), { target: { value: '0' } });
  fireEvent.change(screen.getByLabelText('Dietista'), { target: { value: '1' } });
  expect(screen.getByRole('link', { name: /Saiba mais/ })).toHaveAttribute('href', '/pt/team/other');
  expect(screen.queryByAltText(person.name)).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Prenota' })).toBeDisabled();
});

it('excludes disabled bookings and does not revive old booking entries for an empty shared collection', () => {
  render(<Contact data={{ ...contactData, dietitians: [{ ...person, bookingEnabled: false }] }} />);
  expect(screen.queryByLabelText('Dietista')).not.toBeInTheDocument();
});

it('uses the same profile photo and linked name for article authors', () => {
  const article: Article = { id: 1, title: 'Nutrition', description: 'Article', slug: 'nutrition', createdAt: '', updatedAt: '', publishedAt: '2026-01-01', dietitian: person };
  render(<Post data={article} lang="it" />);
  expect(screen.getByRole('link', { name: person.name })).toHaveAttribute('href', '/it/team/vanessa-pirro');
  expect(screen.getByAltText(person.name)).toHaveAttribute('src', person.profilePhoto!.url);
});

it('does not expose retired inline bookings when canonical profiles are unavailable', () => {
  const data = {
    ...contactData,
    dietitians: undefined,
    bookingCalendar: { ...contactData.bookingCalendar, persons: [{ name: 'Retired person', locations: person.bookingLocations }] },
  };
  render(<Contact data={data} />);
  expect(screen.queryByLabelText('Dietista')).not.toBeInTheDocument();
  expect(screen.getByText('Contatti')).toBeInTheDocument();
});

it('does not use retired inline team cards in classic mode', () => {
  const data = { ...teamData, dietitians: [], layout: 'classic' as const, member: [{ name: 'Retired person' }] };
  render(<Team data={data} />);
  expect(screen.queryByText('Retired person')).not.toBeInTheDocument();
});

it('omits an unmigrated byline rather than using retired Author data', () => {
  const article = { id: 1, title: 'Nutrition', description: '', slug: 'nutrition', createdAt: '', updatedAt: '', publishedAt: '2026-01-01', authorsBio: { name: 'Retired author' } };
  render(<Post data={article} />);
  expect(screen.getByRole('heading', { name: 'Nutrition' })).toBeInTheDocument();
  expect(screen.queryByText('Retired author')).not.toBeInTheDocument();
});
