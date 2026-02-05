import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/tests/integration/**/*.test.ts'],
    testTimeout: 30000, // docker + DB = plus lent
    hookTimeout: 30000,
  },
});