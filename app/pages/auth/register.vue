<template>
  <!-- overflow-x-hidden sur le wrapper racine pour bloquer le scroll latéral -->
  <div class="bg-surface text-on-surface font-manrope min-h-screen overflow-x-hidden">
    <main class="min-h-screen flex flex-col md:flex-row overflow-x-hidden">

      <!-- ────────────────────────────────────────────────
           Volet gauche : image + overlay bleu (desktop)
      ──────────────────────────────────────────────── -->
      <section class="relative hidden md:flex md:w-1/2 h-screen overflow-hidden flex-shrink-0">
        <!-- Image de fond -->
        <div class="absolute inset-0 z-0">
          <img
            class="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZxiVu-LbWnfkC4BP1a3V-L7o0hGOBxi-UmjvtA0JYgMabW_2s8TB3slw4s3FYgk-eDzwq0x8xh96zCSd9DIJo6dXC5eDAfY08gPikBwPW9zrm3-t5Ap4IulZ8tzhYiAeNWjD_ZJDqd5WBVSlq6HlH1F-be5zssapDXn5KTCOUwMSOVeNXX_H2hoNfLvIOEV_r-ZK_EGMlLuwlzPCcEg0WmSfScn-YkWf8gka8G13wUAFZ-dF5sHNfwV0Shllm-FIaU2045hYeSFs"
            alt="Immeuble contemporain de luxe"
          />
        </div>
        <!-- Overlay dégradé bleu -->
        <div
          class="absolute inset-0 z-10"
          style="background: linear-gradient(135deg, rgba(0,62,126,0.85) 0%, rgba(21,63,116,0.6) 100%)"
        ></div>

        <!-- Contenu au-dessus de l'overlay -->
        <div class="relative z-20 flex flex-col justify-between p-margin-desktop w-full text-white">
          <!-- Logo -->
          <div>
            <span class="text-headline-md font-bold tracking-tight">ImmoPro</span>
          </div>

          <!-- Accroche -->
          <div class="max-w-md">
            <h1 class="text-display-lg mb-stack-md leading-tight">
              Rejoignez des milliers de propriétaires et clients
            </h1>
            <p class="text-body-lg text-white/80">
              La plateforme de référence pour les transactions immobilières premium et sécurisées.
            </p>
          </div>

          <!-- Avatars + membres -->
          <div class="flex items-center gap-stack-md">
            <div class="flex -space-x-3">
              <div
                v-for="(src, i) in avatars"
                :key="i"
                class="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-primary-container"
              >
                <img :src="src" class="w-full h-full object-cover" alt="Membre" />
              </div>
            </div>
            <span class="text-label-md text-white/90">Plus de 10k membres actifs</span>
          </div>
        </div>
      </section>

      <!-- ────────────────────────────────────────────────
           Volet droit : formulaire d'inscription
      ──────────────────────────────────────────────── -->
      <section class="w-full md:w-1/2 h-screen overflow-y-auto overflow-x-hidden flex items-start md:items-center justify-center p-margin-mobile md:p-margin-desktop bg-white">
        <div class="w-full max-w-xl">

          <!-- Logo mobile uniquement -->
          <div class="md:hidden mb-stack-lg">
            <span class="text-headline-md font-bold text-primary">ImmoPro</span>
          </div>

          <!-- En-tête -->
          <div class="mb-8">
            <h2 class="text-headline-lg text-on-surface mb-stack-sm">Créer un compte</h2>
            <p class="text-body-md text-on-surface-variant">
              Inscrivez-vous pour accéder aux meilleures opportunités immobilières.
            </p>
          </div>

          <!-- Formulaire -->
          <form class="space-y-stack-lg" @submit.prevent="handleRegister">

            <!-- Prénom / Nom -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <div class="flex flex-col gap-2">
                <label class="text-label-md text-on-surface-variant" for="firstName">Prénom</label>
                <input
                  id="firstName"
                  v-model="form.firstName"
                  type="text"
                  placeholder="John"
                  required
                  class="field-base"
                />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-label-md text-on-surface-variant" for="lastName">Nom</label>
                <input
                  id="lastName"
                  v-model="form.lastName"
                  type="text"
                  placeholder="TORO"
                  required
                  class="field-base"
                />
              </div>
            </div>

            <!-- Email -->
            <div class="flex flex-col gap-2">
              <label class="text-label-md text-on-surface-variant" for="email">Adresse email</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl select-none">mail</span>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="nom@gmail.com"
                  required
                  class="field-base pl-12"
                />
              </div>
            </div>

            <!-- Pays / Ville -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter">

              <!-- Autocomplétion Pays -->
              <div class="flex flex-col gap-2">
                <label class="text-label-md text-on-surface-variant" for="countryInput">Pays</label>
                <div class="relative" ref="countryRef">
                  <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl select-none pointer-events-none">public</span>
                  <input
                    id="countryInput"
                    v-model="countryQuery"
                    type="text"
                    placeholder="Ex: France"
                    autocomplete="off"
                    required
                    class="field-base pl-12"
                    @input="onCountryInput"
                    @focus="showCountryDropdown = filteredCountries.length > 0"
                    @blur="onCountryBlur"
                  />
                  <!-- Spinner chargement pays -->
                  <span v-if="loadingCountries" class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline animate-spin text-xl">progress_activity</span>
                  <!-- Dropdown pays -->
                  <ul
                    v-if="showCountryDropdown && filteredCountries.length > 0"
                    class="autocomplete-dropdown"
                  >
                    <li
                      v-for="c in filteredCountries"
                      :key="c.cca2"
                      class="autocomplete-item"
                      @mousedown.prevent="selectCountry(c)"
                    >
                      <span class="text-lg leading-none">{{ c.flag }}</span>
                      <span>{{ c.name.common }}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Autocomplétion Ville -->
              <div class="flex flex-col gap-2">
                <label class="text-label-md text-on-surface-variant" for="cityInput">Ville</label>
                <div class="relative" ref="cityRef">
                  <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl select-none pointer-events-none">location_city</span>
                  <input
                    id="cityInput"
                    v-model="cityQuery"
                    type="text"
                    placeholder="Ex: Paris"
                    autocomplete="off"
                    required
                    :disabled="!form.country"
                    class="field-base pl-12 disabled:opacity-50 disabled:cursor-not-allowed"
                    @input="onCityInput"
                    @focus="showCityDropdown = filteredCities.length > 0"
                    @blur="onCityBlur"
                  />
                  <!-- Spinner chargement villes -->
                  <span v-if="loadingCities" class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline animate-spin text-xl">progress_activity</span>
                  <!-- Dropdown villes -->
                  <ul
                    v-if="showCityDropdown && filteredCities.length > 0"
                    class="autocomplete-dropdown"
                  >
                    <li
                      v-for="city in filteredCities"
                      :key="city"
                      class="autocomplete-item"
                      @mousedown.prevent="selectCity(city)"
                    >
                      <span class="material-symbols-outlined text-base text-outline">location_on</span>
                      <span>{{ city }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Téléphone -->
            <div class="flex flex-col gap-2">
              <label class="text-label-md text-on-surface-variant" for="phone">Numéro de téléphone</label>
              <div class="flex gap-2">
                <!-- Indicatif (lecture seule, rempli automatiquement) -->
                <div class="relative flex-shrink-0">
                  <input
                    v-model="form.dialCode"
                    type="text"
                    readonly
                    placeholder="+33"
                    class="field-base w-24 text-center cursor-default bg-surface-container-low font-bold text-primary"
                  />
                </div>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  placeholder="06 12 34 56 78"
                  required
                  class="field-base flex-1"
                />
              </div>
            </div>

            <!-- Mot de passe / Confirmation -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <div class="flex flex-col gap-2">
                <label class="text-label-md text-on-surface-variant" for="password">Mot de passe</label>
                <div class="relative">
                  <input
                    id="password"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    required
                    class="field-base pr-12"
                  />
                  <button
                    type="button"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                    @click="showPassword = !showPassword"
                  >
                    <span class="material-symbols-outlined text-xl">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                  </button>
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-label-md text-on-surface-variant" for="confirmPassword">Confirmation</label>
                <div class="relative">
                  <input
                    id="confirmPassword"
                    v-model="form.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    required
                    class="field-base pr-12"
                  />
                  <button
                    type="button"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                    @click="showConfirmPassword = !showConfirmPassword"
                  >
                    <span class="material-symbols-outlined text-xl">{{ showConfirmPassword ? 'visibility_off' : 'visibility' }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Indicateur de force du mot de passe -->
            <div v-if="form.password" class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-caption text-on-surface-variant">Force du mot de passe</span>
                <span class="text-caption font-bold" :class="strengthColor">{{ passwordStrengthLabel }}</span>
              </div>
              <div class="flex gap-1.5 h-1.5 w-full">
                <div
                  v-for="n in 3"
                  :key="n"
                  class="h-full flex-1 rounded-full transition-colors duration-300"
                  :class="passwordStrength >= n ? activeStrengthClass : 'bg-outline-variant/30'"
                ></div>
              </div>
            </div>

            <!-- Message d'erreur -->
            <p v-if="errorMessage" class="text-sm text-error flex items-center gap-1">
              <span class="material-symbols-outlined text-base">error</span>
              {{ errorMessage }}
            </p>

            <!-- Bouton soumettre -->
            <div class="pt-2 space-y-stack-lg">
              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full h-12 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
                  <span class="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                  Inscription en cours…
                </span>
                <span v-else>S'inscrire</span>
              </button>

              <!-- Séparateur -->
              <div class="relative flex items-center py-2">
                <div class="flex-grow border-t border-outline-variant"></div>
                <span class="flex-shrink mx-4 text-caption text-outline uppercase tracking-wider">ou continuer avec</span>
                <div class="flex-grow border-t border-outline-variant"></div>
              </div>

              <!-- Boutons sociaux -->
              <div class="w-full">
                <button
                  type="button"
                  class="flex items-center justify-center gap-2 w-full h-12 bg-white border border-outline-variant rounded-xl hover:bg-surface-container-low transition-all"
                >
                  <img
                    src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
                    class="w-5 h-5"
                    alt="Google"
                  />
                  <span class="text-label-md text-on-surface">Continuer avec Google</span>
                </button>
              </div>

              <!-- Lien connexion -->
              <p class="text-center text-body-md text-on-surface-variant">
                Déjà un compte ?
                <NuxtLink to="/auth/login" class="text-primary font-bold hover:underline ml-1">
                  Se connecter
                </NuxtLink>
              </p>
            </div>
          </form>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useHead, navigateTo } from '#imports'

useHead({ title: 'Créer un compte | ImmoPro' })

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface Country {
  name: { common: string }
  cca2: string
  flag: string
  idd: { root: string; suffixes?: string[] }
}

/* ─────────────────────────────────────────────
   Données du formulaire
───────────────────────────────────────────── */
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  country: '',       // code ISO (ex: "FR")
  countryName: '',   // nom affiché (ex: "France")
  city: '',
  dialCode: '',
  phone: '',
  password: '',
  confirmPassword: '',
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')

/* ─────────────────────────────────────────────
   Avatars
───────────────────────────────────────────── */
const avatars = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAzIN2ZB8VFVKycc9e2BHChR8U2gJMdOXs0SyK-B57y58S4K4Khr8ZUAUqufsY4AlH7hQLBcLQ--sfUjlQrvXZ56krMWTGqux_isBafoKZzMYvApc8_HUaWKGZqij8fUSuHiS-fH-3HbfR7xmO24WF-9zkC5_xo0UVAuFKeXtv3aN7jL3mUYcWFvf7jD7nu--WlPnHq1mNLVZkS_NXQTbGKpCjiHZ0tmNhpL4BIPPMZDkCp7apAS5gobFDvygGTpPf0EkIGeOREmtU',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA_lWLHxmENbnSz1s-kacw6mwJLre-ML4Gh01fEUePGosA5u-KQoe2fRNZ_YUycSaXvtyACHDvizFlSiFjO-flH0viStbU0hUWiZWzkRc9wIcw0omuAOGvBc_TSIgdOqaPDHSzzirOf3Yz2FUhP3vzpx17AphqQIlwSr68P5vDO118LzM8hsIT-77oTXSXp8DIsH19tJLwngFKeU-RJ0dpxXMKOngTMezkMV63a0rrSVoqwiEdAM-d9WLTcGJftUe70V4prejMN08M',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCUvsN6StGGhDwoxWznrqe-b_iR95u3Vzv4CuWOgp5iPs90KJm04RFGeo2GrFTXnUBlAapeTsBLRZ4w2aKL7NfMclPd1aU0Sy492w3-vFI3Af14CtjlXvLgCImCNYJoRCojMPtU2fihYJrMThq_Bn9cQBSZkeLhpRMaporg2Co2gjcWKJNtcXmUfbmKj97QZjS3-J9AMFFQl-vxdIxSvruL8e_RBp-F49CIrOUt-pa2rA9G3duf044ePZ4hWXaIGVwlDrhZgiaupio',
]

