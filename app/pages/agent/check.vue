<template>
  <div class="p-6 space-y-6">

    <!-- ── En-tête de section ── -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-[#003e7e]">Biens à vérifier</h1>
        <p class="text-gray-500 text-sm mt-1">Gérez les inspections et la validation des nouveaux mandats.</p>
      </div>
      <button
        class="self-start flex items-center gap-2 px-4 py-2 bg-[#003e7e] text-white rounded-xl font-semibold text-sm hover:opacity-90 active:scale-95 transition-all shadow-sm"
        @click="refreshAll"
      >
        <span class="material-symbols-outlined text-[18px]">refresh</span>
        Actualiser
      </button>
    </div>

    <!-- ── Toast notification ── -->
    <Transition name="toast">
      <div
        v-if="toast"
        :class="[
          'fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg text-sm font-semibold',
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white',
        ]"
      >
        <span class="material-symbols-outlined text-[20px]">
          {{ toast.type === 'success' ? 'check_circle' : 'error' }}
        </span>
        {{ toast.message }}
      </div>
    </Transition>

    <!-- ── Filtres & Onglets ── -->
    <div class="bg-white rounded-xl p-4 shadow-[0_4px_12px_rgba(26,86,160,0.05)]">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

        <!-- Onglets avec compteurs -->
        <div class="flex items-center gap-2 border-b lg:border-none border-gray-200 pb-4 lg:pb-0 flex-wrap">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="switchTab(tab.key)"
            :class="[
              'flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm transition-all',
              activeTab === tab.key
                ? 'bg-[#003e7e] text-white'
                : 'text-gray-500 hover:bg-gray-100',
            ]"
          >
            {{ tab.label }}
            <span
              :class="[
                'inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold',
                activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600',
              ]"
            >
              {{ tabCount(tab.key) }}
            </span>
          </button>
        </div>

        <!-- Filtres -->
        <div class="flex flex-wrap items-center gap-2">
          <select
            v-model="filterType"
            @change="applyFilters"
            class="px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-500 cursor-pointer hover:bg-gray-100 transition-colors outline-none"
          >
            <option value="">Tous types</option>
            <option value="appartement">Appartement</option>
            <option value="maison">Maison</option>
            <option value="villa">Villa</option>
            <option value="terrain">Terrain</option>
            <option value="bureau_commerce">Bureau / Commerce</option>
          </select>
          <div class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-500 cursor-pointer hover:bg-gray-100 transition-colors">
            <span class="material-symbols-outlined text-[16px]">filter_list</span>
            <span>Priorité</span>
          </div>
          <div class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-500 cursor-pointer hover:bg-gray-100 transition-colors">
            <span>Date</span>
            <span class="material-symbols-outlined text-[16px]">calendar_today</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Tableau ── -->
    <div class="bg-white rounded-xl shadow-[0_4px_12px_rgba(26,86,160,0.05)] overflow-hidden">

      <!-- Skeleton loader -->
      <div v-if="isLoading" class="p-6 space-y-4">
        <div v-for="i in 4" :key="i" class="flex items-center gap-4 animate-pulse">
          <div class="w-14 h-14 bg-gray-100 rounded-xl flex-shrink-0"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-100 rounded w-1/3"></div>
            <div class="h-3 bg-gray-100 rounded w-1/4"></div>
          </div>
          <div class="h-6 w-16 bg-gray-100 rounded-full"></div>
        </div>
      </div>

      <!-- Erreur -->
      <div v-else-if="error" class="p-12 text-center">
        <span class="material-symbols-outlined text-red-300 text-5xl mb-3 block">error_outline</span>
        <p class="text-red-500 font-semibold">{{ error }}</p>
        <button @click="refreshAll" class="mt-4 px-4 py-2 bg-[#003e7e] text-white text-sm rounded-lg">Réessayer</button>
      </div>

      <!-- Table -->
      <template v-else>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100">
                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Bien</th>
                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Propriétaire</th>
                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Soumis le</th>
                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Statut</th>
                <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="bien in biens"
                :key="bien.id"
                class="hover:bg-blue-50/30 transition-colors group cursor-pointer"
              >
                <!-- Bien -->
                <td class="px-6 py-5">
                  <div class="flex items-center gap-4">
                    <div class="relative h-14 w-14 rounded-xl overflow-hidden shadow-sm flex-shrink-0 bg-gray-100">
                      <img
                        v-if="thumbnailUrl(bien)"
                        :src="thumbnailUrl(bien)"
                        :alt="bien.titre"
                        class="h-full w-full object-cover"
                      />
                      <div v-else class="h-full w-full flex items-center justify-center">
                        <span class="material-symbols-outlined text-gray-300 text-3xl">home</span>
                      </div>
                    </div>
                    <div>
                      <p class="font-semibold text-[#003e7e] text-[15px] leading-tight">{{ bien.titre }}</p>
                      <p class="text-sm text-gray-400 line-clamp-1 mt-0.5">{{ bien.adresse }}</p>
                    </div>
                  </div>
                </td>

                <!-- Propriétaire -->
                <td class="px-6 py-5">
                  <p class="font-semibold text-sm text-gray-800">
                    {{ bien.proprietaire?.first_name }} {{ bien.proprietaire?.last_name }}
                  </p>
                  <p class="text-xs text-gray-400">{{ bien.proprietaire?.email }}</p>
                </td>

                <!-- Type -->
                <td class="px-6 py-5 text-sm text-gray-600 capitalize">
                  {{ formatType(bien.type_bien) }}
                </td>

                <!-- Soumis le -->
                <td class="px-6 py-5 text-sm text-gray-600">
                  {{ formatDate(bien.created_at) }}
                </td>

                <!-- Statut -->
                <td class="px-6 py-5">
                  <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border', statutClass(bien)]">
                    {{ statutLabel(bien) }}
                  </span>
                </td>

                <!-- Actions -->
                <td class="px-6 py-5 text-right">

                  <!-- Onglet "en_cours" : publier ou rejeter -->
                  <div v-if="activeTab === 'en_cours'" class="flex items-center justify-end gap-2">
                    <button
                      class="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 font-bold text-xs flex items-center gap-1.5 border border-green-200 hover:bg-green-600 hover:text-white transition-colors"
                      :disabled="isSubmitting === bien.id"
                      @click="publier(bien.id)"
                    >
                      <span class="material-symbols-outlined text-[15px]">check_circle</span>
                      Publier
                    </button>
                    <button
                      class="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 font-bold text-xs flex items-center gap-1.5 border border-red-200 hover:bg-red-600 hover:text-white transition-colors"
                      :disabled="isSubmitting === bien.id"
                      @click="openRejectModal(bien)"
                    >
                      <span class="material-symbols-outlined text-[15px]">cancel</span>
                      Rejeter
                    </button>
                    <button
                      class="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                      title="Libérer ce bien"
                      @click="liberer(bien.id)"
                    >
                      <span class="material-symbols-outlined text-[18px]">undo</span>
                    </button>
                  </div>

                  <!-- Onglet "non_assigne" : prendre en charge (hover) -->
                  <div
                    v-else-if="activeTab === 'non_assigne'"
                    class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <button
                      class="px-3 py-1.5 rounded-lg bg-[#003e7e] text-white font-bold text-xs flex items-center gap-1.5 hover:opacity-90 transition-opacity disabled:opacity-50"
                      :disabled="isClaiming"
                      @click="prendre(bien.id)"
                    >
                      <span class="material-symbols-outlined text-[15px]">assignment_turned_in</span>
                      Prendre en charge
                    </button>
                    <button
                      class="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                      title="Documents"
                      @click.stop
                    >
                      <span class="material-symbols-outlined text-[20px]">description</span>
                    </button>
                  </div>

                  <!-- Onglet "termine" : lecture seule -->
                  <div v-else class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      class="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                      title="Voir le détail"
                    >
                      <span class="material-symbols-outlined text-[20px]">visibility</span>
                    </button>
                  </div>

                </td>
              </tr>

              <!-- État vide -->
              <tr v-if="!isLoading && biens.length === 0">
                <td colspan="6" class="px-6 py-16 text-center">
                  <span class="material-symbols-outlined text-gray-200 text-5xl mb-3 block">inbox</span>
                  <p class="text-gray-400 font-medium">Aucun bien dans cet onglet.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-3 bg-gray-50 flex items-center justify-between border-t border-gray-100 flex-wrap gap-4">
          <p class="text-xs text-gray-400">
            Affichage de {{ pageStart }} à {{ pageEnd }} sur {{ meta.total }} biens
          </p>
          <div class="flex items-center gap-2">
            <button
              class="p-2 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-40 transition-colors"
              :disabled="meta.current_page <= 1"
              @click="goToPage(meta.current_page - 1)"
            >
              <span class="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <div class="flex items-center gap-1">
              <button
                v-for="page in meta.last_page"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'w-8 h-8 rounded-lg font-bold text-xs transition-colors',
                  meta.current_page === page
                    ? 'bg-[#003e7e] text-white'
                    : 'hover:bg-gray-100 text-gray-500',
                ]"
              >
                {{ page }}
              </button>
            </div>
            <button
              class="p-2 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-40 transition-colors"
              :disabled="meta.current_page >= meta.last_page"
              @click="goToPage(meta.current_page + 1)"
            >
              <span class="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>
      </template>
    </div>

    <!-- ── Actions rapides ── -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div class="bg-white p-6 rounded-xl shadow-[0_4px_12px_rgba(26,86,160,0.05)] flex items-center gap-4 hover:scale-[1.02] transition-transform cursor-pointer">
        <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <span class="material-symbols-outlined text-[#003e7e] text-[22px]">event_available</span>
        </div>
        <div>
          <h3 class="font-bold text-base text-gray-800">Planifier visite</h3>
          <p class="text-xs text-gray-400">Réserver un créneau</p>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-[0_4px_12px_rgba(26,86,160,0.05)] flex items-center gap-4 hover:scale-[1.02] transition-transform cursor-pointer">
        <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
          <span class="material-symbols-outlined text-gray-600 text-[22px]">folder_zip</span>
        </div>
        <div>
          <h3 class="font-bold text-base text-gray-800">Voir documents</h3>
          <p class="text-xs text-gray-400">Mandats &amp; Titres</p>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-[0_4px_12px_rgba(26,86,160,0.05)] flex items-center gap-4 hover:scale-[1.02] transition-transform cursor-pointer">
        <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          <span class="material-symbols-outlined text-green-700 text-[22px]">rate_review</span>
        </div>
        <div>
          <h3 class="font-bold text-base text-gray-800">Rédiger rapport</h3>
          <p class="text-xs text-gray-400">Inspection technique</p>
        </div>
      </div>

      <div class="bg-[#003e7e] p-6 rounded-xl shadow-lg flex items-center gap-4 hover:scale-[1.02] transition-transform cursor-pointer relative overflow-hidden group">
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
        <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 relative z-10">
          <span class="material-symbols-outlined text-white text-[22px]">auto_fix_high</span>
        </div>
        <div class="relative z-10">
          <h3 class="font-bold text-base text-white">Assistant IA</h3>
          <p class="text-xs text-white/70">Analyse de conformité</p>
        </div>
      </div>
    </div>

    <!-- ── Modal rejet ── -->
    <Teleport to="body">
      <div
        v-if="rejectModal.open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        @click.self="rejectModal.open = false"
      >
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
          <h3 class="text-lg font-bold text-gray-800 mb-1">Rejeter ce bien</h3>
          <p class="text-sm text-gray-500 mb-4">
            <strong>{{ rejectModal.bien?.titre }}</strong> — indiquez le motif au propriétaire.
          </p>
          <textarea
            v-model="rejectModal.note"
            rows="4"
            placeholder="Motif du rejet (obligatoire)…"
            class="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:ring-2 focus:ring-red-300 outline-none"
          />
          <div class="flex justify-end gap-3 mt-4">
            <button
              class="px-4 py-2 rounded-lg text-gray-600 text-sm font-semibold hover:bg-gray-100 transition-colors"
              @click="rejectModal.open = false"
            >
              Annuler
            </button>
            <button
              :disabled="!rejectModal.note.trim() || isSubmitting === rejectModal.bien?.id"
              class="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-700 disabled:opacity-50 transition-colors"
              @click="confirmerRejet"
            >
              Confirmer le rejet
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { useBiensStore } from '~/stores/biens'

