<template>
  <div class="p-8 pb-16">

    <!-- ── En-tête ──────────────────────────────────────────────────────── -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-extrabold text-[#1A56A0] tracking-tight">Biens & Annonces</h1>
        <p class="text-sm text-gray-400 mt-1">Gestion de toutes les propriétés soumises sur la plateforme</p>
      </div>
    </div>

    <!-- ── KPI Cards ─────────────────────────────────────────────────────── -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div
        v-for="kpi in kpiCards" :key="kpi.key"
        @click="setStatutFilter(kpi.key)"
        :class="[
          'bg-white rounded-xl p-4 shadow-sm border-2 cursor-pointer transition-all flex items-center gap-3 select-none',
          activeStatut === kpi.key ? 'border-[#1A56A0] shadow-md' : 'border-transparent hover:border-gray-200'
        ]"
      >
        <div :class="['w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', kpi.bg]">
          <span :class="['material-symbols-outlined text-[22px]', kpi.color]">{{ kpi.icon }}</span>
        </div>
        <div>
          <p class="text-xs text-gray-400 font-medium">{{ kpi.label }}</p>
          <p class="text-2xl font-bold text-gray-800">{{ counts[kpi.key] ?? '—' }}</p>
        </div>
      </div>
    </div>

    <!-- ── Filtres ───────────────────────────────────────────────────────── -->
    <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-5">
      <div class="flex flex-wrap items-end gap-3">
        <div class="flex-1 min-w-[200px]">
          <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Recherche</label>
          <div class="relative">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
            <input v-model="search" @input="onSearchInput" type="text" placeholder="Titre, adresse..."
              class="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1A56A0]/20 focus:border-[#1A56A0] outline-none" />
          </div>
        </div>
        <div class="w-40">
          <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Statut</label>
          <select v-model="activeStatut" @change="load()" class="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-[#1A56A0]/20">
            <option value="">Tous</option>
            <option value="en_attente">En attente</option>
            <option value="en_cours">En cours</option>
            <option value="valide">Approuvés</option>
            <option value="publie">Publiés</option>
            <option value="rejete">Rejetés</option>
          </select>
        </div>
        <div class="w-48">
          <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Type</label>
          <select v-model="filterType" @change="load()" class="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-[#1A56A0]/20">
            <option value="">Tous les types</option>
            <option value="appartement">Appartement</option>
            <option value="maison">Maison</option>
            <option value="villa">Villa</option>
            <option value="terrain">Terrain</option>
            <option value="bureau_commerce">Bureau / Commerce</option>
            <option value="chambre_studio">Chambre / Studio</option>
          </select>
        </div>
      </div>
    </div>

    <!-- ── Liste en cards ────────────────────────────────────────────────── -->

    <!-- Skeleton -->
    <div v-if="isLoading" class="space-y-3">
      <div v-for="i in 5" :key="i" class="bg-white rounded-xl p-4 flex items-center gap-4 animate-pulse border border-gray-100">
        <div class="w-16 h-16 bg-gray-100 rounded-xl flex-shrink-0"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-gray-100 rounded w-1/3"></div>
          <div class="h-3 bg-gray-100 rounded w-1/4"></div>
        </div>
        <div class="h-6 w-20 bg-gray-100 rounded-full"></div>
        <div class="h-6 w-24 bg-gray-100 rounded-full"></div>
        <div class="flex gap-2"><div class="w-8 h-8 bg-gray-100 rounded-full"></div><div class="w-8 h-8 bg-gray-100 rounded-full"></div></div>
      </div>
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="bg-white rounded-xl p-12 text-center border border-gray-100">
      <span class="material-symbols-outlined text-red-300 text-5xl mb-3 block">error_outline</span>
      <p class="text-red-500 font-semibold">{{ error }}</p>
      <button @click="load()" class="mt-4 px-4 py-2 bg-[#1A56A0] text-white text-sm rounded-lg">Réessayer</button>
    </div>

    <!-- Tableau liste -->
    <div v-else-if="biens.length === 0" class="bg-white rounded-xl p-16 text-center border border-gray-100">
      <span class="material-symbols-outlined text-gray-200 text-5xl mb-3 block">inbox</span>
      <p class="text-gray-400 font-medium">Aucun bien trouvé.</p>
    </div>

    <div v-else class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-gray-50 text-gray-500 text-[11px] font-semibold uppercase tracking-wide">
            <tr>
              <th class="px-4 py-3 text-center">Bien</th>
              <th class="px-3 py-3 w-[200px] text-center">Propriétaire</th>
              <th class="px-3 py-3 w-[220px] text-center">Agent</th>
              <th class="px-3 py-3 w-[110px] text-center">Statut</th>
              <!-- <th class="px-3 py-3 w-[120px] text-center">Rapport</th> -->
              <th class="px-3 py-3 text-center w-[140px]">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="bien in biens" :key="bien.id" class="hover:bg-blue-50/30 transition-colors">
              <td class="px-4 py-3 text-center">
                <div class="flex items-center justify-center gap-3 min-w-0">
                  <div class="w-14 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                    <img v-if="bien.photo_principale" :src="bien.photo_principale" :alt="bien.titre" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <span class="material-symbols-outlined text-gray-300 text-[16px]">home</span>
                    </div>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-800 truncate max-w-[180px]">{{ bien.titre }}</p>
                    <p class="text-gray-400 text-xs truncate max-w-[180px]">{{ bien.adresse }}</p>
                    <div class="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span class="text-xs text-gray-500 capitalize">{{ formatType(bien.type_bien) }}</span>
                      <span class="text-gray-300">·</span>
                      <span :class="['text-xs font-bold', bien.type_transaction === 'vente' ? 'text-[#1A56A0]' : 'text-purple-600']">
                        {{ bien.type_transaction?.charAt(0).toUpperCase() + bien.type_transaction?.slice(1) }}
                      </span>
                      <span class="text-gray-300">·</span>
                      <span class="text-xs text-gray-500 font-medium">{{ formatPrix(bien.prix) }}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-3 py-3 text-gray-500 text-xs text-center">
                <div class="min-w-0">
                  <p class="font-medium text-gray-700 truncate">{{ bien.proprietaire?.first_name }} {{ bien.proprietaire?.last_name }}</p>
                  <p class="text-gray-400 truncate">{{ bien.proprietaire?.email }}</p>
                </div>
              </td>
              <td class="px-3 py-3 text-gray-500 text-xs text-center">
                <template v-if="bien.agent">
                  <div class="flex items-center justify-center gap-2">
                    <div class="w-7 h-7 rounded-full bg-[#EBF4FB] flex items-center justify-center shrink-0">
                      <span class="text-[#1A56A0] text-[10px] font-bold">{{ agentInitials(bien.agent) }}</span>
                    </div>
                    <div class="min-w-0">
                      <p class="font-medium text-gray-700 truncate">{{ bien.agent.first_name }} {{ bien.agent.last_name }}</p>
                      <p class="text-gray-400 truncate">{{ bien.agent.email }}</p>
                    </div>
                  </div>
                </template>
                <span v-else class="text-gray-300 italic">Non assigné</span>
              </td>
              <td class="px-3 py-3 text-center">
                <span :class="['px-2.5 py-1 rounded-full text-[11px] font-bold border whitespace-nowrap', bienStatutClass(bien.statut)]">
                  {{ bienStatutLabel(bien.statut) }}
                </span>
              </td>
              <!-- <td class="px-3 py-3 text-center">
                <button
                  v-if="bien.rapport"
                  @click="openRapport(bien.rapport.id)"
                  :title="rapportBadgeLabel(bien.rapport.statut)"
                  :class="['inline-flex items-center justify-center w-8 h-8 rounded-full border transition-all', rapportBadgeClass(bien.rapport.statut)]"
                >
                  <span class="material-symbols-outlined text-[15px]">{{ rapportBadgeIcon(bien.rapport.statut) }}</span>
                </button>
                <span v-else class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-400" title="Aucun rapport">
                  <span class="material-symbols-outlined text-[15px]">draft</span>
                </span>
              </td> -->
              <td class="px-3 py-3 text-center">
                <div class="flex items-center justify-center gap-1.5 whitespace-nowrap">
                  <button @click="openDetail(bien)"
                    class="w-8 h-8 rounded-full bg-blue-50 text-[#003e7e] flex items-center justify-center hover:bg-blue-100 transition-colors" title="Voir le détail">
                    <span class="material-symbols-outlined text-[17px]">visibility</span>
                  </button>
                  <button v-if="['en_attente','en_cours'].includes(bien.statut)"
                    type="button"
                    @click.stop.prevent="actionPublier(bien)"
                    class="w-8 h-8 rounded-full bg-green-50 text-green-700 flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors" title="Approuver">
                    <span class="material-symbols-outlined text-[17px]">check_circle</span>
                  </button>
                  <button v-if="['en_attente','en_cours'].includes(bien.statut)"
                    type="button"
                    @click.stop.prevent="actionRejeter(bien)"
                    class="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors" title="Rejeter">
                    <span class="material-symbols-outlined text-[17px]">cancel</span>
                  </button>
                  <button v-if="bien.statut === 'publie'"
                    @click="actionArchiver(bien)"
                    class="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors" title="Archiver">
                    <span class="material-symbols-outlined text-[17px]">archive</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── Pagination ─────────────────────────────────────────────────────── -->
    <div v-if="meta.last_page > 1" class="mt-4 flex items-center justify-between">
      <p class="text-xs text-gray-400">{{ pageStart }}–{{ pageEnd }} sur {{ meta.total }} biens</p>
      <div class="flex items-center gap-1.5">
        <button :disabled="meta.current_page <= 1" @click="goToPage(meta.current_page - 1)"
          class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white text-gray-400 disabled:opacity-30 transition-colors">
          <span class="material-symbols-outlined text-[20px]">chevron_left</span>
        </button>
        <button v-for="p in pagesToShow" :key="p" @click="goToPage(p)"
          :class="['w-8 h-8 rounded-lg text-xs font-bold transition-colors', meta.current_page === p ? 'bg-[#1A56A0] text-white' : 'bg-white hover:bg-gray-100 text-gray-500 border border-gray-200']">
          {{ p }}
        </button>
        <button :disabled="meta.current_page >= meta.last_page" @click="goToPage(meta.current_page + 1)"
          class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white text-gray-400 disabled:opacity-30 transition-colors">
          <span class="material-symbols-outlined text-[20px]">chevron_right</span>
        </button>
      </div>
    </div>

    <!-- ── Toast ─────────────────────────────────────────────────────────── -->
    <Transition name="toast">
      <div v-if="toast"
        :class="['fixed top-6 right-6 z-[60] flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg text-sm font-semibold',
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white']">
        <span class="material-symbols-outlined text-[20px]">{{ toast.type === 'success' ? 'check_circle' : 'error' }}</span>
        {{ toast.message }}
      </div>
    </Transition>

    <!-- ── Modal Rapport ──────────────────────────────────────────────────── -->
    <RapportAdminModal
      v-if="rapportModal.open"
      :rapport-id="rapportModal.rapportId"
      @close="rapportModal.open = false"
      @decided="onDecided"
    />

    <!-- ── Modal Détail Bien ──────────────────────────────────────────────── -->
    <BienDetailAdminModal
      v-if="detailModal.open"
      :bien-id="detailModal.bienId"
      @close="detailModal.open = false"
      @open-rapport="openRapport"
      @action-publier="actionPublier"
      @action-rejeter="actionRejeter"
      @action-archiver="actionArchiver"
      @refresh="refreshAfterAction"
    />

  </div>
