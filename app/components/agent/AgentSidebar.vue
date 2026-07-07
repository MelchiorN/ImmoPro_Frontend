<template>
  <aside class="fixed left-0 top-0 h-full w-64 bg-primary-container text-on-primary-fixed-variant flex flex-col z-50 shadow-md">
    <!-- Logo & Branding -->
    <div class="px-6 py-7 mb-2">
      <h1 class="text-xl font-bold text-on-primary tracking-tight">ImmoPro</h1>
      <p class="text-xs text-on-primary/70 mt-0.5">Professional Agent</p>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 px-4 space-y-0.5">
      <NuxtLink
        v-for="item in navItems"
        :key="item.id"
        :to="item.href"
        :class="[
          'flex items-center gap-4 px-4 py-2.5 rounded-lg transition-all duration-150 font-medium',
          isActive(item.href)
            ? 'bg-on-primary-fixed-variant text-on-primary font-bold scale-95'
            : 'text-primary-fixed hover:bg-on-primary-fixed-variant/50'
        ]"
      >
        <component :is="item.icon" :size="20" />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <!-- User Profile Section -->
    <div class="mx-4 mb-4 p-3 bg-on-primary-fixed-variant/30 rounded-xl flex items-center gap-3">
      <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center overflow-hidden shrink-0">
        <img
          class="w-full h-full object-cover"
          :src="authStore.user?.value?.profile_picture || defaultAvatar"
          alt="Agent"
        />
      </div>
      <div class="overflow-hidden">
        <p class="text-on-primary text-sm font-bold truncate">{{ displayName }}</p>
        <p class="text-on-primary/60 text-[10px] truncate">Verified Member</p>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  LayoutDashboard,
  ShieldCheck,
  CalendarDays,
  BarChart2,
  Mail,
  User
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth/auth'

const authStore = useAuthStore()
const route = useRoute()

const defaultAvatar =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBlXvZvCZXGkGm9owPsXbMEJNNVxaEyXlJkW_la0YA-2f8yla-tEvfadeiBbyAFhggQVKeB7aO3D2YDGV5x-ESnOA04OMpv8jitxj2Vvw1cx_Z9phKZxYapquc3VbM76h3aEiDQ84MnVQHSKIZmFDvZauEb4tebRTU1hCqmHjHHG7WpMeTjyotPH5_HocxcRFwOfrNJiDz4LiyZcTdlY-2SDjtHa_lgb4YErYTgapzC2iYngX23_fxRd2O2zhqZ-RfsPbyANN0uKmg'

const displayName = computed(() => {
  const user = authStore.user?.value
  if (!user) return 'Agent ImmoPro'
  if (user.first_name || user.last_name) {
    return `${user.first_name || ''} ${user.last_name || ''}`.trim()
  }
  return user.name || user.email || 'Agent ImmoPro'
})

const navItems = [
  { id: 1, label: 'Dashboard',          icon: LayoutDashboard, href: '/agent' },
  { id: 2, label: 'Biens à vérifier',   icon: ShieldCheck,     href: '/agent/check' },
  { id: 3, label: 'Calendrier',         icon: CalendarDays,    href: '/agent/calendar' },
  { id: 4, label: 'Rapports',           icon: BarChart2,       href: '/agent/reports' },
  { id: 5, label: 'Messagerie',         icon: Mail,            href: '/agent/messages' },
  { id: 6, label: 'Profil',             icon: User,            href: '/agent/profile' },
]

function isActive(href: string): boolean {
  return route.path === href
}
</script>
