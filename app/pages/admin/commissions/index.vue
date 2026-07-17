<template>
  <div class="p-8 pb-16">

    <!-- ── En-tête ── -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-extrabold text-[#1A56A0] tracking-tight flex items-center gap-3">
          <TrendingUp :size="32" class="text-[#1A56A0]" />
          Commissions & Reversements
        </h1>
        <p class="text-sm text-gray-400 mt-1">Suivi financier de la plateforme ImmoPro</p>
      </div>
      <button @click="store.fetchAll()" :disabled="store.isLoading.value"
        class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
        <RefreshCw :size="15" :class="store.isLoading.value ? 'animate-spin' : ''" />
        Actualiser
      </button>
    </div>

    <!-- ── KPI Cards ── -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-8">
      <!-- Total perçu -->
      <div class="xl:col-span-2 bg-gradient-to-br from-[#003e7e] to-[#1A56A0] rounded-2xl p-5 text-white shadow-lg">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm font-medium text-blue-100">Total commissions perçues</p>
          <Banknote :size="20" class="text-blue-200" />
        </div>
        <div v-if="store.isLoading.value" class="h-8 bg-white/20 animate-pulse rounded-lg w-2/3" />
        <h3 v-else class="text-2xl font-extrabold">{{ formatMontant(store.stats.value.total_percu) }}</h3>
        <p class="text-xs text-blue-200 mt-1">Depuis le lancement</p>
      </div>

      <!-- Ce mois -->
      <div class="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Ce mois</p>
          <CalendarDays :size="16" class="text-[#1A56A0]" />
        </div>
        <div v-if="store.isLoading.value" class="h-7 bg-gray-100 animate-pulse rounded w-3/4" />
        <h3 v-else class="text-xl font-extrabold text-[#1A56A0]">{{ formatMontant(store.stats.value.percu_ce_mois) }}</h3>
        <p class="text-[11px] text-gray-400 mt-1">Mois précédent : {{ formatMontant(store.stats.value.percu_mois_dernier) }}</p>
      </div>

      <!-- Locations actives -->
      <div class="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Locations actives</p>
          <Home :size="16" class="text-green-500" />
        </div>
        <div v-if="store.isLoading.value" class="h-7 bg-gray-100 animate-pulse rounded w-1/2" />
        <h3 v-else class="text-xl font-extrabold text-green-600">{{ store.stats.value.nb_locations_actives ?? 0 }}</h3>
        <p class="text-[11px] text-gray-400 mt-1">Contrats en cours</p>
      </div>

      <!-- Reversements en attente -->
      <div class="xl:col-span-2 bg-white border-2 border-[#1A56A0]/20 rounded-2xl p-5 shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <p class="text-xs font-semibold text-[#1A56A0] uppercase tracking-wider">Reversements en attente</p>
          <ArrowLeftRight :size="16" class="text-[#1A56A0]" />
        </div>
        <div v-if="store.isLoading.value" class="h-7 bg-gray-100 animate-pulse rounded w-2/3" />
        <h3 v-else class="text-xl font-extrabold text-[#1A56A0]">{{ formatMontant(store.stats.value.reversements_en_attente) }}</h3>
        <p class="text-[11px] text-[#1A56A0]/60 mt-1">{{ store.stats.value.nb_reversements_en_attente ?? 0 }} propriétaire(s) à rembourser</p>
      </div>
    </div>

    <!-- ── Onglets ── -->
    <div class="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
      <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
        :class="['px-5 py-2 rounded-lg text-sm font-semibold transition-all',
          activeTab === tab.id
            ? 'bg-white text-[#1A56A0] shadow-sm'
            : 'text-gray-500 hover:text-gray-700']">
        {{ tab.label }}
        <span v-if="tab.badge" class="ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full"
          :class="activeTab === tab.id ? 'bg-blue-100 text-[#1A56A0]' : 'bg-gray-200 text-gray-500'">
          {{ tab.badge }}
        </span>
      </button>
    </div>

    <!-- ── Tableau Commissions ── -->
    <div v-if="activeTab === 'commissions'" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
        <h2 class="font-bold text-gray-800 flex items-center gap-2">
          <Coins :size="18" class="text-[#1A56A0]" />
          Historique des commissions
        </h2>
        <span class="text-xs text-gray-400">{{ store.commissions.value.length }} entrées</span>
      </div>

      <!-- Skeleton -->
      <div v-if="store.isLoading.value" class="divide-y divide-gray-50">
        <div v-for="i in 5" :key="i" class="px-6 py-4 flex items-center gap-4 animate-pulse">
          <div class="h-4 bg-gray-100 rounded w-1/4" />
          <div class="h-4 bg-gray-100 rounded w-1/5" />
          <div class="h-4 bg-gray-100 rounded w-1/5 ml-auto" />
        </div>
      </div>

      <!-- Vide -->
      <div v-else-if="store.commissions.value.length === 0" class="py-16 text-center">
        <Coins :size="48" class="text-gray-200 mx-auto mb-3" />
        <p class="text-gray-400 font-medium">Aucune commission enregistrée</p>
        <p class="text-xs text-gray-300 mt-1">Elles apparaîtront ici dès qu'une location sera confirmée</p>
      </div>

      <!-- Tableau -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50/80">
            <tr class="text-xs text-gray-400 font-semibold uppercase tracking-wider">
              <th class="px-6 py-3 text-left">Bien loué</th>
              <th class="px-6 py-3 text-left">Locataire</th>
              <th class="px-6 py-3 text-center">Durée</th>
              <th class="px-6 py-3 text-center">Taux</th>
              <th class="px-6 py-3 text-right">Commission</th>
              <th class="px-6 py-3 text-right">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="c in store.commissions.value" :key="c.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4">
                <p class="font-semibold text-gray-800 text-xs truncate max-w-[200px]">{{ c.bien?.titre ?? '—' }}</p>
                <p class="text-[11px] text-gray-400 truncate max-w-[200px]">{{ c.bien?.adresse ?? '' }}</p>
              </td>
              <td class="px-6 py-4 text-xs text-gray-600">{{ c.locataire ?? '—' }}</td>
              <td class="px-6 py-4 text-center">
                <span class="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold">
                  {{ c.duree_mois }} mois
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <span class="px-2 py-1 bg-[#EBF4FB] text-[#1A56A0] rounded-full text-[10px] font-bold">
                  {{ c.pourcentage_applique }}%
                </span>
              </td>
              <td class="px-6 py-4 text-right font-extrabold text-[#1A56A0]">
                {{ formatMontant(c.montant_gagne) }}
              </td>
              <td class="px-6 py-4 text-right text-xs text-gray-400">{{ formatDate(c.date_prelevement) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── Tableau Reversements ── -->
    <div v-if="activeTab === 'reversements'" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
        <h2 class="font-bold text-gray-800 flex items-center gap-2">
          <ArrowLeftRight :size="18" class="text-[#1A56A0]" />
          Reversements aux propriétaires
        </h2>
        <!-- Filtre statut -->
        <div class="flex gap-2">
          <button v-for="f in filtresStatut" :key="f.val" @click="filtreStatut = f.val"
            :class="['px-3 py-1.5 rounded-lg text-xs font-bold transition-colors',
              filtreStatut === f.val ? f.activeClass : 'bg-gray-100 text-gray-500 hover:bg-gray-200']">
            {{ f.label }}
          </button>
        </div>
      </div>

      <!-- Skeleton -->
      <div v-if="store.isLoading.value" class="divide-y divide-gray-50">
        <div v-for="i in 5" :key="i" class="px-6 py-4 flex items-center gap-4 animate-pulse">
          <div class="h-4 bg-gray-100 rounded w-1/4" />
          <div class="h-4 bg-gray-100 rounded w-1/5" />
          <div class="h-4 bg-gray-100 rounded w-1/5 ml-auto" />
        </div>
      </div>

      <!-- Vide -->
      <div v-else-if="reversementsFiltres.length === 0" class="py-16 text-center">
        <ArrowLeftRight :size="48" class="text-gray-200 mx-auto mb-3" />
        <p class="text-gray-400 font-medium">Aucun reversement {{ filtreStatut !== 'tous' ? filtreStatut : '' }}</p>
      </div>

      <!-- Tableau -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50/80">
            <tr class="text-xs text-gray-400 font-semibold uppercase tracking-wider">
              <th class="px-6 py-3 text-left">Propriétaire</th>
              <th class="px-6 py-3 text-left">Bien concerné</th>
              <th class="px-6 py-3 text-right">Montant à reverser</th>
              <th class="px-6 py-3 text-center">Statut</th>
              <th class="px-6 py-3 text-center">Date virement</th>
              <th class="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="r in reversementsFiltres" :key="r.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4">
                <p class="font-semibold text-gray-800 text-xs">{{ r.proprietaire?.nom ?? '—' }}</p>
                <p class="text-[11px] text-gray-400">{{ r.proprietaire?.email ?? '' }}</p>
              </td>
              <td class="px-6 py-4 text-xs text-gray-600 max-w-[200px]">
                <p class="truncate font-medium">{{ r.bien?.titre ?? '—' }}</p>
                <p class="text-[11px] text-gray-400 truncate">{{ r.bien?.adresse ?? '' }}</p>
              </td>
              <td class="px-6 py-4 text-right font-extrabold text-[#1A56A0]">
                {{ formatMontant(r.montant_a_reverser) }}
              </td>
              <td class="px-6 py-4 text-center">
                <span :class="['px-2.5 py-1 rounded-full text-[10px] font-bold',
                  r.statut === 'traite'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-blue-50 text-[#1A56A0] border border-blue-200']">
                  <CheckCircle2 v-if="r.statut === 'traite'" :size="10" class="inline mr-0.5" />
                  <Clock v-else :size="10" class="inline mr-0.5" />
                  {{ r.statut === 'traite' ? 'Traité' : 'En attente' }}
                </span>
              </td>
              <td class="px-6 py-4 text-center text-xs text-gray-400">
                {{ r.date_paiement ? formatDate(r.date_paiement) : '—' }}
              </td>
              <td class="px-6 py-4 text-center">
                <button v-if="r.statut === 'en_attente'"
                  @click="handleTraiter(r)"
                  :disabled="r._loading"
                  class="px-3 py-1.5 bg-green-600 text-white text-[11px] font-bold rounded-lg hover:bg-green-700 disabled:opacity-60 transition-colors flex items-center gap-1 mx-auto">
                  <Loader2 v-if="r._loading" :size="11" class="animate-spin" />
                  <CheckCircle2 v-else :size="11" />
                  Virement effectué
                </button>
                <span v-else class="text-xs text-gray-300">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast"
        :class="['fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg text-sm font-semibold',
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white']">
        <component :is="toast.type === 'success' ? CheckCircle2 : XCircle" :size="18" />
        {{ toast.message }}
      </div>
    </Transition>

  </div>
</template>

<script setup>
import {
  TrendingUp, Banknote, CalendarDays, Home,
  Coins, ArrowLeftRight, RefreshCw, CheckCircle2, XCircle,
  Loader2, Clock,
} from 'lucide-vue-next'
import { useCommissionsStore } from '~/stores/commissions'

definePageMeta({ layout: 'admin' })

const store = useCommissionsStore()

// ── State local ────────────────────────────────────────────────────────────
const activeTab    = ref('commissions')
const filtreStatut = ref('tous')
const toast        = ref(null)

// ── Onglets ────────────────────────────────────────────────────────────────
const tabs = computed(() => [
  { id: 'commissions',  label: 'Commissions', badge: store.commissions.value.length || null },
  {
    id: 'reversements',
    label: 'Reversements',
    badge: store.reversements.value.filter(r => r.statut === 'en_attente').length || null,
  },
])

// ── Filtres reversements ───────────────────────────────────────────────────
const filtresStatut = [
  { val: 'tous',       label: 'Tous',        activeClass: 'bg-[#1A56A0] text-white' },
  { val: 'en_attente', label: 'En attente',  activeClass: 'bg-blue-500 text-white' },
  { val: 'traite',     label: 'Traités',     activeClass: 'bg-green-600 text-white' },
]

const reversementsFiltres = computed(() =>
  filtreStatut.value === 'tous'
    ? store.reversements.value
    : store.reversements.value.filter(r => r.statut === filtreStatut.value)
)

// ── Actions ────────────────────────────────────────────────────────────────
async function handleTraiter(reversement) {
  const res = await store.traiterReversement(reversement.id)
  showToast(res.success ? 'success' : 'error', res.message)
}

// ── Helpers ────────────────────────────────────────────────────────────────
function formatMontant(val) {
  if (!val && val !== 0) return '—'
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(val) + ' FCFA'
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function showToast(type, message) {
  toast.value = { type, message }
  setTimeout(() => { toast.value = null }, 3500)
}

// ── Init ───────────────────────────────────────────────────────────────────
onMounted(() => store.fetchAll())
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to       { opacity: 0; transform: translateY(-12px) scale(0.95); }
</style>
