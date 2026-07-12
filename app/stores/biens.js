import { useAuthStore } from '~/stores/auth/auth'

/**
 * Store — Pool de biens pour l'agent
 *
 * Onglets :
 *   non_assigne  → biens en_attente sans agent
 *   en_cours     → biens en_attente assignés à moi
 *   termine      → biens publiés/rejetés que j'ai traités
 */
export const useBiensStore = () => {
  const biens     = useState('biens_list',   () => [])
  const counts    = useState('biens_counts', () => ({ nonAssigne: 0, enCours: 0, termine: 0 }))
  const meta      = useState('biens_meta',   () => ({ total: 0, current_page: 1, last_page: 1 }))
  const isLoading = useState('biens_loading', () => false)
  const isClaiming = useState('biens_claiming', () => false)
  const error     = useState('biens_error',  () => null)

  const config  = useRuntimeConfig()
  const apiBase = config.public?.apiBase || 'http://localhost:8000/api'

  function authHeaders() {
    const authStore = useAuthStore()
    return { Authorization: `Bearer ${authStore.token.value}` }
  }

  // ── Compteurs des onglets ─────────────────────────────────────────────────
  async function fetchCounts() {
    try {
      const data = await $fetch(`${apiBase}/agent/biens/counts`, {
        headers: authHeaders(),
      })
      if (data.success) counts.value = data.data
    } catch (err) {
      console.error('fetchCounts error:', err)
    }
  }

  // ── Liste par onglet ──────────────────────────────────────────────────────
  async function fetchBiens(params = {}) {
    isLoading.value = true
    error.value     = null
    try {
      const query = new URLSearchParams()
      if (params.onglet)    query.set('onglet',    params.onglet)
      if (params.type_bien) query.set('type_bien', params.type_bien)
      if (params.priorite)  query.set('priorite',  params.priorite)
      if (params.search)    query.set('search',    params.search)
      if (params.page)      query.set('page',      params.page)
      if (params.per_page)  query.set('per_page',  params.per_page)

      const url  = `${apiBase}/agent/biens${query.toString() ? '?' + query : ''}`
      const data = await $fetch(url, { headers: authHeaders() })

      biens.value = data.data ?? []
      if (data.meta) meta.value = data.meta
    } catch (err) {
      console.error('fetchBiens error:', err)
      error.value = err?.data?.message || 'Impossible de charger les biens.'
    } finally {
      isLoading.value = false
    }
  }

  // ── Détail d'un bien ──────────────────────────────────────────────────────
  async function fetchBien(id) {
    const data = await $fetch(`${apiBase}/agent/biens/${id}`, {
      headers: authHeaders(),
    })
    return data.data
  }

  // ── Prendre en charge (claim) ─────────────────────────────────────────────
  async function claimBien(id) {
    isClaiming.value = true
    try {
      const data = await $fetch(`${apiBase}/agent/biens/${id}/claim`, {
        method:  'POST',
        headers: authHeaders(),
      })
      // Retirer le bien du pool local et rafraîchir les compteurs
      biens.value = biens.value.filter(b => b.id !== id)
      await fetchCounts()
      return { success: true, data: data.data }
    } catch (err) {
      const message = err?.data?.message || 'Impossible de prendre en charge ce bien.'
      return { success: false, message }
    } finally {
      isClaiming.value = false
    }
  }

  // ── Publier ou rejeter ────────────────────────────────────────────────────
  async function updateStatut(id, statut, noteAdmin = null) {
    try {
      const data = await $fetch(`${apiBase}/agent/biens/${id}/statut`, {
        method:  'PATCH',
        headers: authHeaders(),
        body:    { statut, note_admin: noteAdmin },
      })
      biens.value = biens.value.filter(b => b.id !== id)
      await fetchCounts()
      return { success: true, data: data.data }
    } catch (err) {
      const message = err?.data?.message || 'Impossible de mettre à jour le statut.'
      return { success: false, message }
    }
  }

  // ── Supprimer les documents d'un bien ────────────────────────────────────
  async function deleteDocuments(id) {
    try {
      await $fetch(`${apiBase}/agent/biens/${id}/documents`, {
        method:  'DELETE',
        headers: authHeaders(),
      })
      return { success: true }
    } catch (err) {
      const message = err?.data?.message || 'Impossible de supprimer les documents.'
      return { success: false, message }
    }
  }

  return {
    biens,
    counts,
    meta,
    isLoading,
    isClaiming,
    error,
    fetchCounts,
    fetchBiens,
    fetchBien,
    claimBien,
    updateStatut,
    deleteDocuments,
  }
}
