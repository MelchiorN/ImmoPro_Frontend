<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      @click.self="$emit('close')"
      @keydown.escape.window="handleEscape"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[92vh] overflow-hidden flex flex-col">

        <!-- ── Header ──────────────────────────────────────────────────────── -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div class="flex items-center gap-3">
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Dossier Administrateur</span>
            <span v-if="bien" class="text-sm text-gray-400 font-mono">#{{ String(bien.id).slice(0,8).toUpperCase() }}</span>
            <span v-if="bien" :class="['px-2.5 py-0.5 rounded-full text-xs font-bold border', bienStatutClass(bien.statut)]">
              {{ bienStatutLabel(bien.statut) }}
            </span>
          </div>
          <button @click="$emit('close')" class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <span class="material-symbols-outlined text-[18px] text-gray-600">close</span>
          </button>
        </div>

        <!-- ── Skeleton ─────────────────────────────────────────────────────── -->
        <div v-if="isLoading" class="flex-1 overflow-y-auto p-6 space-y-4">
          <div v-for="i in 4" :key="i" class="animate-pulse space-y-2">
            <div class="h-4 bg-gray-100 rounded w-1/3"></div>
            <div class="h-32 bg-gray-100 rounded"></div>
          </div>
        </div>

        <!-- ── Erreur ────────────────────────────────────────────────────────── -->
        <div v-else-if="loadError" class="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <span class="material-symbols-outlined text-red-300 text-5xl mb-3">error_outline</span>
          <p class="text-red-500 font-semibold mb-4">{{ loadError }}</p>
          <button @click="loadBien" class="px-4 py-2 bg-[#1A56A0] text-white rounded-xl text-sm font-bold">Réessayer</button>
        </div>

        <!-- ── Contenu ───────────────────────────────────────────────────────── -->
        <div v-else-if="bien" class="flex-1 overflow-hidden flex flex-col">
          <div class="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0">

            <!-- ── Colonne gauche (7/12) ─────────────────────────────────────── -->
            <div class="lg:col-span-7 p-6 space-y-5 border-r border-gray-100">

              <!-- Titre & prix -->
              <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <h2 class="text-xl font-bold text-[#003e7e]">{{ bien.titre }}</h2>
                  <p class="flex items-center gap-1 text-gray-400 text-sm mt-1">
                    <span class="material-symbols-outlined text-[15px]">location_on</span>{{ bien.adresse }}
                  </p>
                </div>
                <div class="text-right flex-shrink-0">
                  <p class="text-xs text-gray-400">Prix</p>
                  <p class="text-xl font-bold text-[#003e7e]">{{ formatPrix(bien.prix) }}</p>
                </div>
              </div>

              <!-- Galerie -->
              <div v-if="allMedias.length > 0">
                <div class="relative h-64 rounded-xl overflow-hidden cursor-pointer group mb-2" @click="openLightbox(selectedIdx)">
                  <img v-if="!isVideo(currentMedia)" :src="currentMedia?.url" class="w-full h-full object-cover" />
                  <video v-else :src="currentMedia?.url" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span class="material-symbols-outlined text-white text-4xl">{{ isVideo(currentMedia) ? 'play_circle' : 'zoom_in' }}</span>
                  </div>
                  <div class="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-lg">
                    {{ selectedIdx + 1 }} / {{ allMedias.length }}
                  </div>
                </div>
                <div class="flex gap-2 overflow-x-auto pb-1">
                  <div
                    v-for="(m, i) in allMedias" :key="m.id ?? i"
                    class="relative w-16 h-12 rounded-lg overflow-hidden cursor-pointer flex-shrink-0 border-2 transition-all"
                    :class="selectedIdx === i ? 'border-[#1A56A0]' : 'border-transparent hover:border-gray-300'"
                    @click="selectedIdx = i"
                  >
                    <img v-if="!isVideo(m)" :src="m.url" class="w-full h-full object-cover" />
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
                  <span class="material-symbols-outlined text-[#1A56A0] text-[18px]">home</span>
                  <div><p class="text-[10px] text-gray-400">Type</p><p class="text-xs font-bold">{{ formatType(bien.type_bien) }}</p></div>
                </div>
                <div v-if="bien.surface" class="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
                  <span class="material-symbols-outlined text-[#1A56A0] text-[18px]">square_foot</span>
                  <div><p class="text-[10px] text-gray-400">Surface</p><p class="text-xs font-bold">{{ bien.surface }} m²</p></div>
                </div>
                <div v-if="bien.nb_pieces" class="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
                  <span class="material-symbols-outlined text-[#1A56A0] text-[18px]">bed</span>
                  <div><p class="text-[10px] text-gray-400">Pièces</p><p class="text-xs font-bold">{{ bien.nb_pieces }}</p></div>
                </div>
                <div class="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
                  <span class="material-symbols-outlined text-[#1A56A0] text-[18px]">sell</span>
                  <div><p class="text-[10px] text-gray-400">Transaction</p><p class="text-xs font-bold capitalize">{{ bien.type_transaction }}</p></div>
                </div>
              </div>

              <!-- Description -->
              <div v-if="bien.description">
                <h3 class="text-sm font-bold text-gray-700 mb-1">Description</h3>
                <p class="text-sm text-gray-500 leading-relaxed">{{ bien.description }}</p>
              </div>
            </div>

            <!-- ── Colonne droite (5/12) ────────────────────────────────────── -->
            <div class="lg:col-span-5 p-6 space-y-5 overflow-y-auto">

              <!-- Propriétaire -->
              <div class="bg-gray-50 rounded-xl p-4">
                <h3 class="text-sm font-bold text-gray-700 mb-3">Propriétaire</h3>
                <div v-if="bien.proprietaire" class="flex items-start gap-3">
                  <div class="w-10 h-10 rounded-full bg-[#1A56A0] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {{ initials(bien.proprietaire) }}
                  </div>
                  <div>
                    <p class="font-bold text-sm">{{ bien.proprietaire.first_name }} {{ bien.proprietaire.last_name }}</p>
                    <p class="text-xs text-gray-400">{{ bien.proprietaire.email }}</p>
                  </div>
                </div>
              </div>

              <!-- Agent assigné -->
              <div class="bg-gray-50 rounded-xl p-4">
                <h3 class="text-sm font-bold text-gray-700 mb-3">Agent assigné</h3>
                <div v-if="bien.agent" class="flex items-start gap-3">
                  <div class="w-10 h-10 rounded-full bg-[#EBF4FB] flex items-center justify-center text-[#1A56A0] font-bold text-sm flex-shrink-0">
                    {{ initials(bien.agent) }}
                  </div>
                  <div>
                    <p class="font-bold text-sm">{{ bien.agent.first_name }} {{ bien.agent.last_name }}</p>
                    <p class="text-xs text-gray-400">{{ bien.agent.email }}</p>
                  </div>
                </div>
                <p v-else class="text-xs text-gray-400 italic">Non assigné</p>
              </div>

              <!-- Rapport -->
              <div v-if="bien.rapport" class="border border-gray-100 rounded-xl overflow-hidden">
                <div class="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-[#1A56A0] text-[18px]">description</span>
                    <p class="font-bold text-sm text-gray-800">Rapport d'inspection</p>
                  </div>
                  
                </div>
                <div class="p-4">
                  <button
                    @click="$emit('openRapport', bien.rapport.id)"
                    class="w-full py-2.5 bg-[#1A56A0] text-white rounded-lg text-sm font-bold hover:opacity-90 flex items-center justify-center gap-2"
                  >
                    <span class="material-symbols-outlined text-[16px]">visibility</span>
                    Consulter le rapport
                  </button>
                </div>
              </div>
              <div v-else class="bg-gray-50 rounded-xl p-4 text-sm text-gray-400 text-center italic">
                Aucun rapport soumis pour ce bien.
              </div>

              <!-- Documents -->
              <div>
                <h3 class="text-sm font-bold text-gray-700 mb-3">Documents ({{ documents.length }})</h3>
                <div v-if="documents.length === 0" class="text-xs text-gray-400 italic">Aucun document soumis.</div>
                <div class="space-y-2">
                  <div
                    v-for="doc in documents" :key="doc.id"
                    class="flex items-center gap-2 p-2.5 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <span class="material-symbols-outlined text-gray-400 text-[18px] flex-shrink-0">{{ docIcon(doc) }}</span>
                    <button
                      @click="openDocument(doc)"
                      class="text-xs font-medium text-[#1A56A0] underline truncate flex-1 text-left hover:text-blue-800"
                    >
                      {{ doc.label ?? doc.type ?? 'Document' }}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- ── Footer Actions Admin ────────────────────────────────────────── -->
          <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3 flex-shrink-0">
            <button @click="$emit('close')" class="px-4 py-2 text-gray-500 hover:text-gray-700 text-sm font-semibold">
              Fermer
            </button>
            <div class="flex items-center gap-2">
              <button
                v-if="['en_attente','en_cours'].includes(bien.statut)"
                type="button"
                @click.stop.prevent="confirmPublish"
                class="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 flex items-center gap-1.5"
              >
                <span class="material-symbols-outlined text-[16px]">check_circle</span>Publier
              </button>
              <button
                v-if="['en_attente','en_cours'].includes(bien.statut)"
                type="button"
                @click.stop.prevent="confirmReject"
                class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 flex items-center gap-1.5"
              >
                <span class="material-symbols-outlined text-[16px]">cancel</span>Rejeter
              </button>
              <button
                v-if="bien.statut === 'publie'"
                @click="$emit('actionArchiver', bien)"
                class="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-bold hover:bg-gray-700 flex items-center gap-1.5"
              >
                <span class="material-symbols-outlined text-[16px]">archive</span>Archiver
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- ── Lightbox ─────────────────────────────────────────────────────────── -->
    <Transition name="fade">
      <div
        v-if="lightbox.open"
        class="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center"
        @click.self="lightbox.open = false"
        @keydown.escape.window="lightbox.open = false"
        @keydown.arrow-left.window="lightboxPrev"
        @keydown.arrow-right.window="lightboxNext"
      >
        <button class="absolute top-4 right-4 text-white/70 hover:text-white z-10" @click="lightbox.open = false">
          <span class="material-symbols-outlined text-[32px]">close</span>
        </button>
        <button v-if="allMedias.length > 1" class="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10" @click="lightboxPrev">
          <span class="material-symbols-outlined text-[40px]">chevron_left</span>
        </button>
        <div class="max-w-5xl max-h-[85vh] w-full px-16">
          <img v-if="!isVideo(allMedias[lightbox.index])" :src="allMedias[lightbox.index]?.url" class="max-w-full max-h-[85vh] object-contain mx-auto rounded-lg shadow-2xl" />
          <video v-else :src="allMedias[lightbox.index]?.url" controls autoplay class="max-w-full max-h-[85vh] mx-auto rounded-lg shadow-2xl" />
        </div>
        <button v-if="allMedias.length > 1" class="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10" @click="lightboxNext">
          <span class="material-symbols-outlined text-[40px]">chevron_right</span>
        </button>
        <p class="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm">{{ lightbox.index + 1 }} / {{ allMedias.length }}</p>
      </div>
    </Transition>

    <!-- ── Visionneuse document ───────────────────────────────────────────── -->
    <Transition name="fade">
      <div
        v-if="docViewer.open"
        class="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
        @click.self="docViewer.open = false"
        @keydown.escape.window="docViewer.open = false"
      >
        <div class="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
          <div class="flex items-center justify-between px-5 py-3 border-b border-gray-100 flex-shrink-0">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-gray-400 text-[20px]">{{ docIcon(docViewer.doc) }}</span>
              <span class="text-sm font-semibold text-gray-700 truncate max-w-xs">{{ docViewer.doc?.nom_original ?? 'Document' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <a v-if="docViewer.doc?.url" :href="docViewer.doc.url" target="_blank"
                class="text-xs px-3 py-1.5 bg-[#1A56A0] text-white rounded-lg font-bold hover:opacity-90">
                Ouvrir dans un nouvel onglet
              </a>
              <button @click="docViewer.open = false" class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                <span class="material-symbols-outlined text-[18px] text-gray-600">close</span>
              </button>
            </div>
          </div>
          <div class="flex-1 overflow-hidden bg-gray-100">
            <iframe v-if="isPdf(docViewer.doc)" :src="docViewer.doc.url" class="w-full h-full border-0" style="min-height:70vh" />
            <img v-else-if="isDocImage(docViewer.doc)" :src="docViewer.doc.url" class="max-w-full max-h-[70vh] object-contain mx-auto p-4" />
            <div v-else class="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
              <span class="material-symbols-outlined text-5xl">description</span>
              <p class="text-sm">Aperçu non disponible.</p>
              <a :href="docViewer.doc?.url" target="_blank" class="text-sm text-[#1A56A0] underline font-semibold">Télécharger</a>
            </div>
          </div>
        </div>
      </div>
    </Transition>

  </Teleport>
</template>

<script setup lang="ts">
import Swal from 'sweetalert2'
import { useAuthStore } from '~/stores/auth/auth'
import { useAdminBiensStore } from '~/stores/adminBiens'

const props = defineProps<{ bienId: string }>()
const emit  = defineEmits<{
  close: []
  openRapport: [id: string]
  actionPublier: [bien: any]
  actionRejeter: [bien: any]
  actionArchiver: [bien: any]
  refresh: []
}>()

const authStore = useAuthStore()
const adminStore = useAdminBiensStore()
const config    = useRuntimeConfig()
const apiBase   = config.public?.apiBase || 'http://localhost:8000/api'

// ── Cache partagé entre ouvertures (useState survit aux re-renders) ─────────
const biensCache = useState<Record<string, any>>('admin_biens_detail_cache', () => ({}))

// ── State ──────────────────────────────────────────────────────────────────
// Initialiser immédiatement depuis le cache si disponible
const bien        = ref<any>(biensCache.value[props.bienId] ?? null)
const isLoading   = ref(bien.value === null) // skeleton seulement si pas de cache
const loadError   = ref<string | null>(null)
const selectedIdx = ref(0)
const lightbox    = reactive({ open: false, index: 0 })
const docViewer   = reactive({ open: false, doc: null as any })

// ── Computed ───────────────────────────────────────────────────────────────
const medias    = computed(() => bien.value?.medias ?? [])
const documents = computed(() => bien.value?.documents ?? [])
const allMedias = computed(() => [
  ...medias.value.filter((m: any) => !isVideo(m)),
  ...medias.value.filter((m: any) => isVideo(m)),
])
const currentMedia = computed(() => allMedias.value[selectedIdx.value] ?? null)

// ── Chargement depuis /api/admin/biens/{id} ────────────────────────────────
async function loadBien() {
  // Si déjà en cache, rafraîchir silencieusement en arrière-plan
  const isSilent = biensCache.value[props.bienId] !== undefined
  if (!isSilent) isLoading.value = true
  loadError.value = null
  try {
    const data = await $fetch(`${apiBase}/admin/biens/${props.bienId}`, {
      headers: { Authorization: `Bearer ${authStore.token.value}` },
    }) as any
    bien.value = data.data ?? data
    // Mettre en cache
    biensCache.value = { ...biensCache.value, [props.bienId]: bien.value }
    // Sélectionner la photo principale
    const idx = allMedias.value.findIndex((m: any) => m.est_principale)
    selectedIdx.value = idx >= 0 ? idx : 0
  } catch (e: any) {
    if (!isSilent) loadError.value = e?.data?.message ?? 'Impossible de charger le dossier.'
  } finally {
    isLoading.value = false
  }
}

// ── Lightbox ───────────────────────────────────────────────────────────────
function openLightbox(i: number) { lightbox.index = i; lightbox.open = true }
function lightboxPrev() { lightbox.index = (lightbox.index - 1 + allMedias.value.length) % allMedias.value.length }
function lightboxNext() { lightbox.index = (lightbox.index + 1) % allMedias.value.length }

// ── Document viewer ────────────────────────────────────────────────────────
async function openDocument(doc: any) {
  if (!doc?.url) return
  try {
    // L'URL peut être relative (/api/...) ou absolue
    const fullUrl = doc.url.startsWith('http') ? doc.url : `${apiBase.replace('/api', '')}${doc.url}`
    const resp = await fetch(fullUrl, {
      headers: { Authorization: `Bearer ${authStore.token.value}` },
    })
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    const blob    = await resp.blob()
    const blobUrl = URL.createObjectURL(blob)
    docViewer.doc  = { ...doc, url: blobUrl }
  } catch (e) {
    console.error('Erreur ouverture document:', e)
    docViewer.doc = { ...doc }
  }
  docViewer.open = true
}

// ── Keyboard ───────────────────────────────────────────────────────────────
function handleEscape() {
  if (lightbox.open)   { lightbox.open = false; return }
  if (docViewer.open)  { docViewer.open = false; return }
  emit('close')
}

async function confirmPublish() {
  if (!bien.value) return
  const result = await Swal.fire({
    title: 'Publier ce bien ?',
    html: `<b>${bien.value.titre}</b> sera visible publiquement sur la plateforme.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Oui, publier',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#16a34a',
    cancelButtonColor: '#6b7280',
    reverseButtons: true,
  })
  if (!result.isConfirmed) return

  const res = await adminStore.updateStatut(bien.value.id, 'publie')
  if (res.success) {
    bien.value = { ...bien.value, statut: 'publie' }
    // Mettre à jour le cache avec le nouveau statut
    biensCache.value = { ...biensCache.value, [props.bienId]: bien.value }
    emit('refresh')
    Swal.fire({ icon: 'success', title: 'Bien publié', text: 'Le bien a bien été publié.', confirmButtonColor: '#1A56A0' })
  } else {
    Swal.fire({ icon: 'error', title: 'Erreur', text: res.message, confirmButtonColor: '#1A56A0' })
  }
}

async function confirmReject() {
  if (!bien.value) return
  const result = await Swal.fire({
    title: 'Rejeter ce bien ?',
    html: `<b>${bien.value.titre}</b>`,
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

  const res = await adminStore.updateStatut(bien.value.id, 'rejete', result.value)
  if (res.success) {
    bien.value = { ...bien.value, statut: 'rejete' }
    // Mettre à jour le cache avec le nouveau statut
    biensCache.value = { ...biensCache.value, [props.bienId]: bien.value }
    emit('refresh')
    Swal.fire({ icon: 'success', title: 'Bien rejeté', text: 'Le bien a bien été rejeté.', confirmButtonColor: '#1A56A0' })
  } else {
    Swal.fire({ icon: 'error', title: 'Erreur', text: res.message, confirmButtonColor: '#1A56A0' })
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────
function isVideo(m: any): boolean { return m?.type === 'video' || m?.mime_type?.startsWith('video/') }
function isPdf(d: any): boolean { return d?.mime_type?.includes('pdf') || d?.nom_original?.toLowerCase().endsWith('.pdf') }
function isDocImage(d: any): boolean { return d?.mime_type?.startsWith('image/') }
function docIcon(d: any): string {
  if (isPdf(d)) return 'picture_as_pdf'
  if (isDocImage(d)) return 'image'
  return 'description'
}
function initials(p: any): string {
  return ((p?.first_name?.[0] ?? '') + (p?.last_name?.[0] ?? '')).toUpperCase() || '?'
}
function formatPrix(p: number): string {
  if (p === null || p === undefined || p === 0) return '—'
  const amount = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(p)
  return `${amount} FCFA`
}
const typeLabels: Record<string,string> = {
  appartement:'Appartement', maison:'Maison', villa:'Villa', terrain:'Terrain', bureau_commerce:'Bureau/Commerce',
}
function formatType(t: string): string { return typeLabels[t] ?? t }
function bienStatutClass(s: string): string {
  if (s === 'en_attente') return 'bg-orange-50 text-orange-700 border-orange-200'
  if (s === 'en_cours')   return 'bg-blue-50 text-blue-700 border-blue-200'
  if (s === 'publie')     return 'bg-green-50 text-green-700 border-green-200'
  if (s === 'rejete')     return 'bg-red-50 text-red-700 border-red-200'
  return 'bg-gray-100 text-gray-500 border-gray-200'
}
function bienStatutLabel(s: string): string {
  const m: Record<string,string> = { en_attente:'EN ATTENTE', en_cours:'EN COURS', publie:'PUBLIÉ', rejete:'REJETÉ', archive:'ARCHIVÉ' }
  return m[s] ?? s?.toUpperCase() ?? '—'
}


onMounted(loadBien)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
