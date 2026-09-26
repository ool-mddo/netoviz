// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginPrettier from 'eslint-plugin-prettier'

export default withNuxt(
  {
    plugins: {
      prettier: eslintPluginPrettier
    },
    rules: {
      'prettier/prettier': 'error',
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'vue/v-bind-style': ['error', 'longform'],
      'vue/v-on-style': ['error', 'longform'],
      'vue/v-slot-style': ['error', 'longform'],
      'max-len': ['error', { code: 120 }],
      // Match the previous @nuxtjs/eslint-config (Nuxt2) leniency:
      // unused *arguments* were never flagged (only unused locals), and
      // the `a && a()` short-circuit idiom is used throughout this codebase.
      'no-unused-vars': ['error', { args: 'none', caughtErrors: 'none' }],
      '@typescript-eslint/no-unused-vars': ['error', { args: 'none', caughtErrors: 'none' }],
      'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
      '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }]
    }
  },
  eslintConfigPrettier
)