/* ─────────────────────────────────────────────
   Autocomplétion PAYS (RestCountries)
───────────────────────────────────────────── */
const allCountries = ref<Country[]>([])
const loadingCountries = ref(false)
const countryQuery = ref('')
const showCountryDropdown = ref(false)
const countryRef = ref<HTMLElement | null>(null)

/** Charge tous les pays au montage (une seule requête) */
async function fetchAllCountries() {
  loadingCountries.value = true
  try {
    const res = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,flag,idd')
    const data: Country[] = await res.json()
    // Tri alphabétique par nom commun
    allCountries.value = data.sort((a, b) =>
      a.name.common.localeCompare(b.name.common, 'fr')
    )
  } catch {
    console.error('Impossible de charger la liste des pays.')
  } finally {
    loadingCountries.value = false
  }
}

/** Pays filtrés selon la saisie */
const filteredCountries = computed(() => {
  if (!countryQuery.value.trim()) return []
  const q = countryQuery.value.toLowerCase().trim()
  return allCountries.value
    .filter(c => c.name.common.toLowerCase().includes(q))
    .slice(0, 8)
})

function onCountryInput() {
  // Réinitialise la sélection si l'utilisateur retape
  form.country = ''
  form.countryName = ''
  form.dialCode = ''
  form.city = ''
  cityQuery.value = ''
  allCities.value = []
  showCountryDropdown.value = filteredCountries.value.length > 0
}

