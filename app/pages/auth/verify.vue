<template>
  <div class="bg-surface-bright font-manrope text-on-surface min-h-screen flex flex-col">

    <!-- ── Header ── -->
    <header class="sticky top-0 z-50 flex justify-between items-center px-margin-desktop h-20 w-full max-w-[1280px] mx-auto bg-surface/80 backdrop-blur-md border-b border-outline-variant/30">
      <div class="text-headline-md font-bold text-primary">ImmoPro</div>
      <div class="flex items-center gap-stack-md">
        <span class="text-label-md text-on-surface-variant">Besoin d'aide ?</span>
        <button class="text-primary text-label-md hover:underline transition-all">
          Contactez le support
        </button>
      </div>
    </header>

    <!-- ── Contenu principal ── -->
    <main class="flex-grow flex items-center justify-center py-section-gap px-margin-mobile md:px-margin-desktop relative">

      <!-- Fond dégradé décoratif -->
      <div class="fixed inset-0 -z-10 bg-gradient-to-br from-surface-container-low to-surface-bright"></div>

      <!-- Carte de vérification -->
      <div class="w-full max-w-[520px] bg-white rounded-xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(13,58,110,0.05)] p-10 md:p-14 text-center">

        <!-- Icône -->
        <div class="mb-8 flex justify-center">
          <div class="w-16 h-16 rounded-full flex items-center justify-center text-primary"
               style="background: rgba(26,86,160,0.08)">
            <span
              class="material-symbols-outlined text-4xl"
              style="font-variation-settings:'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
            >verified_user</span>
          </div>
        </div>

        <!-- Titre & sous-titre -->
        <h1 class="text-headline-lg text-on-background mb-stack-md">
          Vérification de votre compte
        </h1>
        <p class="text-body-md text-on-surface-variant mb-10">
          Un code à 6 chiffres a été envoyé à votre adresse e-mail.<br />
          Veuillez le saisir ci-dessous pour sécuriser votre accès.
        </p>

        <!-- Formulaire OTP -->
        <form class="space-y-10" @submit.prevent="handleVerify">

          <!-- Champs OTP -->
          <div class="flex justify-between gap-2 md:gap-4">
            <input
              v-for="(_, index) in otp"
              :key="index"
              :ref="(el) => setInputRef(el as HTMLInputElement | null, index)"
              v-model="otp[index]"
              type="text"
              inputmode="numeric"
              maxlength="1"
              autocomplete="one-time-code"
              required
              class="otp-input w-12 h-14 md:w-16 md:h-20 text-center text-2xl font-bold rounded-lg
                     border-[1.5px] border-outline-variant bg-white text-primary
                     focus:border-primary focus:ring-0 transition-all"
              @input="onInput($event as InputEvent, index)"
              @keydown="onKeydown($event as KeyboardEvent, index)"
              @paste="onPaste($event as ClipboardEvent)"
            />
          </div>

          <!-- Message d'erreur -->
          <p v-if="errorMessage" class="text-sm text-error flex items-center justify-center gap-1">
            <span class="material-symbols-outlined text-base">error</span>
            {{ errorMessage }}
          </p>

          <div class="space-y-stack-lg">
            <!-- Bouton Vérifier -->
            <button
              type="submit"
              :disabled="isVerifying || otpComplete === false"
              class="w-full py-4 rounded-lg text-headline-md font-bold shadow-sm transition-all
                     active:scale-[0.98] focus:ring-4 focus:ring-primary-container/20
                     disabled:opacity-60 disabled:cursor-not-allowed"
              :class="verified ? 'bg-green-500 text-white' : 'bg-primary-container text-white hover:bg-primary'"
            >
              <span v-if="verified" class="flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-xl"
                  style="font-variation-settings:'FILL' 1">check_circle</span>
                Vérifié
              </span>
              <span v-else-if="isVerifying" class="flex items-center justify-center gap-2">
                <span class="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                Vérification…
              </span>
              <span v-else>Vérifier</span>
            </button>

            <!-- Renvoyer le code -->
            <div class="pt-4">
              <p class="text-label-md text-on-surface-variant">
                Vous n'avez pas reçu le code ?
                <button
                  type="button"
                  :disabled="countdown > 0"
                  class="text-primary font-bold ml-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  @click="resendCode"
                >
                  Renvoyer le code
                  <span v-if="countdown > 0">({{ countdown }}s)</span>
                </button>
              </p>
            </div>
          </div>
        </form>

        <!-- Badge sécurité -->
        <div class="mt-12 flex items-center justify-center gap-2 text-on-surface-variant/60">
          <span
            class="material-symbols-outlined text-sm"
            style="font-variation-settings:'FILL' 1"
          >lock</span>
          <span class="text-caption">Connexion sécurisée par cryptage SSL de bout en bout</span>
        </div>
      </div>
    </main>

    <!-- ── Footer ── -->
    <footer class="w-full py-stack-lg px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-stack-lg bg-surface-bright border-t border-outline-variant/20">
      <div class="text-caption text-on-surface-variant">
        © 2024 ImmoPro. Tous droits réservés.
      </div>
      <div class="flex gap-stack-lg">
        <a href="#" class="text-caption text-on-surface-variant hover:text-primary transition-colors">
          Conditions d'utilisation
        </a>
        <a href="#" class="text-caption text-on-surface-variant hover:text-primary transition-colors">
          Politique de confidentialité
        </a>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useHead, navigateTo } from '#imports'

