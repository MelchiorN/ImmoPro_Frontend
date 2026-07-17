<template>
  <div class="relative" ref="bellRef">

    <!-- Bouton cloche -->
    <button
      @click="toggleDropdown"
      class="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      aria-label="Notifications"
    >
      <span class="material-symbols-outlined text-gray-700 text-[22px]">notifications</span>

      <!-- Badge nombre non lus -->
      <span
        v-if="store.unreadCount.value > 0"
        class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white"
      >
        {{ store.unreadCount.value > 99 ? '99+' : store.unreadCount.value }}
      </span>

      <!-- Point bleu si 0 non lus mais badge vide -->
      <span
        v-else-if="store.unreadCount.value === 0 && hasAny"
        class="absolute top-1.5 right-1.5 w-2 h-2 bg-gray-300 rounded-full border-2 border-white"
      />
    </button>

    <!-- Dropdown -->
    <Transition name="notif-drop">
      <div
        v-if="open"
        class="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
      >
        <!-- En-tête -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#1a56a0] text-[20px]">notifications</span>
            <span class="font-bold text-gray-800 text-sm">Notifications</span>
            <span
              v-if="store.unreadCount.value > 0"
              class="bg-red-100 text-red-600 text-[11px] font-bold px-2 py-0.5 rounded-full"
            >{{ store.unreadCount.value }} nouvelles</span>
          </div>
          <button
            v-if="store.unreadCount.value > 0"
            @click="readAll"
            class="text-xs text-[#1a56a0] hover:underline font-medium"
          >
            Tout marquer lu
          </button>
        </div>

        <!-- Liste -->
        <div class="max-h-[420px] overflow-y-auto">

          <!-- Loading -->
          <div v-if="store.loading.value" class="flex justify-center py-8">
            <span class="material-symbols-outlined animate-spin text-[#1a56a0]">progress_activity</span>
          </div>

          <!-- Vide -->
          <div
            v-else-if="store.notifications.value.length === 0"
            class="flex flex-col items-center py-12 text-gray-400"
          >
            <span class="material-symbols-outlined text-[40px] mb-2">notifications_off</span>
            <span class="text-sm">Aucune notification</span>
          </div>

          <!-- Items -->
          <template v-else>
            <button
              v-for="notif in store.notifications.value"
              :key="notif.id"
              @click="handleNotifClick(notif)"
              class="w-full text-left px-5 py-3.5 flex gap-3 items-start hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
              :class="{ 'bg-blue-50/60': !notif.lu }"
            >
              <!-- Icône type -->
              <span class="text-[22px] mt-0.5 shrink-0">{{ typeIcon(notif.type) }}</span>

              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-800 truncate">{{ notif.titre }}</p>
                <p class="text-xs text-gray-500 leading-snug mt-0.5 line-clamp-2">{{ notif.message }}</p>
                <p class="text-[11px] text-gray-400 mt-1">{{ formatDate(notif.created_at) }}</p>
              </div>

              <!-- Pastille non lu -->
              <span
                v-if="!notif.lu"
                class="w-2 h-2 bg-[#1a56a0] rounded-full mt-2 shrink-0"
              />
            </button>
          </template>
        </div>

        <!-- Pied de page -->
        <div class="px-5 py-3 border-t border-gray-100 bg-gray-50 text-center">
          <span class="text-xs text-gray-400">
            {{ store.notifications.value.length }} notification{{ store.notifications.value.length > 1 ? 's' : '' }} affichée{{ store.notifications.value.length > 1 ? 's' : '' }}
          </span>
        </div>
      </div>
    </Transition>

    <!-- Backdrop fermeture au clic extérieur -->
    <div v-if="open" class="fixed inset-0 z-40" @click="open = false" />
  </div>
</template>

<script setup lang="ts">
import { useNotificationsStore } from '~/stores/notifications'

const store = useNotificationsStore()
const open  = ref(false)
const bellRef = ref<HTMLElement | null>(null)

const hasAny = computed(() => store.notifications.value.length > 0)

// Ouvrir/fermer et charger à l'ouverture
async function toggleDropdown() {
  open.value = !open.value
  if (open.value) {
    await store.fetchNotifications()
  }
}

// Marquer comme lu au clic et fermer
async function handleNotifClick(notif: any) {
  if (!notif.lu) {
    await store.markAsRead(notif.id)
  }
  open.value = false
}

async function readAll() {
  await store.markAllAsRead()
}

// Polling toutes les 30s quand la page est active
let pollInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  // Chargement initial silencieux pour le badge
  store.fetchNotifications()

  pollInterval = setInterval(() => {
    if (!open.value) {
      store.fetchNotifications()
    }
  }, 30_000)
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})

// ── Helpers ──────────────────────────────────────────────────────────────────

function typeIcon(type: string): string {
  const map: Record<string, string> = {
    visite_planifiee:          '📅',
    visite_planifiee_admin:    '📅',
    visite_confirmee:          '✅',
    visite_annulee:            '❌',
    visite_rapport_soumis:     '📋',
    visite_update_admin:       '🔄',
    rapport_approuve:          '🎉',
    rapport_rejete:            '⚠️',
    bien_assigne:              '🏠',
    bien_publie:               '🎉',
    bien_rejete:               '❌',
    bien_archive:              '📦',
    bien_statut_change_agent:  '🔄',
    bien_corrections_requises: '✏️',
  }
  return map[type] ?? '🔔'
}

function formatDate(iso: string): string {
  if (!iso) return ''
  const date = new Date(iso)
  const now  = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diff < 60)   return 'À l\'instant'
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} h`

  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.notif-drop-enter-active,
.notif-drop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.notif-drop-enter-from,
.notif-drop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
