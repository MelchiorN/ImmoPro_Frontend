<template>
  <div class="p-8 pb-16">
    <!-- Page Header -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-extrabold text-[#1A56A0] tracking-tight">Dashboard Administrateur</h1>
      <div class="flex gap-3">
        <button class="px-4 py-2 border border-[#1A56A0] text-[#1A56A0] rounded-lg font-semibold hover:bg-[#EBF4FB] transition-colors">
          Exporter PDF
        </button>
        <button class="px-4 py-2 bg-[#1A56A0] text-white rounded-lg font-semibold hover:bg-[#0D3A6E] transition-colors">
          Nouvelle Campagne
        </button>
      </div>
    </div>

    <!-- KPI Cards Row -->
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
      <div v-for="kpi in kpiCards" :key="kpi.id" class="bg-white p-5 rounded-[16px] shadow-[0_4px_20px_rgba(26,86,160,0.08)] border border-surface-container">
        <p class="text-sm text-[#888888] font-medium mb-1">{{ kpi.label }}</p>
        <h3 class="text-2xl font-bold text-[#1A56A0]">{{ kpi.value }}</h3>
        <p :class="['text-xs mt-2 flex items-center gap-1', kpi.trendClass]">
          <span class="material-symbols-outlined text-sm">{{ kpi.trendIcon }}</span>
          {{ kpi.trend }}
        </p>
      </div>
    </div>

    <!-- Charts & Validations Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      <!-- Revenue Chart -->
      <div class="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-surface-container">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-bold text-[#1A56A0]">Revenus mensuels</h2>
          <div class="flex bg-surface-container-low p-1 rounded-lg">
            <button class="px-3 py-1 text-xs font-semibold rounded bg-white shadow-sm text-[#1A56A0]">Mensuel</button>
            <button class="px-3 py-1 text-xs font-semibold rounded text-outline hover:text-[#1A56A0]">Trimestriel</button>
            <button class="px-3 py-1 text-xs font-semibold rounded text-outline hover:text-[#1A56A0]">Annuel</button>
          </div>
        </div>
        <div class="h-48 flex items-end justify-between gap-2 px-2">
          <svg class="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 100">
            <path d="M0 80 Q 50 60, 100 70 T 200 40 T 300 50 T 400 20" fill="transparent" stroke="#1A56A0" stroke-width="3"></path>
            <path d="M0 80 Q 50 60, 100 70 T 200 40 T 300 50 T 400 20 V 100 H 0 Z" fill="rgba(26,86,160,0.1)"></path>
          </svg>
        </div>
      </div>

      <!-- Pending Announcements -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-surface-container overflow-hidden">
        <h2 class="text-lg font-bold text-[#1A56A0] mb-4">Annonces en attente</h2>
        <div class="space-y-4">
          <div v-for="item in pendingAnnouncements" :key="item.id" class="flex items-center justify-between p-3 border-b border-surface-container-low last:border-0">
            <div class="flex items-center gap-3">
              <div 
                class="w-10 h-10 rounded-lg bg-cover bg-center"
                :style="{ backgroundImage: `url('${item.image}')` }"
              ></div>
              <div>
                <p class="text-xs font-bold truncate w-32">{{ item.title }}</p>
                <p class="text-[10px] text-outline">{{ item.location }}</p>
              </div>
            </div>
            <div class="flex gap-2">
              <button class="p-1 text-green-700 hover:bg-green-50 rounded" title="Valider">
                <span class="material-symbols-outlined text-sm">check_circle</span>
              </button>
              <button class="p-1 text-red-600 hover:bg-red-50 rounded" title="Rejeter">
                <span class="material-symbols-outlined text-sm">cancel</span>
              </button>
            </div>
          </div>
        </div>
        <button class="w-full mt-6 py-2 border border-[#1A56A0] text-[#1A56A0] text-xs font-bold rounded-lg hover:bg-[#EBF4FB]">
          Voir tous les rapports
        </button>
      </div>
    </div>

    <!-- Donut Chart & Agent Performance Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Distribution Donut -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-surface-container flex flex-col md:flex-row items-center gap-8">
        <div class="flex-shrink-0">
          <h2 class="text-lg font-bold text-[#1A56A0] mb-6">Répartition des annonces</h2>
          <div class="relative w-40 h-40">
            <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path class="text-[#EBF4FB] stroke-current" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke-width="4"></path>
              <path class="text-[#1A56A0] stroke-current" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke-dasharray="60, 100" stroke-linecap="round" stroke-width="4"></path>
              <path class="text-[#2E75B6] stroke-current" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke-dasharray="25, 100" stroke-dashoffset="-60" stroke-linecap="round" stroke-width="4"></path>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-2xl font-bold text-[#1A56A0]">4.1k</span>
              <span class="text-[10px] text-outline uppercase font-bold">Total</span>
            </div>
          </div>
        </div>
        <div class="space-y-3 w-full">
          <div v-for="distribution in distributionData" :key="distribution.id" class="flex items-center justify-between text-sm">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: distribution.color }"></div>
              <span class="text-on-surface">{{ distribution.label }}</span>
            </div>
            <span class="font-bold">{{ distribution.percentage }}</span>
          </div>
        </div>
      </div>

      <!-- Agent Performance Table -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-surface-container">
        <h2 class="text-lg font-bold text-[#1A56A0] mb-4">Performances des agents</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="text-outline border-b border-surface-container-low">
                <th class="pb-3 font-semibold">Agent</th>
                <th class="pb-3 font-semibold text-center">Ventes</th>
                <th class="pb-3 font-semibold text-center">Satisfaction</th>
                <th class="pb-3 font-semibold text-right">Statut</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-surface-container-low">
              <tr v-for="agent in agentPerformance" :key="agent.id">
                <td class="py-3 flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-[#EBF4FB] flex items-center justify-center text-[#1A56A0] font-bold text-xs">
                    {{ agent.initials }}
                  </div>
                  <span class="font-medium">{{ agent.name }}</span>
                </td>
                <td class="py-3 text-center font-bold">{{ agent.sales }}</td>
                <td class="py-3 text-center" :class="agent.satisfactionClass">
                  {{ agent.satisfaction }}/5
                </td>
                <td class="py-3 text-right">
                  <span :class="['px-2 py-1 rounded-full text-[10px] font-bold uppercase', agent.statusClass]">
                    {{ agent.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- AI Alerts & Recent Activity Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- AI Alerts -->
      <div class="bg-[#EBF4FB] p-6 rounded-2xl border border-[#1A56A0]/10">
        <div class="flex items-center gap-2 mb-6">
          <span class="material-symbols-outlined text-[#1A56A0]">auto_awesome</span>
          <h2 class="text-lg font-bold text-[#1A56A0]">Alertes & Anomalies IA</h2>
        </div>
        <div class="space-y-4">
          <div v-for="alert in aiAlerts" :key="alert.id" :class="['bg-white p-4 rounded-xl flex gap-4 items-start shadow-sm', alert.opacityClass]">
            <span class="material-symbols-outlined" :class="alert.iconClass">{{ alert.icon }}</span>
            <div>
              <p class="text-sm font-bold text-on-surface">{{ alert.title }}</p>
              <p class="text-xs text-outline mt-1">{{ alert.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-surface-container">
        <h2 class="text-lg font-bold text-[#1A56A0] mb-6">Activité récente</h2>
        <div class="relative space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#EBF4FB]">
          <div v-for="activity in recentActivity" :key="activity.id" class="flex gap-4 relative">
            <div :class="['w-6 h-6 rounded-full flex items-center justify-center z-10 border-4 border-white', activity.bgClass]">
              <span class="material-symbols-outlined text-[12px] text-white">{{ activity.icon }}</span>
            </div>
            <div>
              <p class="text-sm font-bold">{{ activity.title }}</p>
              <p class="text-xs text-outline">{{ activity.description }}</p>
              <p class="text-[10px] text-outline mt-1 italic">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Payments Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-surface-container overflow-hidden">
      <div class="p-6 border-b border-surface-container flex justify-between items-center">
        <h2 class="text-lg font-bold text-[#1A56A0]">Paiements récents</h2>
        <button class="text-xs font-bold text-[#1A56A0] hover:underline">Voir tout l'historique</button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-surface-container-low text-[10px] uppercase tracking-wider text-outline">
            <tr>
              <th class="px-6 py-4 font-bold">Client</th>
              <th class="px-6 py-4 font-bold">Référence</th>
              <th class="px-6 py-4 font-bold">Montant</th>
              <th class="px-6 py-4 font-bold">Date</th>
              <th class="px-6 py-4 font-bold">Statut</th>
              <th class="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-container-low text-sm">
            <tr v-for="payment in recentPayments" :key="payment.id" class="hover:bg-surface-container-low/50 transition-colors">
              <td class="px-6 py-4 font-semibold">{{ payment.client }}</td>
              <td class="px-6 py-4 text-outline font-mono text-xs">{{ payment.reference }}</td>
              <td class="px-6 py-4 font-bold text-[#1A56A0]">{{ payment.amount }}</td>
              <td class="px-6 py-4 text-outline">{{ payment.date }}</td>
              <td class="px-6 py-4">
                <span :class="['inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold', payment.statusClass]">
                  <span class="w-1 h-1 rounded-full" :style="{ backgroundColor: payment.statusColor }"></span>
                  {{ payment.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button class="text-[#1A56A0] hover:text-[#0D3A6E] font-bold">Détails</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

// Static KPI Cards Data
const kpiCards = [
  {
    id: 1,
    label: 'Total utilisateurs',
    value: '12,482',
    trend: '+12%',
    trendIcon: 'trending_up',
    trendClass: 'text-green-600'
  },
  {
    id: 2,
    label: 'Annonces publiées',
    value: '4,105',
    trend: '+5.2%',
    trendIcon: 'trending_up',
    trendClass: 'text-green-600'
  },
  {
    id: 3,
    label: 'En attente',
    value: '184',
    trend: 'Urgent',
    trendIcon: 'priority_high',
    trendClass: 'text-orange-500'
  },
  {
    id: 4,
    label: 'Locations en cours',
    value: '2,940',
    trend: '+8%',
    trendIcon: 'trending_up',
    trendClass: 'text-green-600'
  },
  {
    id: 5,
    label: 'Revenus (mois)',
    value: '€84.5k',
    trend: '+14%',
    trendIcon: 'trending_up',
    trendClass: 'text-green-600'
  },
  {
    id: 6,
    label: 'Taux d\'occupation',
    value: '94.2%',
    trend: 'Cible 95%',
    trendIcon: 'check_circle',
    trendClass: 'text-[#1A56A0]'
  }
]

// Pending Announcements
const pendingAnnouncements = [
  {
    id: 1,
    title: 'Villa Vue Mer',
    location: 'Antibes, FR',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcBXJmQ4n8bZJZWSaaJ1GigsCtL2Y7G-33Fk8djJR-le61VIFGjkRSNkSVfFXa0Nx9n9jXHYCKyhQ8ZqSyV2h5oQO8oURG2kp9-dNsDmg1tLBqVA4NFOJhzB6Va1DvOncewwhk-AYnyUJ-XcCrQ_yLV0_HXislVBOehgnZn3cwU7K_OdAAjIUgNBavtuGIZyvtte24FmHeWjN2rtyp5k8P2694R9tYaUtKtJo0YEoyiJJ393Fh1bg3B1rHsaJltwR3mnp3CaAagTg'
  },
  {
    id: 2,
    title: 'Loft Industriel',
    location: 'Lyon, FR',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCouo5D75H8pE6bLBg8QxARHjnJhZZbanJL2cztEuuEjKGYC4bnpFv2XCVHwIik92J33WQQiP4DGdSeXlTbXyTjLW2Bkv_P2lczbUL-91TBpF_yA9mulDEEB_Kutvl5J1dSJNYDJeZ07DeHaX8ZFhPuCAPQDeBZMo1bhRe7eryIaSKN1oEIquU36QqjQpOGcoaplcrTS4Mzpay7J_B3ouOKAD8S7HLO0wAot1N1ag_iU3UcHGqs4RJRjc6BYv8VHIrh9yXLIjaYukA'
  }
]

// Distribution Data
const distributionData = [
  { id: 1, label: 'Ventes', percentage: '60%', color: '#1A56A0' },
  { id: 2, label: 'Locations', percentage: '25%', color: '#2E75B6' },
  { id: 3, label: 'Colocations', percentage: '15%', color: '#EBF4FB' }
]

// Agent Performance
const agentPerformance = [
  {
    id: 1,
    name: 'Jean Simon',
    initials: 'JS',
    sales: 14,
    satisfaction: '4.9',
    satisfactionClass: 'text-green-600 font-bold',
    status: 'Top Performant',
    statusClass: 'bg-green-100 text-green-700'
  },
  {
    id: 2,
    name: 'Aline Meyer',
    initials: 'AM',
    sales: 8,
    satisfaction: '4.2',
    satisfactionClass: 'text-orange-500 font-bold',
    status: 'En Progrès',
    statusClass: 'bg-orange-100 text-orange-700'
  },
  {
    id: 3,
    name: 'Robert K.',
    initials: 'RK',
    sales: 3,
    satisfaction: '3.1',
    satisfactionClass: 'text-red-600 font-bold',
    status: 'Attention',
    statusClass: 'bg-red-100 text-red-700'
  }
]

// AI Alerts
const aiAlerts = [
  {
    id: 1,
    icon: 'warning',
    iconClass: 'text-orange-500',
    title: 'Prix hors-marché détecté',
    description: 'L\'annonce #8291 (Studio Paris) est 40% au dessus du prix secteur. Vérification requise.',
    opacityClass: ''
  },
  {
    id: 2,
    icon: 'security',
    iconClass: 'text-red-600',
    title: 'Suspicion de doublon',
    description: 'Images identiques trouvées sur 3 comptes différents. Risque de fraude élevé.',
    opacityClass: ''
  },
  {
    id: 3,
    icon: 'info',
    iconClass: 'text-[#1A56A0]',
    title: 'Optimisation titre',
    description: 'Suggérez "Appartement de luxe" au lieu de "Beau studio" pour booster les clics.',
    opacityClass: 'opacity-60'
  }
]

// Recent Activity
const recentActivity = [
  {
    id: 1,
    icon: 'person_add',
    bgClass: 'bg-[#1A56A0]',
    title: 'Nouvel agent certifié',
    description: 'Sophie Vallet a rejoint l\'équipe de Lyon.',
    time: 'Il y a 10 minutes'
  },
  {
    id: 2,
    icon: 'task_alt',
    bgClass: 'bg-[#2E75B6]',
    title: 'Paiement commission validé',
    description: 'Commission de €1,200 payée à Marc D.',
    time: 'Il y a 1 heure'
  },
  {
    id: 3,
    icon: 'report_problem',
    bgClass: 'bg-[#0D3A6E]',
    title: 'Signalement utilisateur',
    description: 'Annonce frauduleuse signalée par 2 clients.',
    time: 'Il y a 4 heures'
  }
]

// Recent Payments
const recentPayments = [
  {
    id: 1,
    client: 'Julien Descamps',
    reference: '#INV-2023-001',
    amount: '€1,450.00',
    date: '12/10/2023',
    status: 'Payé',
    statusClass: 'bg-green-100 text-green-700',
    statusColor: '#16a34a'
  },
  {
    id: 2,
    client: 'Sarah Martinez',
    reference: '#INV-2023-002',
    amount: '€2,100.00',
    date: '11/10/2023',
    status: 'En attente',
    statusClass: 'bg-orange-100 text-orange-700',
    statusColor: '#ea580c'
  },
  {
    id: 3,
    client: 'Robert Wilson',
    reference: '#INV-2023-003',
    amount: '€850.00',
    date: '10/10/2023',
    status: 'Échoué',
    statusClass: 'bg-red-100 text-red-700',
    statusColor: '#dc2626'
  }
]
</script>
