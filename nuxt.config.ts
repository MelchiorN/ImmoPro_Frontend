// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
  ],

  // Auto-import des composants
  components: {
    global: true,
    dirs: [
      '~/components',
      '~/components/**'
    ]
  },

  // Redirige automatiquement "/" vers la page de connexion
  routeRules: {
    '/': { redirect: '/auth/login' },
  },

  // Configuration d'API
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api'
    }
  },

  // CSS global : fonts + utilitaires personnalisés
  css: ['~/assets/css/main.css'],
})