definePageMeta({ layout: 'agent' })

const store = useBiensStore()
const { biens, counts, meta, isLoading, isClaiming, error } = store

// ── Onglets ──────────────────────────────────────────────────────────────────
const tabs = [
  { key: 'non_assigne', label: 'Non assignés' },
  { key: 'en_cours',    label: 'En cours' },
  { key: 'termine',     label: 'Terminés' },
]
const activeTab = ref<string>('non_assigne')

function tabCount(key: string): number {
  if (key === 'non_assigne') return counts.value.nonAssigne ?? 0
  if (key === 'en_cours')    return counts.value.enCours    ?? 0
  if (key === 'termine')     return counts.value.termine    ?? 0
  return 0
}

// ── Filtres ──────────────────────────────────────────────────────────────────
const filterType = ref('')

function applyFilters() {
  loadBiens()
}

// ── Chargement ────────────────────────────────────────────────────────────────
async function loadBiens(page = 1) {
  await store.fetchBiens({
    onglet:    activeTab.value,
    type_bien: filterType.value || undefined,
    page,
  })
}

async function refreshAll() {
  await Promise.all([store.fetchCounts(), loadBiens()])
}

function switchTab(key: string) {
  activeTab.value = key
  loadBiens()
}

function goToPage(page: number) {
  loadBiens(page)
}

