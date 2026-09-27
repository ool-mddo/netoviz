import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('.', import.meta.url)),
      '@': fileURLToPath(new URL('.', import.meta.url))
    },
    // components import sibling files as e.g. './NotFound' (no extension),
    // relying on Nuxt's bundler to resolve `.vue`; plain Vite/Vitest needs it explicit.
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
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