</template>

<script setup lang="ts">
import Swal from 'sweetalert2'
import { useAdminBiensStore } from '~/stores/adminBiens'
import RapportAdminModal from '~/components/admin/RapportAdminModal.vue'
import BienDetailAdminModal from '~/components/admin/BienDetailAdminModal.vue'

definePageMeta({ layout: 'admin' })

const store = useAdminBiensStore()
const { biens, meta, counts, isLoading, error } = store

let pollTimer: ReturnType<typeof setInterval> | null = null

// ── Filtres ────────────────────────────────────────────────────────────────
const search = ref('')
const activeStatut = ref('')
const filterType = ref('')
let searchTimer: ReturnType<typeof setTimeout> | null = null

function onSearchInput() {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => load(), 400)
}

function setStatutFilter(key: string) {
  activeStatut.value = activeStatut.value === key ? '' : key
  load()
}

// ── Chargement ─────────────────────────────────────────────────────────────
async function load(page = 1, silent = false) {
  await store.fetchBiens({
    statut: activeStatut.value || undefined,
    type_bien: filterType.value || undefined,
    search: search.value || undefined,
    page,
  }, silent)
}

function goToPage(p: number) { load(p) }

// ── Pagination ─────────────────────────────────────────────────────────────
const pageStart = computed(() => meta.value.total === 0 ? 0 : (meta.value.current_page - 1) * meta.value.per_page + 1)
const pageEnd = computed(() => Math.min(meta.value.current_page * meta.value.per_page, meta.value.total))
const pagesToShow = computed(() => {
  const last = meta.value.last_page
  const cur = meta.value.current_page
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1)
  const pages: number[] = []
  for (let i = Math.max(1, cur - 2); i <= Math.min(last, cur + 2); i++) pages.push(i)
  if (pages[0] > 1) pages.unshift(1)
  if (pages[pages.length - 1] < last) pages.push(last)
  return pages
})