// ── Pagination ────────────────────────────────────────────────────────────────
const pageStart = computed(() => {
  if (meta.value.total === 0) return 0
  return (meta.value.current_page - 1) * 15 + 1
})
const pageEnd = computed(() =>
  Math.min(meta.value.current_page * 15, meta.value.total)
)

// ── Toast ────────────────────────────────────────────────────────────────────
const toast = ref<{ type: 'success' | 'error'; message: string } | null>(null)

function showToast(type: 'success' | 'error', message: string) {
  toast.value = { type, message }
  setTimeout(() => { toast.value = null }, 3500)
}

// ── Actions ──────────────────────────────────────────────────────────────────
const isSubmitting = ref<string | null>(null)

async function prendre(id: string) {
  const result = await store.claimBien(id)
  if (result.success) {
    showToast('success', 'Bien pris en charge. Il est maintenant dans votre onglet "En cours".')
    await store.fetchCounts()
  } else {
    showToast('error', result.message)
  }
}

async function liberer(id: string) {
  const result = await store.releaseBien(id)
  if (result.success) {
    showToast('success', 'Bien remis dans le pool.')
    await store.fetchCounts()
  } else {
    showToast('error', result.message)
  }
}

async function publier(id: string) {
  isSubmitting.value = id
  const result = await store.updateStatut(id, 'publie')
  isSubmitting.value = null
  if (result.success) {
    showToast('success', 'Bien publié avec succès.')
  } else {
    showToast('error', result.message)
  }
}