useHead({ title: 'Vérification OTP | ImmoPro' })

/* ── État ── */
const otp = ref<string[]>(['', '', '', '', '', ''])
const inputRefs = ref<(HTMLInputElement | null)[]>(Array(6).fill(null))
const isVerifying = ref(false)
const verified = ref(false)
const errorMessage = ref('')
const countdown = ref(59)
let timer: ReturnType<typeof setInterval> | null = null

/* ── OTP complet ? ── */
const otpComplete = computed(() => otp.value.every(d => /^[0-9]$/.test(d)))

/* ── Références des inputs ── */
function setInputRef(el: HTMLInputElement | null, index: number) {
  inputRefs.value[index] = el
}

/* ── Saisie d'un chiffre ── */
function onInput(event: InputEvent, index: number) {
  const target = event.target as HTMLInputElement
  // Garder uniquement le dernier chiffre saisi
  const val = target.value.replace(/[^0-9]/g, '').slice(-1)
  otp.value[index] = val
  target.value = val

  // Avancer vers le champ suivant si rempli
  if (val && index < 5) {
    inputRefs.value[index + 1]?.focus()
  }
}

/* ── Touche retour arrière ── */
function onKeydown(event: KeyboardEvent, index: number) {
  if (event.key === 'Backspace') {
    if (!otp.value[index] && index > 0) {
      otp.value[index - 1] = ''
      inputRefs.value[index - 1]?.focus()
    } else {
      otp.value[index] = ''
    }
  }
}

/* ── Coller un code complet ── */
function onPaste(event: ClipboardEvent) {
  event.preventDefault()
  const text = event.clipboardData?.getData('text') ?? ''
  const digits = text.replace(/[^0-9]/g, '').slice(0, 6)
  digits.split('').forEach((d, i) => {
    otp.value[i] = d
    if (inputRefs.value[i]) inputRefs.value[i]!.value = d
  })
  const nextEmpty = digits.length < 6 ? digits.length : 5
  inputRefs.value[nextEmpty]?.focus()
}

/* ── Compte à rebours pour renvoyer ── */
function startTimer() {
  if (timer) clearInterval(timer)
  countdown.value = 59
  timer = setInterval(() => {
    if (countdown.value <= 0) {
      clearInterval(timer!)
      timer = null
      return
    }
    countdown.value--
  }, 1000)
}

function resendCode() {
  if (countdown.value > 0) return
  // TODO : appel backend pour renvoyer le code
  startTimer()
}

/* ── Soumission ── */
async function handleVerify() {
  if (!otpComplete.value) return
  errorMessage.value = ''
  isVerifying.value = true

  try {
    // TODO : remplacer par l'appel réel au backend
    await new Promise(resolve => setTimeout(resolve, 1300))
    verified.value = true
    await new Promise(resolve => setTimeout(resolve, 800))
    await navigateTo('/auth/login')
  } catch {
    errorMessage.value = 'Code invalide. Veuillez réessayer.'
  } finally {
    isVerifying.value = false
  }
}

/* ── Cycle de vie ── */
onMounted(() => {
  startTimer()
  // Focus sur le premier champ
  inputRefs.value[0]?.focus()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.otp-input:focus {
  box-shadow: 0 0 0 4px rgba(26, 86, 160, 0.1);
}
</style>
