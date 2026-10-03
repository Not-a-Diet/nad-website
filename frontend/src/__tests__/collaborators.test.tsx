import { fireEvent, render, screen } from '@testing-library/react'
import Collaborators from '@/app/[lang]/components/Collaborators'

describe('Collaborators', () => {
  it('replaces a named placeholder when its Strapi logo is uploaded', () => {
    const { rerender } = render(
      <Collaborators data={{ title: 'Collaborano con noi', logos: [{ id: 1, title: 'Logo partner 1' }] }} lang="it" />
    )
    expect(screen.getByText('Logo partner 1')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()

    rerender(<Collaborators data={{ title: 'Collaborano con noi', logos: [{
      id: 1, title: 'Partner approved name', logo: { url: '/uploads/partner.svg' },
    }] }} lang="it" />)

    expect(screen.queryByText('Logo partner 1')).not.toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Partner approved name' })).toHaveAttribute('src', 'http://localhost:1337/uploads/partner.svg')
  })

  it('exposes each partner once to assistive technology and lets visitors pause the strip', () => {
    const { container } = render(<Collaborators data={{ title: 'Our collaborators', logos: [
      { id: 1, title: 'Partner A', logo: { url: '/uploads/a.svg' } },
      { id: 2, title: 'Partner B', logo: { url: '/uploads/b.svg' } },
    ] }} />)

    expect(screen.getAllByRole('list')).toHaveLength(1)
    expect(screen.getAllByRole('img')).toHaveLength(2)
    fireEvent.click(screen.getByRole('button', { name: 'Pause scrolling' }))
    expect(container.querySelector('[data-paused="true"]')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Resume scrolling' }))
    expect(container.querySelector('[data-paused="false"]')).toBeInTheDocument()
  })

  it('hides an empty section and ignores unnamed entries', () => {
    const { container } = render(<Collaborators data={{ title: 'Our collaborators', logos: [{ id: 1 }] }} />)
    expect(container).toBeEmptyDOMElement()
  })
})
