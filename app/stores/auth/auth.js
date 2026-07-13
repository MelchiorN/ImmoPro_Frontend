const USER_STORAGE_KEY = 'auth_user'

function readUserFromStorage() {
  if (import.meta.server) return null
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function writeUserToStorage(user) {
  if (import.meta.server) return
  try {
    user
      ? localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
      : localStorage.removeItem(USER_STORAGE_KEY)
  } catch { /* quota ou mode privé */ }
}

export const useAuthStore = () => {
  const user      = useState('auth_user',    () => readUserFromStorage())
  const isLoading = useState('auth_loading', () => false)
  const error     = useState('auth_error',   () => null)

  // Cookie de session unique pour l'authentification
  const tokenCookie = useCookie('auth_token', {
    path:     '/',
    sameSite: 'lax',
    secure:   false, // true en production HTTPS
  })

  const token = computed(() => tokenCookie.value)

  const isAuthenticated = computed(() => !!token.value)

  const config  = useRuntimeConfig()
  const apiBase = config.public.apiBase 

  /**
   * Connexion — endpoint POST /login (admin + agent).
   * Stocke le token dans le cookie unique.
   */
  async function login(payload) {
    isLoading.value = true
    error.value     = null
    try {
      const data = await $fetch(`${apiBase}/login`, {
        method: 'POST',
        body:   { email: payload.email, password: payload.password },
      })

      if (data.token && data.user) {
        tokenCookie.value = data.token
        user.value = data.user
        writeUserToStorage(data.user)
        return true
      }

      error.value = 'Une erreur est survenue lors de la connexion.'
      return false
    } catch (err) {
      console.error('Login error:', err)
      error.value = err?.data?.message || err?.message || 'Identifiants incorrects'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Recharge le user depuis l'API si le localStorage est vide
   * (ex : rechargement de la page, cookie toujours actif)
   */
  async function fetchUser() {
    const activeToken = token.value
    if (!activeToken) return
    if (user.value) return // déjà en mémoire

    try {
      const data = await $fetch(`${apiBase}/me`, {
        headers: { Authorization: `Bearer ${activeToken}` },
      })
      // /me retourne le user brut (avec role, id, etc.)
      const userData = data?.user ?? data
      user.value = userData
      writeUserToStorage(userData)
    } catch (err) {
      // 401 = token expiré → déconnecter
      // Autre erreur réseau → ne pas déconnecter (évite logout sur CORS/timeout)
      if (err?.status === 401 || err?.statusCode === 401) {
        logoutState()
      }
    }
  }

  /**
   * Déconnexion — révoque le token côté serveur et nettoie l'état local.
   */
  async function logout() {
    const activeToken = token.value
    if (!activeToken) { logoutState(); return }

    isLoading.value = true
    try {
      await $fetch(`${apiBase}/logout`, {
        method:  'POST',
        headers: { Authorization: `Bearer ${activeToken}` },
      })
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      logoutState()
      isLoading.value = false
    }
  }

  function logoutState() {
    tokenCookie.value = null
    user.value = null
    writeUserToStorage(null)
  }

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    fetchUser,
  }
}
