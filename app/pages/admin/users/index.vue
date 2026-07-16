<template>
  <div class="p-8 pb-16">

    <!-- ── En-tête ── -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-extrabold text-[#1A56A0] tracking-tight">Utilisateurs</h1>
        <p class="text-sm text-gray-400 mt-1">Gestion des comptes clients de la plateforme</p>
      </div>
    </div>

    <!-- ── Cards KPI ── -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      <div v-for="kpi in kpiCards" :key="kpi.label"
        class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
        <div :class="['w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', kpi.bg]">
          <span :class="['material-symbols-outlined text-[22px]', kpi.color]">{{ kpi.icon }}</span>
        </div>
        <div>
          <p class="text-xs text-gray-400 font-medium">{{ kpi.label }}</p>
          <p class="text-2xl font-bold text-gray-800">
            <span v-if="statsLoading" class="inline-block w-8 h-5 bg-gray-100 animate-pulse rounded" />
            <span v-else>{{ kpi.value }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- ── Filtres ── -->
    <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-5">
      <div class="flex flex-wrap items-end gap-3">
        <div class="flex-1 min-w-[200px]">
          <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Recherche</label>
          <div class="relative">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
            <input v-model="search" @input="onSearchInput" type="text"
              placeholder="Nom, email, téléphone..."
              class="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1A56A0]/20 focus:border-[#1A56A0] outline-none" />
          </div>
        </div>
        <div class="w-44">
          <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Statut</label>
          <select v-model="filterStatus" @change="load()"
            class="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-[#1A56A0]/20">
            <option value="">Tous</option>
            <option value="active">Actifs</option>
            <option value="suspended">Suspendus</option>
            <option value="blocked">Bloqués</option>
          </select>
        </div>
      </div>
    </div>

    <!-- ── Tableau ── -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

      <!-- Skeleton -->
      <div v-if="isLoading" class="p-6 space-y-3">
        <div v-for="i in 6" :key="i" class="flex items-center gap-4 animate-pulse">
          <div class="w-10 h-10 bg-gray-100 rounded-full flex-shrink-0"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-100 rounded w-1/3"></div>
            <div class="h-3 bg-gray-100 rounded w-1/4"></div>
          </div>
          <div class="h-6 w-16 bg-gray-100 rounded-full"></div>
          <div class="flex gap-2">
            <div class="w-8 h-8 bg-gray-100 rounded-full"></div>
            <div class="w-8 h-8 bg-gray-100 rounded-full"></div>
            <div class="w-8 h-8 bg-gray-100 rounded-full"></div>
          </div>
        </div>
      </div>

      <!-- Erreur -->
      <div v-else-if="error" class="p-12 text-center">
        <span class="material-symbols-outlined text-red-300 text-5xl mb-3 block">error_outline</span>
        <p class="text-red-500 font-semibold">{{ error }}</p>
        <button @click="load()" class="mt-4 px-4 py-2 bg-[#1A56A0] text-white text-sm rounded-lg">Réessayer</button>
      </div>

      <!-- Vide -->
      <div v-else-if="users.length === 0" class="p-16 text-center">
        <span class="material-symbols-outlined text-gray-200 text-5xl mb-3 block">group</span>
        <p class="text-gray-400 font-medium">Aucun utilisateur trouvé</p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-gray-50 text-gray-500 text-[11px] font-semibold uppercase tracking-wide border-b border-gray-100">
            <tr>
              <th class="px-5 py-3">Utilisateur</th>
              <th class="px-4 py-3">Contact</th>
              <th class="px-4 py-3">Localisation</th>
              <th class="px-4 py-3 text-center">Biens</th>
              <th class="px-4 py-3">Inscription</th>
              <th class="px-4 py-3">Statut</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="user in users" :key="user.id" class="hover:bg-blue-50/30 transition-colors">

              <!-- Avatar + nom -->
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full overflow-hidden bg-[#EBF4FB] flex-shrink-0">
                    <img v-if="user.profile_picture" :src="user.profile_picture" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center text-[#1A56A0] font-bold text-sm">
                      {{ initials(user) }}
                    </div>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-800">{{ user.first_name }} {{ user.last_name }}</p>
                    <p class="text-xs text-gray-400 truncate max-w-[180px]">{{ user.email }}</p>
                  </div>
                </div>
              </td>

              <!-- Contact -->
              <td class="px-4 py-4 text-gray-500 text-xs">{{ user.telephone || '—' }}</td>

              <!-- Localisation -->
              <td class="px-4 py-4 text-gray-500 text-xs">{{ user.city }}, {{ user.country }}</td>

              <!-- Biens -->
              <td class="px-4 py-4 text-center">
                <span class="text-sm font-bold text-[#1A56A0]">{{ user.biens_count ?? 0 }}</span>
              </td>

              <!-- Inscription -->
              <td class="px-4 py-4 text-gray-400 text-xs">{{ formatDate(user.created_at) }}</td>

              <!-- Statut -->
              <td class="px-4 py-4">
                <span :class="['px-2.5 py-0.5 rounded-full text-xs font-bold border', statusClass(user.status)]">
                  {{ statusLabel(user.status) }}
                </span>
              </td>

              <!-- Actions -->
              <td class="px-4 py-4">
                <div class="flex items-center justify-end gap-1.5">
                  <!-- Voir détail -->
                  <button @click="openDetail(user)"
                    class="w-8 h-8 rounded-full bg-blue-50 text-[#1A56A0] flex items-center justify-center hover:bg-[#1A56A0] hover:text-white transition-colors shadow-sm"
                    title="Voir le détail">
                    <span class="material-symbols-outlined text-[17px]">visibility</span>
                  </button>
                  <!-- Activer / Désactiver -->
                  <button @click="toggleStatus(user)"
                    :class="['w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm',
                      user.status === 'active'
                        ? 'bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white'
                        : 'bg-green-50 text-green-600 hover:bg-green-500 hover:text-white']"
                    :title="user.status === 'active' ? 'Suspendre' : 'Activer'">
                    <span class="material-symbols-outlined text-[17px]">
                      {{ user.status === 'active' ? 'block' : 'check_circle' }}
                    </span>
                  </button>
                  <!-- Historique -->
                  <button @click="openHistorique(user)"
                    class="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center hover:bg-purple-500 hover:text-white transition-colors shadow-sm"
                    title="Historique de connexions">
                    <span class="material-symbols-outlined text-[17px]">history</span>
                  </button>
                </div>
              </td>

            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="meta.last_page > 1" class="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <p class="text-xs text-gray-400">{{ pageStart }}–{{ pageEnd }} sur {{ meta.total }} utilisateurs</p>
        <div class="flex items-center gap-1.5">
          <button :disabled="meta.current_page <= 1" @click="goToPage(meta.current_page - 1)"
            class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white text-gray-400 disabled:opacity-30 transition-colors">
            <span class="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          <button v-for="p in pagesToShow" :key="p" @click="goToPage(p)"
            :class="['w-8 h-8 rounded-lg text-xs font-bold transition-colors',
              meta.current_page === p ? 'bg-[#1A56A0] text-white' : 'bg-white hover:bg-gray-100 text-gray-500 border border-gray-200']">
            {{ p }}
          </button>
          <button :disabled="meta.current_page >= meta.last_page" @click="goToPage(meta.current_page + 1)"
            class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white text-gray-400 disabled:opacity-30 transition-colors">
            <span class="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>


    <!-- ── Toast ── -->
    <Transition name="toast">
      <div v-if="toast"
        :class="['fixed top-6 right-6 z-[60] flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg text-sm font-semibold',
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white']">
        <span class="material-symbols-outlined text-[20px]">{{ toast.type === 'success' ? 'check_circle' : 'error' }}</span>
        {{ toast.message }}
      </div>
    </Transition>

    <!-- ── Modal Détail Utilisateur ── -->
    <Teleport to="body">
      <div v-if="detailModal.open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        @click.self="detailModal.open = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
            <h2 class="text-lg font-bold text-[#1A56A0]">Détail de l'utilisateur</h2>
            <button @click="detailModal.open = false"
              class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
              <span class="material-symbols-outlined text-[18px] text-gray-600">close</span>
            </button>
          </div>

          <!-- Skeleton détail -->
          <div v-if="detailModal.loading" class="flex-1 p-6 space-y-4">
            <div v-for="i in 5" :key="i" class="animate-pulse h-10 bg-gray-100 rounded-xl" />
          </div>

          <!-- Contenu -->
          <div v-else-if="detailModal.user" class="flex-1 overflow-y-auto p-6 space-y-5">

            <!-- Avatar + identité -->
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-full overflow-hidden bg-[#EBF4FB] flex-shrink-0">
                <img v-if="detailModal.user.profile_picture" :src="detailModal.user.profile_picture" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-[#1A56A0] font-bold text-2xl">
                  {{ initials(detailModal.user) }}
                </div>
              </div>
              <div>
                <p class="text-xl font-bold text-gray-800">
                  {{ detailModal.user.first_name }} {{ detailModal.user.last_name }}
                </p>
                <span :class="['px-2.5 py-0.5 rounded-full text-xs font-bold border', statusClass(detailModal.user.status)]">
                  {{ statusLabel(detailModal.user.status) }}
                </span>
              </div>
            </div>

            <!-- Infos principales -->
            <div class="grid grid-cols-2 gap-3">
              <InfoRow icon="email"     label="Email"      :value="detailModal.user.email" />
              <InfoRow icon="phone"     label="Téléphone"  :value="detailModal.user.telephone || '—'" />
              <InfoRow icon="location_city" label="Ville" :value="detailModal.user.city" />
              <InfoRow icon="public"    label="Pays"       :value="detailModal.user.country" />
              <InfoRow icon="calendar_today" label="Inscrit le" :value="formatDate(detailModal.user.created_at)" />
              <InfoRow icon="login" label="Dernière connexion"
                :value="detailModal.user.derniere_connexion ? formatDateTime(detailModal.user.derniere_connexion) : '—'" />
            </div>

            <!-- Stats biens -->
            <div v-if="detailModal.user.biens_stats" class="bg-gray-50 rounded-xl p-4">
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Biens soumis</p>
              <div class="grid grid-cols-5 gap-2 text-center">
                <div>
                  <p class="text-xl font-extrabold text-[#1A56A0]">{{ detailModal.user.biens_stats.total }}</p>
                  <p class="text-[10px] text-gray-400">Total</p>
                </div>
                <div>
                  <p class="text-xl font-extrabold text-orange-500">{{ detailModal.user.biens_stats.en_attente }}</p>
                  <p class="text-[10px] text-gray-400">En attente</p>
                </div>
                <div>
                  <p class="text-xl font-extrabold text-blue-500">{{ detailModal.user.biens_stats.en_cours }}</p>
                  <p class="text-[10px] text-gray-400">En cours</p>
                </div>
                <div>
                  <p class="text-xl font-extrabold text-green-600">{{ detailModal.user.biens_stats.publie }}</p>
                  <p class="text-[10px] text-gray-400">Publiés</p>
                </div>
                <div>
                  <p class="text-xl font-extrabold text-red-400">{{ detailModal.user.biens_stats.rejete }}</p>
                  <p class="text-[10px] text-gray-400">Rejetés</p>
                </div>
              </div>
            </div>

            <!-- Derniers biens -->
            <div v-if="detailModal.user.derniers_biens?.length">
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Derniers biens soumis</p>
              <div class="space-y-2">
                <div v-for="bien in detailModal.user.derniers_biens" :key="bien.id"
                  class="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100">
                  <div class="w-12 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img v-if="bien.photo" :src="bien.photo" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <span class="material-symbols-outlined text-gray-300 text-xl">home</span>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-gray-800 truncate">{{ bien.titre }}</p>
                    <p class="text-xs text-gray-400">{{ formatDate(bien.created_at) }}</p>
                  </div>
                  <span :class="['px-2 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap', bienStatutClass(bien.statut)]">
                    {{ bienStatutLabel(bien.statut) }}
                  </span>
                </div>
              </div>
            </div>

          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-between flex-shrink-0">
            <button v-if="detailModal.user"
              @click="toggleStatus(detailModal.user); detailModal.open = false"
              :class="['px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5',
                detailModal.user.status === 'active'
                  ? 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                  : 'bg-green-50 text-green-600 hover:bg-green-100']">
              <span class="material-symbols-outlined text-[16px]">
                {{ detailModal.user.status === 'active' ? 'block' : 'check_circle' }}
              </span>
              {{ detailModal.user.status === 'active' ? 'Suspendre' : 'Activer' }}
            </button>
            <button @click="detailModal.open = false"
              class="px-4 py-2 bg-[#1A56A0] text-white rounded-lg text-sm font-semibold hover:opacity-90">
              Fermer
            </button>
          </div>
        </div>
      </div>


      <!-- ── Modal Historique Connexions ── -->
      <div v-if="historiqueModal.open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        @click.self="historiqueModal.open = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">

          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
            <div>
              <h2 class="text-lg font-bold text-[#1A56A0]">Historique de connexions</h2>
              <p class="text-xs text-gray-400 mt-0.5" v-if="historiqueModal.user">
                {{ historiqueModal.user.first_name }} {{ historiqueModal.user.last_name }}
              </p>
            </div>
            <button @click="historiqueModal.open = false"
              class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
              <span class="material-symbols-outlined text-[18px] text-gray-600">close</span>
            </button>
          </div>

          <!-- Skeleton -->
          <div v-if="historiqueModal.loading" class="flex-1 p-6 space-y-3">
            <div v-for="i in 5" :key="i" class="animate-pulse h-12 bg-gray-100 rounded-xl" />
          </div>

          <!-- Vide -->
          <div v-else-if="historiqueModal.data.length === 0" class="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <span class="material-symbols-outlined text-gray-200 text-5xl mb-3">history</span>
            <p class="text-gray-400 text-sm font-medium">Aucune connexion enregistrée</p>
          </div>

          <!-- Liste -->
          <div v-else class="flex-1 overflow-y-auto">
            <div class="divide-y divide-gray-100">
              <div v-for="h in historiqueModal.data" :key="h.id"
                class="px-6 py-3 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                <!-- Icône device -->
                <div :class="['w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0',
                  h.statut === 'succes' ? 'bg-green-50' : 'bg-red-50']">
                  <span :class="['material-symbols-outlined text-[18px]',
                    h.statut === 'succes' ? 'text-green-600' : 'text-red-500']">
                    {{ deviceIcon(h.device_type) }}
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-sm font-semibold text-gray-800">
                      {{ formatDateTime(h.connected_at) }}
                    </span>
                    <span :class="['text-[10px] font-bold px-2 py-0.5 rounded-full',
                      h.statut === 'succes' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600']">
                      {{ h.statut === 'succes' ? 'Succès' : 'Échec' }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-400 mt-0.5">
                    {{ [h.plateforme, h.device_type, h.ville, h.pays].filter(Boolean).join(' · ') || '—' }}
                    <span v-if="h.ip_address" class="ml-2 font-mono">{{ h.ip_address }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="px-6 py-3 border-t border-gray-100 flex-shrink-0 text-right">
            <button @click="historiqueModal.open = false"
              class="px-4 py-2 bg-[#1A56A0] text-white rounded-lg text-sm font-semibold hover:opacity-90">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import Swal from 'sweetalert2'
import { useAuthStore } from '~/stores/auth/auth'

definePageMeta({ layout: 'admin' })

const authStore = useAuthStore()
const config    = useRuntimeConfig()
const apiBase   = config.public?.apiBase || 'http://localhost:8000/api'

// ── State ──────────────────────────────────────────────────────────────────
const users        = useState('admin_users_list',    () => [])
const meta         = useState('admin_users_meta',    () => ({ total: 0, current_page: 1, last_page: 1, per_page: 15 }))
const isLoading    = useState('admin_users_loading', () => true)
const error        = useState('admin_users_error',   () => null)
const statsData    = useState('admin_users_stats',   () => null)
const statsLoading = useState('admin_users_stats_loading', () => true)
const search       = ref('')
const filterStatus = ref('')
const toast        = ref(null)
let   searchTimer  = null
let   pollTimer    = null

// ── KPI cards ──────────────────────────────────────────────────────────────
const kpiCards = computed(() => [
  { label: 'Total',          value: statsData.value?.total ?? '—',     icon: 'group',           bg: 'bg-blue-100',   color: 'text-blue-600' },
  { label: 'Actifs',         value: statsData.value?.actifs ?? '—',    icon: 'check_circle',    bg: 'bg-green-100',  color: 'text-green-600' },
  { label: 'Suspendus',      value: statsData.value?.suspendus ?? '—', icon: 'pause_circle',    bg: 'bg-orange-100', color: 'text-orange-600' },
  { label: 'Bloqués',        value: statsData.value?.bloques ?? '—',   icon: 'block',           bg: 'bg-red-100',    color: 'text-red-600' },
  { label: 'Nouveaux ce mois', value: statsData.value?.nouveaux_ce_mois ?? '—', icon: 'person_add', bg: 'bg-purple-100', color: 'text-purple-600' },
])

// ── Headers auth ───────────────────────────────────────────────────────────
function authHeaders() {
  return { Authorization: `Bearer ${authStore.token.value}` }
}

// ── Charger les stats ──────────────────────────────────────────────────────
async function loadStats() {
  try {
    const data = await $fetch(`${apiBase}/admin/users/stats`, { headers: authHeaders() })
    statsData.value = data.data
  } catch { /* silencieux */ }
  finally { statsLoading.value = false }
}

// ── Charger la liste ───────────────────────────────────────────────────────
async function load(page = 1, silent = false) {
  if (!silent) isLoading.value = true
  error.value = null
  try {
    const query = new URLSearchParams()
    if (search.value)       query.set('search',   search.value)
    if (filterStatus.value) query.set('status',   filterStatus.value)
    query.set('page',     page)
    query.set('per_page', 15)

    const data = await $fetch(`${apiBase}/admin/users?${query}`, { headers: authHeaders() })
    users.value = data.data ?? []
    if (data.meta) meta.value = data.meta
  } catch (e) {
    if (!silent) error.value = e?.data?.message || 'Impossible de charger les utilisateurs.'
  } finally {
    isLoading.value = false
  }
}

function onSearchInput() {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => load(1), 400)
}

// ── Pagination ─────────────────────────────────────────────────────────────
const pageStart = computed(() => meta.value.total === 0 ? 0 : (meta.value.current_page - 1) * meta.value.per_page + 1)
const pageEnd   = computed(() => Math.min(meta.value.current_page * meta.value.per_page, meta.value.total))
const pagesToShow = computed(() => {
  const last = meta.value.last_page, cur = meta.value.current_page
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1)
  const pages = []
  for (let i = Math.max(1, cur - 2); i <= Math.min(last, cur + 2); i++) pages.push(i)
  if (pages[0] > 1) pages.unshift(1)
  if (pages[pages.length - 1] < last) pages.push(last)
  return pages
})
function goToPage(p) { load(p) }

// ── Toggle statut ──────────────────────────────────────────────────────────
async function toggleStatus(user) {
  const newStatus = user.status === 'active' ? 'suspended' : 'active'
  const label     = newStatus === 'active' ? 'activer' : 'suspendre'

  const result = await Swal.fire({
    title: `Confirmer`,
    text:  `Voulez-vous ${label} le compte de ${user.first_name} ${user.last_name} ?`,
    icon:  'question',
    showCancelButton: true,
    confirmButtonText: 'Confirmer',
    cancelButtonText:  'Annuler',
    confirmButtonColor: newStatus === 'active' ? '#16a34a' : '#ea580c',
    cancelButtonColor:  '#6b7280',
    reverseButtons: true,
  })
  if (!result.isConfirmed) return

  try {
    const data = await $fetch(`${apiBase}/admin/users/${user.id}/status`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: { status: newStatus },
    })
    // Mettre à jour localement
    const idx = users.value.findIndex(u => u.id === user.id)
    if (idx !== -1) users.value[idx] = { ...users.value[idx], status: newStatus }
    // Invalider le cache détail pour cet utilisateur
    const updated = { ...usersDetailCache.value }
    delete updated[user.id]
    usersDetailCache.value = updated
    showToast('success', data.message)
    loadStats()
  } catch (e) {
    showToast('error', e?.data?.message || 'Erreur lors de la mise à jour.')
  }
}

