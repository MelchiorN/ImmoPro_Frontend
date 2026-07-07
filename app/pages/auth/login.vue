<template>
  <div class="bg-background text-on-background font-[Manrope] h-screen overflow-hidden">
    <main class="flex h-full w-full">

      <!-- ─── Panneau gauche : visuel + branding (desktop uniquement) ─── -->
      <section class="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-[64px] overflow-hidden h-full">

        <!-- Image de fond -->
        <div
          class="absolute inset-0 z-0 bg-cover bg-center"
          style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCWsPF5hoQIOV-j0oUMKT7ZIJoGgaWE8jQyu2cITjl24wRXVJlGypvfGfOCOlqZbkIpvvZA-Xa1yeXzy7uYdrOQ6a_NQzDVgoC93dSiQtyX1W3zsmUKnWEmRLS1e1YpnnHuj1KfW-genouTA_XChm5jX-76EsCPvGnxeJin9AxXXZe1da4q-rJGT0NIMVp9BoK9yKmMOUKBcvORja1G8kj93J_IKEQXkcMdg6Fpo7T-ocypEWKnbn7UhBDknomSj5BbQKjsDYwA5XM')"
        />
        <!-- Overlay bleu 65% -->
        <div class="absolute inset-0 z-10 bg-primary-container/65" />

        <!-- Contenu brand -->
        <div class="relative z-20 flex flex-col items-center text-center max-w-lg">
          <!-- Logo + titre -->
          <div class="mb-6 flex items-center gap-3">
            <span class="material-symbols-outlined text-[64px] text-white" style="font-variation-settings:'FILL' 1">domain</span>
            <h1 class="text-white text-[48px] font-extrabold tracking-tight leading-tight">ImmoPro</h1>
          </div>

          <h2 class="text-white text-[32px] font-bold mb-[80px] leading-snug">
            Trouvez votre bien idéal
          </h2>

          <!-- Liste features -->
          <ul class="space-y-6 text-left w-full max-w-xs">
            <li v-for="item in [
              'Accès exclusif au marché off-market',
              'Estimation certifiée par experts',
              'Accompagnement juridique premium',
            ]" :key="item" class="flex items-center gap-4 text-white">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <span class="material-symbols-outlined text-white text-[20px]" style="font-variation-settings:'FILL' 1">check_circle</span>
              </div>
              <span class="text-[18px] leading-relaxed">{{ item }}</span>
            </li>
          </ul>
        </div>

        <!-- Copyright -->
        <div class="absolute bottom-10 z-20 text-white/60 text-[12px] font-medium">
          © 2026 ImmoPro. Excellence immobilière.
        </div>
      </section>

      <!-- ─── Panneau droit : formulaire ─── -->
      <section class="w-full lg:w-1/2 bg-surface flex flex-col justify-center items-center px-6 py-6 md:px-[64px] overflow-hidden h-full">
        <div class="w-full max-w-md h-full flex flex-col justify-center">

          <!-- Logo mobile -->
          <div class="flex items-center gap-2 mb-6 lg:mb-8">
            <span class="material-symbols-outlined text-primary text-[32px]" style="font-variation-settings:'FILL' 1">domain</span>
            <span class="text-primary text-[24px] font-semibold tracking-tight">ImmoPro</span>
          </div>

          <!-- Titre -->
          <div class="mb-6">
            <h2 class="text-[28px] font-bold text-on-background mb-1">Bon retour!</h2>
            <p class="text-on-surface-variant text-[14px]">Connectez-vous pour accéder à vos propriétés.</p>
          </div>

          <!-- Formulaire -->
          <form class="space-y-4" @submit.prevent="handleLogin">

            <!-- Email -->
            <div class="space-y-1.5">
              <label class="block text-[12px] font-semibold tracking-widest uppercase text-on-surface-variant" for="email">
                Adresse e-mail
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span class="material-symbols-outlined text-outline text-[18px]">mail</span>
                </div>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  placeholder="melchior@gmail.com"
                  class="block w-full pl-11 pr-4 py-2.5 bg-white border border-outline-variant rounded-lg focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-[14px] placeholder:text-outline/50"
                />
              </div>
            </div>

            <!-- Mot de passe -->
            <div class="space-y-1.5">
              <label class="block text-[12px] font-semibold tracking-widest uppercase text-on-surface-variant" for="password">
                Mot de passe
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span class="material-symbols-outlined text-outline text-[18px]">lock</span>
                </div>
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  placeholder="••••••••"
                  class="block w-full pl-11 pr-12 py-2.5 bg-white border border-outline-variant rounded-lg focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-[14px] placeholder:text-outline/50"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-primary transition-colors"
                  @click="showPassword = !showPassword"
                >
                  <!-- <span class="material-symbols-outlined text-[18px]">
                    {{ showPassword ? 'visibility_off' : 'visibility' }}
                  </span> -->
                </button>
              </div>
            </div>

            <!-- Options -->
            <div class="flex items-center justify-between pt-1">
              <label class="flex items-center gap-2 cursor-pointer group">
                <input
                  v-model="form.rememberMe"
                  type="checkbox"
                  class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
                />
                <span class="text-[12px] font-semibold text-on-surface-variant group-hover:text-on-surface transition-colors">
                  Se souvenir de moi
                </span>
              </label>
              <NuxtLink
                to="/auth/forgot-password"
                class="text-[12px] font-bold text-primary hover:underline"
              >
                Mot de passe oublié?
              </NuxtLink>
            </div>

            <!-- Erreur API -->
            <p v-if="error" class="text-red-600 text-xs pt-1">{{ error }}</p>

            <!-- Bouton Se connecter -->
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full py-3 bg-primary text-white text-[13px] font-semibold tracking-wide rounded-lg shadow-lg shadow-primary/20 hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 pt-2"
            >
              <svg v-if="isLoading" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <span>{{ isLoading ? 'Connexion…' : 'Se connecter' }}</span>
            </button>
          </form>

          <!-- Divider -->
          <div class="relative my-4">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-outline-variant/30" />
            </div>
            <div class="relative flex justify-center text-[11px]">
              <span class="px-3 bg-surface text-outline font-medium">ou</span>
            </div>
          </div>

          <!-- Social logins -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              type="button"
              class="flex items-center justify-center gap-2 py-2.5 border border-outline-variant rounded-lg bg-white hover:bg-surface-container-low transition-colors text-[12px] font-semibold text-on-surface"
            >
              <!-- Icône Google inline SVG -->
              <svg class="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button
              type="button"
              class="flex items-center justify-center gap-2 py-2.5 border border-outline-variant rounded-lg bg-white hover:bg-surface-container-low transition-colors text-[12px] font-semibold text-on-surface"
            >
              <!-- Icône Apple inline SVG -->
              <svg class="w-4 h-4" viewBox="0 0 384 512" fill="currentColor">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
              </svg>
              Apple
            </button>
          </div>

          <!-- Lien inscription -->
          <p class="mt-4 text-center text-[13px] text-on-surface-variant">
            Nouveau sur ImmoPro?
            <NuxtLink to="/auth/register" class="text-primary font-bold hover:underline ml-1">
              Créer un compte
            </NuxtLink>
          </p>

        </div>
      </section>
    </main>

    <!-- Modal OTP 2FA -->
    <!-- <AuthOtpModal
      :show="showOtp"
      :loading="isLoading"
      :error="otpError"
      @close="showOtp = false"
      @verify="handleVerify"
    /> -->
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth/auth'

useHead({ title: 'Connexion | ImmoPro - Immobilier de Prestige' })

const authStore = useAuthStore()

const form = reactive({ email: '', password: '', rememberMe: false })
const showPassword = ref(false)

const isLoading = authStore.isLoading
const error = authStore.error

// OTP non requis pour l'admin - redirection directe après connexion réussie
const showOtp = ref(false)
const otpError = ref<string | null>(null)

async function handleLogin() {
  const ok = await authStore.login({
    email:    form.email,
    password: form.password,
  })
  if (ok) {
    const role = authStore.user.value?.role
    if (role === 'admin')       await navigateTo('/admin')
    else if (role === 'agent')  await navigateTo('/agent')
    else                        await navigateTo('/')
  }
}

async function handleVerify(code: string) {
  // Optionnel, conservé pour compatibilité template
  showOtp.value = false
  await navigateTo('/admin')
}
</script>

