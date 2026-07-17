<template>
  <header class="sticky top-0 h-16 bg-white shadow-sm flex items-center justify-between px-8 z-40 border-b border-gray-200">

    <!-- Barre de recherche -->
    <div class="relative w-96">
      <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[18px]">search</span>
      <input
        class="w-full pl-10 pr-4 py-2 bg-blue-50 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-200 outline-none"
        placeholder="Rechercher une annonce, un client..."
        type="text"
      />
    </div>

    <!-- Actions droite -->
    <div class="flex items-center gap-4">

      <!-- Notifications -->
      <NotificationBell />

      <!-- Paramètres -->
      <button
        @click="goToSettings"
        title="Paramètres"
        class="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <span class="material-symbols-outlined text-gray-700 text-[22px]">settings</span>
      </button>

      <!-- Dropdown utilisateur -->
      <div class="relative">
        <button
          @click="showDropdown = !showDropdown"
          class="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors focus:outline-none"
        >
          <span class="text-sm font-semibold text-gray-700">{{ displayName }}</span>
          <span
            class="material-symbols-outlined text-gray-500 text-[18px] transition-transform duration-200"
            :class="{ 'rotate-180': showDropdown }"
          >expand_more</span>
        </button>

        <!-- Backdrop fermeture -->
        <div v-if="showDropdown" class="fixed inset-0 z-40" @click="showDropdown = false" />

        <!-- Menu déroulant -->
        <div
          v-if="showDropdown"
          class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50"
        >
          <button
            @click="handleLogout"
            class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-semibold transition-colors"
          >
            <span class="material-symbols-outlined text-[16px]">logout</span>
            Se déconnecter
          </button>
        </div>
      </div>

    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '~/stores/auth/auth'

const authStore    = useAuthStore()
const showDropdown = ref(false)

const displayName = computed(() => {
  const user = authStore.user?.value
  if (!user) return 'Admin'
  if (user.first_name || user.last_name) {
    return `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'Admin'
  }
  return user.name || user.email || 'Admin'
})

function goToSettings() {
  showDropdown.value = false
  navigateTo('/admin/settings')
}

async function handleLogout() {
  showDropdown.value = false
  await authStore.logout()
  await navigateTo('/auth/login')
}
</script>
