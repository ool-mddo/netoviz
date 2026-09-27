import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.test.js'],
    exclude: ['**/node_modules/**', '**/.nuxt/**', '**/.output/**', '**/static/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html']
    }
  }
})
