<script setup lang="ts">
const props = defineProps<{ show: boolean; loading: boolean; error: string | null }>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'verify', code: string): void
}>()

const digits = ref<string[]>(Array(6).fill(''))
const inputs = ref<HTMLInputElement[]>([])

const code = computed(() => digits.value.join(''))

function onInput(index: number, event: Event) {
  const val = (event.target as HTMLInputElement).value.replace(/\D/g, '')
  digits.value[index] = val.slice(-1)
  if (val && index < 5) {
    nextTick(() => inputs.value[index + 1]?.focus())
  }
}

function onKeydown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace' && !digits.value[index] && index > 0) {
    inputs.value[index - 1]?.focus()
  }
}

function verify() {
  if (code.value.length === 6) emit('verify', code.value)
}

// Reset + focus quand la modal s'ouvre
watch(() => props.show, (val) => {
  if (val) {
    digits.value = Array(6).fill('')
    nextTick(() => inputs.value[0]?.focus())
  }
})

// Fermeture via Escape
onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') emit('close')
  })
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="show"
        class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0b1c30]/40 backdrop-blur-sm"
        @click.self="emit('close')"
      >
        <div class="glass-morphism w-full max-w-md p-10 rounded-2xl shadow-2xl">
          <!-- Icône -->
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-[#1a56a0]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="material-symbols-outlined text-[#003e7e] text-[32px]">verified_user</span>
            </div>
            <h3 class="text-[24px] font-semibold leading-snug text-[#0b1c30] mb-2">
              Vérification en deux étapes
            </h3>
            <p class="text-[#424751] text-[16px]">
              Entrez le code de sécurité à 6 chiffres envoyé à votre téléphone.
            </p>
          </div>

          <!-- Cases OTP -->
          <div class="flex justify-between gap-2 mb-8">
            <input
              v-for="(_, i) in digits"
              :key="i"
              :ref="(el) => { if (el) inputs[i] = el as HTMLInputElement }"
              v-model="digits[i]"
              type="text"
              inputmode="numeric"
              maxlength="1"
              class="otp-input w-12 h-14 text-center text-xl font-bold rounded-lg border border-[#c2c6d3] bg-white transition-all focus:outline-none"
              @input="onInput(i, $event)"
              @keydown="onKeydown(i, $event)"
            />
          </div>

          <!-- Erreur -->
          <p v-if="error" class="text-red-600 text-sm text-center mb-4">{{ error }}</p>

          <!-- Bouton Vérifier -->
          <button
            class="w-full py-4 bg-[#003e7e] text-white text-[14px] font-semibold tracking-wide rounded-lg shadow-lg hover:bg-[#1a56a0] active:scale-[0.98] transition-all disabled:opacity-60"
            :disabled="loading || code.length < 6"
            @click="verify"
          >
            <span v-if="loading" class="inline-block animate-spin mr-2">⏳</span>
            Vérifier
          </button>

          <!-- Annuler -->
          <button
            class="w-full mt-4 py-2 text-[#737782] text-[14px] font-semibold hover:text-[#0b1c30] transition-colors"
            @click="emit('close')"
          >
            Annuler
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
</style>
