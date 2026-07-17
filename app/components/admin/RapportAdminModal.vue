<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      @click.self="$emit('close')"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">

        <!-- ── Header ─────────────────────────────────────────────────────── -->
        <div class="flex items-start justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 class="text-lg font-bold text-[#003e7e]">Rapport d'inspection</h2>
            <p class="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[14px]">home_work</span>
              {{ rapport?.bien?.titre ?? '—' }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <span :class="['px-2.5 py-0.5 rounded-full text-xs font-bold border', statutBadgeClass]">
              {{ statutLabel }}
            </span>
            <button @click="$emit('close')" class="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors ml-1">
              <span class="material-symbols-outlined text-gray-400 text-[20px]">close</span>
            </button>
          </div>
        </div>

        <!-- ── Contenu scrollable ──────────────────────────────────────────── -->
        <div class="flex-1 overflow-y-auto p-6 space-y-5">

          <!-- Loader -->
          <div v-if="isLoading" class="space-y-3">
            <div v-for="i in 4" :key="i" class="h-10 bg-gray-100 rounded-xl animate-pulse" />
          </div>

          <template v-else-if="rapport">
            <!-- Info bien + agent -->
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-50 rounded-xl p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bien concerné</p>
                <p class="font-semibold text-sm text-gray-800">{{ rapport.bien?.titre }}</p>
                <p class="text-xs text-gray-500 mt-0.5">{{ rapport.bien?.adresse }}</p>
                <div class="flex items-center gap-1 mt-2">
                  <span :class="['px-2 py-0.5 rounded-full text-[10px] font-bold', bienStatutClass(rapport.bien?.statut)]">
                    {{ rapport.bien?.statut?.toUpperCase() }}
                  </span>
                </div>
              </div>
              <div class="bg-gray-50 rounded-xl p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Agent rédacteur</p>
                <p class="font-semibold text-sm text-gray-800">
                  {{ rapport.agent?.first_name }} {{ rapport.agent?.last_name }}
                </p>
                <p class="text-xs text-gray-500 mt-0.5">{{ rapport.agent?.email }}</p>
                <p v-if="rapport.soumis_le" class="text-xs text-gray-400 mt-2">
                  Soumis le {{ formatDate(rapport.soumis_le) }}
                </p>
              </div>
            </div>

            <!-- Contenu principal -->
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Contenu du rapport</p>
              <div class="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap min-h-[120px] leading-relaxed">
                {{ rapport.contenu || 'Aucun contenu rédigé.' }}
              </div>
            </div>

            <!-- Checklist -->
            <div v-if="rapport.checklist?.length">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Points vérifiés ({{ rapport.checklist.length }})</p>
              <div class="grid grid-cols-2 gap-1.5">
                <div v-for="(item, i) in rapport.checklist" :key="i" class="flex items-center gap-2 text-sm bg-green-50 rounded-lg px-3 py-1.5">
                  <span class="material-symbols-outlined text-green-500 text-[16px] flex-shrink-0">check_circle</span>
                  <span class="text-gray-700 text-xs">{{ item }}</span>
                </div>
              </div>
            </div>

            <!-- Note finale -->
            <div v-if="rapport.note_finale">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Note de conclusion</p>
              <div class="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-gray-700 leading-relaxed">
                {{ rapport.note_finale }}
              </div>
            </div>

            <!-- Note de rejet précédent -->
            <div v-if="rapport.note_rejet && rapport.statut !== 'valide'" class="bg-red-50 border border-red-200 rounded-xl p-4">
              <p class="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">Motif de rejet précédent</p>
              <p class="text-sm text-red-700">{{ rapport.note_rejet }}</p>
            </div>

            <!-- Zone de décision (uniquement si soumis) -->
            <div v-if="rapport.statut === 'soumis'" class="border-t border-gray-100 pt-5">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Votre décision</p>

              <!-- Tabs décision -->
              <div class="flex gap-2 mb-4">
                <button
                  type="button"
                  @click.stop.prevent="() => confirmer('publier')"
                  :class="[
                    'flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all flex items-center justify-center gap-2',
                    decision === 'publier'
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-green-600 border-green-200 hover:border-green-400'
                  ]"
                >
                  <span class="material-symbols-outlined text-[18px]">verified</span>
                  Approuver le rapport
                </button>
                <button
                  type="button"
                  @click.stop.prevent="() => confirmer('rejeter')"
                  :class="[
                    'flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all flex items-center justify-center gap-2',
                    decision === 'rejeter'
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-red-600 border-red-200 hover:border-red-400'
                  ]"
                >
                  <span class="material-symbols-outlined text-[18px]">cancel</span>
                  Rejeter le rapport
                </button>
              </div>
              <p class="text-xs text-gray-400 bg-teal-50 border border-teal-100 rounded-lg px-3 py-2">
                <span class="material-symbols-outlined text-teal-500 text-[14px] align-middle mr-1">info</span>
                En approuvant, le propriétaire recevra une notification pour publier son bien lui-même.
              </p>

            </div>

            <!-- Résultat si déjà traité -->
            <div v-if="rapport.statut === 'valide'" class="bg-teal-50 border border-teal-200 rounded-xl p-4 flex items-center gap-3">
              <span class="material-symbols-outlined text-teal-600 text-2xl">task_alt</span>
              <div>
                <p class="font-bold text-teal-700 text-sm">Rapport approuvé</p>
                <p class="text-xs text-teal-600 mt-0.5">Le propriétaire a été notifié et peut publier son bien.</p>
              </div>
            </div>

          </template>
        </div>

        <!-- ── Footer ─────────────────────────────────────────────────────── -->
        <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-between flex-shrink-0">
          <button @click="$emit('close')" class="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            Fermer
          </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import Swal from 'sweetalert2'
