<template>
  <div class="p-6 space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-primary">Calendrier des visites</h1>
        <p class="text-sm text-gray-400 mt-0.5">Visualisez et gérez vos visites planifiées</p>
      </div>
      <!-- Légende statuts -->
      <div class="hidden sm:flex items-center gap-4 text-xs text-gray-500">
        <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span>Planifiée</span>
        <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>Confirmée</span>
        <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-gray-300 inline-block"></span>Annulée</span>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">

      <!-- ── Colonne gauche : Calendrier ── -->
      <div class="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

        <!-- Navigation mois -->
        <div class="flex items-center justify-between mb-6">
          <button
            class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            @click="prevMonth"
          >
            <ChevronLeft :size="18" />
          </button>
          <h2 class="text-lg font-bold text-gray-800 capitalize">
            {{ monthLabel }}
          </h2>
          <button
            class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            @click="nextMonth"
          >
            <ChevronRight :size="18" />
          </button>
        </div>

        <!-- Jours de la semaine -->
        <div class="grid grid-cols-7 mb-2">
          <div
            v-for="day in ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']"
            :key="day"
            class="text-center text-[11px] font-bold text-gray-400 uppercase tracking-wide py-1"
          >
            {{ day }}
          </div>
        </div>

        <!-- Grille des jours -->
        <div class="grid grid-cols-7 gap-1">
          <div
            v-for="(cell, i) in calendarCells"
            :key="i"
            :class="[
              'relative min-h-[60px] rounded-xl p-1.5 transition-colors cursor-pointer',
              cell.isCurrentMonth ? 'hover:bg-blue-50/60' : 'opacity-30 cursor-default',
              cell.isToday ? 'bg-primary/10 ring-2 ring-primary/30' : '',
              selectedDay?.date === cell.date ? 'bg-blue-50 ring-2 ring-primary' : '',
            ]"
            @click="cell.isCurrentMonth && selectDay(cell)"
          >
            <!-- Numéro du jour -->
            <span
              :class="[
                'text-xs font-bold flex w-6 h-6 items-center justify-center rounded-full',
                cell.isToday ? 'bg-primary text-white' : 'text-gray-700',
              ]"
            >
              {{ cell.day }}
            </span>

            <!-- Points de visites -->
            <div class="mt-0.5 space-y-0.5">
              <div
                v-for="(visite, vi) in cell.visites.slice(0, 2)"
                :key="vi"
                :class="['text-[9px] font-bold px-1 py-0.5 rounded truncate leading-tight', visiteBadgeClass(visite.statut)]"
              >
                {{ formatTime(visite.date_visite) }} {{ truncate(visite.bien_titre, 10) }}
              </div>
              <div
                v-if="cell.visites.length > 2"
                class="text-[9px] text-gray-400 font-bold px-1"
              >
                +{{ cell.visites.length - 2 }} autres
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Colonne droite : Liste visites du jour sélectionné ── -->
      <div class="space-y-4">

        <!-- Résumé du mois -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 class="text-sm font-bold text-gray-700 mb-3">Ce mois</h3>
          <div class="space-y-3">
            <div v-for="stat in monthStats" :key="stat.label" class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span :class="['w-2.5 h-2.5 rounded-full', stat.color]"></span>
                <span class="text-xs text-gray-500">{{ stat.label }}</span>
              </div>
              <span class="text-xs font-bold text-gray-700">{{ stat.count }}</span>
            </div>
          </div>
        </div>

        <!-- Visites du jour sélectionné -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 class="text-sm font-bold text-gray-700 mb-3">
            <span v-if="selectedDay">
              Visites du {{ formatDayLabel(selectedDay.date) }}
            </span>
            <span v-else>Sélectionnez un jour</span>
          </h3>

          <div v-if="isLoading" class="space-y-2">
            <div v-for="i in 2" :key="i" class="animate-pulse h-16 bg-gray-100 rounded-xl" />
          </div>

          <div v-else-if="!selectedDay" class="text-center py-6">
            <CalendarDays :size="32" class="text-gray-200 mx-auto mb-2" />
            <p class="text-xs text-gray-400">Cliquez sur un jour pour voir les visites</p>
          </div>

          <div v-else-if="selectedDay.visites.length === 0" class="text-center py-6">
            <CalendarX :size="32" class="text-gray-200 mx-auto mb-2" />
            <p class="text-xs text-gray-400">Aucune visite ce jour</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="visite in selectedDay.visites"
              :key="visite.id"
              :class="['p-3 rounded-xl border transition-colors', visiteCardClass(visite.statut)]"
            >
              <!-- Heure + bien -->
              <div class="flex items-start justify-between gap-2 mb-2">
                <div class="min-w-0">
                  <p class="text-xs font-bold text-gray-800 truncate">{{ visite.bien_titre }}</p>
                  <p class="text-[10px] text-gray-400 truncate">{{ visite.bien_adresse }}</p>
                </div>
                <span :class="['text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0', visiteBadgeClass(visite.statut)]">
                  {{ statutLabel(visite.statut) }}
                </span>
              </div>
              <!-- Heure -->
              <div class="flex items-center gap-1 text-[11px] text-gray-500">
                <Clock :size="11" />
                {{ formatTime(visite.date_visite) }}
              </div>
              <!-- Notes -->
              <p v-if="visite.notes" class="text-[10px] text-gray-400 mt-1 italic line-clamp-2">
                {{ visite.notes }}
              </p>
            </div>
          </div>
        </div>

        <!-- Prochaines visites (toutes) -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 class="text-sm font-bold text-gray-700 mb-3">Prochaines visites</h3>
          <div v-if="upcomingVisites.length === 0" class="text-center py-4">
            <p class="text-xs text-gray-400">Aucune visite à venir</p>
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="visite in upcomingVisites"
              :key="visite.id"
              class="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-1.5 transition-colors"
              @click="goToVisite(visite)"
            >
              <div class="bg-purple-50 text-purple-700 rounded-xl px-2 py-1.5 text-center min-w-[44px] flex-shrink-0">
                <p class="text-[11px] font-extrabold">{{ formatTime(visite.date_visite) }}</p>
                <p class="text-[9px] font-bold uppercase">{{ formatDayShort(visite.date_visite) }}</p>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-xs font-bold truncate text-gray-800">{{ visite.bien_titre }}</p>
                <p class="text-[10px] text-gray-400 truncate">{{ visite.bien_adresse }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  ChevronLeft, ChevronRight, CalendarDays, CalendarX, Clock,
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth/auth'

definePageMeta({ layout: 'agent' })

const authStore = useAuthStore()
const config    = useRuntimeConfig()
const apiBase   = config.public?.apiBase || 'http://localhost:8000/api'

// ── State ──────────────────────────────────────────────────────────────────
const visites    = useState<any[]>('agent_visites_list', () => [])
const isLoading  = useState('agent_visites_loading', () => false)
const currentDate = ref(new Date())
const selectedDay = ref<{ date: string; day: number; visites: any[] } | null>(null)
let   pollTimer: ReturnType<typeof setInterval> | null = null

// ── Charger les visites ────────────────────────────────────────────────────
async function loadVisites(silent = false) {
  if (!silent) isLoading.value = true
  try {
    const data = await $fetch(`${apiBase}/agent/visites`, {
      headers: { Authorization: `Bearer ${authStore.token.value}` },
    })
    visites.value = (data as any).data ?? []
  } catch (e) {
    console.error('Erreur chargement visites', e)
  } finally {
    isLoading.value = false
  }
}

// ── Calendrier ─────────────────────────────────────────────────────────────
const monthLabel = computed(() =>
  currentDate.value.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
)

function prevMonth() {
  const d = new Date(currentDate.value)
  d.setMonth(d.getMonth() - 1)
  currentDate.value = d
  selectedDay.value = null
}
function nextMonth() {
  const d = new Date(currentDate.value)
  d.setMonth(d.getMonth() + 1)
  currentDate.value = d
  selectedDay.value = null
}

const calendarCells = computed(() => {
  const year  = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const today = new Date()

  const firstDay = new Date(year, month, 1)
  // Lundi=0 … Dimanche=6
  let startDow = firstDay.getDay() - 1
  if (startDow < 0) startDow = 6

  const daysInMonth   = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const cells: any[] = []

  // Jours du mois précédent
  for (let i = startDow - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, isCurrentMonth: false, date: '', visites: [] })
  }

  // Jours du mois courant
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const dayVisites = visites.value.filter(v => v.date_visite?.startsWith(dateStr))
    cells.push({
      day: d,
      isCurrentMonth: true,
      date: dateStr,
      isToday: today.getFullYear() === year && today.getMonth() === month && today.getDate() === d,
      visites: dayVisites,
    })
  }

  // Compléter à 42 cellules
  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, isCurrentMonth: false, date: '', visites: [] })
  }

  return cells
})

