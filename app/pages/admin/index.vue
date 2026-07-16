<template>
  <div class="p-8 pb-16">
    <!-- Page Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-extrabold text-[#1A56A0] tracking-tight">Dashboard Administrateur</h1>
        <p class="text-sm text-gray-400 mt-1">Vue en temps réel de la plateforme ImmoPro</p>
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
      <div v-for="i in 6" :key="i" class="animate-pulse bg-gray-100 h-24 rounded-2xl" />
    </div>

    <!-- KPI Cards Row -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
      <div
        v-for="kpi in kpiCards"
        :key="kpi.id"
        class="bg-white p-5 rounded-[16px] shadow-[0_4px_20px_rgba(26,86,160,0.08)] border border-gray-100 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between mb-1">
          <p class="text-sm text-[#888888] font-medium">{{ kpi.label }}</p>
          <span class="material-symbols-outlined text-[18px]" :class="kpi.iconClass">{{ kpi.icon }}</span>
        </div>
        <h3 class="text-2xl font-bold text-[#1A56A0]">{{ kpi.value }}</h3>
        <p :class="['text-xs mt-2 flex items-center gap-1', kpi.trendClass]">
          <span class="material-symbols-outlined text-sm">{{ kpi.trendIcon }}</span>
          {{ kpi.trend }}
        </p>
      </div>
    </div>

    <!-- Charts & Validations Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      <!-- Biens récents en attente -->
      <div class="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-bold text-[#1A56A0]">Biens en attente de vérification</h2>
          <span class="text-xs text-gray-400 bg-orange-50 text-orange-600 font-bold px-2 py-1 rounded-lg">
            {{ stats?.kpis?.biens_en_attente ?? 0 }} non assignés
          </span>
        </div>
        <div v-if="isLoading" class="space-y-3">
          <div v-for="i in 3" :key="i" class="animate-pulse h-14 bg-gray-100 rounded-xl" />
        </div>
        <div v-else-if="biensEnAttente.length === 0" class="text-center py-8 text-gray-400 text-sm">
          Aucun bien en attente
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="bien in biensEnAttente"
            :key="bien.id"
            class="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-10 rounded-lg bg-cover bg-center bg-gray-100 flex-shrink-0"
                :style="bien.photo ? { backgroundImage: `url('${bien.photo}')` } : {}"
              >
                <span v-if="!bien.photo" class="material-symbols-outlined text-gray-300 flex items-center justify-center h-full text-2xl">image_not_supported</span>
              </div>
              <div>
                <p class="text-xs font-bold truncate max-w-[180px]">{{ bien.titre }}</p>
                <p class="text-[10px] text-gray-400">{{ bien.client ?? '—' }} · {{ formatDate(bien.created_at) }}</p>
              </div>
            </div>
            <div class="flex gap-2 flex-shrink-0">
              <span class="px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-bold rounded-full">En attente</span>
            </div>
          </div>
        </div>
        <button class="w-full mt-4 py-2 border border-[#1A56A0] text-[#1A56A0] text-xs font-bold rounded-lg hover:bg-[#EBF4FB]">
          Voir tous les dossiers
        </button>
      </div>

      <!-- Répartition statuts -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
        <h2 class="text-lg font-bold text-[#1A56A0] mb-6">Répartition des biens</h2>
        <!-- Donut SVG -->
        <div class="relative w-40 h-40 mx-auto mb-6">
          <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path class="text-[#EBF4FB] stroke-current" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke-width="4" />
            <path
              v-if="donutPublies > 0"
              class="stroke-current text-[#1A56A0]"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none" :stroke-dasharray="`${donutPublies}, 100`" stroke-linecap="round" stroke-width="4"
            />
            <path
              v-if="donutEnCours > 0"
              class="stroke-current text-purple-400"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none" :stroke-dasharray="`${donutEnCours}, 100`" :stroke-dashoffset="`-${donutPublies}`" stroke-linecap="round" stroke-width="4"
            />
            <path
              v-if="donutRejetes > 0"
              class="stroke-current text-red-300"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none" :stroke-dasharray="`${donutRejetes}, 100`" :stroke-dashoffset="`-${donutPublies + donutEnCours}`" stroke-linecap="round" stroke-width="4"
            />
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-2xl font-bold text-[#1A56A0]">{{ totalBiens }}</span>
            <span class="text-[10px] text-gray-400 uppercase font-bold">Total</span>
          </div>
        </div>
        <div class="space-y-3 mt-auto">
          <div v-for="d in donutLegend" :key="d.label" class="flex items-center justify-between text-sm">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: d.color }" />
              <span class="text-gray-600 text-xs">{{ d.label }}</span>
            </div>
            <span class="font-bold text-xs text-gray-700">{{ d.value }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Agents Performance -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 class="text-lg font-bold text-[#1A56A0] mb-4">Performances des agents</h2>
        <div v-if="isLoading" class="space-y-3">
          <div v-for="i in 3" :key="i" class="animate-pulse h-10 bg-gray-100 rounded-lg" />
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="text-gray-400 border-b border-gray-100 text-xs">
                <th class="pb-3 font-semibold">Agent</th>
                <th class="pb-3 font-semibold text-center">Publiés</th>
                <th class="pb-3 font-semibold text-center">Total traités</th>
                <th class="pb-3 font-semibold text-right">Taux</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="agent in agentsPerf" :key="agent.id">
                <td class="py-3 flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-[#EBF4FB] flex items-center justify-center text-[#1A56A0] font-bold text-xs flex-shrink-0">
                    {{ agent.initials || '?' }}
                  </div>
                  <span class="font-medium text-xs truncate max-w-[120px]">{{ agent.name || 'Agent' }}</span>
                </td>
                <td class="py-3 text-center font-bold text-green-600">{{ agent.biens_publies }}</td>
                <td class="py-3 text-center text-gray-500">{{ agent.biens_total }}</td>
                <td class="py-3 text-right">
                  <span class="text-xs font-bold" :class="agent.biens_total > 0 ? 'text-[#1A56A0]' : 'text-gray-300'">
                    {{ agent.biens_total > 0 ? Math.round(agent.biens_publies / agent.biens_total * 100) + '%' : '—' }}
                  </span>
                </td>
              </tr>
              <tr v-if="agentsPerf.length === 0">
                <td colspan="4" class="py-6 text-center text-gray-400 text-xs">Aucun agent actif</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Résumé rapide -->
      <div class="bg-gradient-to-br from-[#003e7e] to-[#1a6bc4] p-6 rounded-2xl text-white flex flex-col gap-4">
        <h2 class="text-lg font-bold">Résumé plateforme</h2>
        <div class="grid grid-cols-2 gap-3">
          <div v-for="item in summaryItems" :key="item.label" class="bg-white/10 rounded-xl p-3">
            <p class="text-xs text-white/70 font-medium mb-1">{{ item.label }}</p>
            <p class="text-xl font-extrabold">{{ item.value }}</p>
          </div>
        </div>
        <div class="mt-auto pt-2 border-t border-white/10 text-[11px] text-white/50">
          Dernière actualisation : {{ lastUpdated }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '~/stores/auth/auth'

definePageMeta({ layout: 'admin' })

const authStore = useAuthStore()
const config    = useRuntimeConfig()
const apiBase   = config.public?.apiBase || 'http://localhost:8000/api'

// ── State ──────────────────────────────────────────────────────────────────
// useState persiste entre navigations → pas de skeleton au retour
const stats        = useState<any>('admin_dashboard_stats', () => null)
const isLoading    = ref(stats.value === null) // skeleton seulement si aucune donnée en cache
const lastUpdated  = ref('—')
let   pollTimer: ReturnType<typeof setInterval> | null = null

// ── Load stats ─────────────────────────────────────────────────────────────
async function loadStats(silent = false) {
  // Si on a déjà des données, on ne montre jamais le skeleton (refresh silencieux)
  if (!silent && stats.value === null) isLoading.value = true
  try {
    const data = await $fetch(`${apiBase}/admin/stats`, {
      headers: { Authorization: `Bearer ${authStore.token.value}` },
    })
    stats.value = (data as any).data
    lastUpdated.value = new Date().toLocaleTimeString('fr-FR')
  } catch (e) {
    console.error('Erreur chargement stats admin', e)
  } finally {
    isLoading.value = false
  }
}

// ── Derived data ───────────────────────────────────────────────────────────
const biensEnAttente = computed(() => stats.value?.biens_en_attente ?? [])
const agentsPerf     = computed(() => stats.value?.agents_perf ?? [])

const kpiCards = computed(() => {
  const k = stats.value?.kpis ?? {}
  return [
    { id: 1, label: 'Clients',      value: k.total_clients ?? '—',      icon: 'group',          iconClass: 'text-blue-400',   trend: 'Propriétaires inscrits',   trendIcon: 'person',          trendClass: 'text-gray-400' },
    { id: 2, label: 'Agents',       value: k.total_agents ?? '—',       icon: 'badge',          iconClass: 'text-purple-400', trend: 'Agents actifs',            trendIcon: 'verified',        trendClass: 'text-purple-500' },
    { id: 3, label: 'Publiés',      value: k.biens_publies ?? '—',      icon: 'check_circle',   iconClass: 'text-green-400',  trend: 'Annonces en ligne',        trendIcon: 'trending_up',     trendClass: 'text-green-600' },
    { id: 4, label: 'Non assignés', value: k.biens_en_attente ?? '—',   icon: 'pending',        iconClass: 'text-orange-400', trend: 'Urgence de traitement',    trendIcon: 'priority_high',   trendClass: 'text-orange-500' },
    { id: 5, label: 'En cours',     value: k.biens_en_cours ?? '—',     icon: 'autorenew',      iconClass: 'text-blue-400',   trend: 'Vérification en cours',    trendIcon: 'hourglass_top',   trendClass: 'text-blue-500' },
    { id: 6, label: 'Visites',      value: k.visites_total ?? '—',      icon: 'calendar_month', iconClass: 'text-indigo-400', trend: `${k.visites_planifiees ?? 0} à venir`, trendIcon: 'event', trendClass: 'text-indigo-500' },
  ]
})

const totalBiens = computed(() => {
  const k = stats.value?.kpis ?? {}
  return (k.biens_publies ?? 0) + (k.biens_en_attente ?? 0) + (k.biens_en_cours ?? 0) + (k.biens_rejetes ?? 0)
})

const donutPublies = computed(() => totalBiens.value > 0 ? Math.round((stats.value?.kpis?.biens_publies ?? 0) / totalBiens.value * 100) : 0)
const donutEnCours = computed(() => totalBiens.value > 0 ? Math.round(((stats.value?.kpis?.biens_en_attente ?? 0) + (stats.value?.kpis?.biens_en_cours ?? 0)) / totalBiens.value * 100) : 0)
const donutRejetes = computed(() => totalBiens.value > 0 ? Math.round((stats.value?.kpis?.biens_rejetes ?? 0) / totalBiens.value * 100) : 0)

const donutLegend = computed(() => [
  { label: 'Publiés',    value: stats.value?.kpis?.biens_publies ?? 0,   color: '#1A56A0' },
  { label: 'En attente', value: (stats.value?.kpis?.biens_en_attente ?? 0) + (stats.value?.kpis?.biens_en_cours ?? 0), color: '#a855f7' },
  { label: 'Rejetés',   value: stats.value?.kpis?.biens_rejetes ?? 0,   color: '#fca5a5' },
])

const summaryItems = computed(() => {
  const k = stats.value?.kpis ?? {}
  return [
    { label: 'Total utilisateurs', value: (k.total_clients ?? 0) + (k.total_agents ?? 0) },
    { label: 'Taux de publication', value: totalBiens.value > 0 ? Math.round((k.biens_publies ?? 0) / totalBiens.value * 100) + '%' : '—' },
    { label: 'Visites planifiées', value: k.visites_planifiees ?? 0 },
    { label: 'Dossiers urgents',   value: k.biens_en_attente ?? 0 },
  ]
})

// ── Helpers ────────────────────────────────────────────────────────────────
function formatDate(d: string | null): string {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}

onMounted(() => {
  loadStats(stats.value !== null)
  pollTimer = setInterval(() => loadStats(true), 30_000)
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
  document.removeEventListener('visibilitychange', onVisibilityChange)
})

function onVisibilityChange() {
  if (document.visibilityState === 'visible') loadStats(true)
}

// Écouter les events du bus → rafraîchissement immédiat sans skeleton
const { on } = useRefreshBus()
on('stats', () => loadStats(true))
on('biens', () => loadStats(true))
on('all',   () => loadStats(true))
</script>
