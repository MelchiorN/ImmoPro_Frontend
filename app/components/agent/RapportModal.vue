<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      @click.self="$emit('close')"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 class="text-lg font-bold text-[#003e7e]">
              {{ rapport ? rapport.titre : 'Rapport d\'inspection' }}
            </h2>
            <p class="text-xs text-gray-400 mt-0.5">{{ bien?.titre }}</p>
          </div>
          <div class="flex items-center gap-2">
            <!-- Badge statut -->
            <span v-if="rapport" :class="['px-2.5 py-0.5 rounded-full text-xs font-bold border', statutBadgeClass]">
              {{ statutLabel }}
            </span>
            <button @click="$emit('close')" class="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
              <span class="material-symbols-outlined text-gray-400 text-[20px]">close</span>
            </button>
          </div>
        </div>

        <!-- Contenu scrollable -->
        <div class="flex-1 overflow-y-auto p-6 space-y-5">

          <!-- Note de rejet (si rejeté) -->
          <div v-if="rapport?.statut === 'rejete' && rapport.note_rejet" class="bg-red-50 border border-red-200 rounded-xl p-4">
            <div class="flex items-start gap-2">
              <span class="material-symbols-outlined text-red-500 text-[20px] flex-shrink-0 mt-0.5">error</span>
              <div>
                <p class="text-sm font-bold text-red-700 mb-1">Rapport rejeté — corrections requises</p>
                <p class="text-sm text-red-600">{{ rapport.note_rejet }}</p>
              </div>
            </div>
          </div>

          <!-- Mode lecture si soumis/validé -->
          <template v-if="isReadOnly">
            <div class="space-y-4">
              <div>
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Contenu du rapport</p>
                <div class="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap min-h-[100px]">
                  {{ rapport?.contenu || '—' }}
                </div>
              </div>
              <div v-if="rapport?.note_finale">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Note finale</p>
                <div class="bg-gray-50 rounded-xl p-4 text-sm text-gray-700">{{ rapport.note_finale }}</div>
              </div>
              <div v-if="rapport?.checklist?.length">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Checklist</p>
                <div class="space-y-1.5">
                  <div v-for="(item, i) in rapport.checklist" :key="i" class="flex items-center gap-2 text-sm">
                    <span class="material-symbols-outlined text-green-500 text-[18px]">check_circle</span>
                    <span class="text-gray-700">{{ item }}</span>
                  </div>
                </div>
              </div>
              <div v-if="rapport?.soumis_le" class="text-xs text-gray-400">
                Soumis le {{ formatDate(rapport.soumis_le) }}
              </div>
            </div>
          </template>

          <!-- Mode édition -->
          <template v-else>
            <!-- Titre -->
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Titre du rapport</label>
              <input
                v-model="form.titre"
                type="text"
                placeholder="Ex: Rapport d'inspection — Appartement Marina"
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#003e7e]/20 focus:border-[#003e7e] outline-none"
              />
            </div>

            <!-- Contenu -->
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                Contenu du rapport <span class="text-red-400">*</span>
              </label>
              <textarea
                v-model="form.contenu"
                rows="6"
                placeholder="Décrivez l'état du bien, les observations lors de la visite, les points de conformité, les anomalies constatées..."
                class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-[#003e7e]/20 focus:border-[#003e7e] outline-none"
              />
            </div>

            <!-- Checklist -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Points vérifiés</label>
                <button @click="addChecklistItem" class="text-xs text-[#003e7e] font-bold hover:underline flex items-center gap-1">
                  <span class="material-symbols-outlined text-[14px]">add</span> Ajouter
                </button>
              </div>
              <div class="space-y-2">
                <div v-for="(item, i) in form.checklist" :key="i" class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-green-400 text-[18px] flex-shrink-0">check_circle</span>
                  <input
                    v-model="form.checklist[i]"
                    type="text"
                    placeholder="Point vérifié..."
                    class="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-[#003e7e]/20 outline-none"
                  />
                  <button @click="removeChecklistItem(i)" class="w-7 h-7 rounded-full hover:bg-red-50 text-gray-300 hover:text-red-400 flex items-center justify-center transition-colors">
                    <span class="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
                <p v-if="!form.checklist.length" class="text-xs text-gray-400 italic">Aucun point ajouté</p>
              </div>
            </div>

            <!-- Note finale -->
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Note de conclusion</label>
              <textarea
                v-model="form.note_finale"
                rows="3"
                placeholder="Conclusion globale, recommandations..."
                class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-[#003e7e]/20 focus:border-[#003e7e] outline-none"
              />
            </div>
          </template>
        </div>

        <!-- Footer actions -->
        <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-between flex-shrink-0">
          <button
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Fermer
          </button>

          <div v-if="!isReadOnly" class="flex items-center gap-2">
            <!-- Sauvegarder brouillon -->
            <button
              @click="sauvegarder"
              :disabled="isSaving"
              class="px-4 py-2 text-sm font-bold text-[#003e7e] border border-[#003e7e] rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
            >
              <span v-if="isSaving">Sauvegarde...</span>
              <span v-else>Sauvegarder</span>
            </button>
            <!-- Soumettre -->
            <button
              @click="soumettre"
              :disabled="isSubmitting || !form.contenu?.trim()"
              class="px-4 py-2 text-sm font-bold bg-[#003e7e] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-1.5"
            >
              <span class="material-symbols-outlined text-[16px]">send</span>
              <span v-if="isSubmitting">Soumission...</span>
              <span v-else>Soumettre à l'admin</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useRapportsStore } from '~/stores/rapports'

const props = defineProps<{
  bienId: string
  bien?: any
}>()

const emit = defineEmits<{
  close: []
  submitted: [rapport: any]
}>()

const store = useRapportsStore()

const rapport    = ref<any>(null)
const isLoading  = ref(true)
const isSaving   = ref(false)
const isSubmitting = ref(false)

const form = reactive({
  titre:       '',
  contenu:     '',
  checklist:   [] as string[],
  note_finale: '',
})

// ── Read-only si soumis ou validé ──────────────────────────────────────────
const isReadOnly = computed(() =>
  rapport.value?.statut === 'soumis' || rapport.value?.statut === 'valide'
)

const statutBadgeClass = computed(() => {
  const s = rapport.value?.statut
  if (s === 'brouillon') return 'bg-gray-100 text-gray-600 border-gray-200'
  if (s === 'soumis')    return 'bg-blue-50 text-blue-700 border-blue-200'
  if (s === 'valide')    return 'bg-green-50 text-green-700 border-green-200'
  if (s === 'rejete')    return 'bg-red-50 text-red-700 border-red-200'
  return 'bg-gray-100 text-gray-500 border-gray-200'
})

const statutLabel = computed(() => {
  const s = rapport.value?.statut
  if (s === 'brouillon') return 'Brouillon'
  if (s === 'soumis')    return 'Soumis'
  if (s === 'valide')    return 'Validé'
  if (s === 'rejete')    return 'À corriger'
  return s ?? '—'
})

// ── Charger ou créer le rapport ────────────────────────────────────────────
async function init() {
  isLoading.value = true
  const existing = await store.fetchRapportByBien(props.bienId)
  if (existing) {
    rapport.value = existing
    form.titre       = existing.titre       ?? ''
    form.contenu     = existing.contenu     ?? ''
    form.checklist   = [...(existing.checklist ?? [])]
    form.note_finale = existing.note_finale ?? ''
  } else {
    // Créer un brouillon
    const result = await store.createRapport(props.bienId)
    if (result.success) {
      rapport.value    = result.data
      form.titre       = result.data?.titre ?? ''
    }
  }
  isLoading.value = false
}

function addChecklistItem() {
  form.checklist.push('')
}

function removeChecklistItem(i: number) {
  form.checklist.splice(i, 1)
}

async function sauvegarder() {
  if (!rapport.value) return
  isSaving.value = true
  const result = await store.saveRapport(rapport.value.id, {
    titre:       form.titre,
    contenu:     form.contenu,
    checklist:   form.checklist.filter(c => c.trim()),
    note_finale: form.note_finale,
  })
  isSaving.value = false
  if (result.success) {
    rapport.value = result.data
  }
}

async function soumettre() {
  if (!rapport.value || !form.contenu?.trim()) return
  isSubmitting.value = true
  // Sauvegarder d'abord
  await store.saveRapport(rapport.value.id, {
    titre:       form.titre,
    contenu:     form.contenu,
    checklist:   form.checklist.filter(c => c.trim()),
    note_finale: form.note_finale,
  })
  const result = await store.soumettre(rapport.value.id)
  isSubmitting.value = false
  if (result.success) {
    rapport.value = result.data
    emit('submitted', result.data)
  }
}

function formatDate(d: string): string {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

onMounted(init)
</script>