function selectDay(cell: any) {
  if (!cell.isCurrentMonth) return
  selectedDay.value = cell
}

// ── Stats du mois ──────────────────────────────────────────────────────────
const monthStats = computed(() => {
  const year  = currentDate.value.getFullYear()
  const month = String(currentDate.value.getMonth() + 1).padStart(2, '0')
  const thisMonth = visites.value.filter(v => v.date_visite?.startsWith(`${year}-${month}`))
  return [
    { label: 'Planifiées',  count: thisMonth.filter(v => v.statut === 'planifiee').length,  color: 'bg-purple-400' },
    { label: 'Confirmées',  count: thisMonth.filter(v => v.statut === 'confirmee').length,  color: 'bg-blue-400' },
    { label: 'Effectuées',  count: thisMonth.filter(v => v.visite_effectuee).length,         color: 'bg-green-400' },
    { label: 'Annulées',    count: thisMonth.filter(v => v.statut === 'annulee').length,     color: 'bg-gray-300' },
  ]
})

// ── Prochaines visites ─────────────────────────────────────────────────────
const upcomingVisites = computed(() => {
  const now = new Date().toISOString()
  return visites.value
    .filter(v => v.date_visite > now && v.statut !== 'annulee')
    .slice(0, 5)
})

// ── Navigation vers un jour ────────────────────────────────────────────────
function goToVisite(visite: any) {
  if (!visite.date_visite) return
  const d = new Date(visite.date_visite)
  currentDate.value = new Date(d.getFullYear(), d.getMonth(), 1)
  const dateStr = visite.date_visite.slice(0, 10)
  const cell = calendarCells.value.find(c => c.date === dateStr)
  if (cell) selectedDay.value = cell
}

