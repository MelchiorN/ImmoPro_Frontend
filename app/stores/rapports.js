import { useAuthStore } from '~/stores/auth/auth'

export const useRapportsStore = () => {
  const config  = useRuntimeConfig()
  const apiBase = config.public.apiBase 

  function authHeaders() {
    const authStore = useAuthStore()
    return { Authorization: `Bearer ${authStore.token.value}` }
  }

  // ── Récupérer le rapport d'un bien ────────────────────────────────────────
  async function fetchRapportByBien(bienId) {
    try {
      const data = await $fetch(`${apiBase}/agent/biens/${bienId}/rapport`, {
        headers: authHeaders(),
      })
      return data.data ?? null
    } catch {
      return null
    }
  }

  // ── Récupérer un rapport par ID ───────────────────────────────────────────
  async function fetchRapport(id) {
    const data = await $fetch(`${apiBase}/agent/rapports/${id}`, {
      headers: authHeaders(),
    })
    return data.data
  }

  // ── Créer ou récupérer un brouillon ──────────────────────────────────────
  async function createRapport(bienId) {
    try {
      const data = await $fetch(`${apiBase}/agent/rapports`, {
        method:  'POST',
        headers: authHeaders(),
        body:    { bien_id: bienId },
      })
      return { success: true, data: data.data }
    } catch (err) {
      return { success: false, message: err?.data?.message || 'Erreur création rapport.' }
    }
  }

  // ── Sauvegarder (brouillon) ───────────────────────────────────────────────
  async function saveRapport(id, payload) {
    try {
      const data = await $fetch(`${apiBase}/agent/rapports/${id}`, {
        method:  'PUT',
        headers: authHeaders(),
        body:    payload,
      })
      return { success: true, data: data.data }
    } catch (err) {
      return { success: false, message: err?.data?.message || 'Erreur sauvegarde rapport.' }
    }
  }

  // ── Soumettre à l'admin ───────────────────────────────────────────────────
  async function soumettre(id, payload = {}) {
    try {
      const data = await $fetch(`${apiBase}/agent/rapports/${id}/soumettre`, {
        method:  'POST',
        headers: authHeaders(),
        body:    payload,
      })
      return { success: true, data: data.data, message: data.message }
    } catch (err) {
      return { success: false, message: err?.data?.message || 'Erreur soumission rapport.' }
    }
  }

  return { fetchRapportByBien, fetchRapport, createRapport, saveRapport, soumettre }
}