function selectCountry(c: Country) {
  countryQuery.value = c.name.common
  form.country = c.cca2
  form.countryName = c.name.common
  showCountryDropdown.value = false

  // Indicatif téléphonique
  if (c.idd?.root) {
    const suffix = c.idd.suffixes?.length === 1 ? c.idd.suffixes[0] : ''
    form.dialCode = c.idd.root + suffix
  } else {
    form.dialCode = ''
  }

  // Charger les villes du pays
  fetchCitiesForCountry(c.name.common)
}

function onCountryBlur() {
  // Léger délai pour laisser le mousedown se déclencher
  setTimeout(() => {
    showCountryDropdown.value = false
    // Si le texte ne correspond à aucun pays validé, on réinitialise
    if (!form.country) {
      countryQuery.value = ''
    }
  }, 150)
}

/* ─────────────────────────────────────────────
   Autocomplétion VILLES (CountriesNow)
───────────────────────────────────────────── */
const allCities = ref<string[]>([])
const loadingCities = ref(false)
const cityQuery = ref('')
const showCityDropdown = ref(false)
const cityRef = ref<HTMLElement | null>(null)

async function fetchCitiesForCountry(countryName: string) {
  loadingCities.value = true
  allCities.value = []
  cityQuery.value = ''
  form.city = ''
  try {
    const res = await fetch('https://countriesnow.space/api/v1/countries/cities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: countryName }),
    })
    const data = await res.json()
    if (!data.error && Array.isArray(data.data)) {
      allCities.value = data.data.sort((a: string, b: string) => a.localeCompare(b, 'fr'))
    }
  } catch {
    console.error('Impossible de charger les villes.')
  } finally {
    loadingCities.value = false
  }
}