// ── Modal détail ───────────────────────────────────────────────────────────
const usersDetailCache = useState('admin_users_detail_cache', () => ({}))
const detailModal = reactive({ open: false, user: null, loading: false })

async function openDetail(user) {
  // Afficher immédiatement depuis le cache si disponible
  const cached = usersDetailCache.value[user.id]
  detailModal.user    = cached ?? null
  detailModal.loading = !cached   // skeleton uniquement si pas de cache
  detailModal.open    = true
  try {
    const data = await $fetch(`${apiBase}/admin/users/${user.id}`, { headers: authHeaders() })
    detailModal.user = data.data
    // Mettre en cache
    usersDetailCache.value = { ...usersDetailCache.value, [user.id]: data.data }
  } catch {
    if (!cached) detailModal.open = false
  } finally {
    detailModal.loading = false
  }
}

// ── Modal historique ───────────────────────────────────────────────────────
const historiqueModal = reactive({ open: false, user: null, data: [], loading: false })

async function openHistorique(user) {
  historiqueModal.user    = user
  historiqueModal.data    = []
  historiqueModal.loading = true
  historiqueModal.open    = true
  try {
    const data = await $fetch(`${apiBase}/admin/users/${user.id}/historique?per_page=50`, { headers: authHeaders() })
    historiqueModal.data = data.data ?? []
  } catch { /* silencieux */ }
  finally { historiqueModal.loading = false }
}

