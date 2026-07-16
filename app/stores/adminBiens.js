import { useAuthStore } from '~/stores/auth/auth'

export const useAdminBiensStore = () => {
  const biens     = useState('admin_biens_list',    () => [])
  const meta      = useState('admin_biens_meta',    () => ({ total: 0, current_page: 1, last_page: 1, per_page: 20 }))
  const counts    = useState('admin_biens_counts',  () => ({ en_attente: 0, en_cours: 0, publie: 0, rejete: 0 }))
  const isLoading = useState('admin_biens_loading', () => false)
  const error     = useState('admin_biens_error',   () => null)

  const config  = useRuntimeConfig()
  const apiBase = config.public.apiBase 

  function authHeaders() {
    const authStore = useAuthStore()
    return { Authorization: `Bearer ${authStore.token.value}` }
  }

  // ── Liste des biens ───────────────────────────────────────────────────────
  async function fetchBiens(params = {}, silent = false) {
    if (!silent) isLoading.value = true
    error.value     = null
    try {
      const query = new URLSearchParams()
      if (params.statut)    query.set('statut',    params.statut)
      if (params.type_bien) query.set('type_bien', params.type_bien)
      if (params.search)    query.set('search',    params.search)
      if (params.page)      query.set('page',      params.page)
      if (params.per_page)  query.set('per_page',  params.per_page)

      const url  = `${apiBase}/admin/biens${query.toString() ? '?' + query : ''}`
      const data = await $fetch(url, { headers: authHeaders() })

      biens.value = data.data ?? []
      if (data.meta) meta.value = data.meta
    } catch (err) {
      if (!silent) error.value = err?.data?.message || 'Impossible de charger les biens.'
    } finally {
      isLoading.value = false
    }
  }

  // ── Compteurs par statut ──────────────────────────────────────────────────
  async function fetchCounts() {
    try {
      const statuts = ['en_attente', 'en_cours', 'publie', 'rejete']
      const results = await Promise.all(
        statuts.map(s =>
          $fetch(`${apiBase}/admin/biens?statut=${s}&per_page=1`, { headers: authHeaders() })
            .then(d => ({ statut: s, total: d.meta?.total ?? 0 }))
            .catch(() => ({ statut: s, total: 0 }))
        )
      )
      counts.value = Object.fromEntries(results.map(r => [r.statut, r.total]))
    } catch {}
  }

  // ── Détail d'un rapport (admin) ───────────────────────────────────────────
  async function fetchRapport(id) {
    const data = await $fetch(`${apiBase}/admin/rapports/${id}`, {
      headers: authHeaders(),
    })
    return data.data
  }

  // ── Décision admin : publier ou rejeter via le rapport ────────────────────
  async function deciderRapport(rapportId, decision, note = '') {
    try {
      const data = await $fetch(`${apiBase}/admin/rapports/${rapportId}/decision`, {
        method:  'POST',
        headers: authHeaders(),
        body:    { decision, note },
      })
      return { success: true, data: data.data, message: data.message }
    } catch (err) {
      return { success: false, message: err?.data?.message || 'Erreur lors de la décision.' }
    }
  }

  // ── Changer statut d'un bien directement (sans rapport) ──────────────────
  async function updateStatut(id, statut, note = '') {
    try {
      const data = await $fetch(`${apiBase}/admin/biens/${id}/statut`, {
        method:  'PATCH',
        headers: authHeaders(),
        body:    { statut, note_admin: note },
      })
      // Mettre à jour localement
      const idx = biens.value.findIndex(b => b.id === id)
      if (idx !== -1) biens.value[idx] = { ...biens.value[idx], ...data.data }
      // Rafraîchir les compteurs immédiatement
      await fetchCounts()
      return { success: true, data: data.data }
    } catch (err) {
      return { success: false, message: err?.data?.message || 'Erreur mise à jour statut.' }
    }
  }

  return {
    biens, meta, counts, isLoading, error,
    fetchBiens, fetchCounts, fetchRapport, deciderRapport, updateStatut,
  }
}