// ── KPI cards ──────────────────────────────────────────────────────────────
const kpiCards = [
  { key: 'en_attente', label: 'En attente', icon: 'schedule', bg: 'bg-orange-100', color: 'text-orange-600' },
  { key: 'en_cours', label: 'En cours', icon: 'autorenew', bg: 'bg-blue-100', color: 'text-blue-600' },
  { key: 'valide', label: 'Approuvés', icon: 'verified', bg: 'bg-teal-100', color: 'text-teal-600' },
  { key: 'publie', label: 'Publiés', icon: 'check_circle', bg: 'bg-green-100', color: 'text-green-600' },
  { key: 'rejete', label: 'Rejetés', icon: 'cancel', bg: 'bg-red-100', color: 'text-red-600' },
]

// ── Toast ──────────────────────────────────────────────────────────────────
const toast = ref<{ type: 'success' | 'error'; message: string } | null>(null)
function showToast(type: 'success' | 'error', message: string) {
  toast.value = { type, message }
  setTimeout(() => { toast.value = null }, 3500)
}

// ── Modal Rapport ──────────────────────────────────────────────────────────
const rapportModal = reactive<{ open: boolean; rapportId: string }>({ open: false, rapportId: '' })
function openRapport(id: string) { rapportModal.rapportId = id; rapportModal.open = true }
function onDecided(decision: string) {
  rapportModal.open = false
  showToast('success', decision === 'publier' ? 'Bien publié avec succès.' : 'Rapport rejeté. L\'agent a été notifié.')
  refreshAfterAction()
  emitBus('stats')
  emitBus('biens')
}

