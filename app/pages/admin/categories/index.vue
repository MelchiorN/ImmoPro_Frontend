<template>
  <div class="p-8 pb-16">

    <!-- ── En-tête ── -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-extrabold text-[#1A56A0] tracking-tight">Catégories de biens</h1>
        <p class="text-sm text-gray-400 mt-1">Gérez les types de biens et leurs champs dynamiques</p>
      </div>
      <button @click="openCreate"
        class="flex items-center gap-2 px-4 py-2.5 bg-[#1A56A0] text-white rounded-xl text-sm font-semibold hover:bg-[#154d8e] transition-colors shadow-sm">
        <PlusCircle :size="18" />
        Nouvelle catégorie
      </button>
    </div>

    <!-- ── Skeleton ── -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      <div v-for="i in 6" :key="i"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse space-y-3">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 bg-gray-100 rounded-xl" />
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-100 rounded w-2/3" />
            <div class="h-3 bg-gray-100 rounded w-1/3" />
          </div>
        </div>
        <div class="h-3 bg-gray-100 rounded w-full" />
        <div class="h-3 bg-gray-100 rounded w-3/4" />
      </div>
    </div>

    <!-- ── Erreur ── -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
      <AlertCircle :size="40" class="text-red-300 mx-auto mb-3" />
      <p class="text-red-600 font-semibold">{{ error }}</p>
      <button @click="store.fetchCategories()"
        class="mt-4 px-4 py-2 bg-[#1A56A0] text-white text-sm rounded-lg">Réessayer</button>
    </div>

    <!-- ── Grille des catégories ── -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      <div v-for="cat in categories" :key="cat.id"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col">

        <!-- Card header -->
        <div class="p-5 flex items-start gap-3">
          <!-- Icône catégorie -->
          <div :class="['w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', categoryBg(cat.slug)]">
            <component :is="categoryIcon(cat.slug)" :size="22" :class="categoryIconColor(cat.slug)" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-gray-800 text-base truncate">{{ cat.nom }}</h3>
              <!-- Badge actif/inactif -->
              <span :class="['px-2 py-0.5 rounded-full text-[10px] font-bold border flex-shrink-0',
                cat.actif
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-gray-100 text-gray-400 border-gray-200']">
                {{ cat.actif ? 'Actif' : 'Inactif' }}
              </span>
            </div>
            <p class="text-xs text-gray-400 font-mono mt-0.5">{{ cat.slug }}</p>
          </div>
        </div>

        <!-- Description -->
        <p v-if="cat.description" class="px-5 text-xs text-gray-500 line-clamp-2 leading-relaxed">
          {{ cat.description }}
        </p>

        <!-- Compteurs champs + Commission -->
        <div class="px-5 py-3 mt-2 flex items-center gap-4 flex-wrap">
          <div class="flex items-center gap-1.5 text-xs text-gray-500">
            <LayoutList :size="13" class="text-[#1A56A0]" />
            <span><strong class="text-gray-800">{{ cat.nb_attributs_actifs }}</strong> champs actifs</span>
          </div>
          <div v-if="cat.nb_attributs > cat.nb_attributs_actifs"
            class="flex items-center gap-1.5 text-xs text-gray-400">
            <EyeOff :size="13" />
            <span>{{ cat.nb_attributs - cat.nb_attributs_actifs }} désactivés</span>
          </div>
          <!-- Badge commission -->
          <div class="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
            :class="cat.pourcentage_commission > 0
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'bg-gray-50 text-gray-400 border border-gray-200'">
            <Percent :size="10" />
            <span>{{ cat.pourcentage_commission > 0 ? cat.pourcentage_commission + '%' : 'Pas de commission' }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-auto px-5 py-4 border-t border-gray-50 flex items-center gap-2">
          <button @click="goToDetail(cat)"
            class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#EBF4FB] text-[#1A56A0] text-xs font-bold hover:bg-[#1A56A0] hover:text-white transition-colors">
            <Settings :size="14" />
            Gérer les champs
          </button>
          <button @click="openEdit(cat)"
            class="w-9 h-9 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors"
            title="Modifier">
            <Pencil :size="15" />
          </button>
          <button @click="toggleActif(cat)"
            :class="['w-9 h-9 rounded-xl flex items-center justify-center transition-colors',
              cat.actif
                ? 'bg-orange-50 text-orange-500 hover:bg-orange-100'
                : 'bg-green-50 text-green-600 hover:bg-green-100']"
            :title="cat.actif ? 'Désactiver' : 'Activer'">
            <component :is="cat.actif ? EyeOff : Eye" :size="15" />
          </button>
        </div>
      </div>

      <!-- Vide -->
      <div v-if="categories.length === 0"
        class="col-span-full flex flex-col items-center justify-center py-20 text-center">
        <FolderX :size="48" class="text-gray-200 mb-4" />
        <p class="text-gray-400 font-medium">Aucune catégorie trouvée</p>
        <button @click="openCreate"
          class="mt-4 flex items-center gap-2 px-4 py-2 bg-[#1A56A0] text-white text-sm rounded-xl font-semibold">
          <PlusCircle :size="16" />
          Créer la première catégorie
        </button>
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

    <!-- ── Modal Créer / Modifier catégorie ── -->
    <Teleport to="body">
      <div v-if="modal.open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        @click.self="modal.open = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div class="flex items-center gap-2">
              <component :is="modal.mode === 'create' ? PlusCircle : Pencil" :size="18" class="text-[#1A56A0]" />
              <h2 class="text-lg font-bold text-[#1A56A0]">
                {{ modal.mode === 'create' ? 'Nouvelle catégorie' : 'Modifier la catégorie' }}
              </h2>
            </div>
            <button @click="modal.open = false"
              class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
              <X :size="16" class="text-gray-600" />
            </button>
          </div>

          <!-- Formulaire -->
          <form @submit.prevent="submitModal" class="p-6 space-y-4">

            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Nom *</label>
              <input v-model="form.nom" type="text" placeholder="ex: Maison / Villa"
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1A56A0]/20 focus:border-[#1A56A0]"
                required />
            </div>

            <div v-if="modal.mode === 'create'">
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Slug technique *
                <span class="text-gray-400 font-normal normal-case ml-1">(doit correspondre à un type_bien de l'API)</span>
              </label>
              <input v-model="form.slug" type="text" placeholder="ex: maison"
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono outline-none focus:ring-2 focus:ring-[#1A56A0]/20 focus:border-[#1A56A0]"
                pattern="[a-z0-9_]+" title="Minuscules, chiffres et _ uniquement" required />
            </div>

            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Description</label>
              <textarea v-model="form.description" rows="3" placeholder="Description courte de la catégorie..."
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1A56A0]/20 focus:border-[#1A56A0] resize-none" />
            </div>

            <div>
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Ordre d'affichage</label>
              <input v-model.number="form.ordre_affichage" type="number" min="0"
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1A56A0]/20 focus:border-[#1A56A0]" />
            </div>

            <!-- Commission -->
            <div class="bg-amber-50 border border-amber-100 rounded-xl p-4 space-y-1.5">
              <label class="flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider">
                <Percent :size="13" />
                Commission ImmoPro (%)
              </label>
              <div class="flex items-center gap-2">
                <input v-model.number="form.pourcentage_commission" type="number" min="0" max="100" step="0.01"
                  placeholder="ex: 10"
                  class="flex-1 border border-amber-200 bg-white rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400" />
                <span class="text-sm font-bold text-amber-600">%</span>
              </div>
              <p class="text-[11px] text-amber-600/80">
                Le prix public affiché sur l'application sera : prix propriétaire + {{ form.pourcentage_commission || 0 }}%
              </p>
            </div>

            <!-- Erreur -->
            <p v-if="modal.error" class="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">
              <AlertCircle :size="15" />
              {{ modal.error }}
            </p>

            <!-- Footer -->
            <div class="flex items-center justify-end gap-3 pt-2">
              <button type="button" @click="modal.open = false"
                class="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl">
                Annuler
              </button>
              <button type="submit" :disabled="modal.saving"
                class="flex items-center gap-2 px-5 py-2 bg-[#1A56A0] text-white text-sm font-bold rounded-xl hover:bg-[#154d8e] disabled:opacity-60 transition-colors">
                <Loader2 v-if="modal.saving" :size="15" class="animate-spin" />
                <Save v-else :size="15" />
                {{ modal.mode === 'create' ? 'Créer' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import {
  PlusCircle, Settings, Pencil, Eye, EyeOff, FolderX,
  AlertCircle, CheckCircle2, XCircle, X, Save, Loader2,
  LayoutList, Home, Building2, TreePine, Briefcase, BedDouble, Percent,
} from 'lucide-vue-next'
import { useCategoriesStore } from '~/stores/categories'
import { useRouter } from 'vue-router'

definePageMeta({ layout: 'admin' })

const router = useRouter()
const store  = useCategoriesStore()
const { categories, isLoading, error } = store

// ── Icônes par slug ───────────────────────────────────────────────────────
const iconMap = {
  maison:          Home,
  villa:           Home,
  appartement:     Building2,
  terrain:         TreePine,
  bureau_commerce: Briefcase,
  chambre_studio:  BedDouble,
}
const bgMap = {
  maison:          'bg-blue-100',
  villa:           'bg-blue-100',
  appartement:     'bg-purple-100',
  terrain:         'bg-green-100',
  bureau_commerce: 'bg-orange-100',
  chambre_studio:  'bg-pink-100',
}
const colorMap = {
  maison:          'text-blue-600',
  villa:           'text-blue-600',
  appartement:     'text-purple-600',
  terrain:         'text-green-600',
  bureau_commerce: 'text-orange-600',
  chambre_studio:  'text-pink-600',
}
const categoryIcon      = (slug) => iconMap[slug] ?? Home
const categoryBg        = (slug) => bgMap[slug] ?? 'bg-gray-100'
const categoryIconColor = (slug) => colorMap[slug] ?? 'text-gray-500'

// ── Navigation vers la page détail ───────────────────────────────────────
function goToDetail(cat) {
  router.push(`/admin/categories/${cat.id}`)
}

// ── Toggle actif ──────────────────────────────────────────────────────────
async function toggleActif(cat) {
  const res = await store.updateCategorie(cat.id, { actif: !cat.actif })
  if (res.success) {
    showToast('success', cat.actif ? 'Catégorie désactivée.' : 'Catégorie activée.')
  } else {
    showToast('error', res.message)
  }
}

// ── Modal Créer / Modifier ────────────────────────────────────────────────
const modal = reactive({
  open: false, mode: 'create', saving: false, error: null, id: null,
})
const form = reactive({ nom: '', slug: '', description: '', ordre_affichage: 0, pourcentage_commission: 0 })

function openCreate() {
  Object.assign(form, { nom: '', slug: '', description: '', ordre_affichage: 0, pourcentage_commission: 0 })
  Object.assign(modal, { open: true, mode: 'create', saving: false, error: null, id: null })
}

function openEdit(cat) {
  Object.assign(form, {
    nom: cat.nom,
    slug: cat.slug,
    description: cat.description ?? '',
    ordre_affichage: cat.ordre_affichage ?? 0,
    pourcentage_commission: cat.pourcentage_commission ?? 0,
  })
  Object.assign(modal, { open: true, mode: 'edit', saving: false, error: null, id: cat.id })
}

async function submitModal() {
  modal.saving = true
  modal.error  = null
  try {
    let res
    if (modal.mode === 'create') {
      res = await store.createCategorie({ ...form })
    } else {
      res = await store.updateCategorie(modal.id, {
        nom: form.nom,
        description: form.description,
        ordre_affichage: form.ordre_affichage,
        pourcentage_commission: form.pourcentage_commission,
      })
    }
    if (res.success) {
      modal.open = false
      showToast('success', modal.mode === 'create' ? 'Catégorie créée.' : 'Catégorie mise à jour.')
    } else {
      modal.error = res.message
    }
  } finally {
    modal.saving = false
  }
}

// ── Toast ─────────────────────────────────────────────────────────────────
const toast = ref(null)
function showToast(type, message) {
  toast.value = { type, message }
  setTimeout(() => { toast.value = null }, 3500)
}

// ── Init ──────────────────────────────────────────────────────────────────
onMounted(() => store.fetchCategories())
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to       { opacity: 0; transform: translateY(-12px) scale(0.95); }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