// ── Helpers ────────────────────────────────────────────────────────────────
function formatTime(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}
function formatDayLabel(dateStr: string): string {
  if (!dateStr) return ''
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}
function formatDayShort(iso: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('fr-FR', { weekday: 'short' })
}
function truncate(s: string | null, n: number): string {
  if (!s) return ''
  return s.length > n ? s.slice(0, n) + '…' : s
}
function statutLabel(s: string): string {
  return { planifiee: 'Planifiée', confirmee: 'Confirmée', annulee: 'Annulée', rapport_soumis: 'Rapport soumis' }[s] ?? s
}
function visiteBadgeClass(s: string): string {
  if (s === 'planifiee')     return 'bg-purple-100 text-purple-700'
  if (s === 'confirmee')     return 'bg-blue-100 text-blue-700'
  if (s === 'rapport_soumis') return 'bg-green-100 text-green-700'
  return 'bg-gray-100 text-gray-500'
}
function visiteCardClass(s: string): string {
  if (s === 'planifiee')     return 'border-purple-200 bg-purple-50'
  if (s === 'confirmee')     return 'border-blue-200 bg-blue-50'
  if (s === 'rapport_soumis') return 'border-green-200 bg-green-50'
  return 'border-gray-200 bg-gray-50'
}

onMounted(() => {
  // Si des données existent déjà (navigation retour), rafraîchir silencieusement
  const hasCachedData = visites.value.length > 0
  loadVisites(hasCachedData)
  pollTimer = setInterval(() => loadVisites(true), 30_000)
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
  document.removeEventListener('visibilitychange', onVisibilityChange)
})

function onVisibilityChange() {
  if (document.visibilityState === 'visible') loadVisites(true)
}

// Bus → écouter ET émettre
const { on: onBus, emit: emitBus } = useRefreshBus()
onBus('visites', () => loadVisites(true))
</script>