// ── Modal Détail ───────────────────────────────────────────────────────────
const detailModal = reactive<{ open: boolean; bienId: string }>({ open: false, bienId: '' })
function openDetail(bien: any) {
  detailModal.bienId = bien.id
  detailModal.open = true
}
async function refreshAfterAction() {
  await Promise.all([
    load(meta.value.current_page),
    store.fetchCounts(),
  ])
}

// ── Actions avec SweetAlert2 ───────────────────────────────────────────────
async function actionPublier(bien: any) {
  if (bien.rapport?.statut === 'soumis') {
    openRapport(bien.rapport.id)
    return
  }

  const result = await Swal.fire({
    title: 'Approuver ce bien ?',
    html: `<b>${bien.titre}</b> sera marqué comme approuvé. Le propriétaire pourra ensuite le publier.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Oui, approuver',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#16a34a',
    cancelButtonColor: '#6b7280',
    reverseButtons: true,
  })
  if (!result.isConfirmed) return

  const res = await store.updateStatut(bien.id, 'valide')
  if (res.success) {
    showToast('success', 'Bien approuvé. Le propriétaire peut maintenant le publier.')
    await refreshAfterAction()
    emitBus('stats')
    emitBus('biens')
  } else {
    Swal.fire({ icon: 'error', title: 'Erreur', text: res.message, confirmButtonColor: '#1A56A0' })
  }
}

async function actionRejeter(bien: any) {
  const result = await Swal.fire({
    title: 'Rejeter ce bien ?',
    html: `<b>${bien.titre}</b>`,
    input: 'textarea',
    inputLabel: 'Motif du rejet (obligatoire)',
    inputPlaceholder: 'Expliquez pourquoi ce bien est rejeté...',
    inputAttributes: { rows: '3' },
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Rejeter',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    reverseButtons: true,
    preConfirm: (note: string) => {
      if (!note?.trim()) {
        Swal.showValidationMessage('Le motif est obligatoire')
        return false
      }
      return note
    },
  })
  if (!result.isConfirmed) return

  const res = await store.updateStatut(bien.id, 'rejete', result.value)
  if (res.success) {
    showToast('success', 'Bien rejeté.')
    await refreshAfterAction()
    emitBus('stats')
    emitBus('biens')
  } else {
    Swal.fire({ icon: 'error', title: 'Erreur', text: res.message, confirmButtonColor: '#1A56A0' })
  }
}

async function actionArchiver(bien: any) {
  const result = await Swal.fire({
    title: 'Archiver ce bien ?',
    html: `<b>${bien.titre}</b> sera retiré de la liste publique.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Archiver',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#4b5563',
    cancelButtonColor: '#6b7280',
    reverseButtons: true,
  })
  if (!result.isConfirmed) return

  const res = await store.updateStatut(bien.id, 'archive')
  if (res.success) {
    showToast('success', 'Bien archivé.')
    await refreshAfterAction()
    emitBus('stats')
    emitBus('biens')
  } else {
    Swal.fire({ icon: 'error', title: 'Erreur', text: res.message, confirmButtonColor: '#1A56A0' })
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────
const typeLabels: Record<string, string> = {
  appartement: 'Appartement', maison: 'Maison', villa: 'Villa',
  terrain: 'Terrain', bureau_commerce: 'Bureau / Commerce', chambre_studio: 'Chambre / Studio',
}
function formatType(t: string) { return typeLabels[t] ?? t }
function formatPrix(p: number) {
  if (p === null || p === undefined || p === 0) return '—'
  const amount = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(p)
  return `${amount} FCFA`
}
function agentInitials(agent: any) {
  return `${agent?.first_name?.[0] ?? ''}${agent?.last_name?.[0] ?? ''}`.toUpperCase() || '?'
}
function bienStatutClass(s: string) {
  if (s === 'en_attente') return 'bg-orange-50 text-orange-700 border-orange-200'
  if (s === 'en_cours') return 'bg-blue-50 text-blue-700 border-blue-200'
  if (s === 'valide') return 'bg-teal-50 text-teal-700 border-teal-200'
  if (s === 'publie') return 'bg-green-50 text-green-700 border-green-200'
  if (s === 'rejete') return 'bg-red-50 text-red-700 border-red-200'
  if (s === 'archive') return 'bg-gray-100 text-gray-500 border-gray-200'
  return 'bg-gray-100 text-gray-500 border-gray-200'
}
function bienStatutLabel(s: string) {
  const m: Record<string, string> = {
    en_attente: 'EN ATTENTE',
    en_cours: 'EN COURS',
    valide: 'APPROUVÉ',
    publie: 'PUBLIÉ',
    rejete: 'REJETÉ',
    archive: 'ARCHIVÉ',
  }
  return m[s] ?? s.toUpperCase()
}
function rapportBadgeClass(s: string) {
  if (s === 'soumis') return 'bg-orange-50 text-orange-700 border-orange-300 hover:bg-orange-100'
  if (s === 'valide') return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
  if (s === 'rejete') return 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
  return 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
}
function rapportBadgeIcon(s: string) {
  if (s === 'soumis') return 'pending'
  if (s === 'valide') return 'task_alt'
  if (s === 'rejete') return 'rate_review'
  return 'draft'
}

// ── Init ───────────────────────────────────────────────────────────────────
onMounted(() => {
  // Si des données existent déjà (navigation retour), rafraîchir silencieusement
  const hasCachedData = biens.value.length > 0
  load(meta.value.current_page, hasCachedData)
  store.fetchCounts()
  pollTimer = setInterval(() => {
    store.fetchCounts()
    load(meta.value.current_page, true)
  }, 30_000)
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
  document.removeEventListener('visibilitychange', onVisibilityChange)
})

function onVisibilityChange() {
  if (document.visibilityState === 'visible') {
    store.fetchCounts()
    load(meta.value.current_page, true)
  }
}

// Écouter les events du bus → rafraîchissement immédiat sans skeleton
const { on: onBus, emit: emitBus } = useRefreshBus()
onBus('biens', () => refreshAfterAction())
onBus('stats', () => store.fetchCounts())
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(-12px); }
</style>
