import { useAuthStore } from '~/stores/auth/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  // ── Tenter de recharger le user si on a un token mais pas le user en mémoire ──
  // (ex : rechargement de la page, cookie de session encore actif)
  if (authStore.token.value && !authStore.user.value) {
    await authStore.fetchUser()
  }

  const isAdminRoute = to.path.startsWith('/admin')
  const isAgentRoute = to.path.startsWith('/agent')
  const isAuthRoute  = to.path.startsWith('/auth')
  const isPublic     = to.path === '/' || isAuthRoute

  const isAuthenticated = authStore.isAuthenticated.value
  const role            = authStore.user.value?.role

  // ── 1. Utilisateur non connecté qui tente d'accéder à une zone protégée ──
  if ((isAdminRoute || isAgentRoute) && !isAuthenticated) {
    return navigateTo('/auth/login')
  }

  // ── 2. Utilisateur connecté qui tente d'accéder au mauvais espace ─────────
  if (isAuthenticated && isAdminRoute && role !== 'admin') {
    // Un agent qui tape /admin → renvoyé vers son dashboard
    return navigateTo('/agent')
  }

  if (isAuthenticated && isAgentRoute && role !== 'agent') {
    // Un admin qui tape /agent → renvoyé vers son dashboard
    return navigateTo('/admin')
  }

  // ── 3. Utilisateur déjà connecté qui retourne sur les pages auth ──────────
  if (isAuthRoute && isAuthenticated) {
    if (role === 'admin') return navigateTo('/admin')
    if (role === 'agent') return navigateTo('/agent')
  }
})
