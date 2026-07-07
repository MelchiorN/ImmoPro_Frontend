export interface LoginPayload {
  email: string
  password: string
  rememberMe: boolean
}

export function useAuth() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function login(payload: LoginPayload): Promise<boolean> {
    isLoading.value = true
    error.value = null

    try {
      // TODO: remplacer par l'appel réel au backend Laravel
      // const { data } = await useFetch('/api/login', { method: 'POST', body: payload })
      await new Promise(resolve => setTimeout(resolve, 800)) // simulation
      return true
    } catch (err: any) {
      error.value = err?.message ?? 'Identifiants incorrects'
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function verifyOtp(code: string): Promise<boolean> {
    isLoading.value = true
    error.value = null
    try {
      // TODO: POST /api/verify-otp
      await new Promise(resolve => setTimeout(resolve, 600))
      return true
    } catch (err: any) {
      error.value = err?.message ?? 'Code invalide'
      return false
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, error, login, verifyOtp }
}
