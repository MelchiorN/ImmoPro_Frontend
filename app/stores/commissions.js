import { useAuthStore } from '~/stores/auth/auth'

export const useCommissionsStore = () => {
  const stats        = useState('admin_commissions_stats',    () => ({}))
  const commissions  = useState('admin_commissions_list',     () => [])
  const reversements = useState('admin_reversements_list',    () => [])
  const isLoading    = useState('admin_commissions_loading',  () => false)
  const error        = useState('admin_commissions_error',    () => null)

  const config  = useRuntimeConfig()
  const apiBase = config.public.apiBase

  function authHeaders() {
    const authStore = useAuthStore()
    return { Authorization: `Bearer ${authStore.token.value}` }
  }

  // ── Stats KPIs ──────────────────────────────────────────────────────────────
  async function fetchStats(silent = false) {
    if (!silent) isLoading.value = true
    error.value = null
    try {
      const data = await $fetch(`${apiBase}/admin/commissions/stats`, { headers: authHeaders() })
      stats.value = data.data ?? {}
    } catch (e) {
      if (!silent) error.value = e?.data?.message || 'Impossible de charger les stats.'
    } finally {
      if (!silent) isLoading.value = false
    }
  }

  // ── Liste des commissions ───────────────────────────────────────────────────
  async function fetchCommissions(silent = false) {
    if (!silent) isLoading.value = true
    error.value = null
    try {
      const data = await $fetch(`${apiBase}/admin/commissions`, { headers: authHeaders() })
      commissions.value = data.data ?? []
    } catch (e) {
      if (!silent) error.value = e?.data?.message || 'Impossible de charger les commissions.'
    } finally {
      if (!silent) isLoading.value = false
    }
  }

  // ── Liste des reversements ──────────────────────────────────────────────────
  async function fetchReversements(silent = false) {
    if (!silent) isLoading.value = true
    error.value = null
    try {
      const data = await $fetch(`${apiBase}/admin/reversements`, { headers: authHeaders() })
      reversements.value = (data.data ?? []).map(r => ({ ...r, _loading: false }))
    } catch (e) {
      if (!silent) error.value = e?.data?.message || 'Impossible de charger les reversements.'
    } finally {
      if (!silent) isLoading.value = false
    }
  }

  // ── Charger tout ────────────────────────────────────────────────────────────
  async function fetchAll(silent = false) {
    if (!silent) isLoading.value = true
    error.value = null
    try {
      await Promise.all([fetchStats(true), fetchCommissions(true), fetchReversements(true)])
    } catch (e) {
      error.value = 'Erreur lors du chargement des données.'
    } finally {
      isLoading.value = false
    }
  }

  // ── Traiter un reversement ──────────────────────────────────────────────────
  async function traiterReversement(id) {
    const reversement = reversements.value.find(r => r.id === id)
    if (!reversement) return { success: false, message: 'Reversement introuvable.' }

    reversement._loading = true
    try {
      await $fetch(`${apiBase}/admin/reversements/${id}/traiter`, {
        method: 'PATCH',
        headers: authHeaders(),
      })
      reversement.statut       = 'traite'
      reversement.date_paiement = new Date().toISOString()

      // Mettre à jour les KPIs localement
      if (stats.value) {
        stats.value.reversements_en_attente = Math.max(0,
          (stats.value.reversements_en_attente || 0) - (reversement.montant_a_reverser || 0))
        stats.value.nb_reversements_en_attente = Math.max(0,
          (stats.value.nb_reversements_en_attente || 0) - 1)
      }

      return { success: true, message: 'Reversement marqué comme traité.' }
    } catch (e) {
      return { success: false, message: e?.data?.message || 'Erreur lors du traitement.' }
    } finally {
      reversement._loading = false
    }
  }

  return {
    // State
    stats,
    commissions,
    reversements,
    isLoading,
    error,
    // Actions
    fetchStats,
    fetchCommissions,
    fetchReversements,
    fetchAll,
    traiterReversement,
  }
}
