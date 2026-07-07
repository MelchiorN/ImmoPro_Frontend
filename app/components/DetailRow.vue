<template>
  <div>
    <p class="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-0.5">{{ label }}</p>
    <p class="font-medium text-on-surface text-sm break-all">{{ value }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; value: string }>()
</script>
