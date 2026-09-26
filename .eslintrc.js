module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  // TODO(Phase2): replace with @nuxt/eslint's auto-generated globals (flat config).
  globals: {
    defineNuxtConfig: 'readonly',
    defineNitroPlugin: 'readonly',
    useHead: 'readonly',
    useRoute: 'readonly'
  },
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  extends: ['@nuxtjs', 'prettier', 'plugin:prettier/recommended'],
  plugins: [],
  ignorePatterns: [],
  // add your custom rules here
  rules: {
    'nuxt/no-cjs-in-config': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/v-bind-style': ['error', 'longform'],
    'vue/v-on-style': ['error', 'longform'],
    'vue/v-slot-style': ['error', 'longform'],
    'max-len': ['error', { code: 120 }]
  }
}
