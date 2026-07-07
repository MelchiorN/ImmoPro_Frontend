<template>
  <div class="bg-gray-50 text-gray-900 font-[Manrope] flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <AdminSidebar />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden ml-64">
      <!-- Header -->
      <AdminHeader />

      <!-- Main Content Area -->
      <main class="flex-1 overflow-y-auto bg-gray-50">
        <slot />
      </main>

      <!-- Footer -->
      <AdminFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
// Les composants Admin* sont auto-importés en Nuxt 3
</script>
