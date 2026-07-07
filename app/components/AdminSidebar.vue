<template>
  <aside class="fixed left-0 top-0 h-full w-64 bg-[#0d3a6e] text-white flex flex-col z-50">
    <!-- Logo & Branding -->
    <div class="p-6 flex items-center gap-3">
      <span class="material-symbols-outlined text-4xl" style="font-variation-settings: 'FILL' 1">domain</span>
      <h1 class="text-2xl font-bold tracking-tight">ImmoPro</h1>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-grow px-4 mt-4 space-y-1">
      <NuxtLink 
        v-for="item in navItems" 
        :key="item.id"
        :to="item.href"
        :class="[
          'flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200',
          isActive(item.href) ? 'sidebar-active' : 'hover:bg-white/10 opacity-80 hover:opacity-100'
        ]"
      >
        <span class="material-symbols-outlined">{{ item.icon }}</span>
        <span class="font-medium">{{ item.label }}</span>
      </NuxtLink>
    </nav>
    <div class="p-6 mt-auto border-t border-white/10">
      <div class="flex items-center gap-3">
        <img 
          class="w-10 h-10 rounded-full border-2 border-white/20 object-cover" 
          :src="authStore.user?.profile_picture || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBa9j6JX1mj_vkWWtbL2iJb_vQLaR7kdp8_5PeAEvzmAnp3sWT4nh-Fr-k1i0fYI3bD1IXQhPPaAmVkRcvprkRn209aFuNH-xEl_UKLFC98ZT3k33-PJSlmFUS9d8HkvVp32pC58brKRXWdGVEhXldff_qft7gHFrsSpCrlEtDX7012bDTC3HaysUoKJnrSiqTPnjhfrdVMsE6qdkvSplLA7cUbyx55XDix59DJ4IN88CXnHALPMKpku8HbzmP9a1GmtwhqqH8BH0'"
          alt="Admin Profile"
        />
        <div class="overflow-hidden">
          <p class="text-sm font-bold truncate">
            {{ displayName }}
          </p>
          <p class="text-xs opacity-60 truncate">
            {{ displayEmail }}
          </p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '~/stores/auth/auth'

const authStore = useAuthStore()
const displayName = computed(() => {
  const user = authStore.user?.value
  if (!user) return 'Admin'
  if (user.first_name || user.last_name) {
    return `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'Admin'
  }
  return user.name || user.email || 'Admin'
})

const displayEmail = computed(() => {
  return authStore.user?.value?.email || 'admin@gmail.com'
})

const navItems = [
  { id: 1,  label: 'Dashboard',      icon: 'dashboard',            href: '/admin' },
  { id: 2,  label: 'Agents',         icon: 'support_agent',        href: '/admin/agents' },
  { id: 3,  label: 'Utilisateurs',   icon: 'group',                href: '/admin/users' },
  { id: 4,  label: 'Biens/Annonces', icon: 'home_work',            href: '/admin/properties' },
  { id: 5,  label: 'Vérificateurs',  icon: 'verified_user',        href: '/admin/verifiers' },
  { id: 6,  label: 'Transactions',   icon: 'payments',             href: '/admin/transactions' },
  { id: 7,  label: 'Commissions',    icon: 'percent',              href: '/admin/commissions' },
  { id: 8,  label: 'Alertes',        icon: 'notifications_active', href: '/admin/alerts' },
  { id: 9,  label: 'Rapports',       icon: 'analytics',            href: '/admin/reports' },
]

// Highlight active item based on current route
const route = useRoute()
function isActive(href: string): boolean {
  return route.path === href || (href !== '/admin' && route.path.startsWith(href))
}

// Kept for backward compat but no longer used for active state
const updateActive = () => {}
onMounted(updateActive)
watch(() => route.path, updateActive)
</script>

<style scoped>
.sidebar-active {
  @apply bg-white/10 border-l-4 border-white;
}
</style>
