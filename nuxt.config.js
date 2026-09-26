export default defineNuxtConfig({
  compatibilityDate: '2026-01-01',
  telemetry: false,
  devServer: {
    host: '0.0.0.0',
    port: process.env.PORT || process.env.NETOVIZ_WEB_LISTEN || 3000
  },
  /*
   ** Runtime config: values that must be readable in the browser at runtime
   ** (NETOVIZ_REST_PORT overrides the REST API port; unset it to run all-in-one).
   */
  runtimeConfig: {
    public: {
      netovizRestPort: process.env.NETOVIZ_REST_PORT || ''
    }
  },
  /*
   ** Headers of the page
   */
  app: {
    head: {
      titleTemplate: '%s - ' + process.env.npm_package_name,
      title: process.env.npm_package_name || '',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: process.env.npm_package_description || ''
        }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    }
  },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Nuxt.js modules
   */
  modules: ['@pinia/nuxt', 'vuetify-nuxt-module', '@nuxt/eslint'],
  /*
   ** vuetify-nuxt-module configuration
   ** https://github.com/vuetifyjs/nuxt-module
   */
  vuetify: {
    moduleOptions: {},
    vuetifyOptions: {}
  }
})
