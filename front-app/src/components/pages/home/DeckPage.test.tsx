import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import DeckPage from './DeckPage'
import '@testing-library/jest-dom';

// Mock du localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock as any

// Mock de fetch
global.fetch = vi.fn()

// Helper pour render avec Router
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <MemoryRouter initialEntries={['/decks']}>
      {component}
    </MemoryRouter>
  )
}

describe('DeckPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'token') return 'fake-token'
      if (key === 'user') return JSON.stringify({ id: '123', name: 'Test User' })
      return null
    })
  })

  it('affiche un loader pendant le chargement', () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [],
    })

    renderWithRouter(<DeckPage />)
    expect(screen.getByText(/Chargement des decks/i)).toBeInTheDocument()
  })

  it('affiche les decks après le chargement', async () => {
    const mockDecks = [
      {
        id: '1',
        name: 'Mon Deck',
        format: 'Commander',
        colors: ['R', 'G'],
        cards: [],
        imageUri: 'https://example.com/image.jpg',
      },
    ]

    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockDecks,
    })

    renderWithRouter(<DeckPage />)

    await waitFor(() => {
      expect(screen.getByText('Mon Deck')).toBeInTheDocument()
    })
  })

  it('redirige vers login si pas de token', () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    const originalLocation = window.location
    delete (window as any).location
    window.location = { ...originalLocation, href: '' } as any

    renderWithRouter(<DeckPage />)

    expect(window.location.href).toBe('/login')
    
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    })
  })
})