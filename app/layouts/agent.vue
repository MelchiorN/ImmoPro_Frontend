<template>
  <div class="bg-background text-on-surface font-manrope flex h-screen overflow-hidden">

    <!-- Sidebar fixe -->
    <AgentSidebar />

    <!-- Colonne principale -->
    <div class="flex-1 flex flex-col overflow-hidden ml-64">

      <!-- Header sticky -->
      <AgentHeader :title="pageTitle" />

      <!-- Zone de contenu scrollable -->
      <main class="flex-1 overflow-y-auto bg-background">
        <slot />
      </main>

      <!-- Footer -->
      <AgentFooter />

    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const pageTitles: Record<string, string> = {
  '/agent':            'Tableau de bord',
  '/agent/check': 'Biens à vérifier',
  '/agent/calendar':   'Calendrier',
  '/agent/reports':    'Rapports',
  '/agent/messages':   'Messagerie',
  '/agent/profile':    'Profil',
}

const pageTitle = computed(() => pageTitles[route.path] ?? 'Tableau de bord')
</script>
