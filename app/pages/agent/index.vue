<template>
  <div class="p-6 flex gap-6">

    <!-- ── Colonne principale ── -->
    <div class="flex-1 space-y-6 min-w-0">

      <!-- KPI Row -->
      <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <div
          v-for="kpi in kpis"
          :key="kpi.label"
          class="bg-white p-5 rounded-xl border border-gray-100 shadow-[0_2px_12px_rgba(0,62,126,0.06)] hover:shadow-md transition-shadow"
        >
          <div class="flex justify-between items-start mb-3">
            <span class="text-gray-500 text-sm font-medium">{{ kpi.label }}</span>
            <div :class="`p-2 ${kpi.iconBg} rounded-lg`">
              <component :is="kpi.icon" :size="18" :class="kpi.iconColor" />
            </div>
          </div>
          <p class="text-3xl font-extrabold text-primary leading-none">{{ kpi.value }}</p>
          <div class="mt-2 flex items-center gap-1" :class="kpi.trendColor">
            <component :is="kpi.trendIcon" :size="13" />
            <span class="text-xs font-medium">{{ kpi.trend }}</span>
          </div>
        </div>
      </section>

      <!-- Tableau priorité -->
      <section class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 class="text-base font-bold text-primary">À traiter en priorité</h3>
          <button class="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
            Tout voir <ArrowRight :size="14" />
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wide">
              <tr>
                <th class="px-5 py-3">Bien</th>
                <th class="px-5 py-3">Propriétaire</th>
                <th class="px-5 py-3">Soumis le</th>
                <th class="px-5 py-3">Priorité</th>
                <th class="px-5 py-3">Statut</th>
                <th class="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="property in properties"
                :key="property.id"
                class="hover:bg-blue-50/30 transition-colors"
              >
                <!-- Bien -->
                <td class="px-5 py-3">
                  <div class="flex items-center gap-3">
                    <div class="w-14 h-10 rounded-lg overflow-hidden shrink-0 relative">
                      <img :src="property.image" :alt="property.name" class="w-full h-full object-cover" />
                      <div v-if="property.verified" class="absolute top-0.5 left-0.5 bg-green-600 px-1 rounded text-[7px] text-white flex items-center gap-0.5">
                        <BadgeCheck :size="7" />
                      </div>
                    </div>
                    <div>
                      <p class="font-semibold text-gray-800">{{ property.name }}</p>
                      <p class="text-gray-400 text-xs">{{ property.location }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-3 text-gray-500">{{ property.owner }}</td>
                <td class="px-5 py-3 text-gray-500 text-xs">{{ property.date }}</td>
                <!-- Priorité -->
                <td class="px-5 py-3">
                  <span :class="`px-2.5 py-0.5 rounded-full text-xs font-bold ${priorityClass(property.priority)}`">
                    {{ property.priority }}
                  </span>
                </td>
                <!-- Statut -->
                <td class="px-5 py-3">
                  <div class="flex items-center gap-1.5 text-gray-500 text-xs">
                    <div :class="`w-1.5 h-1.5 rounded-full ${statusDotClass(property.status)}`" />
                    {{ property.status }}
                  </div>
                </td>
                <!-- Actions — toujours visibles -->
                <td class="px-5 py-3 text-right">
                  <div class="flex justify-end gap-2">
                    <button class="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors">
                      Voir
                    </button>
                    <button class="px-3 py-1.5 border border-gray-200 text-primary rounded-lg text-xs font-medium hover:bg-blue-50 transition-colors">
                      Planifier
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <!-- ── Panneau droit ── -->
    <aside class="w-72 space-y-5 hidden xl:flex xl:flex-col shrink-0">

      <!-- Mini Calendrier -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div class="flex justify-between items-center mb-4">
          <h4 class="font-bold text-gray-800 text-sm">Octobre 2023</h4>
          <div class="flex gap-1">
            <button class="p-1 hover:bg-gray-100 rounded transition-colors">
              <ChevronLeft :size="14" />
            </button>
            <button class="p-1 hover:bg-gray-100 rounded transition-colors">
              <ChevronRight :size="14" />
            </button>
          </div>
        </div>

        <div class="grid grid-cols-7 gap-y-1 text-center text-[10px] text-gray-400 mb-2 font-semibold">
          <span v-for="d in ['L','M','M','J','V','S','D']" :key="d">{{ d }}</span>
        </div>

        <div class="grid grid-cols-7 gap-y-1 text-center text-xs">
          <span
            v-for="day in calendarDays"
            :key="`${day.num}-${day.prev}`"
            :class="[
              'relative flex items-center justify-center rounded-full w-6 h-6 mx-auto cursor-pointer transition-colors',
              day.prev  ? 'text-gray-300' :
              day.today ? 'bg-primary text-white font-bold' :
              'text-gray-700 hover:bg-blue-50',
            ]"
          >
            {{ day.num }}
            <span v-if="day.event && !day.today" class="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
          </span>
        </div>

        <!-- Prochaines visites -->
        <div class="mt-4 pt-4 border-t border-gray-100">
          <h5 class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Prochaines visites</h5>
          <div class="space-y-3">
            <div
              v-for="visit in upcomingVisits"
              :key="visit.id"
              class="flex gap-3 cursor-pointer group"
            >
              <div :class="[
                'px-2 py-1 rounded-lg text-center min-w-[46px] transition-colors text-xs',
                visit.today
                  ? 'bg-blue-50 text-primary'
                  : 'bg-gray-50 text-gray-500',
                'group-hover:bg-primary group-hover:text-white'
              ]">
                <p class="font-bold">{{ visit.time }}</p>
                <p class="text-[9px] font-bold uppercase">{{ visit.day }}</p>
              </div>
              <div class="flex-1 overflow-hidden">
                <p class="text-xs font-bold truncate text-gray-800">{{ visit.property }}</p>
                <p class="text-[10px] text-gray-400 truncate">{{ visit.client }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Carte performance -->
      <div class="bg-primary p-5 rounded-xl text-white relative overflow-hidden group cursor-pointer">
        <div class="absolute -right-6 -top-6 w-28 h-28 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
        <div class="relative z-10">
          <Award :size="28" class="mb-3 fill-white" />
          <p class="font-bold text-sm mb-1">Qualité de service</p>
          <p class="text-xs text-white/75 mb-4 leading-relaxed">
            85 % des biens vérifiés ce trimestre. Excellent travail !
          </p>
          <button class="w-full py-2 bg-white text-primary rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors">
            Voir mes stats
          </button>
        </div>
      </div>

    </aside>
  </div>
</template>

<script setup lang="ts">
import {
  Package, CheckCircle2, CalendarCheck, Percent,
  TrendingUp, Check, Clock,
  ChevronLeft, ChevronRight, ArrowRight, BadgeCheck, Award,
} from 'lucide-vue-next'

definePageMeta({ layout: 'agent' })

const kpis = [
  {
    label: 'Biens assignés',     value: '12',
    icon: Package,       iconBg: 'bg-blue-50',   iconColor: 'text-primary',
    trend: '+2 cette semaine',   trendIcon: TrendingUp, trendColor: 'text-green-600',
  },
  {
    label: 'Vérifiés ce mois',   value: '8',
    icon: CheckCircle2,  iconBg: 'bg-green-50',  iconColor: 'text-green-600',
    trend: 'Objectif : 10',      trendIcon: Check,     trendColor: 'text-green-600',
  },
  {
    label: 'Visites planifiées', value: '5',
    icon: CalendarCheck, iconBg: 'bg-purple-50', iconColor: 'text-purple-600',
    trend: 'Prochaine à 14:00',  trendIcon: Clock,      trendColor: 'text-gray-500',
  },
  {
    label: 'Taux de validation', value: '92%',
    icon: Percent,       iconBg: 'bg-blue-50',   iconColor: 'text-primary',
    trend: '+1.4% ce mois',      trendIcon: TrendingUp, trendColor: 'text-green-600',
  },
]

const properties = [
  {
    id: 1, name: 'Appartement Haussmannien', location: 'Paris 8e — 75m²',
    owner: 'Jean Dupont', date: '12/10/2023', priority: 'Urgent', status: 'En attente', verified: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrFh34jK0XlFxo-YxW1Xlv2xz-zAFsrBZ_KSl93og2Rlm9F5r6G1y3IPJ1IZqkDMp_AtV5Cb4SIQpYa1ilsyso742QXX4wCAOBr65RA1ANn0msgJdOpVYBAlDVRnOwm74jmL5D9gSTJJIwbOkPQ94duezex4nL3n8DOnq2erNx6nP7zRTrEsf5m8eka-hue3cCuuiJ3Z6NK_GBcV0UHswjAa-vzYhTsN5roOrKHW5jrWSSu5s3PQfGhgawkws7BvZ-4fpchOz_bQM',
  },
  {
    id: 2, name: 'Loft Industriel', location: 'Lyon — 110m²',
    owner: 'Marie Lefebvre', date: '13/10/2023', priority: 'Moyenne', status: 'Revue en cours', verified: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvxa6tzuirFssjQr5W_pAc9snOaqsyGKMOS1QEklk29aDuPLacIdcaZ9Su7tUhykmTVU1xSzok2RLSxeDBWaRHxd2ky-kqY_SlQIQJngZgjByyX_I8wZJdUDFs_T9n7pRoSA-X7sNjse3QaQC8jYwRSKcqnHhm3poIGLyJ8VlfjlW52XoIsjbU773Zt_in0DUIIJlCSx8tU7RD5x10sUaeYpDSxHF-gOO6ADwZX5h56_NuT0tdN57j6RKU-8jDlVZAh-hrwA8whgo',
  },
  {
    id: 3, name: 'Villa Contemporaine', location: 'Bordeaux — 150m²',
    owner: 'Marc Durant', date: '14/10/2023', priority: 'Faible', status: 'En attente', verified: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlVwfVlXdzgA2nSZWqIDYWrWjYUB5JV4Hxsja0qX8h7dTFO5ZEC4458594ZXVT2Y_sKUOMWlV0LQitgiIVN7bc8iAMS8k3LnSf2UjD2z7hubBu5CiXXWvsGFGQQ8sFf95qbt-kMXb9BGdvuYed-Ml7dl-1uBVNuAlgzdePugkTJOr56IZDUMSLFTEyTBbtvXtVyLBUkfUsvUM-Wn9_P9YfxSDCfYvFwKVECxQEayLUnK6mwk84cidPjWxXeCQ466NJeC1RSjUt0JY',
  },
]

function priorityClass(p: string) {
  if (p === 'Urgent')  return 'bg-red-100 text-red-700'
  if (p === 'Moyenne') return 'bg-orange-100 text-orange-700'
  return 'bg-blue-50 text-primary'
}
function statusDotClass(s: string) {
  if (s === 'Revue en cours') return 'bg-blue-500'
  return 'bg-gray-400'
}

const calendarDays = [
  { num: 25, prev: true }, { num: 26, prev: true }, { num: 27, prev: true },
  { num: 28, prev: true }, { num: 29, prev: true }, { num: 30, prev: true },
  { num: 1 }, { num: 2 }, { num: 3 }, { num: 4 }, { num: 5 }, { num: 6 }, { num: 7 },
  { num: 8 }, { num: 9 }, { num: 10 }, { num: 11 },
  { num: 12, today: true },
  { num: 13, event: true },
  { num: 14 }, { num: 15 }, { num: 16 },
  { num: 17, event: true },
  { num: 18 }, { num: 19 }, { num: 20 }, { num: 21 }, { num: 22 },
]

const upcomingVisits = [
  { id: 1, time: '14:00', day: 'Auj.', property: 'Appt. Haussmannien', client: 'Jean Dupont', today: true },
  { id: 2, time: '10:30', day: 'Dem.', property: 'Villa Contemporaine', client: 'Marc Durant', today: false },
]
</script>