// ── Toast ──────────────────────────────────────────────────────────────────
function showToast(type, message) {
  toast.value = { type, message }
  setTimeout(() => { toast.value = null }, 3500)
}

// ── Helpers d'affichage ────────────────────────────────────────────────────
function initials(u) {
  return ((u?.first_name?.[0] ?? '') + (u?.last_name?.[0] ?? '')).toUpperCase() || '?'
}
function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}
function formatDateTime(d) {
  if (!d) return '—'
  return new Date(d).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
function deviceIcon(type) {
  if (type === 'mobile')  return 'smartphone'
  if (type === 'desktop') return 'computer'
  return 'web'
}
const statusMap = {
  active:    { label: 'Actif',    cls: 'bg-green-50 text-green-700 border-green-200' },
  suspended: { label: 'Suspendu', cls: 'bg-orange-50 text-orange-700 border-orange-200' },
  blocked:   { label: 'Bloqué',   cls: 'bg-red-50 text-red-700 border-red-200' },
}
function statusLabel(s) { return statusMap[s]?.label ?? s }
function statusClass(s) { return statusMap[s]?.cls ?? 'bg-gray-100 text-gray-500 border-gray-200' }

function bienStatutClass(s) {
  if (s === 'en_attente') return 'bg-orange-50 text-orange-700 border-orange-200'
  if (s === 'en_cours')   return 'bg-blue-50 text-blue-700 border-blue-200'
  if (s === 'publie')     return 'bg-green-50 text-green-700 border-green-200'
  if (s === 'rejete')     return 'bg-red-50 text-red-700 border-red-200'
  return 'bg-gray-100 text-gray-500 border-gray-200'
}
function bienStatutLabel(s) {
  return { en_attente: 'En attente', en_cours: 'En cours', publie: 'Publié', rejete: 'Rejeté' }[s] ?? s
}

// ── Init + polling ─────────────────────────────────────────────────────────
onMounted(() => {
  // Si des données existent déjà (navigation retour), rafraîchir silencieusement
  const hasCachedData = users.value.length > 0
  load(meta.value.current_page, hasCachedData)
  if (hasCachedData) loadStats()
  else loadStats()
  pollTimer = setInterval(() => { load(meta.value.current_page, true); loadStats() }, 30_000)
  document.addEventListener('visibilitychange', onVisibilityChange)
})
onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
  document.removeEventListener('visibilitychange', onVisibilityChange)
})
function onVisibilityChange() {
  if (document.visibilityState === 'visible') { load(meta.value.current_page, true); loadStats() }
}
</script>

<!-- Composant local InfoRow pour le modal détail -->
<script>
const InfoRow = {
  props: ['icon', 'label', 'value'],
  template: `
    <div class="flex items-start gap-2 p-3 bg-gray-50 rounded-xl">
      <span class="material-symbols-outlined text-[#1A56A0] text-[18px] flex-shrink-0 mt-0.5">{{ icon }}</span>
      <div class="min-w-0">
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{{ label }}</p>
        <p class="text-sm font-medium text-gray-700 truncate">{{ value || '—' }}</p>
      </div>
    </div>
  `
}
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(-12px); }
</style>
