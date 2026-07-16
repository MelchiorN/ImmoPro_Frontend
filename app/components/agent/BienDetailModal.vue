<template>
  <Teleport to="body">
    <!-- ── Overlay principal ── -->
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      @click.self="$emit('close')"
      @keydown.escape.window="handleEscape"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[92vh] overflow-hidden flex flex-col">

        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div class="flex items-center gap-3">
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Dossier de vérification</span>
            <span v-if="bien" class="text-sm text-gray-400 font-mono">
              #{{ String(bien.id).slice(0,8).toUpperCase() }}
            </span>
            <span v-if="bien" :class="['px-2.5 py-0.5 rounded-full text-xs font-bold border', statutClass]">
              {{ statutLabel }}
            </span>
          </div>
          <button
            class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            @click="$emit('close')"
          >
            <span class="material-symbols-outlined text-[18px] text-gray-600">close</span>
          </button>
        </div>

        <!-- Skeleton -->
        <div v-if="isLoading" class="flex-1 overflow-y-auto p-6 space-y-4">
          <div v-for="i in 4" :key="i" class="animate-pulse space-y-2">
            <div class="h-4 bg-gray-100 rounded w-1/3"></div>
            <div class="h-32 bg-gray-100 rounded"></div>
          </div>
        </div>

        <!-- Erreur -->
        <div v-else-if="loadError" class="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <span class="material-symbols-outlined text-red-300 text-5xl mb-3">error_outline</span>
          <p class="text-red-500 font-semibold mb-4">{{ loadError }}</p>
          <button @click="loadBien" class="px-4 py-2 bg-[#003e7e] text-white rounded-xl text-sm font-bold">
            Réessayer
          </button>
        </div>

        <!-- Contenu -->
        <div v-else-if="bien" class="flex-1 overflow-y-auto">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-0">

            <!-- ── Colonne gauche (7/12) ── -->
            <div class="lg:col-span-7 p-6 space-y-5 border-r border-gray-100">

              <!-- Titre & prix -->
              <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <h2 class="text-xl font-bold text-[#003e7e]">{{ bien.titre }}</h2>
                  <p class="flex items-center gap-1 text-gray-400 text-sm mt-1">
                    <span class="material-symbols-outlined text-[15px]">location_on</span>
                    {{ bien.adresse }}
                  </p>
                </div>
                <div class="text-right flex-shrink-0">
                  <p class="text-xs text-gray-400">Prix</p>
                  <p class="text-xl font-bold text-[#003e7e]">{{ formatPrice(bien.prix) }}</p>
                </div>
              </div>

              <!-- Galerie médias -->
              <div v-if="photos.length > 0 || videos.length > 0">
                <!-- Photo principale cliquable -->
                <div
                  class="relative h-60 rounded-xl overflow-hidden cursor-pointer group mb-2"
                  @click="openLightbox(selectedMediaIndex)"
                >
                  <img v-if="!isVideo(currentMedia)" :src="currentMedia?.url" class="w-full h-full object-cover" />
                  <video v-else :src="currentMedia?.url" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span class="material-symbols-outlined text-white text-4xl">
                      {{ isVideo(currentMedia) ? 'play_circle' : 'zoom_in' }}
                    </span>
                  </div>
                  <div class="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-lg">
                    {{ selectedMediaIndex + 1 }} / {{ allMedias.length }}
                  </div>
                </div>
                <!-- Miniatures -->
                <div class="flex gap-2 overflow-x-auto pb-1">
                  <div
                    v-for="(media, i) in allMedias"
                    :key="media.id ?? i"
                    class="relative w-16 h-12 rounded-lg overflow-hidden cursor-pointer flex-shrink-0 border-2 transition-all"
                    :class="selectedMediaIndex === i ? 'border-[#003e7e]' : 'border-transparent hover:border-gray-300'"
                    @click="selectedMediaIndex = i"
                  >
                    <img v-if="!isVideo(media)" :src="media.url" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full bg-gray-800 flex items-center justify-center">
                      <span class="material-symbols-outlined text-white text-[18px]">play_arrow</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="h-40 bg-gray-50 rounded-xl flex items-center justify-center">
                <span class="material-symbols-outlined text-gray-300 text-4xl">image_not_supported</span>
              </div>

              <!-- Specs -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div class="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
                  <span class="material-symbols-outlined text-[#003e7e] text-[18px]">home</span>
                  <div><p class="text-[10px] text-gray-400">Type</p><p class="text-xs font-bold">{{ formatType(bien.type_bien) }}</p></div>
                </div>
                <div v-if="bien.surface" class="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
                  <span class="material-symbols-outlined text-[#003e7e] text-[18px]">square_foot</span>
                  <div><p class="text-[10px] text-gray-400">Surface</p><p class="text-xs font-bold">{{ bien.surface }} m²</p></div>
                </div>
                <div v-if="bien.nb_pieces" class="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
                  <span class="material-symbols-outlined text-[#003e7e] text-[18px]">bed</span>
                  <div><p class="text-[10px] text-gray-400">Pièces</p><p class="text-xs font-bold">{{ bien.nb_pieces }}</p></div>
                </div>
                <div class="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
                  <span class="material-symbols-outlined text-[#003e7e] text-[18px]">sell</span>
                  <div><p class="text-[10px] text-gray-400">Transaction</p><p class="text-xs font-bold capitalize">{{ bien.type_transaction }}</p></div>
                </div>
              </div>

              <!-- Description -->
              <div v-if="bien.description">
                <h3 class="text-sm font-bold text-gray-700 mb-1">Description</h3>
                <p class="text-sm text-gray-500 leading-relaxed">{{ bien.description }}</p>
              </div>
            </div>

            <!-- ── Colonne droite (5/12) ── -->
            <div class="lg:col-span-5 p-6 space-y-5 overflow-y-auto">

              <!-- Propriétaire -->
              <div class="bg-gray-50 rounded-xl p-4">
                <h3 class="text-sm font-bold text-gray-700 mb-3">Soumis par</h3>
                <div v-if="bien.proprietaire" class="flex items-start gap-3">
                  <div class="w-10 h-10 rounded-full bg-[#003e7e] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {{ initials(bien.proprietaire) }}
                  </div>
                  <div>
                    <p class="font-bold text-sm">{{ bien.proprietaire.first_name }} {{ bien.proprietaire.last_name }}</p>
                    <p class="text-xs text-gray-400">{{ bien.proprietaire.email }}</p>
                    <p v-if="bien.proprietaire.telephone" class="text-xs text-gray-400">{{ bien.proprietaire.telephone }}</p>
                  </div>
                </div>
              </div>

              <!-- Documents -->
              <div>
                <h3 class="text-sm font-bold text-gray-700 mb-3">
                  Documents ({{ documents.length }})
                </h3>
                <div v-if="documents.length === 0" class="text-xs text-gray-400 italic">Aucun document soumis.</div>
                <div class="space-y-2">
                  <div
                    v-for="doc in documents"
                    :key="doc.id"
                    :class="['flex items-center gap-2 p-2.5 rounded-xl border transition-colors',
                      docDecisions[doc.id] === 'conforme' ? 'border-green-200 bg-green-50' :
                      docDecisions[doc.id] === 'non_conforme' ? 'border-red-200 bg-red-50' :
                      'border-gray-100 hover:bg-gray-50']"
                  >
                    <!-- Icône type doc -->
                    <span class="material-symbols-outlined text-gray-400 text-[18px] flex-shrink-0">
                      {{ docIcon(doc) }}
                    </span>
                    <!-- Nom cliquable pour lire -->
                    <button
                      class="text-xs font-medium text-[#003e7e] underline truncate flex-1 text-left hover:text-blue-800"
                      @click="openDocument(doc)"
                    >
                      {{ doc.label ?? doc.type ?? 'Document' }}
                    </button>
                    <!-- Boutons conformité — seulement pour en_cours -->
                    <template v-if="activeTab === 'en_cours'">
                      <button
                        :class="['w-6 h-6 rounded-full flex items-center justify-center text-[12px] transition-colors',
                          docDecisions[doc.id] === 'conforme' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600']"
                        title="Conforme" @click="docDecisions[doc.id] = 'conforme'"
                      ><span class="material-symbols-outlined text-[13px]">check</span></button>
                      <button
                        :class="['w-6 h-6 rounded-full flex items-center justify-center transition-colors',
                          docDecisions[doc.id] === 'non_conforme' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600']"
                        title="Non conforme" @click="docDecisions[doc.id] = 'non_conforme'"
                      ><span class="material-symbols-outlined text-[13px]">close</span></button>
                    </template>
                  </div>
                </div>
              </div>

              <!-- Timeline -->
              <div>
                <h3 class="text-sm font-bold text-gray-700 mb-3">Historique</h3>
                <div class="relative space-y-3">
                  <div class="absolute left-3 top-0 bottom-0 w-px bg-gray-200"></div>
                  <div class="relative flex gap-3 pl-8">
                    <div class="absolute left-0 top-0.5 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center border-2 border-white z-10">
                      <span class="material-symbols-outlined text-green-600 text-[12px]">check</span>
                    </div>
                    <div><p class="text-xs font-semibold">Soumission reçue</p><p class="text-[11px] text-gray-400">{{ formatDate(bien.created_at) }}</p></div>
                  </div>
                  <div v-if="bien.agent_id" class="relative flex gap-3 pl-8">
                    <div class="absolute left-0 top-0.5 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white z-10">
                      <span class="material-symbols-outlined text-[#003e7e] text-[12px]">person</span>
                    </div>
                    <div><p class="text-xs font-semibold">Pris en charge</p></div>
                  </div>
                  <div v-for="visite in visites" :key="visite.id" class="relative flex gap-3 pl-8">
                    <div class="absolute left-0 top-0.5 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center border-2 border-white z-10">
                      <span class="material-symbols-outlined text-purple-600 text-[12px]">calendar_today</span>
                    </div>
                    <div>
                      <p class="text-xs font-semibold">Visite {{ visiteStatutLabel(visite.statut) }}</p>
                      <p class="text-[11px] text-gray-400">{{ formatDate(visite.date_visite) }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ── Actions selon onglet ── -->
              <div class="pt-3 border-t border-gray-100 space-y-2">

                <!-- NON ASSIGNÉ : lecture seule, juste prendre en charge -->
                <template v-if="activeTab === 'non_assigne'">
                  <p class="text-xs text-gray-400 italic text-center mb-2">
                    Prenez en charge ce dossier pour évaluer la conformité des documents.
                  </p>
                  <button
                    class="w-full py-3 bg-[#003e7e] text-white rounded-xl font-bold text-sm hover:opacity-90"
                    @click="$emit('action', 'claim', bien.id)"
                  >
                    <span class="material-symbols-outlined text-[16px] mr-1">assignment_turned_in</span>
                    Prendre en charge
                  </button>
                </template>

                <!-- EN COURS : conformité docs + planifier visite -->
                <template v-else-if="activeTab === 'en_cours'">
                  <!-- Résumé conformité -->
                  <div v-if="documents.length > 0" class="bg-gray-50 rounded-xl p-3">
                    <p class="text-xs font-bold text-gray-600 mb-2">Évaluation des documents</p>
                    <div class="flex gap-3 text-xs">
                      <span class="text-green-600 font-bold">{{ conformeCount }} conforme(s)</span>
                      <span class="text-red-500 font-bold">{{ nonConformeCount }} non conforme(s)</span>
                      <span class="text-gray-400">{{ pendingCount }} en attente</span>
                    </div>
                  </div>
                  <!-- Planifier visite (si pas encore planifiée) -->
                  <button
                    v-if="!hasVisitePlanifiee"
                    class="w-full py-3 bg-purple-600 text-white rounded-xl font-bold text-sm hover:opacity-90 flex items-center justify-center gap-2"
                    @click="showVisiteForm = !showVisiteForm"
                  >
                    <span class="material-symbols-outlined text-[16px]">calendar_add_on</span>
                    Planifier une visite
                  </button>
                  <div v-else class="bg-purple-50 border border-purple-200 rounded-xl p-3 text-xs text-purple-700 font-semibold flex items-center gap-2">
                    <span class="material-symbols-outlined text-[16px]">event_available</span>
                    Visite planifiée — {{ formatDate(visites[0]?.date_visite) }}
                  </div>
                  <!-- Formulaire planification -->
                  <div v-if="showVisiteForm" class="bg-purple-50 border border-purple-200 rounded-xl p-4 space-y-3">
                    <p class="text-xs font-bold text-purple-800">Nouvelle visite</p>
                    <input
                      v-model="visiteForm.date"
                      type="datetime-local"
                      class="w-full border border-purple-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <textarea
                      v-model="visiteForm.notes"
                      rows="2"
                      placeholder="Notes optionnelles…"
                      class="w-full border border-purple-200 rounded-lg px-3 py-2 text-sm resize-none outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <div class="flex gap-2">
                      <button
                        class="flex-1 py-2 bg-purple-600 text-white rounded-lg text-xs font-bold hover:opacity-90 disabled:opacity-50"
                        :disabled="!visiteForm.date || isSavingVisite"
                        @click="planifierVisite"
                      >
                        {{ isSavingVisite ? 'Enregistrement…' : 'Confirmer' }}
                      </button>
                      <button class="px-3 py-2 text-xs text-gray-500 hover:text-gray-700" @click="showVisiteForm = false">Annuler</button>
                    </div>
                    <p v-if="visiteError" class="text-xs text-red-500">{{ visiteError }}</p>
                  </div>

                  <!-- ── Bouton Rédiger un rapport ── -->
                  <button
                    class="w-full py-3 bg-[#003e7e]/10 text-[#003e7e] border border-[#003e7e]/20 rounded-xl font-bold text-sm hover:bg-[#003e7e]/20 transition-colors flex items-center justify-center gap-2"
                    :disabled="isCreatingRapport"
                    @click="goToRapport"
                  >
                    <span class="material-symbols-outlined text-[16px]">description</span>
                    {{ isCreatingRapport ? 'Ouverture…' : 'Rédiger un rapport' }}
                  </button>
                </template>


                <button
                  class="w-full py-2 text-gray-400 text-sm hover:text-[#003e7e] transition-colors"
                  @click="$emit('close')"
                >
                  Fermer
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Lightbox médias plein écran ── -->
    <Transition name="fade">
      <div
        v-if="lightbox.open"
        class="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center"
        @click.self="lightbox.open = false"
        @keydown.escape.window="lightbox.open = false"
        @keydown.arrow-left.window="lightboxPrev"
        @keydown.arrow-right.window="lightboxNext"
      >
        <!-- Fermer -->
        <button class="absolute top-4 right-4 text-white/70 hover:text-white z-10" @click="lightbox.open = false">
          <span class="material-symbols-outlined text-[32px]">close</span>
        </button>
        <!-- Précédent -->
        <button v-if="allMedias.length > 1" class="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10" @click="lightboxPrev">
          <span class="material-symbols-outlined text-[40px]">chevron_left</span>
        </button>
        <!-- Media -->
        <div class="max-w-5xl max-h-[85vh] w-full px-16">
          <img
            v-if="!isVideo(allMedias[lightbox.index])"
            :src="allMedias[lightbox.index]?.url"
            class="max-w-full max-h-[85vh] object-contain mx-auto rounded-lg shadow-2xl"
          />
          <video
            v-else
            :src="allMedias[lightbox.index]?.url"
            controls
            autoplay
            class="max-w-full max-h-[85vh] mx-auto rounded-lg shadow-2xl"
          />
        </div>
        <!-- Suivant -->
        <button v-if="allMedias.length > 1" class="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10" @click="lightboxNext">
          <span class="material-symbols-outlined text-[40px]">chevron_right</span>
        </button>
        <!-- Compteur -->
        <p class="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm">
          {{ lightbox.index + 1 }} / {{ allMedias.length }}
        </p>
      </div>
    </Transition>

    <!-- ── Visionneuse document ── -->
    <Transition name="fade">
      <div
        v-if="docViewer.open"
        class="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
        @click.self="docViewer.open = false"
        @keydown.escape.window="docViewer.open = false"
      >
        <div class="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
          <div class="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-gray-400 text-[20px]">{{ docIcon(docViewer.doc) }}</span>
              <span class="text-sm font-semibold text-gray-700 truncate max-w-xs">
                {{ docViewer.doc?.nom_original ?? 'Document' }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <a
                v-if="docViewer.doc?.url"
                :href="docViewer.doc.url"
                target="_blank"
                class="text-xs px-3 py-1.5 bg-[#003e7e] text-white rounded-lg font-bold hover:opacity-90"
              >
                Ouvrir dans un nouvel onglet
              </a>
              <button @click="docViewer.open = false" class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                <span class="material-symbols-outlined text-[18px] text-gray-600">close</span>
              </button>
            </div>
          </div>
          <!-- Iframe pour PDF / image -->
          <div class="flex-1 overflow-hidden bg-gray-100">
            <iframe
              v-if="isPdf(docViewer.doc)"
              :src="docViewer.doc.url"
              class="w-full h-full border-0"
              style="min-height: 70vh"
            />
            <img
              v-else-if="isDocImage(docViewer.doc)"
              :src="docViewer.doc.url"
              class="max-w-full max-h-[70vh] object-contain mx-auto p-4"
            />
            <div v-else class="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
              <span class="material-symbols-outlined text-5xl">description</span>
              <p class="text-sm">Aperçu non disponible pour ce type de fichier.</p>
              <a :href="docViewer.doc?.url" target="_blank" class="text-sm text-[#003e7e] underline font-semibold">
                Télécharger le document
              </a>
            </div>
          </div>
        </div>
      </div>
    </Transition>

  </Teleport>
</template>

<script setup lang="ts">
import { useBiensStore } from '~/stores/biens'
import { useAuthStore } from '~/stores/auth/auth'

const props = defineProps<{ bienId: string; activeTab: string }>()
const emit  = defineEmits<{ close: []; action: [action: string, id: string] }>()

const store     = useBiensStore()
const authStore = useAuthStore()
const config    = useRuntimeConfig()
const apiBase   = config.public?.apiBase || 'http://localhost:8000/api'

// Bus — déclaré en setup pour avoir le contexte Vue
const { emit: emitBus } = useRefreshBus()

// ── State ─────────────────────────────────────────────────────────────────
const bien           = ref<any>(null)
const isLoading      = ref(true)
const loadError      = ref<string | null>(null)
const visites        = ref<any[]>([])
const docDecisions   = reactive<Record<string, 'conforme' | 'non_conforme'>>({})
const selectedMediaIndex = ref(0)

const lightbox = reactive({ open: false, index: 0 })
const docViewer = reactive({ open: false, doc: null as any })

const showVisiteForm   = ref(false)
const isSavingVisite   = ref(false)
const visiteError      = ref<string | null>(null)
const visiteForm       = reactive({ date: '', notes: '' })
const isCreatingRapport = ref(false)

// ── Computed ──────────────────────────────────────────────────────────────
const medias    = computed(() => bien.value?.medias    ?? [])
const documents = computed(() => bien.value?.documents ?? [])
const photos    = computed(() => medias.value.filter((m: any) => !isVideo(m)))
const videos    = computed(() => medias.value.filter((m: any) => isVideo(m)))
const allMedias = computed(() => [...photos.value, ...videos.value])
const currentMedia = computed(() => allMedias.value[selectedMediaIndex.value] ?? null)

const conformeCount    = computed(() => Object.values(docDecisions).filter(v => v === 'conforme').length)
const nonConformeCount = computed(() => Object.values(docDecisions).filter(v => v === 'non_conforme').length)
const pendingCount     = computed(() => documents.value.length - conformeCount.value - nonConformeCount.value)
const hasVisitePlanifiee = computed(() =>
  visites.value.some((v: any) => v.statut === 'planifiee' || v.statut === 'confirmee')
)

const statutLabel = computed(() => {
  if (!bien.value) return ''
  if (props.activeTab === 'non_assigne') return 'EN ATTENTE'
  if (props.activeTab === 'en_cours')    return 'EN COURS'
  if (bien.value.statut === 'publie')    return 'PUBLIÉ'
  if (bien.value.statut === 'rejete')    return 'REJETÉ'
  return bien.value.statut?.toUpperCase() ?? '—'
})
const statutClass = computed(() => {
  if (!bien.value) return ''
  if (props.activeTab === 'non_assigne') return 'bg-orange-50 text-orange-700 border-orange-200'
  if (props.activeTab === 'en_cours')    return 'bg-blue-50 text-blue-700 border-blue-200'
  if (bien.value.statut === 'publie')    return 'bg-green-50 text-green-700 border-green-200'
  return 'bg-gray-100 text-gray-500 border-gray-200'
})

// ── Chargement ────────────────────────────────────────────────────────────
async function loadBien() {
  isLoading.value = true; loadError.value = null
  try {
    bien.value = await store.fetchBien(props.bienId)
    const principale = allMedias.value.find((m: any) => m.est_principale) ?? allMedias.value[0]
    if (principale) selectedMediaIndex.value = allMedias.value.indexOf(principale)
    if (props.activeTab === 'en_cours') await loadVisites()
  } catch (e: any) {
    loadError.value = e?.data?.message ?? 'Impossible de charger le dossier.'
  } finally {
    isLoading.value = false
  }
}

async function loadVisites() {
  try {
    const data = await $fetch(`${apiBase}/agent/biens/${props.bienId}/visites`, {
      headers: { Authorization: `Bearer ${authStore.token.value}` },
    })
    visites.value = (data as any).data ?? []
  } catch { visites.value = [] }
}

// ── Lightbox ──────────────────────────────────────────────────────────────
function openLightbox(index: number) {
  lightbox.index = index
  lightbox.open  = true
}
function lightboxPrev() {
  lightbox.index = (lightbox.index - 1 + allMedias.value.length) % allMedias.value.length
}
function lightboxNext() {
  lightbox.index = (lightbox.index + 1) % allMedias.value.length
}

// ── Document viewer ───────────────────────────────────────────────────────
async function openDocument(doc: any) {
  if (!doc?.url) return
  try {
    const token = authStore.token.value
    if (!token) throw new Error('Token manquant')
    // Fetch authentifié pour accéder au fichier privé (disk local Laravel)
    const resp = await fetch(doc.url, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!resp.ok) throw new Error('Erreur ' + resp.status)
    const blob = await resp.blob()
    const blobUrl = URL.createObjectURL(blob)
    docViewer.doc  = { ...doc, url: blobUrl }
    docViewer.open = true
  } catch (e) {
    console.error('Impossible d\'ouvrir le document :', e)
    docViewer.doc  = doc
    docViewer.open = true
  }
}
function isPdf(doc: any): boolean {
  return doc?.mime_type?.includes('pdf') || doc?.nom_original?.toLowerCase().endsWith('.pdf')
}
function isDocImage(doc: any): boolean {
  return doc?.mime_type?.startsWith('image/')
}
function docIcon(doc: any): string {
  if (isPdf(doc)) return 'picture_as_pdf'
  if (isDocImage(doc)) return 'image'
  return 'description'
}

// ── Médias ────────────────────────────────────────────────────────────────
function isVideo(media: any): boolean {
  return media?.type === 'video' || media?.mime_type?.startsWith('video/')
}

// ── Planifier visite ──────────────────────────────────────────────────────
async function planifierVisite() {
  if (!visiteForm.date) return
  isSavingVisite.value = true; visiteError.value = null
  try {
    const data = await $fetch(`${apiBase}/agent/biens/${props.bienId}/visites`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${authStore.token.value}` },
      body:    { date_visite: visiteForm.date, notes: visiteForm.notes },
    })
    visites.value.push((data as any).visite)
    showVisiteForm.value = false
    visiteForm.date = ''; visiteForm.notes = ''
    // Notifier le calendrier et le dashboard
    emitBus('visites')
    emitBus('stats')
  } catch (e: any) {
    visiteError.value = e?.data?.message ?? 'Erreur lors de la planification.'
  } finally {
    isSavingVisite.value = false
  }
}

// ── Rapport ────────────────────────────────────────────────────────────────
async function goToRapport() {
  if (!bien.value) return
  isCreatingRapport.value = true
  try {
    await $fetch(`${apiBase}/agent/rapports`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${authStore.token.value}` },
      body:    { bien_id: props.bienId },
    })
  } catch {
    // Rapport déjà existant ou autre erreur — on navigue quand même
  } finally {
    isCreatingRapport.value = false
  }
  emit('close')
  await navigateTo('/agent/reports')
}

// ── Helpers ───────────────────────────────────────────────────────────────
function initials(p: any): string {
  return ((p?.first_name?.[0] ?? '') + (p?.last_name?.[0] ?? '')).toUpperCase() || '?'
}
function formatDate(d: string | null): string {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}
function formatPrice(p: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(p)
}
const typeLabels: Record<string, string> = {
  appartement: 'Appartement', maison: 'Maison', villa: 'Villa',
  terrain: 'Terrain', bureau_commerce: 'Bureau / Commerce',
}
function formatType(t: string): string { return typeLabels[t] ?? t }
function visiteStatutLabel(s: string): string {
  const map: Record<string, string> = {
    planifiee: 'planifiée', confirmee: 'confirmée',
    annulee: 'annulée', rapport_soumis: 'rapport soumis',
  }
  return map[s] ?? s
}
function handleEscape() {
  if (lightbox.open) { lightbox.open = false; return }
  if (docViewer.open) { docViewer.open = false; return }
  emit('close')
}



onMounted(loadBien)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
