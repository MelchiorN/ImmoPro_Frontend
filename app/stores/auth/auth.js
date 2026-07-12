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

/**
 * Clé du cookie selon le rôle — évite le conflit entre onglets admin/agent.
 * Un admin et un agent peuvent être connectés simultanément dans des onglets
 * différents sans écraser le token de l'autre.
 */
function cookieKey(role) {
  if (role === 'admin') return 'auth_token_admin'
  if (role === 'agent') return 'auth_token_agent'
  return 'auth_token'
}

export const useAuthStore = () => {
  const user      = useState('auth_user',    () => readUserFromStorage())
  const isLoading = useState('auth_loading', () => false)
  const error     = useState('auth_error',   () => null)

  // Cookie de session — sans maxAge = cookie de session (expire à la fermeture du navigateur)
  // Le nom du cookie dépend du rôle stocké dans le user actuel
  const currentRole = computed(() => user.value?.role ?? null)

  const tokenCookie = useCookie('auth_token', {
    // Pas de maxAge → cookie de session (effacé à la fermeture du navigateur)
    path:     '/',
    sameSite: 'lax',
    secure:   false, // true en production HTTPS
  })

  // Cookies dédiés par rôle pour éviter les conflits multi-onglets
  const adminTokenCookie = useCookie('auth_token_admin', {
    path: '/', sameSite: 'lax', secure: false,
  })
  const agentTokenCookie = useCookie('auth_token_agent', {
    path: '/', sameSite: 'lax', secure: false,
  })

  /**
   * Retourne le token actif selon le rôle de l'utilisateur en mémoire.
   * Si pas de user en mémoire, essaie les deux cookies.
   */
  const token = computed(() => {
    const role = user.value?.role
    if (role === 'admin') return adminTokenCookie.value
    if (role === 'agent') return agentTokenCookie.value
    // Fallback : si le user n'est pas encore chargé, cherche n'importe quel cookie actif
    return adminTokenCookie.value || agentTokenCookie.value || null
  })

  const isAuthenticated = computed(() => !!token.value)

  const config  = useRuntimeConfig()
  const apiBase = config.public?.apiBase || 'http://localhost:8000/api'

  /**
   * Connexion — endpoint POST /login (admin + agent).
   * Stocke le token dans le cookie dédié au rôle.
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
        // Stocke dans le cookie dédié au rôle
        const role = data.user.role
        if (role === 'admin') adminTokenCookie.value = data.token
        if (role === 'agent') agentTokenCookie.value = data.token

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
    // Efface le cookie du rôle actuel
    const role = user.value?.role
    if (role === 'admin') adminTokenCookie.value = null
    else if (role === 'agent') agentTokenCookie.value = null
    else {
      adminTokenCookie.value = null
      agentTokenCookie.value = null
    }
    // Efface aussi l'ancien cookie générique si présent
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
