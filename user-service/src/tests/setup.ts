import { beforeAll, afterAll, afterEach, vi } from 'vitest'


beforeAll(() => {
  console.log('🧪 Démarrage des tests backend')
})


afterAll(() => {
  console.log('✅ Tests terminés')
})


afterEach(() => {
  vi.clearAllMocks()
})