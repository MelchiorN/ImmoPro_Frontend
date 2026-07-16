<template>
  <div class="p-6 space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-primary">Mes Rapports</h1>
        <p class="text-sm text-gray-400 mt-0.5">Rédigez et suivez vos rapports de vérification</p>
      </div>
      <button
        class="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm"
        @click="showNewRapportModal = true"
      >
        <Plus :size="16" />
        Nouveau rapport
      </button>
    </div>

    <!-- Filtres statut -->
    <div class="flex gap-2">
      <button
        v-for="f in filters"
        :key="f.value"
        :class="['px-3 py-1.5 rounded-lg text-xs font-bold transition-colors', activeFilter === f.value ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-primary hover:text-primary']"
        @click="activeFilter = f.value"
      >
        {{ f.label }} <span v-if="f.count !== undefined" class="ml-1 opacity-70">({{ f.count }})</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div v-for="i in 3" :key="i" class="animate-pulse bg-white rounded-xl h-40 border border-gray-100" />
    </div>

    <!-- Vide -->
    <div v-else-if="filteredRapports.length === 0" class="bg-white rounded-xl border border-gray-100 p-16 flex flex-col items-center text-center">
      <FileText :size="48" class="text-gray-200 mb-4" />
      <p class="text-gray-500 font-semibold">Aucun rapport {{ activeFilter !== 'all' ? 'dans cette catégorie' : '' }}</p>
      <p class="text-xs text-gray-400 mt-1">Commencez par créer un rapport sur un bien que vous avez pris en charge.</p>
      <button
        class="mt-4 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90"
        @click="showNewRapportModal = true"
      >
        Créer un rapport
      </button>
    </div>

    <!-- Liste des rapports -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div
        v-for="rapport in filteredRapports"
        :key="rapport.id"
        class="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
      >
        <!-- Photo du bien -->
        <div class="relative h-32 bg-gray-100 flex-shrink-0">
          <img
            v-if="rapport.bien?.photo"
            :src="rapport.bien.photo"
            class="w-full h-full object-cover"
            :alt="rapport.bien?.titre"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <Building2 :size="32" class="text-gray-300" />
          </div>
          <!-- Badge statut -->
          <span :class="['absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase', statutClass(rapport.statut)]">
            {{ statutLabel(rapport.statut) }}
          </span>
        </div>

        <!-- Contenu -->
        <div class="p-4 flex-1 flex flex-col">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
            {{ rapport.client ? rapport.client.first_name + ' ' + rapport.client.last_name : 'Client inconnu' }}
          </p>
          <h3 class="font-bold text-sm text-gray-800 truncate mb-0.5">
            {{ rapport.titre ?? rapport.bien?.titre ?? 'Sans titre' }}
          </h3>
          <p class="text-xs text-gray-400 truncate mb-3">
            <MapPin :size="11" class="inline mr-0.5" />{{ rapport.bien?.adresse ?? '—' }}
          </p>

          <!-- Aperçu contenu -->
          <p v-if="rapport.contenu" class="text-xs text-gray-500 line-clamp-2 flex-1 mb-3">
            {{ rapport.contenu }}
          </p>
          <p v-else class="text-xs text-gray-300 italic flex-1 mb-3">Aucun contenu rédigé…</p>

          <!-- Footer -->
          <div class="flex items-center justify-between pt-3 border-t border-gray-50">
            <span class="text-[10px] text-gray-400">
              {{ formatDate(rapport.updated_at) }}
            </span>
            <button
              class="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
              @click="editRapport(rapport)"
            >
              <Pencil :size="12" />
              {{ rapport.statut === 'soumis' ? 'Voir' : 'Continuer' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Modal Nouveau rapport ── -->
    <Teleport to="body">
      <div
        v-if="showNewRapportModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        @click.self="showNewRapportModal = false"
      >
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
          <h2 class="text-lg font-bold text-primary mb-4">Choisir un bien</h2>
          <p class="text-sm text-gray-500 mb-4">Sélectionnez le bien pour lequel vous souhaitez rédiger un rapport.</p>
          <div v-if="loadingBiens" class="flex justify-center py-6">
            <Loader2 :size="24" class="animate-spin text-primary" />
          </div>
          <div v-else class="space-y-2 max-h-72 overflow-y-auto">
            <div
              v-for="bien in biensList"
              :key="bien.id"
              class="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-primary cursor-pointer transition-colors"
              @click="createRapport(bien)"
            >
              <div class="w-12 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img v-if="bien.photo" :src="bien.photo" class="w-full h-full object-cover" />
                <Building2 v-else :size="20" class="m-auto mt-2 text-gray-300" />
              </div>
              <div class="min-w-0">
                <p class="font-bold text-sm truncate">{{ bien.titre }}</p>
                <p class="text-xs text-gray-400 truncate">{{ bien.adresse }}</p>
              </div>
            </div>
            <p v-if="biensList.length === 0" class="text-center text-sm text-gray-400 py-4">
              Aucun bien en cours assigné.
            </p>
          </div>
          <button class="mt-4 w-full py-2 text-sm text-gray-400 hover:text-gray-600" @click="showNewRapportModal = false">
            Annuler
          </button>
        </div>
      </div>

      <!-- ── Modal Édition rapport ── -->
      <div
        v-if="editingRapport"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        @click.self="editingRapport = null"
      >
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <p class="text-xs text-gray-400 font-bold uppercase tracking-wide">{{ editingRapport.client?.first_name }} {{ editingRapport.client?.last_name }}</p>
              <h2 class="font-bold text-primary">{{ editingRapport.bien?.titre }}</h2>
            </div>
            <button class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200" @click="editingRapport = null">
              <X :size="16" />
            </button>
          </div>

          <!-- Corps -->
          <div class="flex-1 overflow-y-auto p-6 space-y-4">
            <!-- Titre -->
            <div>
              <label class="block text-xs font-bold text-gray-600 mb-1">Titre du rapport</label>
              <input
                v-model="editForm.titre"
                type="text"
                class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Rapport de vérification..."
              />
            </div>

            <!-- Contenu -->
            <div>
              <label class="block text-xs font-bold text-gray-600 mb-1">Rapport de vérification</label>
              <textarea
                v-model="editForm.contenu"
                rows="8"
                class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Rédigez votre rapport détaillé ici : état du bien, conformité des documents, observations..."
              />
            </div>

            <!-- Note finale -->
            <div>
              <label class="block text-xs font-bold text-gray-600 mb-1">Note finale / Recommandation</label>
              <textarea
                v-model="editForm.note_finale"
                rows="3"
                class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Publiable, à rejeter, ou à compléter..."
              />
            </div>

            <p v-if="saveError" class="text-xs text-red-500">{{ saveError }}</p>
          </div>

          <!-- Actions -->
          <div class="px-6 py-4 border-t border-gray-100 flex gap-3">
            <button
              class="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
              :disabled="isSaving"
              @click="saveRapport('brouillon')"
            >
              {{ isSaving ? 'Enregistrement…' : 'Sauvegarder brouillon' }}
            </button>
            <button
              class="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition-colors"
              :disabled="isSaving"
              @click="saveRapport('soumis')"
            >
              Soumettre le rapport
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { FileText, Plus, Building2, MapPin, Pencil, Loader2, X } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth/auth'

definePageMeta({ layout: 'agent' })

const authStore = useAuthStore()
const config    = useRuntimeConfig()
const apiBase   = config.public?.apiBase || 'http://localhost:8000/api'

// ── State ──────────────────────────────────────────────────────────────────
const rapports           = useState<any[]>('agent_rapports_list', () => [])
const isLoading          = useState('agent_rapports_loading', () => false)
let   pollTimer: ReturnType<typeof setInterval> | null = null
const activeFilter       = ref('all')
const showNewRapportModal = ref(false)
const biensList          = ref<any[]>([])
const loadingBiens       = ref(false)
const editingRapport     = ref<any>(null)
const editForm           = ref({ titre: '', contenu: '', note_finale: '' })
const isSaving           = ref(false)
const saveError          = ref<string | null>(null)

// ── Filters ────────────────────────────────────────────────────────────────
const filters = computed(() => [
  { value: 'all',      label: 'Tous',      count: rapports.value.length },
  { value: 'brouillon',label: 'Brouillons',count: rapports.value.filter(r => r.statut === 'brouillon').length },
  { value: 'soumis',   label: 'Soumis',    count: rapports.value.filter(r => r.statut === 'soumis').length },
])

const filteredRapports = computed(() =>
  activeFilter.value === 'all'
    ? rapports.value
    : rapports.value.filter(r => r.statut === activeFilter.value)
)

// ── Load rapports ──────────────────────────────────────────────────────────
async function loadRapports(silent = false) {
  if (!silent) isLoading.value = true
  try {
    const data = await $fetch(`${apiBase}/agent/rapports`, {
      headers: { Authorization: `Bearer ${authStore.token.value}` },
    })
    rapports.value = (data as any).data ?? []
  } catch (e) {
    console.error('Erreur chargement rapports', e)
  } finally {
    isLoading.value = false
  }
}

// ── Load biens en cours ────────────────────────────────────────────────────
async function loadBiensEnCours() {
  loadingBiens.value = true
  try {
    const data = await $fetch(`${apiBase}/agent/biens?onglet=en_cours&per_page=50`, {
      headers: { Authorization: `Bearer ${authStore.token.value}` },
    })
    biensList.value = ((data as any).data ?? []).map((b: any) => ({
      id:      b.id,
      titre:   b.titre,
      adresse: b.adresse,
      photo:   b.photo ?? b.medias?.[0]?.url,
    }))
  } catch { biensList.value = [] }
  finally { loadingBiens.value = false }
}

// ── Create rapport ─────────────────────────────────────────────────────────
async function createRapport(bien: any) {
  try {
    const data = await $fetch(`${apiBase}/agent/rapports`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token.value}` },
      body: { bien_id: bien.id },
    })
    const rapport = (data as any).data
    rapports.value.unshift(rapport)
    showNewRapportModal.value = false
    editRapport(rapport)
  } catch (e: any) {
    alert(e?.data?.message ?? 'Erreur lors de la création')
  }
}

// ── Edit rapport ───────────────────────────────────────────────────────────
function editRapport(rapport: any) {
  editingRapport.value = rapport
  editForm.value = {
    titre:       rapport.titre ?? '',
    contenu:     rapport.contenu ?? '',
    note_finale: rapport.note_finale ?? '',
  }
  saveError.value = null
}

// ── Save rapport ───────────────────────────────────────────────────────────
async function saveRapport(statut: string) {
  if (!editingRapport.value) return
  isSaving.value  = true
  saveError.value = null
  try {
    const data = await $fetch(`${apiBase}/agent/rapports/${editingRapport.value.id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authStore.token.value}` },
      body: { ...editForm.value, statut },
    })
    const updated = (data as any).data
    const idx = rapports.value.findIndex(r => r.id === updated.id)
    if (idx !== -1) rapports.value[idx] = updated
    editingRapport.value = null
    // Notifier les autres pages que les rapports ont changé
    emitBus('rapports')
    if (statut === 'soumis') emitBus('stats')
  } catch (e: any) {
    saveError.value = e?.data?.message ?? 'Erreur lors de la sauvegarde.'
  } finally {
    isSaving.value = false
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────
function statutLabel(s: string) {
  return { brouillon: 'Brouillon', soumis: 'Soumis', valide: 'Validé' }[s] ?? s
}
function statutClass(s: string) {
  if (s === 'soumis')   return 'bg-blue-100 text-blue-700'
  if (s === 'valide')   return 'bg-green-100 text-green-700'
  return 'bg-gray-100 text-gray-600'
}
function formatDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

onMounted(() => {
  // Si des données existent déjà (navigation retour), rafraîchir silencieusement
  const hasCachedData = rapports.value.length > 0
  loadRapports(hasCachedData)
  loadBiensEnCours()
  pollTimer = setInterval(() => loadRapports(true), 30_000)
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
  document.removeEventListener('visibilitychange', onVisibilityChange)
})

function onVisibilityChange() {
  if (document.visibilityState === 'visible') loadRapports(true)
}

// Bus → écouter ET émettre
const { on: onBus, emit: emitBus } = useRefreshBus()
onBus('rapports', () => loadRapports(true))
onBus('biens',   () => loadBiensEnCours())
</script>
