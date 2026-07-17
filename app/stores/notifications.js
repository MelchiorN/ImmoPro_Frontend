import { useAuthStore } from '~/stores/auth/auth'

/**
 * Store notifications — admin et agent.
 * Détecte le rôle automatiquement pour choisir le bon endpoint.
 */
export const useNotificationsStore = () => {
  const config  = useRuntimeConfig()
  const apiBase = config.public.apiBase

  // ── État réactif ──────────────────────────────────────────────────────────
  const notifications = useState('notif_list',    () => [])
  const unreadCount   = useState('notif_unread',  () => 0)
  const loading       = useState('notif_loading', () => false)

  // ── Helpers ───────────────────────────────────────────────────────────────
  function authHeaders() {
    const authStore = useAuthStore()
    return { Authorization: `Bearer ${authStore.token.value}` }
  }

  function apiPrefix() {
    const authStore = useAuthStore()
    const role = authStore.user?.value?.role ?? authStore.user?.role
    if (role === 'admin')  return 'admin'
    if (role === 'agent')  return 'agent'
    return 'client'
  }

  // ── Charger les notifications ─────────────────────────────────────────────
  async function fetchNotifications() {
    loading.value = true
    try {
      const data = await $fetch(`${apiBase}/${apiPrefix()}/notifications`, {
        headers: authHeaders(),
      })
      notifications.value = data.data   ?? []
      unreadCount.value   = data.unread_count ?? 0
    } catch (err) {
      console.error('[notifications] fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  // ── Marquer une notif comme lue ───────────────────────────────────────────
  async function markAsRead(id) {
    try {
      await $fetch(`${apiBase}/${apiPrefix()}/notifications/${id}/read`, {
        method:  'PATCH',
        headers: authHeaders(),
      })
      const notif = notifications.value.find(n => n.id === id)
      if (notif && !notif.lu) {
        notif.lu = true
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
    } catch (err) {
      console.error('[notifications] markAsRead error:', err)
    }
  }

  // ── Tout marquer comme lu ─────────────────────────────────────────────────
  async function markAllAsRead() {
    try {
      await $fetch(`${apiBase}/${apiPrefix()}/notifications/read-all`, {
        method:  'POST',
        headers: authHeaders(),
      })
      notifications.value.forEach(n => (n.lu = true))
      unreadCount.value = 0
    } catch (err) {
      console.error('[notifications] markAllAsRead error:', err)
    }
  }

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  }
}
