<template>
  <div class="p-8 pb-16 space-y-6">
    
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-extrabold text-[#1A56A0] tracking-tight flex items-center gap-2">
          <span class="material-symbols-outlined text-[32px]">gavel</span>
          Modèles de Contrats de Location
        </h1>
        <p class="text-sm text-gray-500 mt-1">Gérez, créez et personnalisez les modèles de baux juridiques de la plateforme ImmoPro</p>
      </div>

      <button
        @click="openCreateModal"
        class="flex items-center gap-2 px-5 py-2.5 bg-[#1A56A0] text-white rounded-xl text-sm font-semibold hover:bg-[#154d8e] transition-colors shadow-sm"
      >
        <span class="material-symbols-outlined text-[20px]">add_circle</span>
        Nouveau Modèle
      </button>
    </div>

    <!-- Stat Cards / Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Modèles enregistrés</span>
          <div class="text-2xl font-extrabold text-gray-800 mt-1">{{ templates.length }}</div>
        </div>
        <div class="w-12 h-12 rounded-xl bg-blue-50 text-[#1A56A0] flex items-center justify-center">
          <span class="material-symbols-outlined text-[26px]">description</span>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Modèle par Défaut</span>
          <div class="text-sm font-bold text-amber-700 mt-1 truncate max-w-[200px]">
            {{ defaultTemplate ? defaultTemplate.titre : 'Aucun' }}
          </div>
        </div>
        <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <span class="material-symbols-outlined text-[26px]">star</span>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Modèles Actifs</span>
          <div class="text-2xl font-extrabold text-emerald-600 mt-1">
            {{ activeCount }} / {{ templates.length }}
          </div>
        </div>
        <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <span class="material-symbols-outlined text-[26px]">check_circle</span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
      <div class="w-10 h-10 border-4 border-[#1A56A0] border-t-transparent rounded-full animate-spin"></div>
      <p class="text-sm text-gray-500 mt-3 font-medium">Chargement des modèles de contrats...</p>
    </div>

    <!-- Grid of Contract Templates -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="tpl in templates"
        :key="tpl.id"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group"
      >
        <!-- Card Header -->
        <div class="p-5 border-b border-gray-50 bg-gradient-to-r from-gray-50/50 to-white flex-1">
          <div class="flex items-start justify-between gap-2 mb-3">
            <!-- Type Badge -->
            <span :class="getTypeBadgeClass(tpl.type)" class="px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider">
              {{ getTypeLabel(tpl.type) }}
            </span>

            <!-- Status Badges -->
            <div class="flex items-center gap-1.5">
              <span
                v-if="tpl.est_defaut"
                class="px-2.5 py-1 bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-sm"
              >
                <span class="material-symbols-outlined text-[13px]">star</span>
                Par défaut
              </span>

              <span
                :class="tpl.est_actif ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-400 border-gray-200'"
                class="px-2 py-0.5 border rounded-md text-[11px] font-semibold"
              >
                {{ tpl.est_actif ? 'Actif' : 'Inactif' }}
              </span>
            </div>
          </div>

          <h3 class="text-base font-bold text-gray-800 group-hover:text-[#1A56A0] transition-colors line-clamp-2">
            {{ tpl.titre }}
          </h3>

          <p class="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">
            {{ tpl.description || 'Aucune description fournie pour ce modèle de contrat.' }}
          </p>
        </div>

        <!-- Card Actions Footer -->
        <div class="p-4 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between gap-2">
          <div class="flex items-center gap-1">
            <!-- Button Lire (Direct Read / View) -->
            <button
              @click="openReadModal(tpl)"
              title="Consulter et lire ce contrat"
              class="px-2.5 py-1.5 bg-[#EBF4FB] text-[#1A56A0] hover:bg-[#1A56A0] hover:text-white rounded-xl transition-colors flex items-center gap-1 text-xs font-bold"
            >
              <span class="material-symbols-outlined text-[16px]">visibility</span>
              Lire
            </button>

            <!-- Button Modifier -->
            <button
              @click="openEditModal(tpl)"
              title="Modifier ce modèle"
              class="p-2 text-gray-600 hover:text-[#1A56A0] hover:bg-blue-50 rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold"
            >
              <span class="material-symbols-outlined text-[18px]">edit</span>
            </button>

            <!-- Button Dupliquer -->
            <button
              @click="duplicateTemplate(tpl)"
              title="Dupliquer le modèle"
              class="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-xl transition-colors"
            >
              <span class="material-symbols-outlined text-[18px]">content_copy</span>
            </button>

            <!-- Button Supprimer -->
            <button
              v-if="!tpl.est_defaut"
              @click="confirmDelete(tpl)"
              title="Supprimer ce modèle"
              class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <span class="material-symbols-outlined text-[18px]">delete</span>
            </button>
          </div>

          <button
            v-if="!tpl.est_defaut"
            @click="setDefault(tpl)"
            class="px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors flex items-center gap-1"
          >
            <span class="material-symbols-outlined text-[14px]">star</span>
            Par défaut
          </button>
        </div>
      </div>
    </div>

    <!-- Read / Direct View Modal -->
    <Teleport to="body">
      <div
        v-if="readModalTemplate"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      >
        <div class="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
          
          <!-- Modal Header -->
          <div class="px-6 py-4 bg-[#0d3a6e] text-white flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-blue-300 text-[24px]">menu_book</span>
              <div>
                <h2 class="text-base font-bold">{{ readModalTemplate.titre }}</h2>
                <p class="text-xs text-blue-200 font-medium">Document officiel généré (Aperçu avec données d'exemple)</p>
              </div>
            </div>
            <button @click="readModalTemplate = null" class="p-1.5 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Document Render Area -->
          <div class="flex-1 overflow-y-auto p-6 bg-gray-100">
            <div
              class="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 max-w-3xl mx-auto min-h-[500px]"
              v-html="readModalPreviewHtml"
            ></div>
          </div>

          <!-- Modal Footer -->
          <div class="px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-between">
            <span class="text-xs text-gray-500 font-medium flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Document prêt à l'emploi
            </span>
            <div class="flex items-center gap-3">
              <button
                @click="openEditModal(readModalTemplate); readModalTemplate = null"
                class="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-50 text-[#1A56A0] hover:bg-blue-100 border border-blue-200 flex items-center gap-1.5 transition-colors"
              >
                <span class="material-symbols-outlined text-[16px]">edit</span>
                Modifier le modèle
              </button>
              <button
                @click="readModalTemplate = null"
                class="px-5 py-2 text-xs font-semibold rounded-xl bg-[#1A56A0] hover:bg-[#154d8e] text-white shadow-md transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>

        </div>
      </div>
    </Teleport>

    <!-- Modal Form Editor (Dual Mode: Mode Visuel Simple VS Mode Code HTML) -->
    <Teleport to="body">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      >
        <div class="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-6xl w-full max-h-[92vh] flex flex-col overflow-hidden">
          
          <!-- Modal Header -->
          <div class="px-6 py-4 bg-[#0d3a6e] text-white flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-blue-300 text-[24px]">edit_document</span>
              <h2 class="text-lg font-bold">
                {{ editingId ? 'Modifier le modèle de contrat' : 'Créer un nouveau modèle de contrat' }}
              </h2>
            </div>
            <button @click="closeModal" class="p-1.5 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Modal Body Content -->
          <div class="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <!-- Left Column: Placeholders Sidebar (4 cols) -->
            <div class="lg:col-span-4 bg-gray-50 border border-gray-200 rounded-2xl p-4 flex flex-col gap-3">
              <div>
                <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span class="material-symbols-outlined text-[#1A56A0] text-[18px]">data_object</span>
                  Variables Dynamiques
                </h3>
                <p class="text-[11px] text-gray-500 mt-0.5 leading-snug">
                  Cliquez sur n'importe quelle variable pour l'insérer automatiquement dans le contrat.
                </p>
              </div>

              <div class="space-y-2 overflow-y-auto max-h-[52vh] pr-1">
                <div
                  v-for="(desc, tag) in placeholders"
                  :key="tag"
                  @click="insertPlaceholder(tag)"
                  class="p-2.5 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl cursor-pointer transition-all group"
                >
                  <div class="flex items-center justify-between font-mono text-xs font-bold text-[#1A56A0] group-hover:text-blue-800">
                    <span>{{ tag }}</span>
                    <span class="material-symbols-outlined text-[14px] opacity-0 group-hover:opacity-100 transition-opacity">add_circle</span>
                  </div>
                  <div class="text-[11px] text-gray-500 mt-0.5">{{ desc }}</div>
                </div>
              </div>

              <div class="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-blue-900 text-[11px] flex items-start gap-2 mt-auto">
                <span class="material-symbols-outlined text-[16px] text-[#1A56A0] shrink-0">info</span>
                <span>Ces balises sont automatiquement remplacées lors de la réservation par les données du locataire et du bien.</span>
              </div>
            </div>

            <!-- Right Column: Metadata + Dual Mode Editor (8 cols) -->
            <div class="lg:col-span-8 space-y-4 flex flex-col">
              
              <!-- Metadata Fields -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Titre du modèle *</label>
                  <input
                    v-model="form.titre"
                    type="text"
                    placeholder="Ex: Bail d'habitation..."
                    class="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-[#1A56A0] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-gray-700 mb-1">Catégorie / Type de contrat *</label>
                  <select
                    v-model="form.type"
                    class="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-[#1A56A0] focus:border-transparent outline-none bg-white"
                  >
                    <option value="habitation">Habitation (Maison, Villa, Appartement)</option>
                    <option value="commercial">Commercial (Bureau, Commerce, Boutique)</option>
                    <option value="meuble">Location meublée & courte durée</option>
                    <option value="autre">Autre contrat spécifique</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Description explicative</label>
                <input
                  v-model="form.description"
                  type="text"
                  placeholder="Description du contrat..."
                  class="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:ring-2 focus:ring-[#1A56A0] focus:border-transparent outline-none"
                />
              </div>

              <!-- Toggles -->
              <div class="flex items-center gap-6 py-1">
                <label class="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    v-model="form.est_defaut"
                    class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span>Définir comme modèle par défaut</span>
                </label>

                <label class="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    v-model="form.est_actif"
                    class="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                  />
                  <span>Actif (disponible)</span>
                </label>
              </div>

              <!-- Dual Mode Selector Header -->
              <div class="flex items-center justify-between pt-2 border-t border-gray-100">
                <div class="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                  <button
                    type="button"
                    @click="switchEditorMode('visuel')"
                    :class="editorMode === 'visuel' ? 'bg-white text-[#1A56A0] shadow-xs font-bold' : 'text-gray-600 hover:text-gray-900 font-medium'"
                    class="px-3 py-1.5 text-xs rounded-lg transition-all flex items-center gap-1.5"
                  >
                    <span class="material-symbols-outlined text-[16px]">edit_note</span>
                    Mode Visuel (Sans code)
                  </button>

                  <button
                    type="button"
                    @click="switchEditorMode('html')"
                    :class="editorMode === 'html' ? 'bg-white text-[#1A56A0] shadow-xs font-bold' : 'text-gray-600 hover:text-gray-900 font-medium'"
                    class="px-3 py-1.5 text-xs rounded-lg transition-all flex items-center gap-1.5"
                  >
                    <span class="material-symbols-outlined text-[16px]">code</span>
                    Mode Code HTML (Avancé)
                  </button>
                </div>

                <button
                  type="button"
                  @click="togglePreviewMode"
                  class="px-3 py-1.5 text-xs font-semibold rounded-xl border border-gray-300 hover:bg-gray-100 text-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <span class="material-symbols-outlined text-[16px]">{{ isPreviewMode ? 'edit' : 'visibility' }}</span>
                  {{ isPreviewMode ? 'Retour à l\'édition' : 'Aperçu rendu final' }}
                </button>
              </div>

              <!-- Mode Visuel Toolbar (Formatted Blocks) -->
              <div v-if="editorMode === 'visuel' && !isPreviewMode" class="flex items-center gap-1 p-2 bg-gray-50 border border-gray-200 rounded-xl flex-wrap">
                <span class="text-[11px] font-bold text-gray-500 uppercase mr-2">Outils de saisie :</span>
                <button @click="execCommand('bold')" type="button" title="Gras" class="p-1.5 hover:bg-gray-200 rounded text-gray-700 font-bold text-xs">B</button>
                <button @click="execCommand('italic')" type="button" title="Italique" class="p-1.5 hover:bg-gray-200 rounded text-gray-700 italic text-xs">I</button>
                <button @click="execCommand('underline')" type="button" title="Souligné" class="p-1.5 hover:bg-gray-200 rounded text-gray-700 underline text-xs">U</button>
                <div class="h-4 w-px bg-gray-300 mx-1"></div>
                <button @click="insertVisualBlock('h2')" type="button" class="px-2 py-1 bg-white hover:bg-blue-50 border border-gray-200 rounded text-[11px] font-bold text-[#1A56A0]">Titre H2</button>
                <button @click="insertVisualBlock('h3')" type="button" class="px-2 py-1 bg-white hover:bg-blue-50 border border-gray-200 rounded text-[11px] font-semibold text-[#1A56A0]">Sous-titre H3</button>
                <button @click="insertVisualBlock('box')" type="button" class="px-2 py-1 bg-white hover:bg-blue-50 border border-gray-200 rounded text-[11px] font-semibold text-slate-700">Encadré Info</button>
                <button @click="insertVisualBlock('hr')" type="button" class="px-2 py-1 bg-white hover:bg-gray-100 border border-gray-200 rounded text-[11px] text-gray-600">Ligne Séparation</button>
              </div>

              <!-- Main Content Container (Visual contenteditable vs Raw Textarea vs Preview) -->
              <div class="flex-1 flex flex-col min-h-[360px]">
                
                <!-- 1. Mode Visuel Editable View (For non-programmers) -->
                <div
                  v-if="editorMode === 'visuel' && !isPreviewMode"
                  ref="visualEditorRef"
                  contenteditable="true"
                  @input="onVisualInput"
                  class="w-full h-[380px] overflow-y-auto p-6 rounded-xl border border-gray-300 bg-white text-slate-900 text-sm leading-relaxed focus:ring-2 focus:ring-[#1A56A0] focus:border-transparent outline-none shadow-inner"
                ></div>

                <!-- 2. Mode Code HTML Raw Textarea (For advanced users) -->
                <textarea
                  v-else-if="editorMode === 'html' && !isPreviewMode"
                  ref="editorRef"
                  v-model="form.contenu_html"
                  rows="14"
                  class="w-full p-4 rounded-xl border border-gray-300 font-mono text-xs text-gray-800 focus:ring-2 focus:ring-[#1A56A0] focus:border-transparent outline-none leading-relaxed resize-none flex-1"
                  placeholder="Rédigez ou collez le code HTML ici..."
                ></textarea>

                <!-- 3. Preview Mode -->
                <div
                  v-else
                  class="w-full h-[380px] overflow-y-auto p-6 bg-white border border-gray-300 rounded-xl shadow-inner text-gray-900 text-sm"
                  v-html="previewHtml"
                ></div>
              </div>

            </div>

          </div>

          <!-- Modal Footer -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              @click="closeModal"
              class="px-4 py-2 text-xs font-semibold rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 transition-colors"
            >
              Annuler
            </button>
            <button
              @click="saveTemplate"
              :disabled="isSaving"
              class="px-5 py-2 text-xs font-semibold rounded-xl bg-[#1A56A0] hover:bg-[#154d8e] text-white shadow-md disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              <span class="material-symbols-outlined text-[16px]">save</span>
              {{ isSaving ? 'Enregistrement...' : 'Enregistrer le Modèle' }}
            </button>
          </div>

        </div>
      </div>
    </Teleport>

    <!-- Confirm Delete Modal -->
    <Teleport to="body">
      <div
        v-if="templateToDelete"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <div class="bg-white rounded-2xl border border-gray-100 shadow-xl max-w-md w-full p-6 space-y-4">
          <div class="flex items-center gap-3 text-red-600">
            <span class="material-symbols-outlined text-[32px]">warning</span>
            <h3 class="text-base font-bold">Confirmer la suppression</h3>
          </div>
          <p class="text-xs text-gray-600 leading-relaxed">
            Êtes-vous sûr de vouloir supprimer le modèle de contrat <strong>"{{ templateToDelete.titre }}"</strong> ?
            Cette action est irréversible.
          </p>
          <div class="flex items-center justify-end gap-3 pt-2">
            <button
              @click="templateToDelete = null"
              class="px-4 py-2 text-xs font-semibold rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700"
            >
              Annuler
            </button>
            <button
              @click="deleteTemplate"
              :disabled="isDeleting"
              class="px-4 py-2 text-xs font-semibold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-md"
            >
              {{ isDeleting ? 'Suppression...' : 'Oui, Supprimer' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Toast Notification Message -->
    <Teleport to="body">
      <div
        v-if="toast.message"
        :class="toast.isError ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'"
        class="fixed bottom-6 right-6 px-4 py-3 rounded-xl shadow-lg z-50 text-xs font-bold flex items-center gap-2"
      >
        <span class="material-symbols-outlined text-[18px]">
          {{ toast.isError ? 'error' : 'check_circle' }}
        </span>
        <span>{{ toast.message }}</span>
      </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useContratsStore } from '~/stores/contrats'

definePageMeta({ layout: 'admin' })

const contratsStore = useContratsStore()
const { templates, placeholders, isLoading } = contratsStore

interface TemplateItem {
  id: string
  titre: string
  description?: string
  type: string
  contenu_html: string
  est_actif: boolean
  est_defaut: boolean
}

const isModalOpen = ref(false)
const editingId = ref<string | null>(null)
const isSaving = ref(false)
const isPreviewMode = ref(false)
const previewHtml = ref('')
const editorRef = ref<HTMLTextAreaElement | null>(null)
const visualEditorRef = ref<HTMLDivElement | null>(null)

// Mode d'édition: 'visuel' (Simple sans code) vs 'html' (Code avancé)
const editorMode = ref<'visuel' | 'html'>('visuel')

// Modal de lecture directe
const readModalTemplate = ref<TemplateItem | null>(null)
const readModalPreviewHtml = ref('')

const templateToDelete = ref<TemplateItem | null>(null)
const isDeleting = ref(false)

const toast = ref({ message: '', isError: false })

const form = ref({
  titre: '',
  description: '',
  type: 'habitation',
  contenu_html: '',
  est_actif: true,
  est_defaut: false,
})

const defaultTemplate = computed(() => templates.value.find((t: any) => t.est_defaut))
const activeCount = computed(() => templates.value.filter((t: any) => t.est_actif).length)

async function openReadModal(tpl: TemplateItem) {
  readModalTemplate.value = tpl
  readModalPreviewHtml.value = '<div class="p-8 text-center text-gray-500 font-medium">Chargement de l\'aperçu...</div>'
  const res = await contratsStore.previewTemplate(tpl.contenu_html)
  readModalPreviewHtml.value = res.previewHtml
}

function openCreateModal() {
  editingId.value = null
  form.value = {
    titre: '',
    description: '',
    type: 'habitation',
    contenu_html: getDefaultSampleHtml(),
    est_actif: true,
    est_defaut: templates.value.length === 0,
  }
  editorMode.value = 'visuel'
  isPreviewMode.value = false
  isModalOpen.value = true

  nextTick(() => {
    syncVisualEditorContent()
  })
}

function openEditModal(tpl: TemplateItem) {
  editingId.value = tpl.id
  form.value = {
    titre: tpl.titre,
    description: tpl.description || '',
    type: tpl.type || 'habitation',
    contenu_html: tpl.contenu_html || '',
    est_actif: tpl.est_actif,
    est_defaut: tpl.est_defaut,
  }
  editorMode.value = 'visuel'
  isPreviewMode.value = false
  isModalOpen.value = true

  nextTick(() => {
    syncVisualEditorContent()
  })
}

function switchEditorMode(mode: 'visuel' | 'html') {
  if (editorMode.value === mode) return
  if (editorMode.value === 'visuel' && visualEditorRef.value) {
    form.value.contenu_html = visualEditorRef.value.innerHTML
  }
  editorMode.value = mode
  if (mode === 'visuel') {
    nextTick(() => syncVisualEditorContent())
  }
}

function syncVisualEditorContent() {
  if (visualEditorRef.value) {
    visualEditorRef.value.innerHTML = form.value.contenu_html
  }
}

function onVisualInput() {
  if (visualEditorRef.value) {
    form.value.contenu_html = visualEditorRef.value.innerHTML
  }
}

function execCommand(command: string) {
  document.execCommand(command, false, undefined)
  onVisualInput()
}

function insertVisualBlock(type: string) {
  let htmlSnippet = ''
  switch (type) {
    case 'h2':
      htmlSnippet = '<h2 style="font-size: 18px; font-weight: bold; color: #003E7E; margin-top: 16px; margin-bottom: 8px;">Titre de section</h2>'
      break
    case 'h3':
      htmlSnippet = '<h3 style="font-size: 15px; font-weight: bold; color: #003E7E; margin-top: 12px; margin-bottom: 6px;">Sous-titre de clause</h3>'
      break
    case 'box':
      htmlSnippet = '<div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 12px; border-radius: 6px; margin: 12px 0;"><p style="margin:0;">Informations particulières...</p></div>'
      break
    case 'hr':
      htmlSnippet = '<hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 16px 0;" />'
      break
  }

  if (editorMode.value === 'visuel' && visualEditorRef.value) {
    visualEditorRef.value.focus()
    document.execCommand('insertHTML', false, htmlSnippet)
    onVisualInput()
  } else {
    form.value.contenu_html += `\n${htmlSnippet}\n`
  }
}

function duplicateTemplate(tpl: TemplateItem) {
  editingId.value = null
  form.value = {
    titre: `${tpl.titre} (Copie)`,
    description: tpl.description || '',
    type: tpl.type || 'habitation',
    contenu_html: tpl.contenu_html || '',
    est_actif: true,
    est_defaut: false,
  }
  editorMode.value = 'visuel'
  isPreviewMode.value = false
  isModalOpen.value = true
  nextTick(() => syncVisualEditorContent())
}

function closeModal() {
  isModalOpen.value = false
}

async function saveTemplate() {
  if (editorMode.value === 'visuel' && visualEditorRef.value) {
    form.value.contenu_html = visualEditorRef.value.innerHTML
  }

  if (!form.value.titre.trim() || !form.value.contenu_html.trim()) {
    showToast('Le titre et le contenu du contrat sont obligatoires.', true)
    return
  }

  isSaving.value = true

  try {
    let res
    if (editingId.value) {
      res = await contratsStore.updateTemplate(editingId.value, form.value)
    } else {
      res = await contratsStore.createTemplate(form.value)
    }

    if (res.success) {
      showToast(res.message || 'Modèle de contrat enregistré avec succès !', false)
      closeModal()
    } else {
      showToast(res.message || 'Erreur lors de la sauvegarde.', true)
    }
  } catch (e: any) {
    showToast('Erreur lors de l\'enregistrement.', true)
  } finally {
    isSaving.value = false
  }
}

async function setDefault(tpl: TemplateItem) {
  const res = await contratsStore.setDefaultTemplate(tpl.id)
  if (res.success) {
    showToast(res.message || 'Modèle par défaut mis à jour !', false)
  } else {
    showToast(res.message || 'Erreur lors du changement.', true)
  }
}

function confirmDelete(tpl: TemplateItem) {
  templateToDelete.value = tpl
}

async function deleteTemplate() {
  if (!templateToDelete.value) return
  isDeleting.value = true

  try {
    const res = await contratsStore.deleteTemplate(templateToDelete.value.id)
    if (res.success) {
      showToast(res.message || 'Modèle supprimé avec succès.', false)
      templateToDelete.value = null
    } else {
      showToast(res.message || 'Erreur lors de la suppression.', true)
    }
  } catch (e: any) {
    showToast('Erreur lors de la suppression.', true)
  } finally {
    isDeleting.value = false
  }
}

async function togglePreviewMode() {
  if (!isPreviewMode.value) {
    if (editorMode.value === 'visuel' && visualEditorRef.value) {
      form.value.contenu_html = visualEditorRef.value.innerHTML
    }
    const res = await contratsStore.previewTemplate(form.value.contenu_html)
    previewHtml.value = res.previewHtml
    isPreviewMode.value = true
  } else {
    isPreviewMode.value = false
    nextTick(() => {
      if (editorMode.value === 'visuel') syncVisualEditorContent()
    })
  }
}

function insertPlaceholder(tag: string) {
  if (isPreviewMode.value) isPreviewMode.value = false

  if (editorMode.value === 'visuel' && visualEditorRef.value) {
    visualEditorRef.value.focus()
    const formattedTag = ` <strong>${tag}</strong> `
    document.execCommand('insertHTML', false, formattedTag)
    onVisualInput()
    return
  }

  const textarea = editorRef.value
  if (!textarea) {
    form.value.contenu_html += ` ${tag} `
    return
  }

  const start = textarea.selectionStart ?? form.value.contenu_html.length
  const end = textarea.selectionEnd ?? form.value.contenu_html.length

  form.value.contenu_html =
    form.value.contenu_html.substring(0, start) +
    tag +
    form.value.contenu_html.substring(end)

  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + tag.length, start + tag.length)
  })
}

