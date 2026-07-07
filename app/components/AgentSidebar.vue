<template>
  <aside class="fixed left-0 top-0 h-full w-64 bg-[#0d3a6e] text-white flex flex-col z-50">

    <!-- Logo — identique admin -->
    <div class="p-6 flex items-center gap-3">
      <span class="material-symbols-outlined text-4xl" style="font-variation-settings: 'FILL' 1">domain</span>
      <h1 class="text-2xl font-bold tracking-tight">ImmoPro</h1>
    </div>

    <!-- Navigation -->
    <nav class="flex-grow px-4 mt-4 space-y-1">
      <NuxtLink
        v-for="item in navItems"
        :key="item.id"
        :to="item.href"
        :class="[
          'flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200',
          isActive(item.href)
            ? 'sidebar-active'
            : 'hover:bg-white/10 opacity-80 hover:opacity-100'
        ]"
      >
        <span class="material-symbols-outlined">{{ item.icon }}</span>
        <span class="font-medium">{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <!-- Profil utilisateur -->
    <div class="p-6 mt-auto border-t border-white/10">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden shrink-0 bg-white/20 flex items-center justify-center">
          <img
            v-if="profilePicture"
            :src="profilePicture"
            class="w-full h-full object-cover"
            alt="Agent"
          />
          <span v-else class="text-sm font-bold">{{ avatarInitials }}</span>
        </div>
        <div class="overflow-hidden">
          <p class="text-sm font-bold truncate">{{ displayName }}</p>
          <p class="text-xs opacity-60 truncate">{{ displayEmail }}</p>
        </div>
      </div>
    </div>

  </aside>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth/auth'

const authStore = useAuthStore()
const route     = useRoute()

const displayName = computed(() => {
  const u = authStore.user?.value
  if (!u) return 'Agent'
  if (u.first_name || u.last_name) {
    return `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email || 'Agent'
  }
  return u.name || u.email || 'Agent'
})

const displayEmail = computed(() => authStore.user?.value?.email || 'agent@immopro.fr')

const profilePicture = computed(() => authStore.user?.value?.profile_picture || null)

const avatarInitials = computed(() => {
  const u = authStore.user?.value
  if (!u) return 'A'
  return `${u.first_name?.[0] ?? ''}${u.last_name?.[0] ?? ''}`.toUpperCase() || 'A'
})

const navItems = [
  { id: 1, label: 'Dashboard',        icon: 'dashboard',      href: '/agent' },
  { id: 2, label: 'Biens à vérifier', icon: 'verified_user',  href: '/agent/check' },
  { id: 3, label: 'Calendrier',       icon: 'calendar_today', href: '/agent/calendar' },
  { id: 4, label: 'Rapports',         icon: 'analytics',      href: '/agent/reports' },
  { id: 5, label: 'Messagerie',       icon: 'mail',           href: '/agent/messages' },
  { id: 6, label: 'Profil',           icon: 'person',         href: '/agent/profile' },
]

function isActive(href: string): boolean {
  return route.path === href || (href !== '/agent' && route.path.startsWith(href))
}
</script>

<style scoped>
.sidebar-active {
  @apply bg-white/10 border-l-4 border-white;
}
</style>