// ── Modal rejet ───────────────────────────────────────────────────────────────
const rejectModal = reactive<{
  open: boolean
  bien: { id: string; titre: string } | null
  note: string
}>({
  open: false,
  bien: null,
  note: '',
})

function openRejectModal(bien: any) {
  rejectModal.bien = bien
  rejectModal.note = ''
  rejectModal.open = true
}

async function confirmerRejet() {
  if (!rejectModal.bien || !rejectModal.note.trim()) return
  isSubmitting.value = rejectModal.bien.id
  const result = await store.updateStatut(rejectModal.bien.id, 'rejete', rejectModal.note.trim())
  isSubmitting.value = null
  rejectModal.open = false
  if (result.success) {
    showToast('success', 'Bien rejeté. Le propriétaire a été notifié.')
  } else {
    showToast('error', result.message)
  }
}

// ── Helpers d'affichage ───────────────────────────────────────────────────────
function thumbnailUrl(bien: any): string | null {
  const principal = bien.medias?.find((m: any) => m.est_principale) ?? bien.medias?.[0]
  return principal?.url ?? null
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const typeLabels: Record<string, string> = {
  appartement:    'Appartement',
  maison:         'Maison',
  villa:          'Villa',
  terrain:        'Terrain',
  bureau_commerce: 'Bureau / Commerce',
}
function formatType(t: string): string {
  return typeLabels[t] ?? t
}

function statutLabel(bien: any): string {
  if (activeTab.value === 'non_assigne') return 'EN ATTENTE'
  if (activeTab.value === 'en_cours')    return 'EN COURS'
  if (bien.statut === 'publie')          return 'PUBLIÉ'
  if (bien.statut === 'rejete')          return 'REJETÉ'
  return bien.statut?.toUpperCase() ?? '—'
}

function statutClass(bien: any): string {
  if (activeTab.value === 'non_assigne') return 'bg-orange-50 text-orange-700 border-orange-200'
  if (activeTab.value === 'en_cours')    return 'bg-blue-50 text-blue-700 border-blue-200'
  if (bien.statut === 'publie')          return 'bg-green-50 text-green-700 border-green-200'
  if (bien.statut === 'rejete')          return 'bg-red-50 text-red-700 border-red-200'
  return 'bg-gray-100 text-gray-500 border-gray-200'
}

// ── Initialisation ────────────────────────────────────────────────────────────
onMounted(() => {
  refreshAll()
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
