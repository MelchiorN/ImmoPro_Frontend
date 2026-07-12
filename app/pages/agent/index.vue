<template>
  <div class="p-6 flex gap-6">

    <!-- ── Colonne principale ── -->
    <div class="flex-1 space-y-6 min-w-0">

      <!-- Header dynamique -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold text-primary leading-tight">
            Bonjour{{ agentPrenom ? `, ${agentPrenom}` : '' }} 
          </h1>
          <p class="text-sm text-gray-400 mt-0.5">{{ todayLabel }} · Voici votre tableau de bord</p>
        </div>
      </div>

      <!-- KPI Row -->
      <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <!-- Skeleton -->
        <div v-if="isLoading" v-for="i in 4" :key="i" class="animate-pulse bg-white h-28 rounded-xl border border-gray-100" />

        <div
          v-else
          v-for="kpi in kpis"
          :key="kpi.label"
          class="bg-white p-5 rounded-xl border border-gray-100 shadow-[0_2px_12px_rgba(0,62,126,0.06)] hover:shadow-md transition-shadow"
        >
          <div class="flex justify-between items-start mb-3">
            <span class="text-gray-500 text-sm font-medium">{{ kpi.label }}</span>
            <div :class="`p-2 ${kpi.iconBg} rounded-lg`">
              <component :is="kpi.icon" :size="18" :class="kpi.iconColor" />
            </div>
          </div>
          <p class="text-3xl font-extrabold text-primary leading-none">{{ kpi.value }}</p>
          <div class="mt-2 flex items-center gap-1" :class="kpi.trendColor">
            <component :is="kpi.trendIcon" :size="13" />
            <span class="text-xs font-medium">{{ kpi.trend }}</span>
          </div>
        </div>
      </section>

      <!-- Tableau — Biens en cours (mes dossiers) -->
      <section class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 class="text-base font-bold text-primary">Mes dossiers en cours</h3>
          <NuxtLink
            to="/agent/check"
            class="text-primary text-sm font-medium flex items-center gap-1 hover:underline"
          >
            Tout voir <ArrowRight :size="14" />
          </NuxtLink>
        </div>

        <!-- Skeleton tableau -->
        <div v-if="isLoading" class="p-4 space-y-3">
          <div v-for="i in 3" :key="i" class="animate-pulse h-12 bg-gray-50 rounded-lg" />
        </div>

        <!-- Vide -->
        <div v-else-if="biensEnCours.length === 0" class="px-6 py-12 text-center">
          <Package :size="36" class="text-gray-200 mx-auto mb-3" />
          <p class="text-sm text-gray-400 font-medium">Aucun dossier en cours</p>
          <p class="text-xs text-gray-300 mt-1">Prenez en charge un bien depuis la liste des biens à vérifier.</p>
          <NuxtLink to="/agent/check" class="inline-block mt-3 px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:opacity-90">
            Voir les biens disponibles
          </NuxtLink>
        </div>

        <!-- Tableau -->
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wide">
              <tr>
                <th class="px-5 py-3">Bien</th>
                <th class="px-5 py-3">Propriétaire</th>
                <th class="px-5 py-3">Soumis le</th>
                <th class="px-5 py-3">Priorité</th>
                <th class="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="bien in biensEnCours"
                :key="bien.id"
                class="hover:bg-blue-50/30 transition-colors"
              >
                <!-- Bien -->
                <td class="px-5 py-3">
                  <div class="flex items-center gap-3">
                    <div class="w-14 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                      <img
                        v-if="bien.photo"
                        :src="bien.photo"
                        :alt="bien.titre"
                        class="w-full h-full object-cover"
                      />
                      <div v-else class="w-full h-full flex items-center justify-center">
                        <Building2 :size="16" class="text-gray-300" />
                      </div>
                    </div>
                    <div>
                      <p class="font-semibold text-gray-800 truncate max-w-[160px]">{{ bien.titre }}</p>
                      <p class="text-gray-400 text-xs truncate max-w-[160px]">{{ bien.adresse }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-3 text-gray-500 text-xs">
                  {{ bien.client?.nom ?? '—' }}
                </td>
                <td class="px-5 py-3 text-gray-400 text-xs">
                  {{ formatDate(bien.created_at) }}
                </td>
                <!-- Priorité -->
                <td class="px-5 py-3">
                  <span :class="`px-2.5 py-0.5 rounded-full text-xs font-bold ${priorityClass(bien.priorite)}`">
                    {{ priorityLabel(bien.priorite) }}
                  </span>
                </td>
                <!-- Actions -->
                <td class="px-5 py-3 text-right">
                  <NuxtLink
                    to="/agent/check"
                    class="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors inline-block"
                  >
                    Ouvrir
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Rapports en brouillon -->
      <section v-if="!isLoading && (stats?.kpis?.rapports_brouillons ?? 0) > 0"
        class="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4"
      >
        <div class="flex items-center gap-3">
          <div class="p-2 bg-amber-100 rounded-lg">
            <FileText :size="18" class="text-amber-600" />
          </div>
          <div>
            <p class="text-sm font-bold text-amber-800">
              {{ stats.kpis.rapports_brouillons }} rapport{{ stats.kpis.rapports_brouillons > 1 ? 's' : '' }} en brouillon
            </p>
            <p class="text-xs text-amber-600">Continuez la rédaction de vos rapports non soumis.</p>
          </div>
        </div>
        <NuxtLink
          to="/agent/reports"
          class="px-3 py-2 bg-amber-500 text-white rounded-lg text-xs font-bold hover:bg-amber-600 transition-colors whitespace-nowrap flex-shrink-0"
        >
          Voir les rapports
        </NuxtLink>
      </section>
    </div>

    <!-- ── Panneau droit ── -->
    <aside class="w-72 space-y-5 hidden xl:flex xl:flex-col shrink-0">

      <!-- Mini Calendrier -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div class="flex justify-between items-center mb-4">
          <h4 class="font-bold text-gray-800 text-sm capitalize">{{ miniCalLabel }}</h4>
          <div class="flex gap-1">
            <button class="p-1 hover:bg-gray-100 rounded transition-colors" @click="miniCalPrev">
              <ChevronLeft :size="14" />
            </button>
            <button class="p-1 hover:bg-gray-100 rounded transition-colors" @click="miniCalNext">
              <ChevronRight :size="14" />
            </button>
          </div>
        </div>

        <div class="grid grid-cols-7 gap-y-1 text-center text-[10px] text-gray-400 mb-2 font-semibold">
          <span v-for="d in ['L','M','M','J','V','S','D']" :key="d">{{ d }}</span>
        </div>

        <div class="grid grid-cols-7 gap-y-1 text-center text-xs">
          <span
            v-for="(day, i) in miniCalDays"
            :key="i"
            :class="[
              'relative flex items-center justify-center rounded-full w-6 h-6 mx-auto transition-colors',
              !day.current ? 'text-gray-300' :
              day.today    ? 'bg-primary text-white font-bold' :
              'text-gray-700 hover:bg-blue-50 cursor-pointer',
            ]"
          >
            {{ day.num }}
            <span
              v-if="day.hasVisite && !day.today"
              class="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-500 rounded-full"
            />
          </span>
        </div>

        <!-- Prochaines visites -->
        <div class="mt-4 pt-4 border-t border-gray-100">
          <h5 class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Prochaines visites</h5>

          <div v-if="isLoading" class="space-y-2">
            <div v-for="i in 2" :key="i" class="animate-pulse h-10 bg-gray-50 rounded-lg" />
          </div>

          <div v-else-if="upcomingVisites.length === 0" class="text-center py-3">
            <p class="text-[10px] text-gray-300">Aucune visite planifiée</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="visit in upcomingVisites"
              :key="visit.id"
              class="flex gap-3 cursor-pointer group"
              @click="navigateTo('/agent/calendar')"
            >
              <div :class="[
                'px-2 py-1 rounded-lg text-center min-w-[46px] transition-colors text-xs',
                isToday(visit.date_visite) ? 'bg-blue-50 text-primary' : 'bg-gray-50 text-gray-500',
                'group-hover:bg-primary group-hover:text-white'
              ]">
                <p class="font-bold">{{ formatTime(visit.date_visite) }}</p>
                <p class="text-[9px] font-bold uppercase">{{ formatDayShort(visit.date_visite) }}</p>
              </div>
              <div class="flex-1 overflow-hidden">
                <p class="text-xs font-bold truncate text-gray-800">{{ visit.bien_titre }}</p>
                <p class="text-[10px] text-gray-400 truncate">{{ visit.bien_adresse }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Carte performance -->
      <div class="bg-primary p-5 rounded-xl text-white relative overflow-hidden group cursor-pointer">
        <div class="absolute -right-6 -top-6 w-28 h-28 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
        <div class="relative z-10">
          <Award :size="28" class="mb-3 fill-white" />
          <p class="font-bold text-sm mb-1">Qualité de service</p>
          <p class="text-xs text-white/75 mb-1 leading-relaxed">
            <span v-if="stats?.kpis?.taux_validation !== null && stats?.kpis?.taux_validation !== undefined">
              <span class="text-xl font-extrabold text-white">{{ stats.kpis.taux_validation }}%</span>
              de validation sur vos biens traités.
            </span>
            <span v-else>Aucun dossier traité pour le moment.</span>
          </p>
          <p class="text-[11px] text-white/50 mb-4">
            {{ (stats?.kpis?.publies ?? 0) }} publiés · {{ (stats?.kpis?.en_cours ?? 0) }} en cours
          </p>
          <NuxtLink
            to="/agent/reports"
            class="block w-full py-2 bg-white text-primary rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors text-center"
          >
            Mes rapports
          </NuxtLink>
        </div>
      </div>

    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Package, CheckCircle2, CalendarCheck, Percent,
  TrendingUp, Check, Clock, AlertCircle,
  ChevronLeft, ChevronRight, ArrowRight, Award,
  Building2, FileText, RefreshCw,
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth/auth'

definePageMeta({ layout: 'agent' })

const authStore = useAuthStore()
const config    = useRuntimeConfig()
const apiBase   = config.public?.apiBase || 'http://localhost:8000/api'

// ── State ──────────────────────────────────────────────────────────────────
const stats         = ref<any>(null)
const isLoading     = ref(true)
const miniCalDate   = ref(new Date())

// ── Auth ───────────────────────────────────────────────────────────────────
const agentPrenom = computed(() => {
  const u = authStore.user?.value ?? authStore.user
  return (u as any)?.first_name ?? null
})

// ── Chargement ─────────────────────────────────────────────────────────────
async function loadAll() {
  isLoading.value = true
  try {
    const data = await $fetch(`${apiBase}/agent/stats`, {
      headers: { Authorization: `Bearer ${authStore.token.value}` },
    })
    stats.value = (data as any).data
  } catch (e) {
    console.error('Erreur stats agent', e)
  } finally {
    isLoading.value = false
  }
}

// ── KPIs dynamiques ────────────────────────────────────────────────────────
const kpis = computed(() => {
  const k = stats.value?.kpis ?? {}
  return [
    {
      label: 'Biens en cours',
      value: k.en_cours ?? '—',
      icon: Package, iconBg: 'bg-blue-50', iconColor: 'text-primary',
      trend: `${k.non_assigne ?? 0} en attente de prise en charge`,
      trendIcon: k.non_assigne > 0 ? AlertCircle : Check,
      trendColor: k.non_assigne > 0 ? 'text-orange-500' : 'text-gray-400',
    },
    {
      label: 'Biens publiés',
      value: k.publies ?? '—',
      icon: CheckCircle2, iconBg: 'bg-green-50', iconColor: 'text-green-600',
      trend: 'Dossiers validés et publiés',
      trendIcon: Check, trendColor: 'text-green-600',
    },
    {
      label: 'Visites planifiées',
      value: k.visites_planifiees ?? '—',
      icon: CalendarCheck, iconBg: 'bg-purple-50', iconColor: 'text-purple-600',
      trend: k.prochaine_visite ? `Prochaine à ${k.prochaine_visite}` : 'Aucune à venir',
      trendIcon: Clock, trendColor: 'text-gray-500',
    },
    {
      label: 'Taux de validation',
      value: k.taux_validation !== null && k.taux_validation !== undefined ? `${k.taux_validation}%` : '—',
      icon: Percent, iconBg: 'bg-blue-50', iconColor: 'text-primary',
      trend: k.taux_validation !== null ? 'Sur les dossiers traités' : 'Pas encore de données',
      trendIcon: k.taux_validation >= 80 ? TrendingUp : Check,
      trendColor: k.taux_validation >= 80 ? 'text-green-600' : 'text-gray-400',
    },
  ]
})

const biensEnCours    = computed(() => stats.value?.biens_en_cours ?? [])
const upcomingVisites = computed(() => stats.value?.upcoming_visites ?? [])

// ── Mini calendrier ────────────────────────────────────────────────────────
const miniCalLabel = computed(() =>
  miniCalDate.value.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
)
function miniCalPrev() {
  const d = new Date(miniCalDate.value)
  d.setMonth(d.getMonth() - 1)
  miniCalDate.value = d
}
function miniCalNext() {
  const d = new Date(miniCalDate.value)
  d.setMonth(d.getMonth() + 1)
  miniCalDate.value = d
}

const miniCalDays = computed(() => {
  const year  = miniCalDate.value.getFullYear()
  const month = miniCalDate.value.getMonth()
  const today = new Date()
  const firstDay = new Date(year, month, 1)
  let startDow = firstDay.getDay() - 1
  if (startDow < 0) startDow = 6
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  // Jours avec visites
  const visiteDates = new Set(
    upcomingVisites.value
      .map((v: any) => v.date_visite?.slice(0, 10))
      .filter(Boolean)
  )

  const cells: any[] = []
  for (let i = startDow - 1; i >= 0; i--) {
    cells.push({ num: daysInPrevMonth - i, current: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({
      num: d,
      current: true,
      today: today.getFullYear() === year && today.getMonth() === month && today.getDate() === d,
      hasVisite: visiteDates.has(dateStr),
    })
  }
  while (cells.length < 35) cells.push({ num: cells.length - daysInMonth - startDow + 1, current: false })
  return cells
})

// ── Helpers ────────────────────────────────────────────────────────────────
const todayLabel = computed(() =>
  new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
)

function formatDate(d: string | null): string {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}
function formatTime(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}
function formatDayShort(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  const today = new Date()
  if (d.toDateString() === today.toDateString()) return 'Auj.'
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1)
  if (d.toDateString() === tomorrow.toDateString()) return 'Dem.'
  return d.toLocaleDateString('fr-FR', { weekday: 'short' })
}
function isToday(iso: string | null): boolean {
  if (!iso) return false
  return new Date(iso).toDateString() === new Date().toDateString()
}

function priorityLabel(p: string | null): string {
  const map: Record<string, string> = { haute: 'Urgent', moyenne: 'Moyenne', basse: 'Faible' }
  return map[p ?? ''] ?? (p ?? 'Standard')
}
function priorityClass(p: string | null): string {
  if (p === 'haute')   return 'bg-red-100 text-red-700'
  if (p === 'moyenne') return 'bg-orange-100 text-orange-700'
  return 'bg-blue-50 text-primary'
}

onMounted(loadAll)
</script>
