// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  app: {
    head: {
      title: 'GitHub Profile Dashboard',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Explore GitHub profiles, repositories, stats, and language distribution in a beautiful dashboard.' },
        { name: 'theme-color', content: '#6366f1' },
        { property: 'og:title', content: 'GitHub Profile Dashboard' },
        { property: 'og:description', content: 'Explore GitHub profiles with stats, repos, and language charts.' },
        { property: 'og:type', content: 'website' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  }
})
