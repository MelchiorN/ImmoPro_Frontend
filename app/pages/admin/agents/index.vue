<template>
  <div class="p-8">

    <!-- ── En-tête ── -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-extrabold text-primary tracking-tight">Gestion des agents</h1>
        <p class="text-on-surface-variant text-sm mt-1">
          {{ meta.total }} agent{{ meta.total !== 1 ? 's' : '' }} au total
        </p>
      </div>
      <button
        @click="openCreate"
        class="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-lg font-semibold hover:bg-on-primary-fixed-variant transition-colors shadow-sm"
      >
        <UserPlus :size="18" />
        Ajouter un agent
      </button>
    </div>

    <!-- ── Filtres ── -->
    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <div class="relative flex-1 max-w-sm">
        <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
        <input
          v-model="searchQuery"
          @input="onSearchInput"
          type="text"
          placeholder="Rechercher par nom, email, tél…"
          class="w-full pl-9 pr-4 py-2 border border-outline-variant rounded-lg text-sm bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <select
        v-model="statusFilter"
        @change="loadAgents"
        class="px-4 py-2 border border-outline-variant rounded-lg text-sm bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <option value="">Tous les statuts</option>
        <option value="active">Actifs</option>
        <option value="suspended">Suspendus</option>
        <option value="blocked">Bloqués</option>
      </select>
    </div>

    <!-- ── Tableau ── -->
    <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-sm overflow-hidden">

      <!-- Loader -->
      <div v-if="isLoading" class="flex items-center justify-center py-24">
        <div class="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>

      <!-- Erreur -->
      <div v-else-if="error" class="flex flex-col items-center justify-center py-24 text-on-surface-variant gap-2">
        <AlertCircle :size="36" class="text-error" />
        <p class="text-sm">{{ error }}</p>
        <button @click="loadAgents" class="text-primary text-sm font-medium hover:underline mt-1">Réessayer</button>
      </div>

      <!-- Vide -->
      <div v-else-if="agents.length === 0" class="flex flex-col items-center justify-center py-24 text-on-surface-variant gap-3">
        <Users :size="40" class="opacity-30" />
        <p class="text-sm">Aucun agent trouvé</p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-surface-container-low text-on-surface-variant text-xs font-semibold uppercase tracking-wide border-b border-outline-variant/30">
            <tr>
              <th class="px-6 py-3">Agent</th>
              <th class="px-6 py-3">Contact</th>
              <th class="px-6 py-3">Localisation</th>
              <th class="px-6 py-3">Statut</th>
              <th class="px-6 py-3">Créé le</th>
              <th class="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/20">
            <tr
              v-for="agent in agents"
              :key="agent.id"
              class="hover:bg-surface-container-low/40 transition-colors"
            >
              <!-- Agent -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    {{ initials(agent) }}
                  </div>
                  <div>
                    <p class="font-semibold text-on-surface">{{ agent.first_name }} {{ agent.last_name }}</p>
                    <p class="text-xs text-on-surface-variant">{{ agent.email }}</p>
                  </div>
                </div>
              </td>
              <!-- Contact -->
              <td class="px-6 py-4 text-on-surface-variant">{{ agent.telephone || '—' }}</td>
              <!-- Localisation -->
              <td class="px-6 py-4 text-on-surface-variant">{{ agent.city }}, {{ agent.country }}</td>
              <!-- Statut -->
              <td class="px-6 py-4">
                <span :class="statusBadge(agent.status)">
                  {{ statusLabel(agent.status) }}
                </span>
              </td>
              <!-- Date -->
              <td class="px-6 py-4 text-on-surface-variant text-xs">
                {{ formatDate(agent.created_at) }}
              </td>
              <!-- Actions — toujours visibles, cercles colorés -->
              <td class="px-6 py-4">
                <div class="flex justify-end items-center gap-2">
                  <!-- Voir -->
                  <button
                    @click="openDetail(agent)"
                    title="Voir les détails"
                    class="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-sm"
                  >
                    <Eye :size="14" />
                  </button>
                  <!-- Modifier -->
                  <button
                    @click="openEdit(agent)"
                    title="Modifier"
                    class="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors shadow-sm"
                  >
                    <Pencil :size="14" />
                  </button>
                  <!-- Changer statut -->
                  <button
                    @click="openStatusMenu(agent, $event)"
                    title="Changer le statut"
                    class="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors shadow-sm"
                  >
                    <ShieldCheck :size="14" />
                  </button>
                  <!-- Supprimer -->
                  <button
                    @click="confirmDelete(agent)"
                    title="Supprimer"
                    class="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors shadow-sm"
                  >
                    <Trash2 :size="14" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="meta.last_page > 1" class="flex items-center justify-between px-6 py-4 border-t border-outline-variant/30">
        <p class="text-xs text-on-surface-variant">
          Page {{ meta.current_page }} / {{ meta.last_page }}
        </p>
        <div class="flex gap-2">
          <button
            :disabled="meta.current_page <= 1"
            @click="changePage(meta.current_page - 1)"
            class="px-3 py-1.5 border border-outline-variant rounded-lg text-xs font-medium disabled:opacity-40 hover:bg-surface-container transition-colors"
          >
            ← Précédent
          </button>
          <button
            :disabled="meta.current_page >= meta.last_page"
            @click="changePage(meta.current_page + 1)"
            class="px-3 py-1.5 border border-outline-variant rounded-lg text-xs font-medium disabled:opacity-40 hover:bg-surface-container transition-colors"
          >
            Suivant →
          </button>
        </div>
      </div>
    </div>

    <!-- ── Status dropdown (contextual) ── -->
    <Teleport to="body">
      <div
        v-if="statusMenu.open"
        class="fixed inset-0 z-40"
        @click="statusMenu.open = false"
      />
      <div
        v-if="statusMenu.open"
        class="fixed z-50 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl py-1 w-44"
        :style="{ top: statusMenu.y + 'px', left: statusMenu.x + 'px' }"
      >
        <button
          v-for="s in statusOptions"
          :key="s.value"
          @click="applyStatus(s.value)"
          :disabled="statusMenu.current === s.value"
          class="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface-container transition-colors disabled:opacity-40"
        >
          <span :class="`w-2 h-2 rounded-full ${s.dot}`" />
          {{ s.label }}
        </button>
      </div>
    </Teleport>

    <!-- ── Modal Créer / Modifier ── -->
    <Teleport to="body">
      <div v-if="modal.open" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" @click.self="modal.open = false">
        <div class="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30">
            <h2 class="font-bold text-primary text-lg">
              {{ modal.mode === 'create' ? 'Ajouter un agent' : 'Modifier l\'agent' }}
            </h2>
            <button @click="modal.open = false" class="p-1.5 hover:bg-surface-container rounded-lg transition-colors">
              <X :size="18" />
            </button>
          </div>
          <!-- Body -->
          <form @submit.prevent="submitForm" class="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1">Prénom *</label>
                <input v-model="form.first_name" type="text" required class="input-field" placeholder="Jean" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1">Nom *</label>
                <input v-model="form.last_name" type="text" required class="input-field" placeholder="Dupont" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1">Email *</label>
              <input v-model="form.email" type="email" required class="input-field" placeholder="jean@immopro.fr" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1">Téléphone *</label>
              <input v-model="form.telephone" type="tel" required class="input-field" placeholder="+33 6 00 00 00 00" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1">Pays *</label>
                <input v-model="form.country" type="text" required class="input-field" placeholder="France" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1">Ville *</label>
                <input v-model="form.city" type="text" required class="input-field" placeholder="Paris" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1">
                {{ modal.mode === 'create' ? 'Mot de passe *' : 'Nouveau mot de passe (optionnel)' }}
              </label>
              <div class="relative">
                <input
                  v-model="form.password"
                  :type="showPwd ? 'text' : 'password'"
                  :required="modal.mode === 'create'"
                  class="input-field pr-10"
                  placeholder="••••••••"
                />
                <button type="button" @click="showPwd = !showPwd" class="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary">
                  <Eye v-if="!showPwd" :size="16" />
                  <EyeOff v-else :size="16" />
                </button>
              </div>
            </div>
            <div v-if="form.password">
              <label class="block text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-1">Confirmation *</label>
              <input v-model="form.password_confirmation" type="password" class="input-field" placeholder="••••••••" />
            </div>
            <!-- Erreur form -->
            <p v-if="formError" class="text-error text-xs bg-error-container px-3 py-2 rounded-lg">{{ formError }}</p>
          </form>
          <!-- Footer -->
          <div class="px-6 py-4 border-t border-outline-variant/30 flex justify-end gap-3">
            <button @click="modal.open = false" class="px-4 py-2 border border-outline-variant rounded-lg text-sm font-medium hover:bg-surface-container transition-colors">
              Annuler
            </button>
            <button
              @click="submitForm"
              :disabled="formLoading"
              class="flex items-center gap-2 px-5 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-on-primary-fixed-variant transition-colors disabled:opacity-50"
            >
              <span v-if="formLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {{ modal.mode === 'create' ? 'Créer l\'agent' : 'Enregistrer' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ── Modal Détail ── -->
    <Teleport to="body">
      <div v-if="detailModal.open" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" @click.self="detailModal.open = false">
        <div class="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30">
            <h2 class="font-bold text-primary text-lg">Informations de l'agent</h2>
            <button @click="detailModal.open = false" class="p-1.5 hover:bg-surface-container rounded-lg transition-colors">
              <X :size="18" />
            </button>
          </div>
          <div v-if="detailModal.agent" class="p-6 space-y-4">
            <!-- Avatar + nom -->
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-xl">
                {{ initials(detailModal.agent) }}
              </div>
              <div>
                <p class="text-lg font-bold text-on-surface">{{ detailModal.agent.first_name }} {{ detailModal.agent.last_name }}</p>
                <span :class="statusBadge(detailModal.agent.status)">{{ statusLabel(detailModal.agent.status) }}</span>
              </div>
            </div>
            <!-- Infos -->
            <div class="grid grid-cols-2 gap-3 text-sm">
              <DetailRow label="Email"       :value="detailModal.agent.email" />
              <DetailRow label="Téléphone"   :value="detailModal.agent.telephone || '—'" />
              <DetailRow label="Ville"       :value="detailModal.agent.city" />
              <DetailRow label="Pays"        :value="detailModal.agent.country" />
              <DetailRow label="Créé le"     :value="formatDate(detailModal.agent.created_at)" />
              <DetailRow label="Mis à jour"  :value="formatDate(detailModal.agent.updated_at)" />
            </div>
          </div>
          <div class="px-6 py-4 border-t border-outline-variant/30 flex justify-end gap-3">
            <button @click="openEdit(detailModal.agent); detailModal.open = false" class="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary-fixed transition-colors">
              <Pencil :size="14" /> Modifier
            </button>
            <button @click="detailModal.open = false" class="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-on-primary-fixed-variant transition-colors">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import Swal from 'sweetalert2'
