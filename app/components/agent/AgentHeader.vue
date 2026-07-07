<template>
  <header class="sticky top-0 h-16 bg-surface border-b border-outline-variant flex justify-between items-center px-6 z-40">
    <!-- Title -->
    <h2 class="text-headline-md font-semibold text-primary">{{ title }}</h2>

    <!-- Right Section -->
    <div class="flex items-center gap-5">
      <!-- Search -->
      <div class="relative hidden lg:block">
        <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
        <input
          class="bg-surface-container-low border-none rounded-full pl-9 pr-4 py-1.5 text-sm w-60 focus:outline-none focus:ring-2 focus:ring-primary-container"
          placeholder="Rechercher..."
          type="text"
        />
      </div>

      <!-- Notifications -->
      <button class="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container">
        <Bell :size="20" />
      </button>

      <!-- Settings -->
      <button class="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container">
        <Settings :size="20" />
      </button>

      <!-- User dropdown -->
      <div class="relative">
        <button
          @click="showDropdown = !showDropdown"
          class="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-surface-container transition-colors"
        >
          <span class="text-sm font-semibold text-on-surface hidden sm:block">{{ displayName }}</span>
          <ChevronDown :size="16" class="text-outline transition-transform duration-200" :class="{ 'rotate-180': showDropdown }" />
        </button>

        <div v-if="showDropdown" class="fixed inset-0 z-40" @click="showDropdown = false" />

        <div v-if="showDropdown" class="absolute right-0 mt-2 w-44 bg-surface-container-lowest rounded-lg shadow-lg border border-outline-variant py-1 z-50">
          <button
            @click="handleLogout"
            class="w-full text-left px-4 py-2 text-sm text-error hover:bg-error-container/30 flex items-center gap-2 font-semibold transition-colors"
          >
            <LogOut :size="14" />
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Search, Bell, Settings, ChevronDown, LogOut } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth/auth'

const props = defineProps<{ title?: string }>()

const authStore = useAuthStore()
const showDropdown = ref(false)

const title = computed(() => props.title ?? 'Tableau de bord — Agent')

const displayName = computed(() => {
  const user = authStore.user?.value
  if (!user) return 'Agent'
  if (user.first_name || user.last_name) {
    return `${user.first_name || ''} ${user.last_name || ''}`.trim()
  }
  return user.name || user.email || 'Agent'
})

async function handleLogout() {
  showDropdown.value = false
  await authStore.logout()
  await navigateTo('/auth/login')
}
</script>
