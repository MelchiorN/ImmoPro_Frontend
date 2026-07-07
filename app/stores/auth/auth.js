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

  const tokenCookie = useCookie('auth_token', {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax',
  })

  const isAuthenticated = computed(() => !!tokenCookie.value)

  const config  = useRuntimeConfig()
  const apiBase = config.public?.apiBase || 'http://localhost:8000/api'

  /**
   * Connexion — un seul endpoint POST /login pour admin et agent.
   * Le backend retourne user.role ; le frontend redirige en conséquence.
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
        user.value        = data.user
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
   * (ex : cookie toujours valide mais localStorage effacé)
   */
  async function fetchUser() {
    if (!tokenCookie.value) return
    if (user.value) return  // déjà en mémoire

    try {
      const data = await $fetch(`${apiBase}/me`, {
        headers: { Authorization: `Bearer ${tokenCookie.value}` },
      })
      user.value = data
      writeUserToStorage(data)
    } catch (err) {
      console.error('fetchUser error:', err)
      logoutState()
    }
  }

  /**
   * Déconnexion — un seul endpoint POST /logout
   */
  async function logout() {
    if (!tokenCookie.value) { logoutState(); return }
    isLoading.value = true
    try {
      await $fetch(`${apiBase}/logout`, {
        method:  'POST',
        headers: { Authorization: `Bearer ${tokenCookie.value}` },
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
    user.value        = null
    writeUserToStorage(null)
  }

  return {
    user,
    token: computed(() => tokenCookie.value),
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    fetchUser,
  }
}
