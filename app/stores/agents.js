import { useAuthStore } from '~/stores/auth/auth'

export const useAgentsStore = () => {
  const agents     = useState('agents_list',  () => [])
  const meta       = useState('agents_meta',  () => ({ total: 0, current_page: 1, last_page: 1 }))
  const isLoading  = useState('agents_load',  () => false)
  const error      = useState('agents_error', () => null)

  const config  = useRuntimeConfig()
  const apiBase = config.public.apiBase 

  function authHeaders() {
    const authStore = useAuthStore()
    return { Authorization: `Bearer ${authStore.token.value}` }
  }

  // ── Fetch list ────────────────────────────────────────────────────────────
  async function fetchAgents(params = {}, silent = false) {
    if (!silent) isLoading.value = true
    error.value     = null
    try {
      const query = new URLSearchParams()
      if (params.search)   query.set('search',   params.search)
      if (params.status)   query.set('status',   params.status)
      if (params.page)     query.set('page',      params.page)
      if (params.per_page) query.set('per_page',  params.per_page)

      const url  = `${apiBase}/admin/agents${query.toString() ? '?' + query : ''}`
      const data = await $fetch(url, { headers: authHeaders() })

      agents.value = data.data ?? data
      if (data.meta)  meta.value = data.meta
      if (data.total) meta.value = { total: data.total, current_page: data.current_page, last_page: data.last_page }
    } catch (err) {
      console.error('fetchAgents error:', err)
      if (!silent) error.value = err?.data?.message || 'Impossible de charger les agents.'
    } finally {
      isLoading.value = false
    }
  }

  // ── Create ────────────────────────────────────────────────────────────────
  async function createAgent(payload) {
    const data = await $fetch(`${apiBase}/admin/agents`, {
      method:  'POST',
      body:    payload,
      headers: authHeaders(),
    })
    await fetchAgents()
    return data
  }

  // ── Update ────────────────────────────────────────────────────────────────
  async function updateAgent(id, payload) {
    const data = await $fetch(`${apiBase}/admin/agents/${id}`, {
      method:  'PUT',
      body:    payload,
      headers: authHeaders(),
    })
    await fetchAgents()
    return data
  }

  // ── Update status ─────────────────────────────────────────────────────────
  async function updateStatus(id, status) {
    const data = await $fetch(`${apiBase}/admin/agents/${id}/status`, {
      method:  'PATCH',
      body:    { status },
      headers: authHeaders(),
    })
    // Met à jour localement sans refetch
    const idx = agents.value.findIndex(a => a.id === id)
    if (idx !== -1) agents.value[idx] = { ...agents.value[idx], status }
    return data
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  async function deleteAgent(id) {
    await $fetch(`${apiBase}/admin/agents/${id}`, {
      method:  'DELETE',
      headers: authHeaders(),
    })
    agents.value = agents.value.filter(a => a.id !== id)
  }

  return {
    agents,
    meta,
    isLoading,
    error,
    fetchAgents,
    createAgent,
    updateAgent,
    updateStatus,
    deleteAgent,
  }
}
