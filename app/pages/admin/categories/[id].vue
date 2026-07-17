<template>
  <div class="p-8 pb-16">

    <!-- ── En-tête ── -->
    <div class="flex items-center gap-4 mb-8">
      <button @click="$router.push('/admin/categories')"
        class="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors flex-shrink-0">
        <ArrowLeft :size="18" class="text-gray-600" />
      </button>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-3">
          <div v-if="categorie" :class="['w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', categoryBg(categorie.slug)]">
            <component :is="categoryIcon(categorie.slug)" :size="20" :class="categoryIconColor(categorie.slug)" />
          </div>
          <div class="min-w-0">
            <h1 class="text-2xl font-extrabold text-[#1A56A0] tracking-tight truncate">
              {{ categorie?.nom ?? '...' }}
            </h1>
            <p class="text-sm text-gray-400 mt-0.5">
              <span class="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{{ categorie?.slug }}</span>
              <span class="ml-2">· {{ attributsActifs.length }} champs actifs</span>
            </p>
          </div>
        </div>
      </div>
      <button @click="openAddAttribut"
        class="flex items-center gap-2 px-4 py-2.5 bg-[#1A56A0] text-white rounded-xl text-sm font-semibold hover:bg-[#154d8e] transition-colors shadow-sm flex-shrink-0">
        <PlusCircle :size="16" />
        Ajouter un champ
      </button>
    </div>

    <!-- ── Skeleton ── -->
    <div v-if="isLoading" class="space-y-3">
      <div v-for="i in 8" :key="i" class="bg-white rounded-xl border border-gray-100 p-4 animate-pulse flex items-center gap-4">
        <div class="w-8 h-8 bg-gray-100 rounded-lg flex-shrink-0" />
        <div class="flex-1 space-y-2">
          <div class="h-3.5 bg-gray-100 rounded w-1/4" />
          <div class="h-3 bg-gray-100 rounded w-1/3" />
        </div>
        <div class="h-6 w-16 bg-gray-100 rounded-full" />
        <div class="flex gap-2">
          <div class="w-8 h-8 bg-gray-100 rounded-lg" />
          <div class="w-8 h-8 bg-gray-100 rounded-lg" />
        </div>
      </div>
    </div>

    <!-- ── Contenu ── -->
    <div v-else-if="categorie">

      <!-- Section champs socle -->
      <div class="mb-6">
        <div class="flex items-center gap-2 mb-3">
          <ShieldCheck :size="16" class="text-[#1A56A0]" />
          <h2 class="text-xs font-bold text-gray-500 uppercase tracking-wider">Champs socle</h2>
          <span class="text-xs text-gray-400">(verrouillés — non modifiables)</span>
        </div>
        <div class="space-y-2">
          <div v-for="attr in attributsSocle" :key="attr.id"
            class="bg-[#EBF4FB]/60 border border-[#1A56A0]/10 rounded-xl p-4 flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-[#1A56A0]/10 flex items-center justify-center flex-shrink-0">
              <component :is="typeIcon(attr.type_champ)" :size="15" class="text-[#1A56A0]" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-semibold text-sm text-gray-800">{{ attr.label_affiche }}</span>
                <span class="font-mono text-[11px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{{ attr.nom_champ }}</span>
                <span v-if="attr.obligatoire"
                  class="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded-full">
                  Obligatoire
                </span>
              </div>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-[11px] text-gray-400 flex items-center gap-1">
                  <component :is="typeIcon(attr.type_champ)" :size="11" />
                  {{ typeLabel(attr.type_champ) }}
                </span>
                <span v-if="attr.type_champ === 'enum' && attr.options_enum?.length"
                  class="text-[11px] text-gray-400">
                  · {{ attr.options_enum.join(', ') }}
                </span>
              </div>
            </div>
            <div class="flex items-center gap-1.5 flex-shrink-0">
              <span class="flex items-center gap-1 text-[11px] text-[#1A56A0] font-bold bg-[#1A56A0]/10 px-2 py-1 rounded-lg">
                <Lock :size="11" />
                Socle
              </span>
            </div>
          </div>
          <div v-if="attributsSocle.length === 0" class="text-xs text-gray-400 px-2">
            Aucun champ socle pour cette catégorie.
          </div>
        </div>
      </div>

      <!-- Section champs dynamiques -->
      <div>
        <div class="flex items-center gap-2 mb-3">
          <Sliders :size="16" class="text-gray-500" />
          <h2 class="text-xs font-bold text-gray-500 uppercase tracking-wider">Champs dynamiques</h2>
          <span class="text-xs text-gray-400">(modifiables par l'admin)</span>
        </div>

        <div v-if="attributsDynamiques.length === 0"
          class="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-10 text-center">
          <LayoutList :size="36" class="text-gray-200 mx-auto mb-3" />
          <p class="text-gray-400 text-sm font-medium">Aucun champ dynamique</p>
          <button @click="openAddAttribut"
            class="mt-3 flex items-center gap-1.5 mx-auto px-4 py-2 bg-[#1A56A0] text-white text-xs font-bold rounded-xl">
            <PlusCircle :size="14" />
            Ajouter le premier champ
          </button>
        </div>

        <div v-else class="space-y-2">
          <div v-for="attr in attributsDynamiques" :key="attr.id"
            :class="['bg-white border rounded-xl p-4 flex items-center gap-3 transition-all',
              attr.actif ? 'border-gray-100 shadow-sm' : 'border-gray-100 opacity-60']">

            <!-- Icône type -->
            <div :class="['w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
              attr.actif ? 'bg-gray-100' : 'bg-gray-50']">
              <component :is="typeIcon(attr.type_champ)" :size="15"
                :class="attr.actif ? 'text-gray-600' : 'text-gray-300'" />
            </div>

            <!-- Infos -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-semibold text-sm text-gray-800">{{ attr.label_affiche }}</span>
                <span class="font-mono text-[11px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{{ attr.nom_champ }}</span>
                <span v-if="attr.obligatoire"
                  class="text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-100 px-1.5 py-0.5 rounded-full">
                  Obligatoire
                </span>
                <span v-if="!attr.actif"
                  class="text-[10px] font-bold text-gray-400 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded-full">
                  Désactivé
                </span>
              </div>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-[11px] text-gray-400 flex items-center gap-1">
                  <component :is="typeIcon(attr.type_champ)" :size="11" />
                  {{ typeLabel(attr.type_champ) }}
                </span>
                <span v-if="attr.type_champ === 'enum' && attr.options_enum?.length"
                  class="text-[11px] text-gray-400 truncate max-w-[200px]">
                  · {{ attr.options_enum.join(', ') }}
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-1.5 flex-shrink-0">
              <!-- Modifier -->
              <button @click="openEditAttribut(attr)"
                class="w-8 h-8 rounded-lg bg-gray-50 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors"
                title="Modifier">
                <Pencil :size="14" />
              </button>
              <!-- Toggle actif -->
              <button @click="handleToggle(attr)"
                :class="['w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                  attr.actif
                    ? 'bg-orange-50 text-orange-500 hover:bg-orange-100'
                    : 'bg-green-50 text-green-600 hover:bg-green-100']"
                :title="attr.actif ? 'Désactiver' : 'Activer'">
                <component :is="attr.actif ? EyeOff : Eye" :size="14" />
              </button>
              <!-- Supprimer -->
              <button @click="handleDelete(attr)"
                class="w-8 h-8 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors"
                title="Supprimer">
                <Trash2 :size="14" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Toast ── -->
    <Transition name="toast">
      <div v-if="toast"
        :class="['fixed top-6 right-6 z-[60] flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg text-sm font-semibold',
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white']">
        <component :is="toast.type === 'success' ? CheckCircle2 : XCircle" :size="18" />
        {{ toast.message }}
      </div>
    </Transition>

    <!-- ── Modal Ajouter / Modifier attribut ── -->
    <Teleport to="body">
      <div v-if="attrModal.open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        @click.self="attrModal.open = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">

          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
            <div class="flex items-center gap-2">
              <component :is="attrModal.mode === 'add' ? PlusCircle : Pencil" :size="18" class="text-[#1A56A0]" />
              <h2 class="text-lg font-bold text-[#1A56A0]">
                {{ attrModal.mode === 'add' ? 'Nouveau champ' : 'Modifier le champ' }}
              </h2>
            </div>
            <button @click="attrModal.open = false"
              class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
              <X :size="16" class="text-gray-600" />
            </button>
          </div>

          <!-- Formulaire -->
          <form @submit.prevent="submitAttr" class="flex-1 overflow-y-auto p-6 space-y-4">

            <!-- Nom technique (uniquement à la création) -->
            <div v-if="attrModal.mode === 'add'">
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Nom technique *
                <span class="text-gray-400 font-normal normal-case ml-1">(clé JSON, ex: nb_chambres)</span>
              </label>
              <input v-model="attrForm.nom_champ" type="text" placeholder="ex: nb_chambres"
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono outline-none focus:ring-2 focus:ring-[#1A56A0]/20 focus:border-[#1A56A0]"
                pattern="[a-z0-9_]+" title="Minuscules, chiffres et _ uniquement" required />
            </div>

            <!-- Label affiché -->
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Label affiché *</label>
              <input v-model="attrForm.label_affiche" type="text" placeholder="ex: Nombre de chambres"
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1A56A0]/20 focus:border-[#1A56A0]"
                required />
            </div>

            <!-- Type de champ (uniquement à la création) -->
            <div v-if="attrModal.mode === 'add'">
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Type de champ *</label>
              <div class="grid grid-cols-3 gap-2">
                <button v-for="t in typesChamp" :key="t.value" type="button"
                  @click="attrForm.type_champ = t.value"
                  :class="['flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition-all',
                    attrForm.type_champ === t.value
                      ? 'border-[#1A56A0] bg-[#EBF4FB] text-[#1A56A0]'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300']">
                  <component :is="t.icon" :size="18" />
                  {{ t.label }}
                </button>
              </div>
            </div>

            <!-- Options enum (si type = enum) -->
            <div v-if="attrForm.type_champ === 'enum'">
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Options *
                <span class="text-gray-400 font-normal normal-case ml-1">(une par ligne)</span>
              </label>
              <textarea v-model="optionsText" rows="4"
                placeholder="neuf&#10;bon_etat&#10;a_renover"
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono outline-none focus:ring-2 focus:ring-[#1A56A0]/20 focus:border-[#1A56A0] resize-none" />
              <!-- Aperçu -->
              <div v-if="optionsArray.length" class="flex flex-wrap gap-1.5 mt-2">
                <span v-for="opt in optionsArray" :key="opt"
                  class="bg-gray-100 text-gray-600 text-[11px] font-mono px-2 py-0.5 rounded-full">
                  {{ opt }}
                </span>
              </div>
            </div>

            <!-- Obligatoire -->
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <button type="button" @click="attrForm.obligatoire = !attrForm.obligatoire"
                :class="['w-10 h-6 rounded-full transition-colors relative flex-shrink-0',
                  attrForm.obligatoire ? 'bg-[#1A56A0]' : 'bg-gray-300']">
                <span :class="['absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all',
                  attrForm.obligatoire ? 'left-[18px]' : 'left-0.5']" />
              </button>
              <div>
                <p class="text-sm font-semibold text-gray-700">Obligatoire</p>
                <p class="text-xs text-gray-400">Ce champ doit être rempli lors de la publication</p>
              </div>
            </div>

            <!-- Erreur -->
            <p v-if="attrModal.error"
              class="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">
              <AlertCircle :size="15" />
              {{ attrModal.error }}
            </p>
          </form>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 flex-shrink-0">
            <button type="button" @click="attrModal.open = false"
              class="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl">
              Annuler
            </button>
            <button @click="submitAttr" :disabled="attrModal.saving"
              class="flex items-center gap-2 px-5 py-2 bg-[#1A56A0] text-white text-sm font-bold rounded-xl hover:bg-[#154d8e] disabled:opacity-60 transition-colors">
              <Loader2 v-if="attrModal.saving" :size="15" class="animate-spin" />
              <Save v-else :size="15" />
              {{ attrModal.mode === 'add' ? 'Ajouter' : 'Enregistrer' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import {
  ArrowLeft, PlusCircle, Pencil, Eye, EyeOff, Trash2, Lock,
  ShieldCheck, Sliders, LayoutList, AlertCircle,
  CheckCircle2, XCircle, X, Save, Loader2,
  Home, Building2, TreePine, Briefcase, BedDouble,
  Type, Hash, ToggleLeft, List, Calendar,
} from 'lucide-vue-next'
import { useCategoriesStore } from '~/stores/categories'
import Swal from 'sweetalert2'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const store = useCategoriesStore()

// ── State ─────────────────────────────────────────────────────────────────
const categorie = ref(null)
const isLoading = ref(true)
const toast     = ref(null)

// ── Helpers icônes par slug ───────────────────────────────────────────────
const iconMap  = { maison: Home, villa: Home, appartement: Building2, terrain: TreePine, bureau_commerce: Briefcase, chambre_studio: BedDouble }
const bgMap    = { maison: 'bg-blue-100', villa: 'bg-blue-100', appartement: 'bg-purple-100', terrain: 'bg-green-100', bureau_commerce: 'bg-orange-100', chambre_studio: 'bg-pink-100' }
const colorMap = { maison: 'text-blue-600', villa: 'text-blue-600', appartement: 'text-purple-600', terrain: 'text-green-600', bureau_commerce: 'text-orange-600', chambre_studio: 'text-pink-600' }
const categoryIcon      = (slug) => iconMap[slug] ?? Home
const categoryBg        = (slug) => bgMap[slug] ?? 'bg-gray-100'
const categoryIconColor = (slug) => colorMap[slug] ?? 'text-gray-500'

// ── Helpers icônes par type de champ ─────────────────────────────────────
const typeIconMap = { texte: Type, nombre: Hash, booleen: ToggleLeft, enum: List, date: Calendar }
const typeLabelMap = { texte: 'Texte', nombre: 'Nombre', booleen: 'Booléen', enum: 'Liste', date: 'Date' }
const typeIcon  = (t) => typeIconMap[t] ?? Type
const typeLabel = (t) => typeLabelMap[t] ?? t

// Types pour le sélecteur de formulaire
const typesChamp = [
  { value: 'texte',   label: 'Texte',    icon: Type },
  { value: 'nombre',  label: 'Nombre',   icon: Hash },
  { value: 'booleen', label: 'Booléen',  icon: ToggleLeft },
  { value: 'enum',    label: 'Liste',    icon: List },
  { value: 'date',    label: 'Date',     icon: Calendar },
]

// ── Attributs filtrés ─────────────────────────────────────────────────────
const attributsSocle     = computed(() => (categorie.value?.attributs ?? []).filter(a => a.est_socle))
const attributsDynamiques = computed(() => (categorie.value?.attributs ?? []).filter(a => !a.est_socle))
const attributsActifs     = computed(() => (categorie.value?.attributs ?? []).filter(a => a.actif))

// ── Chargement ────────────────────────────────────────────────────────────
async function load() {
  isLoading.value = true
  try {
    categorie.value = await store.fetchCategorie(route.params.id)
  } catch {
    showToast('error', 'Catégorie introuvable.')
  } finally {
    isLoading.value = false
  }
}

// ── Toggle attribut ───────────────────────────────────────────────────────
async function handleToggle(attr) {
  const res = await store.toggleAttribut(categorie.value.id, attr.id)
  if (res.success) {
    // Mettre à jour localement
    const a = categorie.value.attributs.find(x => x.id === attr.id)
    if (a) a.actif = !a.actif
    showToast('success', res.message)
  } else {
    showToast('error', res.message)
  }
}

// ── Supprimer attribut ────────────────────────────────────────────────────
async function handleDelete(attr) {
  const result = await Swal.fire({
    title: 'Supprimer ce champ ?',
    html: `<p class="text-sm text-gray-600">Le champ <strong>${attr.label_affiche}</strong> sera supprimé définitivement.<br>Cette action est bloquée si des annonces l'utilisent déjà.</p>`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Supprimer',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    reverseButtons: true,
  })
  if (!result.isConfirmed) return

  const res = await store.deleteAttribut(categorie.value.id, attr.id)
  if (res.success) {
    categorie.value.attributs = categorie.value.attributs.filter(a => a.id !== attr.id)
    showToast('success', 'Champ supprimé.')
  } else {
    showToast('error', res.message)
  }
}

// ── Modal ajouter / modifier attribut ────────────────────────────────────
const attrModal = reactive({ open: false, mode: 'add', saving: false, error: null, id: null })
const attrForm  = reactive({ nom_champ: '', label_affiche: '', type_champ: 'texte', obligatoire: false })
const optionsText = ref('')
const optionsArray = computed(() =>
  optionsText.value.split('\n').map(s => s.trim()).filter(Boolean)
)

function openAddAttribut() {
  Object.assign(attrForm, { nom_champ: '', label_affiche: '', type_champ: 'texte', obligatoire: false })
  optionsText.value = ''
  Object.assign(attrModal, { open: true, mode: 'add', saving: false, error: null, id: null })
}

function openEditAttribut(attr) {
  Object.assign(attrForm, {
    nom_champ:     attr.nom_champ,
    label_affiche: attr.label_affiche,
    type_champ:    attr.type_champ,
    obligatoire:   attr.obligatoire,
  })
  optionsText.value = (attr.options_enum ?? []).join('\n')
  Object.assign(attrModal, { open: true, mode: 'edit', saving: false, error: null, id: attr.id })
}

async function submitAttr() {
  attrModal.saving = true
  attrModal.error  = null

  const payload = {
    label_affiche: attrForm.label_affiche,
    obligatoire:   attrForm.obligatoire,
  }

  if (attrModal.mode === 'add') {
    payload.nom_champ  = attrForm.nom_champ
    payload.type_champ = attrForm.type_champ
  }

  if (attrForm.type_champ === 'enum') {
    payload.options_enum = optionsArray.value
  }

  try {
    let res
    if (attrModal.mode === 'add') {
      res = await store.addAttribut(categorie.value.id, payload)
      if (res.success) {
        categorie.value.attributs = [...(categorie.value.attributs ?? []), res.data]
      }
    } else {
      res = await store.updateAttribut(categorie.value.id, attrModal.id, payload)
      if (res.success) {
        const idx = categorie.value.attributs.findIndex(a => a.id === attrModal.id)
        if (idx !== -1) categorie.value.attributs[idx] = { ...categorie.value.attributs[idx], ...res.data }
      }
    }

    if (res.success) {
      attrModal.open = false
      showToast('success', attrModal.mode === 'add' ? 'Champ ajouté.' : 'Champ mis à jour.')
    } else {
      attrModal.error = res.message
    }
  } finally {
    attrModal.saving = false
  }
}

// ── Toast ─────────────────────────────────────────────────────────────────
function showToast(type, message) {
  toast.value = { type, message }
  setTimeout(() => { toast.value = null }, 3500)
}

onMounted(load)
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to       { opacity: 0; transform: translateY(-12px) scale(0.95); }
</style>