/** Villes filtrées selon la saisie */
const filteredCities = computed(() => {
  if (!cityQuery.value.trim()) return allCities.value.slice(0, 8)
  const q = cityQuery.value.toLowerCase().trim()
  return allCities.value
    .filter(c => c.toLowerCase().includes(q))
    .slice(0, 8)
})

function onCityInput() {
  form.city = ''
  showCityDropdown.value = filteredCities.value.length > 0
}

function selectCity(city: string) {
  cityQuery.value = city
  form.city = city
  showCityDropdown.value = false
}

function onCityBlur() {
  setTimeout(() => {
    showCityDropdown.value = false
    // Accepte la valeur libre si pas sélectionné dans le dropdown
    if (!form.city && cityQuery.value.trim()) {
      form.city = cityQuery.value.trim()
    }
  }, 150)
}

/* ─────────────────────────────────────────────
   Force du mot de passe
───────────────────────────────────────────── */
const passwordStrength = computed(() => {
  let score = 0
  if (form.password.length >= 8) score++
  if (/[A-Z]/.test(form.password) && /[a-z]/.test(form.password)) score++
  if (/[0-9]/.test(form.password) || /[^A-Za-z0-9]/.test(form.password)) score++
  return score
})

const passwordStrengthLabel = computed(() => {
  if (passwordStrength.value === 1) return 'Faible'
  if (passwordStrength.value === 2) return 'Moyen'
  return 'Sécurisé'
})