import {
  UserPlus, Search, Eye, EyeOff, Pencil, Trash2,
  ShieldCheck, X, Users, AlertCircle,
} from 'lucide-vue-next'
import { useAgentsStore } from '~/stores/agents'

definePageMeta({ layout: 'admin' })

const store = useAgentsStore()
const { agents, meta, isLoading, error } = store

// ── Filtres ──────────────────────────────────────────────────────────────────
const searchQuery  = ref('')
const statusFilter = ref('')
const currentPage  = ref(1)
let   searchTimer: ReturnType<typeof setTimeout> | null = null

function onSearchInput() {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { currentPage.value = 1; loadAgents() }, 350)
}

function loadAgents() {
  store.fetchAgents({
    search:   searchQuery.value || undefined,
    status:   statusFilter.value || undefined,
    page:     currentPage.value,
    per_page: 15,
  })
}

function changePage(p: number) {
  currentPage.value = p
  loadAgents()
}

onMounted(loadAgents)

// ── Helpers ───────────────────────────────────────────────────────────────────
function initials(agent: any) {
  return `${agent.first_name?.[0] ?? ''}${agent.last_name?.[0] ?? ''}`.toUpperCase()
}

function formatDate(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const statusMap: Record<string, { label: string; cls: string; dot: string }> = {
  active:    { label: 'Actif',     cls: 'bg-tertiary-fixed text-on-tertiary-fixed-variant', dot: 'bg-tertiary' },
  suspended: { label: 'Suspendu',  cls: 'bg-secondary-container text-on-secondary-container', dot: 'bg-secondary' },
  blocked:   { label: 'Bloqué',    cls: 'bg-error-container text-on-error-container', dot: 'bg-error' },
}
function statusBadge(s: string)  { return `px-2.5 py-0.5 rounded-full text-xs font-bold ${statusMap[s]?.cls ?? ''}` }
function statusLabel(s: string)  { return statusMap[s]?.label ?? s }

// ── Status menu ───────────────────────────────────────────────────────────────
const statusOptions = [
  { value: 'active',    label: 'Activer',    dot: 'bg-tertiary' },
  { value: 'suspended', label: 'Suspendre',  dot: 'bg-secondary' },
  { value: 'blocked',   label: 'Bloquer',    dot: 'bg-error' },
]
const statusMenu = reactive({ open: false, agent: null as any, current: '', x: 0, y: 0 })

function openStatusMenu(agent: any, event: MouseEvent) {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  statusMenu.agent   = agent
  statusMenu.current = agent.status
  statusMenu.x = Math.min(rect.left, window.innerWidth - 192)
  statusMenu.y = rect.bottom + 4
  statusMenu.open    = true
}

async function applyStatus(newStatus: string) {
  const agent = statusMenu.agent
  statusMenu.open = false
  const labels: Record<string, string> = { active: 'activer', suspended: 'suspendre', blocked: 'bloquer' }

  const result = await Swal.fire({
    title: `Confirmer l'action`,
    text:  `Voulez-vous ${labels[newStatus]} l'agent ${agent.first_name} ${agent.last_name} ?`,
    icon:  'question',
    showCancelButton: true,
    confirmButtonText: 'Confirmer',
    cancelButtonText:  'Annuler',
    confirmButtonColor: '#003e7e',
    cancelButtonColor:  '#737782',
  })
  if (!result.isConfirmed) return

  try {
    const res = await store.updateStatus(agent.id, newStatus)
    Swal.fire({ icon: 'success', title: 'Succès', text: res.message, confirmButtonColor: '#003e7e', timer: 2000, showConfirmButton: false })
  } catch (err: any) {
    Swal.fire({ icon: 'error', title: 'Erreur', text: err?.data?.message || 'Une erreur est survenue.', confirmButtonColor: '#003e7e' })
  }
}

// ── Supprimer ─────────────────────────────────────────────────────────────────
async function confirmDelete(agent: any) {
  const result = await Swal.fire({
    title: 'Supprimer l\'agent ?',
    html:  `Cette action supprimera définitivement<br><strong>${agent.first_name} ${agent.last_name}</strong>.`,
    icon:  'warning',
    showCancelButton:  true,
    confirmButtonText: 'Supprimer',
    cancelButtonText:  'Annuler',
    confirmButtonColor: '#ba1a1a',
    cancelButtonColor:  '#737782',
  })
  if (!result.isConfirmed) return

  try {
    await store.deleteAgent(agent.id)
    Swal.fire({ icon: 'success', title: 'Supprimé', text: 'L\'agent a été supprimé.', confirmButtonColor: '#003e7e', timer: 2000, showConfirmButton: false })
  } catch (err: any) {
    Swal.fire({ icon: 'error', title: 'Erreur', text: err?.data?.message || 'Impossible de supprimer.', confirmButtonColor: '#003e7e' })
  }
}

// ── Modal Créer / Modifier ────────────────────────────────────────────────────
const modal      = reactive({ open: false, mode: 'create' as 'create' | 'edit', agentId: null as string | null })
const showPwd    = ref(false)
const formLoading = ref(false)
const formError   = ref('')
const form = reactive({
  first_name: '', last_name: '', email: '', telephone: '',
  country: '', city: '', password: '', password_confirmation: '',
})

function resetForm() {
  Object.assign(form, { first_name: '', last_name: '', email: '', telephone: '', country: '', city: '', password: '', password_confirmation: '' })
  formError.value = ''
  showPwd.value   = false
}

function openCreate() {
  resetForm()
  modal.mode    = 'create'
  modal.agentId = null
  modal.open    = true
}

function openEdit(agent: any) {
  resetForm()
  Object.assign(form, {
    first_name: agent.first_name,
    last_name:  agent.last_name,
    email:      agent.email,
    telephone:  agent.telephone,
    country:    agent.country,
    city:       agent.city,
  })
  modal.mode    = 'edit'
  modal.agentId = agent.id
  modal.open    = true
}

async function submitForm() {
  formError.value = ''
  if (form.password && form.password !== form.password_confirmation) {
    formError.value = 'Les mots de passe ne correspondent pas.'
    return
  }
  formLoading.value = true
  try {
    const payload: any = { ...form }
    if (!payload.password) { delete payload.password; delete payload.password_confirmation }

    if (modal.mode === 'create') {
      await store.createAgent(payload)
      modal.open = false
      Swal.fire({ icon: 'success', title: 'Agent créé !', text: `${form.first_name} ${form.last_name} a été ajouté.`, confirmButtonColor: '#003e7e', timer: 2500, showConfirmButton: false })
    } else {
      await store.updateAgent(modal.agentId!, payload)
      modal.open = false
      Swal.fire({ icon: 'success', title: 'Mis à jour !', text: 'Les informations ont été enregistrées.', confirmButtonColor: '#003e7e', timer: 2500, showConfirmButton: false })
    }
  } catch (err: any) {
    const msg = err?.data?.errors
      ? Object.values(err.data.errors).flat().join(' ')
      : err?.data?.message || 'Une erreur est survenue.'
    formError.value = msg
  } finally {
    formLoading.value = false
  }
}

// ── Modal Détail ──────────────────────────────────────────────────────────────
const detailModal = reactive({ open: false, agent: null as any })
function openDetail(agent: any) {
  detailModal.agent = agent
  detailModal.open  = true
}
</script>

<style scoped>
.input-field {
  @apply w-full px-3 py-2.5 border border-outline-variant rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors;
}
</style>
