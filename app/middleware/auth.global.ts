import { useAuthStore } from '~/stores/auth/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()

  // Si on a un token mais pas encore l'utilisateur (ex: rechargement de la page),
  // on charge les infos de l'utilisateur avant d'autoriser ou bloquer la navigation.
  if (authStore.token.value && !authStore.user.value) {
    await authStore.fetchUser()
  }

  const isAdminRoute = to.path.startsWith('/admin')
  const isAgentRoute = to.path.startsWith('/agent')
  const isAuthRoute  = to.path.startsWith('/auth')

  // Redirection des non-authentifiés vers le login
  if ((isAdminRoute || isAgentRoute) && !authStore.isAuthenticated.value) {
    return navigateTo('/auth/login')
  }

  // Redirection des utilisateurs déjà connectés depuis les pages auth
  if (isAuthRoute && authStore.isAuthenticated.value) {
    const role = authStore.user.value?.role
    if (role === 'admin') return navigateTo('/admin')
    if (role === 'agent') return navigateTo('/agent')
  }
})
