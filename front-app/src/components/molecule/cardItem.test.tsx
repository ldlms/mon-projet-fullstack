import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CardItem from './CardItem'

describe('CardItem', () => {
  const mockProps = {
    id: '1',
    imageUri: 'https://example.com/card.jpg',
    onClick: vi.fn(),
    onAddCard: vi.fn(),
  }

  it('affiche l\'image de la carte', () => {
    render(<CardItem {...mockProps} />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', mockProps.imageUri)
  })

  it('appelle onClick au clic gauche', async () => {
    const user = userEvent.setup()
    render(<CardItem {...mockProps} />)
    
    const card = screen.getByRole('img').parentElement!
    await user.click(card)
    
    expect(mockProps.onClick).toHaveBeenCalledTimes(1)
  })

  it('appelle onAddCard au clic droit', async () => {
    const user = userEvent.setup()
    render(<CardItem {...mockProps} />)
    
    const card = screen.getByRole('img').parentElement!
    await user.pointer({ keys: '[MouseRight]', target: card })
    
    expect(mockProps.onAddCard).toHaveBeenCalledTimes(1)
  })
})