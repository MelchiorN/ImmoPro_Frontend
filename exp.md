NuxtJs + Talwindcss
<!DOCTYPE html>

<html class="light" lang="fr"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>ImmoPro - Gestion des annonces</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "on-surface": "#191c1e",
                    "surface-bright": "#f7f9fb",
                    "on-error-container": "#93000a",
                    "inverse-primary": "#a9c7ff",
                    "tertiary-fixed-dim": "#69dbaa",
                    "surface-dim": "#d8dadc",
                    "on-primary-fixed-variant": "#00468c",
                    "tertiary": "#004931",
                    "surface-variant": "#e0e3e5",
                    "on-secondary-container": "#5d666c",
                    "primary": "#003e7e",
                    "on-secondary-fixed": "#141d22",
                    "outline": "#737782",
                    "on-background": "#191c1e",
                    "on-tertiary-fixed": "#002114",
                    "on-tertiary-container": "#6fe1af",
                    "on-secondary-fixed-variant": "#3f484e",
                    "secondary": "#576065",
                    "outline-variant": "#c2c6d3",
                    "surface": "#f7f9fb",
                    "secondary-container": "#dbe4eb",
                    "tertiary-container": "#006344",
                    "primary-fixed-dim": "#a9c7ff",
                    "error": "#ba1a1a",
                    "primary-container": "#1a56a0",
                    "surface-container-high": "#e6e8ea",
                    "background": "#f7f9fb",
                    "surface-tint": "#265ea8",
                    "on-primary": "#ffffff",
                    "surface-container-low": "#f2f4f6",
                    "on-error": "#ffffff",
                    "tertiary-fixed": "#86f8c5",
                    "on-tertiary": "#ffffff",
                    "on-surface-variant": "#424751",
                    "on-secondary": "#ffffff",
                    "surface-container-lowest": "#ffffff",
                    "inverse-on-surface": "#eff1f3",
                    "error-container": "#ffdad6",
                    "inverse-surface": "#2d3133",
                    "on-tertiary-fixed-variant": "#005138",
                    "surface-container": "#eceef0",
                    "secondary-fixed-dim": "#bfc8ce",
                    "surface-container-highest": "#e0e3e5",
                    "primary-fixed": "#d6e3ff",
                    "on-primary-container": "#b3cdff",
                    "on-primary-fixed": "#001b3d",
                    "secondary-fixed": "#dbe4eb"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "spacing": {
                    "xs": "4px",
                    "container-max": "1280px",
                    "md": "16px",
                    "lg": "24px",
                    "xl": "32px",
                    "sm": "8px",
                    "gutter": "16px",
                    "base": "4px"
            },
            "fontFamily": {
                    "display-lg": ["Inter"],
                    "headline-md": ["Inter"],
                    "body-md": ["Inter"],
                    "label-sm": ["Inter"],
                    "label-md": ["Inter"],
                    "title-lg": ["Inter"],
                    "body-lg": ["Inter"]
            },
            "fontSize": {
                    "display-lg": ["36px", {"lineHeight": "44px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                    "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
                    "body-md": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                    "label-sm": ["11px", {"lineHeight": "14px", "fontWeight": "500"}],
                    "label-md": ["12px", {"lineHeight": "16px", "letterSpacing": "0.01em", "fontWeight": "600"}],
                    "title-lg": ["20px", {"lineHeight": "28px", "fontWeight": "600"}],
                    "body-lg": ["16px", {"lineHeight": "24px", "fontWeight": "400"}]
            }
          },
        },
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        body { font-family: 'Inter', sans-serif; background-color: #f7f9fb; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #c2c6d3; border-radius: 10px; }
        .selection-active { display: flex !important; }
    </style>
</head>
<body class="bg-background text-on-background overflow-x-hidden">
<!-- SIDE NAV BAR -->
<aside class="h-screen w-64 fixed left-0 top-0 bg-primary border-r border-outline-variant shadow-md flex flex-col p-lg z-50">
<div class="mb-xl">
<h1 class="font-headline-md text-headline-md text-on-primary font-bold">ImmoPro</h1>
<p class="text-on-primary/60 text-label-md">Admin Portal</p>
</div>
<nav class="flex-1 space-y-sm">
<a class="flex items-center gap-md px-lg py-md text-on-primary/80 hover:text-on-primary hover:bg-primary-container/20 transition-colors rounded-lg" href="#">
<span class="material-symbols-outlined">dashboard</span>
<span class="font-body-md text-body-md">Dashboard</span>
</a>
<a class="flex items-center gap-md px-lg py-md bg-on-primary-fixed-variant text-on-primary-container rounded-lg" href="#">
<span class="material-symbols-outlined">domain</span>
<span class="font-body-md text-body-md">Gestion des biens</span>
</a>
<a class="flex items-center gap-md px-lg py-md text-on-primary/80 hover:text-on-primary hover:bg-primary-container/20 transition-colors rounded-lg" href="#">
<span class="material-symbols-outlined">calendar_today</span>
<span class="font-body-md text-body-md">Calendrier</span>
</a>
<a class="flex items-center gap-md px-lg py-md text-on-primary/80 hover:text-on-primary hover:bg-primary-container/20 transition-colors rounded-lg" href="#">
<span class="material-symbols-outlined">analytics</span>
<span class="font-body-md text-body-md">Rapports</span>
</a>
<a class="flex items-center gap-md px-lg py-md text-on-primary/80 hover:text-on-primary hover:bg-primary-container/20 transition-colors rounded-lg" href="#">
<span class="material-symbols-outlined">mail</span>
<span class="font-body-md text-body-md">Messagerie</span>
</a>
<a class="flex items-center gap-md px-lg py-md text-on-primary/80 hover:text-on-primary hover:bg-primary-container/20 transition-colors rounded-lg" href="#">
<span class="material-symbols-outlined">person</span>
<span class="font-body-md text-body-md">Profil</span>
</a>
</nav>
<div class="mt-auto pt-lg border-t border-on-primary/10 flex items-center gap-md">
<div class="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden">
<img class="w-full h-full object-cover" data-alt="A professional portrait of a senior real estate administrator in a modern office environment, wearing a stylish navy blue blazer. The lighting is soft and corporate, matching a clean blue and white UI palette." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKgWVcxSyMW4IKnmYFop453FtpNoJpRulggN2_uxidNskNYTPZ4aY5dKD_YK86b9J6dlDQZEQxtTx_Su7SVDMallsUVxxk76viZZmse6KycViuJcD4L9PZnzYjj7Bh2PiYEOo_NCA4eZV-9jiXcK6_gGS467fRj7rMQZSaVUFi1n_xjnWLqtkGuLSpjtdNcB4giZ-lwz3iiXxKO7gtdQ3S9GL5EqseWRfg5m30_YPkc2MDjTclSsKzzdXHUDZ0gGfFfIB7SjG5UsE"/>
</div>
<div>
<p class="font-label-md text-on-primary">Admin User</p>
<p class="text-[10px] text-on-primary/60">Super Admin</p>
</div>
</div>
</aside>
<!-- TOP NAV BAR -->
<header class="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 bg-surface border-b border-outline-variant shadow-sm flex justify-between items-center px-lg ml-64 z-40">
<div class="flex items-center gap-lg">
<div class="relative w-96">
<span class="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline">search</span>
<input class="w-full bg-surface-container-low border-none rounded-full pl-xl pr-md py-sm text-body-md focus:ring-2 focus:ring-primary" placeholder="Rechercher une annonce, un ID..." type="text"/>
</div>
</div>
<div class="flex items-center gap-md">
<button class="p-sm text-primary hover:bg-surface-container-low rounded-full transition-all">
<span class="material-symbols-outlined">notifications</span>
</button>
<button class="p-sm text-primary hover:bg-surface-container-low rounded-full transition-all">
<span class="material-symbols-outlined">settings</span>
</button>
<button class="flex items-center gap-sm bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md hover:opacity-90 transition-all">
<span class="material-symbols-outlined text-[18px]">download</span>
                Export CSV
            </button>
</div>
</header>
<!-- MAIN CONTENT -->
<main class="ml-64 pt-20 p-lg min-h-screen">
<!-- Header & Counter Cards -->
<div class="mb-xl">
<h2 class="font-display-lg text-display-lg text-primary mb-lg">Toutes les annonces</h2>
<div class="grid grid-cols-5 gap-md">
<!-- Publiées -->
<div class="bg-surface-container-lowest p-md rounded-xl shadow-[0_4px_12px_rgba(26,86,160,0.05)] border border-outline-variant/30 flex items-center gap-md">
<div class="w-12 h-12 rounded-lg bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed-variant">
<span class="material-symbols-outlined">check_circle</span>
</div>
<div>
<p class="text-label-md text-secondary">Publiées</p>
<p class="text-headline-md font-bold text-on-surface">1,284</p>
</div>
</div>
<!-- En attente -->
<div class="bg-surface-container-lowest p-md rounded-xl shadow-[0_4px_12px_rgba(26,86,160,0.05)] border border-outline-variant/30 flex items-center gap-md">
<div class="w-12 h-12 rounded-lg bg-primary-fixed flex items-center justify-center text-on-primary-fixed-variant">
<span class="material-symbols-outlined">schedule</span>
</div>
<div>
<p class="text-label-md text-secondary">En attente</p>
<p class="text-headline-md font-bold text-on-surface">43</p>
</div>
</div>
<!-- Validées -->
<div class="bg-surface-container-lowest p-md rounded-xl shadow-[0_4px_12px_rgba(26,86,160,0.05)] border border-outline-variant/30 flex items-center gap-md">
<div class="w-12 h-12 rounded-lg bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed-variant">
<span class="material-symbols-outlined">verified</span>
</div>
<div>
<p class="text-label-md text-secondary">Validées</p>
<p class="text-headline-md font-bold text-on-surface">156</p>
</div>
</div>
<!-- Rejetées -->
<div class="bg-surface-container-lowest p-md rounded-xl shadow-[0_4px_12px_rgba(26,86,160,0.05)] border border-outline-variant/30 flex items-center gap-md">
<div class="w-12 h-12 rounded-lg bg-error-container flex items-center justify-center text-on-error-container">
<span class="material-symbols-outlined">cancel</span>
</div>
<div>
<p class="text-label-md text-secondary">Rejetées</p>
<p class="text-headline-md font-bold text-on-surface">12</p>
</div>
</div>
<!-- Louées/Vendues -->
<div class="bg-surface-container-lowest p-md rounded-xl shadow-[0_4px_12px_rgba(26,86,160,0.05)] border border-outline-variant/30 flex items-center gap-md">
<div class="w-12 h-12 rounded-lg bg-surface-variant flex items-center justify-center text-on-surface-variant">
<span class="material-symbols-outlined">sell</span>
</div>
<div>
<p class="text-label-md text-secondary">Louées/Vendues</p>
<p class="text-headline-md font-bold text-on-surface">892</p>
</div>
</div>
</div>
</div>
<!-- Filter Bar -->
<section class="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30 mb-lg">
<div class="grid grid-cols-12 gap-md items-end">
<div class="col-span-3">
<label class="text-label-md text-secondary mb-xs block">Recherche</label>
<div class="relative">
<input class="w-full bg-surface border-outline-variant rounded-lg text-body-md py-sm pl-md focus:ring-primary" placeholder="ID, Titre, Propriétaire..." type="text"/>
</div>
</div>
<div class="col-span-2">
<label class="text-label-md text-secondary mb-xs block">Statut</label>
<select class="w-full bg-surface border-outline-variant rounded-lg text-body-md py-sm focus:ring-primary">
<option>Tous les statuts</option>
<option>Publiées</option>
<option>En attente</option>
<option>Rejetées</option>
</select>
</div>
<div class="col-span-2">
<label class="text-label-md text-secondary mb-xs block">Type de bien</label>
<select class="w-full bg-surface border-outline-variant rounded-lg text-body-md py-sm focus:ring-primary">
<option>Tous les types</option>
<option>Appartement</option>
<option>Villa</option>
<option>Bureau</option>
</select>
</div>
<div class="col-span-1">
<label class="text-label-md text-secondary mb-xs block">Transaction</label>
<select class="w-full bg-surface border-outline-variant rounded-lg text-body-md py-sm focus:ring-primary">
<option>Tous</option>
<option>Vente</option>
<option>Location</option>
</select>
</div>
<div class="col-span-2">
<label class="text-label-md text-secondary mb-xs block">Localisation</label>
<input class="w-full bg-surface border-outline-variant rounded-lg text-body-md py-sm px-md focus:ring-primary" placeholder="Ville, Quartier..." type="text"/>
</div>
<div class="col-span-2 flex gap-sm">
<button class="flex-1 bg-surface border border-outline-variant text-primary py-sm rounded-lg font-label-md hover:bg-surface-container-low transition-all">
                        Réinitialiser
                    </button>
<button class="flex-1 bg-primary text-on-primary py-sm rounded-lg font-label-md hover:opacity-90 transition-all">
                        Filtrer
                    </button>
</div>
</div>
</section>
<!-- Bulk Actions Bar (Hidden by default) -->
<div class="hidden fixed bottom-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-xl py-md rounded-full shadow-xl flex items-center gap-xl z-[60] animate-bounce" id="bulkActions">
<p class="font-label-md"><span id="selectedCount">0</span> annonces sélectionnées</p>
<div class="h-6 w-[1px] bg-outline-variant/30"></div>
<div class="flex items-center gap-md">
<button class="flex items-center gap-sm hover:text-primary-fixed-dim transition-colors font-label-md">
<span class="material-symbols-outlined text-[20px]">block</span> Désactiver
                </button>
<button class="flex items-center gap-sm hover:text-primary-fixed-dim transition-colors font-label-md">
<span class="material-symbols-outlined text-[20px]">person_add</span> Réassigner
                </button>
<button class="flex items-center gap-sm text-error-container hover:text-red-400 transition-colors font-label-md">
<span class="material-symbols-outlined text-[20px]">delete</span> Supprimer
                </button>
</div>
<button class="p-xs hover:bg-on-surface-variant/20 rounded-full" onclick="clearSelection()">
<span class="material-symbols-outlined">close</span>
</button>
</div>
<!-- Property Table -->
<div class="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden mb-xl">
<table class="w-full text-left border-collapse">
<thead>
<tr class="bg-surface-container-low border-b border-outline-variant/50">
<th class="p-lg w-10">
<input class="rounded border-outline text-primary focus:ring-primary" id="selectAll" type="checkbox"/>
</th>
<th class="p-lg font-label-md text-secondary uppercase tracking-wider">Photo / ID</th>
<th class="p-lg font-label-md text-secondary uppercase tracking-wider">Annonce</th>
<th class="p-lg font-label-md text-secondary uppercase tracking-wider">Propriétaire</th>
<th class="p-lg font-label-md text-secondary uppercase tracking-wider">Type / Transac.</th>
<th class="p-lg font-label-md text-secondary uppercase tracking-wider">Statut</th>
<th class="p-lg font-label-md text-secondary uppercase tracking-wider">Agent</th>
<th class="p-lg font-label-md text-secondary uppercase tracking-wider text-right">Actions</th>
</tr>
</thead>
<tbody class="divide-y divide-outline-variant/30">
<!-- Row 1 -->
<tr class="hover:bg-surface-container-low/50 transition-colors">
<td class="px-lg py-md">
<input class="row-checkbox rounded border-outline text-primary focus:ring-primary" type="checkbox"/>
</td>
<td class="px-lg py-md">
<div class="flex items-center gap-md">
<div class="w-14 h-14 rounded-lg overflow-hidden bg-surface-container">
<img class="w-full h-full object-cover" data-alt="A luxurious modern high-rise apartment building exterior at twilight. The architecture features sleek glass balconies and warm interior lighting. Professional architectural photography style with a soft blue sky and sharp contrast." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3sAajSBGxP6Q2LnivQ4M07Dr1G93ixIU3IdM2r-ylanctOWW9W6Hb0ock84aqKPJVfi2cCwZ3z2hCTUZwoo9V_OO6qY5x66dJuXprd33mVAK5K6-_F19f8xehqcpWEin3Z5mpUnsHOfgId7mckw-rRpl4SoxnKkE4okBqWG9_La-_30wY7mfBOtzCh2INawSydrCDEBtR0iaPY65u3Oav-dA26buQRF2oXgwVGH7e-D8B1zI69zEehCDSEjmJFtHy5bEw6UOm2yQ"/>
</div>
<span class="text-label-md font-bold text-outline">#AP-982</span>
</div>
</td>
<td class="px-lg py-md">
<p class="font-body-md font-semibold text-on-surface">Appartement Vue Mer - Marina</p>
<p class="text-label-sm text-secondary">Publié le 12 Oct 2023</p>
</td>
<td class="px-lg py-md text-body-md text-secondary">Jean Dupont</td>
<td class="px-lg py-md">
<span class="block text-body-md text-on-surface">Appartement</span>
<span class="text-label-sm text-primary font-bold">Vente</span>
</td>
<td class="px-lg py-md">
<span class="px-sm py-[2px] rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-[11px] font-bold">PUBLIÉE</span>
</td>
<td class="px-lg py-md">
<div class="flex items-center gap-sm">
<div class="w-8 h-8 rounded-full bg-primary-fixed overflow-hidden">
<img class="w-full h-full object-cover" data-alt="A profile headshot of a friendly real estate agent, a woman with a professional smile, in a bright office. The lighting is optimistic and warm, reflecting a high-end corporate identity." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfD0INV6rxXcHQSHsIl45JFrfkLpu0hT1vnH0uXFo5YM6pN_z7qPkQVFofi39xug2J_nmaF16_JeQssFRRpzHL8RqHOidRr6mlKBOsTWsXcGGT-ueU2YM_W_LFmQN-fq4Axa81in0wRyGVjbjDLbzKW5g5cDKcQYjOQtrh89WY4Vio1G4vpKf0GmwhkcRTZoBMTE7kwCxDJvjJTsqRc-RHianzauTjZXB_V82w1lYGHuMXxvnFG0S_vpbqqEIG-84VXVvlBmv2cxc"/>
</div>
<span class="text-body-md">Sarah M.</span>
</div>
</td>
<td class="px-lg py-md text-right">
<div class="flex justify-end gap-sm">
<button class="p-xs text-primary hover:bg-primary/10 rounded-full transition-all" title="Voir">
<span class="material-symbols-outlined text-[20px]">visibility</span>
</button>
<button class="p-xs text-secondary hover:bg-secondary/10 rounded-full transition-all" title="Désactiver">
<span class="material-symbols-outlined text-[20px]">do_not_disturb_on</span>
</button>
<button class="p-xs text-error hover:bg-error/10 rounded-full transition-all" title="Supprimer">
<span class="material-symbols-outlined text-[20px]">delete</span>
</button>
</div>
</td>
</tr>
<!-- Row 2 -->
<tr class="hover:bg-surface-container-low/50 transition-colors">
<td class="px-lg py-md">
<input class="row-checkbox rounded border-outline text-primary focus:ring-primary" type="checkbox"/>
</td>
<td class="px-lg py-md">
<div class="flex items-center gap-md">
<div class="w-14 h-14 rounded-lg overflow-hidden bg-surface-container">
<img class="w-full h-full object-cover" data-alt="A wide-angle shot of a minimalist, luxury suburban villa with a swimming pool and manicured lawn. Sunny afternoon lighting with vibrant greens and clean white stone textures, professional real estate photography." src="https://lh3.googleusercontent.com/aida-public/AB6AXuATR-JBGCVcSSH12WYfHpgfzG-08w9blU631Bu5DYG3JSV3Gj9N3Mt3NYlqNdECfAhO2CuS_1S2eS9gV_Rd9ZEIl3hjNZdjpCB91IzYRS1HfO2hbXgd1CQ3ce1lTpqfKlLqoM0ayl7OunQRwWAkGZeT6pnHwEI-bJfK2dY8ZaeE97AJVLNDMJWTcrFNu8H0uCz2xPQa3Mk6YZ_66a52RnfknrJFcKOnLqD4U-PQVK60VuF_Rq586le4Q1XpkbEyA3IhO74LkOIPlIg"/>
</div>
<span class="text-label-md font-bold text-outline">#VI-441</span>
</div>
</td>
<td class="px-lg py-md">
<p class="font-body-md font-semibold text-on-surface">Villa Contemporaine - Gammarth</p>
<p class="text-label-sm text-secondary">Publié le 10 Oct 2023</p>
</td>
<td class="px-lg py-md text-body-md text-secondary">Immo Invest S.A.</td>
<td class="px-lg py-md">
<span class="block text-body-md text-on-surface">Villa</span>
<span class="text-label-sm text-secondary font-bold">Location</span>
</td>
<td class="px-lg py-md">
<span class="px-sm py-[2px] rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-bold">EN ATTENTE</span>
</td>
<td class="px-lg py-md">
<div class="flex items-center gap-sm">
<div class="w-8 h-8 rounded-full bg-primary-fixed overflow-hidden">
<img class="w-full h-full object-cover" data-alt="A professional headshot of a confident male real estate agent in a tailored suit. Bright, airy background with soft professional lighting, consistent with a modern blue-themed interface." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkJrzjPEecKVMG3YsqAITrORf8QiEnsPvYoZqMY15YO8to_yjo6aj_AB1BCqhplQD_czXPGnCYd9anZUCEqZBW7gYTayvmjThaUcFyUVgSKMz7zcRrIE4Q0jbSbj9vsHzvOfIARQ2RLXMUbzZcUjyyXr85SA37Nnyn_oaio5aTX9dk2A0bP5D5IRySA6Mx-jd7FGgP8_W8iTwnfUblHs6RK8Xt0ZTem6UAOFh9G_jX2DqUiSYYuab7GYn_E5YoNvawOIcNFgp4FvM"/>
</div>
<span class="text-body-md">Marc L.</span>
</div>
</td>
<td class="px-lg py-md text-right">
<div class="flex justify-end gap-sm">
<button class="p-xs text-primary hover:bg-primary/10 rounded-full transition-all">
<span class="material-symbols-outlined text-[20px]">visibility</span>
</button>
<button class="p-xs text-secondary hover:bg-secondary/10 rounded-full transition-all">
<span class="material-symbols-outlined text-[20px]">do_not_disturb_on</span>
</button>
<button class="p-xs text-error hover:bg-error/10 rounded-full transition-all">
<span class="material-symbols-outlined text-[20px]">delete</span>
</button>
</div>
</td>
</tr>
<!-- Row 3 -->
<tr class="hover:bg-surface-container-low/50 transition-colors">
<td class="px-lg py-md">
<input class="row-checkbox rounded border-outline text-primary focus:ring-primary" type="checkbox"/>
</td>
<td class="px-lg py-md">
<div class="flex items-center gap-md">
<div class="w-14 h-14 rounded-lg overflow-hidden bg-surface-container">
<img class="w-full h-full object-cover" data-alt="An interior shot of a spacious, modern open-plan office space in a corporate district. Large windows showing a city skyline, high-end furniture, and bright natural light. The atmosphere is professional and sleek." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8HibiKIotKjVqYpKVwWF55YelznTNCCcPYYIylFh2Yjm7dv2D75RuF6fEDerTNBkH8j894h4RaVhIltuqiOcGj8GzHLh1P9rjYpMidx60OOEeL4xvOPzGYbdxT1WKDAwUAsWvxooLwwWfsdqiRro0HjObKxN5HbRyDXKYQi9oNlx_b8QrXZRKo5ycwvuVOd6Hy9DlSQ7NlqNCXttcvD741-8KDTtvPnwzjbNp15lMkRdoReKh_6-W6EFZhQM90hm3B_AfcwDht-g"/>
</div>
<span class="text-label-md font-bold text-outline">#BU-102</span>
</div>
</td>
<td class="px-lg py-md">
<p class="font-body-md font-semibold text-on-surface">Plateau Bureaux Centre Ville</p>
<p class="text-label-sm text-secondary">Publié le 08 Oct 2023</p>
</td>
<td class="px-lg py-md text-body-md text-secondary">Ahmed K.</td>
<td class="px-lg py-md">
<span class="block text-body-md text-on-surface">Bureau</span>
<span class="text-label-sm text-primary font-bold">Vente</span>
</td>
<td class="px-lg py-md">
<span class="px-sm py-[2px] rounded-full bg-error-container text-on-error-container text-[11px] font-bold">REJETÉE</span>
</td>
<td class="px-lg py-md">
<div class="flex items-center gap-sm">
<div class="w-8 h-8 rounded-full bg-primary-fixed overflow-hidden">
<img class="w-full h-full object-cover" data-alt="A portrait of a young female professional real estate broker, dressed elegantly in white, with a clear, soft-lit background that reflects a clean, light-mode website aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpXd5x41DuLZQTurhQbe9sEFYIb-UmOCx0LpQY6bPGVJwi5F9aCiNlmW4RRQktxoNDA9d0m1HqpPeSeU42RGJEXYHxt2XmnKhHKPRS-S4b6nmzmForKXUN19-zqx76B3cVBODoeOyfTB8iwYVQNIwZur8e9ztbRlb_FtTKbU5auzhxXudrlWmO9YiR8OAli7k1ReFN7E6oQu5A2ziB73mtD3uF8-6NuTImhH64WVW-uPJxdbt8drzoHAZ8Sbpou0GgyszQNoBng9c"/>
</div>
<span class="text-body-md">Sofia R.</span>
</div>
</td>
<td class="px-lg py-md text-right">
<div class="flex justify-end gap-sm">
<button class="p-xs text-primary hover:bg-primary/10 rounded-full transition-all">
<span class="material-symbols-outlined text-[20px]">visibility</span>
</button>
<button class="p-xs text-secondary hover:bg-secondary/10 rounded-full transition-all">
<span class="material-symbols-outlined text-[20px]">do_not_disturb_on</span>
</button>
<button class="p-xs text-error hover:bg-error/10 rounded-full transition-all">
<span class="material-symbols-outlined text-[20px]">delete</span>
</button>
</div>
</td>
</tr>
<!-- Row 4 -->
<tr class="hover:bg-surface-container-low/50 transition-colors">
<td class="px-lg py-md">
<input class="row-checkbox rounded border-outline text-primary focus:ring-primary" type="checkbox"/>
</td>
<td class="px-lg py-md">
<div class="flex items-center gap-md">
<div class="w-14 h-14 rounded-lg overflow-hidden bg-surface-container">
<img class="w-full h-full object-cover" data-alt="A stylish duplex apartment interior with a double-height ceiling and a spiral staircase. The decor is modern-industrial with a warm color palette. Cinematic indoor lighting, professional photography." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBb5Ol2OQahU7y5qQONajbjHyfrXvckMTsU4nagEa6ixmUQWHcQJEcy6MfBVYBo2_Dd2vfLsD8j3wYHUVT6l65AimqpDJLykSUupX0tdBmzVF5DPcx4uaz4TaCk1svQlslmZyfZxhQ1-LFsA-UwiKRvhQybGiCFj1l77sUNwbUYf5bHM6QBFSbQtdX8cdM6vMoCo3ahqWaap3jQNbWO5NQ-Zs8lQMOvgLm-KdhAiDbMOxbLk5qH9XsdCkMJQCde3WJuL-NvfLh5leE"/>
</div>
<span class="text-label-md font-bold text-outline">#AP-772</span>
</div>
</td>
<td class="px-lg py-md">
<p class="font-body-md font-semibold text-on-surface">Duplex Design - Les Berges du Lac</p>
<p class="text-label-sm text-secondary">Publié le 05 Oct 2023</p>
</td>
<td class="px-lg py-md text-body-md text-secondary">Sami Benali</td>
<td class="px-lg py-md">
<span class="block text-body-md text-on-surface">Appartement</span>
<span class="text-label-sm text-secondary font-bold">Location</span>
</td>
<td class="px-lg py-md">
<span class="px-sm py-[2px] rounded-full bg-surface-variant text-on-surface-variant text-[11px] font-bold uppercase">Loué/Vendu</span>
</td>
<td class="px-lg py-md">
<div class="flex items-center gap-sm">
<div class="w-8 h-8 rounded-full bg-primary-fixed overflow-hidden">
<img class="w-full h-full object-cover" data-alt="A close-up portrait of a mature male property manager with a professional and trustworthy appearance. High-key lighting, blurred office background, matching the premium real estate theme." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsrNVefRsXuY3dWELRhIHSBQUcrB2Vf5Dxz3JuxzIQ9iPkGiDwFjfl-XMCYIenO0RBCKwv3Q0xaMP3YDZEeMleQh00If-t1gIwUJE4YSvNVFE86Zvm6FuBHOl_U4Is2AhUykQy7g5XphuUC2VOEYZjfD1n3WHZpJFW4a4eMb6eCfH4jLv4qJjXFgKwe_bxtRBV0JYG2EjQwTxtRvzq--o8Y0HKUFRewkWwXwlvz60tBEfoWIUxrySQTo-4jKaIbCQdzXHttarfkHg"/>
</div>
<span class="text-body-md">Robert T.</span>
</div>
</td>
<td class="px-lg py-md text-right">
<div class="flex justify-end gap-sm">
<button class="p-xs text-primary hover:bg-primary/10 rounded-full transition-all">
<span class="material-symbols-outlined text-[20px]">visibility</span>
</button>
<button class="p-xs text-secondary hover:bg-secondary/10 rounded-full transition-all">
<span class="material-symbols-outlined text-[20px]">do_not_disturb_on</span>
</button>
<button class="p-xs text-error hover:bg-error/10 rounded-full transition-all">
<span class="material-symbols-outlined text-[20px]">delete</span>
</button>
</div>
</td>
</tr>
</tbody>
</table>
<!-- Pagination -->
<div class="bg-surface-container-low px-lg py-md flex items-center justify-between border-t border-outline-variant/30">
<p class="text-label-md text-secondary">Affichage de 1 à 10 sur 1,284 annonces</p>
<div class="flex items-center gap-xs">
<button class="w-8 h-8 rounded bg-surface border border-outline-variant flex items-center justify-center text-outline hover:text-primary hover:border-primary transition-all">
<span class="material-symbols-outlined">chevron_left</span>
</button>
<button class="w-8 h-8 rounded bg-primary text-on-primary font-label-md">1</button>
<button class="w-8 h-8 rounded bg-surface border border-outline-variant text-secondary font-label-md hover:bg-surface-container-high">2</button>
<button class="w-8 h-8 rounded bg-surface border border-outline-variant text-secondary font-label-md hover:bg-surface-container-high">3</button>
<span class="px-xs text-secondary">...</span>
<button class="w-8 h-8 rounded bg-surface border border-outline-variant text-secondary font-label-md hover:bg-surface-container-high">129</button>
<button class="w-8 h-8 rounded bg-surface border border-outline-variant flex items-center justify-center text-outline hover:text-primary hover:border-primary transition-all">
<span class="material-symbols-outlined">chevron_right</span>
</button>
</div>
</div>
</div>
</main>
<script>
        const selectAll = document.getElementById('selectAll');
        const checkboxes = document.querySelectorAll('.row-checkbox');
        const bulkActions = document.getElementById('bulkActions');
        const selectedCountEl = document.getElementById('selectedCount');

        function updateBulkActions() {
            const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
            if (checkedCount > 0) {
                bulkActions.classList.add('selection-active');
                selectedCountEl.textContent = checkedCount;
            } else {
                bulkActions.classList.remove('selection-active');
            }
        }

        selectAll.addEventListener('change', () => {
            checkboxes.forEach(cb => {
                cb.checked = selectAll.checked;
            });
            updateBulkActions();
        });

        checkboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                if (!cb.checked) selectAll.checked = false;
                if (Array.from(checkboxes).every(cb => cb.checked)) selectAll.checked = true;
                updateBulkActions();
            });
        });

        function clearSelection() {
            checkboxes.forEach(cb => cb.checked = false);
            selectAll.checked = false;
            updateBulkActions();
        }
    </script>
</body></html>