import { useAdminBiensStore } from '~/stores/adminBiens'

const props = defineProps<{
  rapportId: string
}>()

const emit = defineEmits<{
  close: []
  decided: [decision: string]
}>()

const store = useAdminBiensStore()

// ── Cache partagé entre ouvertures ─────────────────────────────────────────
const rapportsCache = useState<Record<string, any>>('admin_rapports_detail_cache', () => ({}))

// Initialiser depuis le cache si disponible
const rapport      = ref<any>(rapportsCache.value[props.rapportId] ?? null)
const isLoading    = ref(rapport.value === null) // skeleton seulement si pas de cache
const isDeciding   = ref(false)
const decision     = ref<'publier' | 'rejeter' | ''>('')

// ── Chargement ────────────────────────────────────────────────────────────
async function load() {
  const isSilent = rapportsCache.value[props.rapportId] !== undefined
  if (!isSilent) isLoading.value = true
  try {
    const data = await store.fetchRapport(props.rapportId)
    rapport.value = data
    // Mettre en cache
    rapportsCache.value = { ...rapportsCache.value, [props.rapportId]: data }
  } finally {
    isLoading.value = false
  }
}

// ── Décision ──────────────────────────────────────────────────────────────
async function confirmer(action: 'publier' | 'rejeter') {
  decision.value = action

  const confirmTitle = action === 'publier' ? 'Approuver ce rapport' : 'Rejeter ce rapport'
  const confirmText = action === 'publier'
    ? 'Le rapport sera approuvé. Le propriétaire recevra une notification pour publier son bien.'
    : 'Le rapport sera rejeté et l\'agent devra le corriger.'

  const result = await Swal.fire({
    title: confirmTitle,
    text: confirmText,
    icon: action === 'publier' ? 'question' : 'warning',
    showCancelButton: true,
    confirmButtonText: action === 'publier' ? 'Oui, publier' : 'Oui, rejeter',
    cancelButtonText: 'Annuler',
    confirmButtonColor: action === 'publier' ? '#16a34a' : '#dc2626',
    cancelButtonColor: '#6b7280',
    reverseButtons: true,
  })

  if (!result.isConfirmed) return

  isDeciding.value = true
  const response = await store.deciderRapport(rapport.value.id, action, '')
  isDeciding.value = false

  if (response.success) {
    rapport.value = response.data
    // Invalider le cache pour forcer un rechargement frais la prochaine fois
    const updated = { ...rapportsCache.value }
    delete updated[props.rapportId]
    rapportsCache.value = updated
    Swal.fire({
      icon: 'success',
      title: action === 'publier' ? 'Rapport approuvé' : 'Rapport rejeté',
      text: action === 'publier'
        ? 'Le rapport a été approuvé. Le propriétaire peut maintenant publier son bien.'
        : 'Le rapport a été rejeté. L\'agent a été notifié.',
      confirmButtonColor: '#1A56A0',
    })
    emit('decided', action)
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: response.message,
      confirmButtonColor: '#1A56A0',
    })
  }
}

const statutBadgeClass = computed(() => {
  const s = rapport.value?.statut
  if (s === 'brouillon') return 'bg-gray-100 text-gray-600 border-gray-200'
  if (s === 'soumis')    return 'bg-orange-50 text-orange-700 border-orange-200'
  if (s === 'valide')    return 'bg-green-50 text-green-700 border-green-200'
  if (s === 'rejete')    return 'bg-red-50 text-red-700 border-red-200'
  return 'bg-gray-100 text-gray-500 border-gray-200'
})

const statutLabel = computed(() => {
  const s = rapport.value?.statut
  if (s === 'brouillon') return 'Brouillon'
  if (s === 'soumis')    return 'En attente de décision'
  if (s === 'valide')    return 'Approuvé'
  if (s === 'rejete')    return 'Rejeté'
  return s ?? '—'
})

function bienStatutClass(s: string): string {
  if (s === 'en_attente') return 'bg-orange-100 text-orange-700'
  if (s === 'en_cours')   return 'bg-blue-100 text-blue-700'
  if (s === 'publie')     return 'bg-green-100 text-green-700'
  if (s === 'rejete')     return 'bg-red-100 text-red-700'
  return 'bg-gray-100 text-gray-600'
}

function formatDate(d: string): string {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

onMounted(load)
</script>