function getTypeLabel(type: string) {
  switch (type) {
    case 'habitation': return 'Habitation (Maison, Villa, Appartement)'
    case 'commercial': return 'Commercial (Bureau, Commerce, Boutique)'
    case 'meuble': return 'Meublé (Courte durée, Résidence)'
    default: return 'Autre catégorie'
  }
}

function getTypeBadgeClass(type: string) {
  switch (type) {
    case 'habitation': return 'bg-blue-100 text-[#1A56A0] border border-blue-200'
    case 'commercial': return 'bg-emerald-100 text-emerald-800 border border-emerald-200'
    case 'meuble': return 'bg-indigo-100 text-indigo-800 border border-indigo-200'
    default: return 'bg-amber-100 text-amber-800 border border-amber-200'
  }
}

function showToast(message: string, isError = false) {
  toast.value = { message, isError }
  setTimeout(() => {
    toast.value = { message: '', isError: false }
  }, 4000)
}

function getDefaultSampleHtml() {
  return `<div class="contract-document" style="font-family: Arial, sans-serif; color: #1e293b; line-height: 1.6;">
    <h2 style="text-align: center; color: #003E7E; text-transform: uppercase;">CONTRAT DE BAIL</h2>
    <p>Entre le bailleur <strong>{NOM_PROPRIETAIRE}</strong> et le locataire <strong>{NOM_LOCATAIRE}</strong>.</p>
    <p>Pour le bien situé à : <strong>{ADRESSE_BIEN}</strong>.</p>
    <p>Montant du loyer mensuel : <strong>{LOYER_MENSUEL}</strong>.</p>
</div>`
}

onMounted(() => {
  contratsStore.fetchTemplates()
})
</script>
