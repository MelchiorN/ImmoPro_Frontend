import { useAuthStore } from '~/stores/auth/auth'

export const useContratsStore = () => {
  const templates    = useState('admin_contrats_templates', () => [])
  const placeholders = useState('admin_contrats_placeholders', () => ({}))
  const isLoading    = useState('admin_contrats_loading', () => false)
  const error        = useState('admin_contrats_error', () => null)

  const config  = useRuntimeConfig()
  const apiBase = config.public.apiBase || 'http://localhost:8000/api'

  function authHeaders() {
    const authStore = useAuthStore()
    const token =
      authStore.token?.value ||
      useCookie('auth_token').value ||
      useCookie('sanctum_token').value ||
      (process.client ? localStorage.getItem('auth_token') || localStorage.getItem('sanctum_token') : null)

    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    }
  }

  // ── 1. Liste des modèles ──────────────────────────────────────────────────
  async function fetchTemplates(silent = false) {
    if (!silent) isLoading.value = true
    error.value = null
    try {
      const data = await $fetch(`${apiBase}/admin/contrat-templates`, {
        headers: authHeaders(),
      })
      if (data.success) {
        templates.value = data.templates || []
        if (data.placeholders) {
          placeholders.value = data.placeholders
        }
      }
      return { success: true }
    } catch (e) {
      const msg = e?.data?.message || 'Erreur lors du chargement des modèles de contrat.'
      if (!silent) error.value = msg
      return { success: false, message: msg }
    } finally {
      isLoading.value = false
    }
  }

  // ── 2. Créer un modèle ────────────────────────────────────────────────────
  async function createTemplate(payload) {
    try {
      const data = await $fetch(`${apiBase}/admin/contrat-templates`, {
        method: 'POST',
        headers: authHeaders(),
        body: payload,
      })
      if (data.success) {
        await fetchTemplates(true)
        return { success: true, message: data.message, template: data.template }
      }
      return { success: false, message: data.message || 'Erreur lors de la création.' }
    } catch (e) {
      return { success: false, message: e?.data?.message || 'Erreur lors de la création du modèle.' }
    }
  }

  // ── 3. Modifier un modèle ─────────────────────────────────────────────────
  async function updateTemplate(id, payload) {
    try {
      const data = await $fetch(`${apiBase}/admin/contrat-templates/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: payload,
      })
      if (data.success) {
        await fetchTemplates(true)
        return { success: true, message: data.message, template: data.template }
      }
      return { success: false, message: data.message || 'Erreur lors de la mise à jour.' }
    } catch (e) {
      return { success: false, message: e?.data?.message || 'Erreur lors de la mise à jour.' }
    }
  }

  // ── 4. Supprimer un modèle ────────────────────────────────────────────────
  async function deleteTemplate(id) {
    try {
      const data = await $fetch(`${apiBase}/admin/contrat-templates/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      })
      if (data.success) {
        await fetchTemplates(true)
        return { success: true, message: data.message }
      }
      return { success: false, message: data.message || 'Erreur lors de la suppression.' }
    } catch (e) {
      return { success: false, message: e?.data?.message || 'Erreur lors de la suppression.' }
    }
  }

  // ── 5. Définir par défaut ─────────────────────────────────────────────────
  async function setDefaultTemplate(id) {
    try {
      const data = await $fetch(`${apiBase}/admin/contrat-templates/${id}/defaut`, {
        method: 'PATCH',
        headers: authHeaders(),
      })
      if (data.success) {
        await fetchTemplates(true)
        return { success: true, message: data.message }
      }
      return { success: false, message: data.message || 'Erreur.' }
    } catch (e) {
      return { success: false, message: e?.data?.message || 'Erreur lors du changement de modèle par défaut.' }
    }
  }

  // ── 6. Prévisualiser un modèle ────────────────────────────────────────────
  async function previewTemplate(contenuHtml) {
    try {
      const data = await $fetch(`${apiBase}/admin/contrat-templates/preview`, {
        method: 'POST',
        headers: authHeaders(),
        body: { contenu_html: contenuHtml },
      })
      if (data.success) {
        return { success: true, previewHtml: data.preview_html }
      }
      return { success: false, previewHtml: contenuHtml }
    } catch (_) {
      return { success: false, previewHtml: contenuHtml }
    }
  }

  return {
    templates,
    placeholders,
    isLoading,
    error,
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    setDefaultTemplate,
    previewTemplate,
  }
}