const strengthColor = computed(() => {
  if (passwordStrength.value === 1) return 'text-error'
  if (passwordStrength.value === 2) return 'text-yellow-600'
  return 'text-primary'
})

const activeStrengthClass = computed(() => {
  if (passwordStrength.value === 1) return 'bg-error'
  if (passwordStrength.value === 2) return 'bg-yellow-500'
  return 'bg-primary'
})

/* ─────────────────────────────────────────────
   Soumission
───────────────────────────────────────────── */
async function handleRegister() {
  errorMessage.value = ''

  if (
    !form.firstName || !form.lastName || !form.email ||
    !form.country || !form.city || !form.phone ||
    !form.password || !form.confirmPassword
  ) {
    errorMessage.value = 'Veuillez remplir tous les champs obligatoires.'
    return
  }

  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  isSubmitting.value = true
  try {
    // TODO : remplacer par l'appel réel au backend
    await new Promise(resolve => setTimeout(resolve, 1000))
    await navigateTo('/auth/verify')
  } finally {
    isSubmitting.value = false
  }
}

/* ─────────────────────────────────────────────
   Initialisation
───────────────────────────────────────────── */
onMounted(() => {
  fetchAllCountries()
})
</script>

<style scoped>
/* Champ de formulaire réutilisable */
.field-base {
  @apply w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface-bright text-on-surface transition-all
         focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10;
}

/* Dropdown d'autocomplétion */
.autocomplete-dropdown {
  @apply absolute z-50 left-0 right-0 top-[calc(100%+4px)]
         bg-white border border-outline-variant rounded-lg shadow-lg
         max-h-52 overflow-y-auto;
}

.autocomplete-item {
  @apply flex items-center gap-3 px-4 py-2.5 text-body-md text-on-surface
         cursor-pointer hover:bg-surface-container-low transition-colors;
}
</style>
