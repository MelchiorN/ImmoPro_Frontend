import { useAuthStore } from '~/stores/auth/auth'

export const useCategoriesStore = () => {
  const categories = useState('admin_categories_list',    () => [])
  const isLoading  = useState('admin_categories_loading', () => false)
  const error      = useState('admin_categories_error',   () => null)

  const config  = useRuntimeConfig()
  const apiBase = config.public.apiBase

  function authHeaders() {
    const authStore = useAuthStore()
    return { Authorization: `Bearer ${authStore.token.value}` }
  }

  // ── Liste ─────────────────────────────────────────────────────────────────
  async function fetchCategories(silent = false) {
    if (!silent) isLoading.value = true
    error.value = null
    try {
      const data = await $fetch(`${apiBase}/admin/categories`, { headers: authHeaders() })
      categories.value = data.data ?? []
    } catch (e) {
      if (!silent) error.value = e?.data?.message || 'Impossible de charger les catégories.'
    } finally {
      isLoading.value = false
    }
  }

  // ── Détail (avec attributs) ───────────────────────────────────────────────
  async function fetchCategorie(id) {
    const data = await $fetch(`${apiBase}/admin/categories/${id}`, { headers: authHeaders() })
    return data.data
  }

  // ── Créer ─────────────────────────────────────────────────────────────────
  async function createCategorie(payload) {
    try {
      const data = await $fetch(`${apiBase}/admin/categories`, {
        method: 'POST', headers: authHeaders(), body: payload,
      })
      categories.value = [...categories.value, data.data]
      return { success: true, data: data.data }
    } catch (e) {
      return { success: false, message: e?.data?.message || 'Erreur lors de la création.' }
    }
  }

  // ── Modifier ──────────────────────────────────────────────────────────────
  async function updateCategorie(id, payload) {
    try {
      const data = await $fetch(`${apiBase}/admin/categories/${id}`, {
        method: 'PUT', headers: authHeaders(), body: payload,
      })
      const idx = categories.value.findIndex(c => c.id === id)
      if (idx !== -1) categories.value[idx] = { ...categories.value[idx], ...data.data }
      return { success: true, data: data.data }
    } catch (e) {
      return { success: false, message: e?.data?.message || 'Erreur lors de la mise à jour.' }
    }
  }

  // ── Ajouter un attribut ───────────────────────────────────────────────────
  async function addAttribut(categorieId, payload) {
    try {
      const data = await $fetch(`${apiBase}/admin/categories/${categorieId}/attributs`, {
        method: 'POST', headers: authHeaders(), body: payload,
      })
      return { success: true, data: data.data }
    } catch (e) {
      return { success: false, message: e?.data?.message || 'Erreur lors de l\'ajout du champ.' }
    }
  }

  // ── Modifier un attribut ──────────────────────────────────────────────────
  async function updateAttribut(categorieId, attributId, payload) {
    try {
      const data = await $fetch(`${apiBase}/admin/categories/${categorieId}/attributs/${attributId}`, {
        method: 'PUT', headers: authHeaders(), body: payload,
      })
      return { success: true, data: data.data }
    } catch (e) {
      return { success: false, message: e?.data?.message || 'Erreur lors de la mise à jour du champ.' }
    }
  }

  // ── Activer / Désactiver un attribut ──────────────────────────────────────
  async function toggleAttribut(categorieId, attributId) {
    try {
      const data = await $fetch(`${apiBase}/admin/categories/${categorieId}/attributs/${attributId}/toggle`, {
        method: 'PATCH', headers: authHeaders(),
      })
      return { success: true, data: data.data, message: data.message }
    } catch (e) {
      return { success: false, message: e?.data?.message || 'Erreur.' }
    }
  }

  // ── Supprimer un attribut ─────────────────────────────────────────────────
  async function deleteAttribut(categorieId, attributId) {
    try {
      await $fetch(`${apiBase}/admin/categories/${categorieId}/attributs/${attributId}`, {
        method: 'DELETE', headers: authHeaders(),
      })
      return { success: true }
    } catch (e) {
      return { success: false, message: e?.data?.message || 'Suppression impossible.' }
    }
  }

  return {
    categories, isLoading, error,
    fetchCategories, fetchCategorie,
    createCategorie, updateCategorie,
    addAttribut, updateAttribut, toggleAttribut, deleteAttribut,
  }
}
