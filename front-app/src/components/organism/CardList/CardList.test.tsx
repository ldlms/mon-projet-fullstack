import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CardList from './CardList'

describe('CardList', () => {
  const mockCards = [
    { id: '1', name: 'Card 1', imageUri: 'url1.jpg', scryFallId: 's1', quantity: 1, cost: '{1}' },
    { id: '2', name: 'Card 2', imageUri: 'url2.jpg', scryFallId: 's2', quantity: 1, cost: '{2}' },
  ]

  it('affiche toutes les cartes', () => {
    const onAddCard = vi.fn()
    render(<CardList cards={mockCards} onAddCard={onAddCard} />)
    
    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(2)
  })

  it('affiche un message quand il n\'y a pas de cartes', () => {
    const onAddCard = vi.fn()
    const { container } = render(<CardList cards={[]} onAddCard={onAddCard} />)
    
    const grid = container.querySelector('.grid')
    expect(grid?.children).toHaveLength(0)
  })

  it('appelle onPreviewCard au clic sur une carte', async () => {
    const user = userEvent.setup()
    const onAddCard = vi.fn()
    const onPreviewCard = vi.fn()
    
    render(
      <CardList 
        cards={mockCards} 
        onAddCard={onAddCard}
        onPreviewCard={onPreviewCard}
      />
    )
    
    const firstCard = screen.getAllByRole('img')[0].parentElement!
    await user.click(firstCard)
    
    expect(onPreviewCard).toHaveBeenCalledWith(mockCards[0])
  })
})