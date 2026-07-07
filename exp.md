NuxtJs+Tailwindcss

<!DOCTYPE html>

<html class="light" lang="fr"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>ImmoPro — Biens à vérifier</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-error-container": "#93000a",
                        "primary-container": "#1a56a0",
                        "on-primary-fixed-variant": "#00468c",
                        "inverse-primary": "#a9c7ff",
                        "surface": "#f7f9fb",
                        "on-tertiary-fixed": "#002114",
                        "on-surface": "#191c1e",
                        "secondary-container": "#dbe4eb",
                        "surface-container-lowest": "#ffffff",
                        "secondary-fixed-dim": "#bfc8ce",
                        "secondary": "#576065",
                        "surface-dim": "#d8dadc",
                        "on-tertiary-fixed-variant": "#005138",
                        "tertiary-fixed": "#86f8c5",
                        "error-container": "#ffdad6",
                        "background": "#f7f9fb",
                        "surface-bright": "#f7f9fb",
                        "primary-fixed": "#d6e3ff",
                        "primary": "#003e7e",
                        "on-primary": "#ffffff",
                        "on-primary-container": "#b3cdff",
                        "inverse-on-surface": "#eff1f3",
                        "inverse-surface": "#2d3133",
                        "on-secondary": "#ffffff",
                        "on-tertiary": "#ffffff",
                        "on-surface-variant": "#424751",
                        "tertiary-container": "#006344",
                        "outline": "#737782",
                        "on-background": "#191c1e",
                        "tertiary-fixed-dim": "#69dbaa",
                        "surface-container-highest": "#e0e3e5",
                        "surface-container-high": "#e6e8ea",
                        "surface-variant": "#e0e3e5",
                        "surface-container-low": "#f2f4f6",
                        "error": "#ba1a1a",
                        "secondary-fixed": "#dbe4eb",
                        "outline-variant": "#c2c6d3",
                        "on-error": "#ffffff",
                        "on-secondary-fixed": "#141d22",
                        "surface-tint": "#265ea8",
                        "on-tertiary-container": "#6fe1af",
                        "on-secondary-fixed-variant": "#3f484e",
                        "on-primary-fixed": "#001b3d",
                        "primary-fixed-dim": "#a9c7ff",
                        "tertiary": "#004931",
                        "surface-container": "#eceef0",
                        "on-secondary-container": "#5d666c"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "sm": "8px",
                        "lg": "24px",
                        "container-max": "1280px",
                        "gutter": "16px",
                        "xs": "4px",
                        "xl": "32px",
                        "md": "16px",
                        "base": "4px"
                    },
                    "fontFamily": {
                        "title-lg": ["Inter"],
                        "label-sm": ["Inter"],
                        "display-lg": ["Inter"],
                        "body-md": ["Inter"],
                        "label-md": ["Inter"],
                        "display-lg-mobile": ["Inter"],
                        "headline-md": ["Inter"],
                        "body-lg": ["Inter"]
                    },
                    "fontSize": {
                        "title-lg": ["20px", {"lineHeight": "28px", "fontWeight": "600"}],
                        "label-sm": ["11px", {"lineHeight": "14px", "fontWeight": "500"}],
                        "display-lg": ["36px", {"lineHeight": "44px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                        "body-md": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                        "label-md": ["12px", {"lineHeight": "16px", "letterSpacing": "0.01em", "fontWeight": "600"}],
                        "display-lg-mobile": ["28px", {"lineHeight": "34px", "fontWeight": "700"}],
                        "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
                        "body-lg": ["16px", {"lineHeight": "24px", "fontWeight": "400"}]
                    }
                },
            },
        }
    </script>
<style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f7f9fb;
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .elevation-1 {
            box-shadow: 0 4px 12px rgba(26, 86, 160, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #dbe4eb;
            border-radius: 10px;
        }
    </style>
</head>
<body class="bg-surface text-on-surface">
<!-- Side Navigation Bar (Shared Component) -->
<aside class="h-full w-64 fixed left-0 top-0 bg-primary dark:bg-primary-container shadow-md flex flex-col py-lg px-md z-50">
<div class="mb-xl px-sm">
<h1 class="font-title-lg text-title-lg font-bold text-on-primary">ImmoPro</h1>
<p class="text-on-primary/70 text-label-sm font-label-sm">Professional Agent</p>
</div>
<nav class="flex-1 space-y-sm">
<!-- Properties to Verify is ACTIVE -->
<a class="flex items-center gap-md px-md py-sm text-primary-fixed hover:bg-on-primary-fixed-variant/50 transition-colors rounded-lg group" href="#">
<span class="material-symbols-outlined">dashboard</span>
<span class="font-body-md text-body-md">Dashboard</span>
</a>
<a class="flex items-center gap-md px-md py-sm text-on-primary bg-on-primary-fixed-variant rounded-lg font-bold transition-colors group" href="#">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">verified_user</span>
<span class="font-body-md text-body-md">Properties to Verify</span>
</a>
<a class="flex items-center gap-md px-md py-sm text-primary-fixed hover:bg-on-primary-fixed-variant/50 transition-colors rounded-lg group" href="#">
<span class="material-symbols-outlined">calendar_today</span>
<span class="font-body-md text-body-md">Calendar</span>
</a>
<a class="flex items-center gap-md px-md py-sm text-primary-fixed hover:bg-on-primary-fixed-variant/50 transition-colors rounded-lg group" href="#">
<span class="material-symbols-outlined">assessment</span>
<span class="font-body-md text-body-md">Reports</span>
</a>
<a class="flex items-center gap-md px-md py-sm text-primary-fixed hover:bg-on-primary-fixed-variant/50 transition-colors rounded-lg group" href="#">
<span class="material-symbols-outlined">mail</span>
<span class="font-body-md text-body-md">Messaging</span>
</a>
<a class="flex items-center gap-md px-md py-sm text-primary-fixed hover:bg-on-primary-fixed-variant/50 transition-colors rounded-lg group" href="#">
<span class="material-symbols-outlined">person</span>
<span class="font-body-md text-body-md">Profile</span>
</a>
</nav>
<div class="mt-auto border-t border-on-primary/10 pt-lg px-sm">
<div class="flex items-center gap-md">
<div class="w-10 h-10 rounded-full bg-on-primary-fixed-variant flex items-center justify-center text-on-primary font-bold">JD</div>
<div>
<p class="text-on-primary font-semibold text-body-md">Jean Dupont</p>
<p class="text-on-primary/60 text-label-sm">Agent Senior</p>
</div>
</div>
</div>
</aside>
<!-- Top Navigation Bar (Shared Component) -->
<header class="flex justify-between items-center h-16 px-lg ml-64 bg-surface dark:bg-surface-dim border-b border-outline-variant dark:border-outline sticky top-0 z-40">
<h2 class="font-headline-md text-headline-md font-semibold text-primary">Tableau de bord — Agent</h2>
<div class="flex items-center gap-lg">
<div class="relative group hidden md:block">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
<input class="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full w-64 focus:ring-2 focus:ring-primary transition-all text-body-md" placeholder="Rechercher un bien..." type="text"/>
</div>
<div class="flex items-center gap-md text-on-surface-variant">
<button class="material-symbols-outlined hover:text-primary transition-all cursor-pointer active:opacity-70">notifications</button>
<button class="material-symbols-outlined hover:text-primary transition-all cursor-pointer active:opacity-70">settings</button>
<div class="w-px h-8 bg-outline-variant mx-sm"></div>
<img class="w-8 h-8 rounded-full object-cover border border-outline-variant" data-alt="Professional studio portrait of a real estate agent in a clean business suit, soft studio lighting, high-end photography style with a shallow depth of field against a neutral modern office background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCievGsFwbbU9dowx0MbA2SmQwfIQx1uXJ-8Jn2Pu4Ymz3CdAZspcv2hphzYZbxw7pm1wZKkEYp-sKcDrSgyRTWJjOc-Ta3RLG8qWlioafUeq8ffgD2lD7bVUT2moxC9DBa_pICnQKWUQoSSPq32Vc57ou8lSllkEvf1vDf6GuZysH_PtD6TcoqTBdURjpd6miHM2ymtxof4fQ-4i9J7xt93AFQvJ_ESEata-_Ts9p5Quma5SvFygZm7rSPlnwnTkgf5GMaio5wHow"/>
</div>
</div>
</header>
<!-- Main Content Canvas -->
<main class="ml-64 p-lg">
<!-- Section Header -->
<div class="flex flex-col md:flex-row md:items-center justify-between mb-xl gap-md">
<div>
<h1 class="font-display-lg text-display-lg text-primary">Biens à vérifier</h1>
<p class="text-on-surface-variant font-body-md text-body-md mt-xs">Gérez les inspections et la validation des nouveaux mandats.</p>
</div>
<div class="flex items-center gap-sm">
<button class="px-md py-sm bg-primary text-on-primary rounded-xl font-semibold flex items-center gap-sm hover:opacity-90 transition-all elevation-1">
<span class="material-symbols-outlined">add</span>
                    Nouveau dossier
                </button>
</div>
</div>
<!-- Filters & Tabs Grid -->
<div class="bg-surface-container-lowest rounded-xl p-md elevation-1 mb-lg">
<div class="flex flex-col lg:flex-row lg:items-center justify-between gap-lg">
<!-- Tabs -->
<div class="flex items-center gap-sm border-b lg:border-none border-outline-variant pb-md lg:pb-0">
<button class="px-lg py-2 rounded-full bg-primary text-on-primary font-bold transition-all text-body-md">Non assignés (12)</button>
<button class="px-lg py-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-all text-body-md">En cours (5)</button>
<button class="px-lg py-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-all text-body-md">Terminés</button>
</div>
<!-- Filters -->
<div class="flex flex-wrap items-center gap-sm">
<div class="flex items-center gap-xs px-sm py-1.5 bg-surface-container-low rounded-lg border border-outline-variant text-body-md text-on-surface-variant">
<span class="material-symbols-outlined text-[18px]">filter_list</span>
<span>Statut</span>
</div>
<div class="flex items-center gap-xs px-sm py-1.5 bg-surface-container-low rounded-lg border border-outline-variant text-body-md text-on-surface-variant">
<span>Type</span>
<span class="material-symbols-outlined text-[18px]">expand_more</span>
</div>
<div class="flex items-center gap-xs px-sm py-1.5 bg-surface-container-low rounded-lg border border-outline-variant text-body-md text-on-surface-variant">
<span>Priorité</span>
</div>
<div class="flex items-center gap-xs px-sm py-1.5 bg-surface-container-low rounded-lg border border-outline-variant text-body-md text-on-surface-variant">
<span>Date</span>
<span class="material-symbols-outlined text-[18px]">calendar_today</span>
</div>
</div>
</div>
</div>
<!-- Verification Table -->
<div class="bg-surface-container-lowest rounded-xl elevation-1 overflow-hidden">
<div class="overflow-x-auto custom-scrollbar">
<table class="w-full text-left border-collapse">
<thead>
<tr class="bg-surface-container-low border-b border-outline-variant">
<th class="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Bien</th>
<th class="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Propriétaire</th>
<th class="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Type</th>
<th class="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Soumis le</th>
<th class="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Priorité</th>
<th class="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
</tr>
</thead>
<tbody class="divide-y divide-outline-variant">
<!-- Row 1: Urgent -->
<tr class="hover:bg-primary-fixed/10 transition-colors group">
<td class="px-lg py-lg">
<div class="flex items-center gap-md">
<div class="relative h-14 w-14 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
<img class="h-full w-full object-cover" data-alt="High-end luxury apartment interior with floor-to-ceiling windows, modern furniture in neutral tones, and warm natural sunlight. Professional architectural photography style with balanced exposure and clean lines." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKFb1H7Whatykyo86YPuiK1jtSpoRTe9bv9pAKrhfu35JrKV0N_zTQo1GPf0hCfZaaOYOOyj_g10mUj6sFEvr-mJ8PNeyfI6pzmOGuLgnkS_aOd3UuvJ7BrBs14uU9-v0GfxQQVyzSFGIXaW0QBCb-wdnn44sDha1fZVQuSWL-YcTwGon_LRtZBtf1DvuQH4vWNj0qqVnAddcVGACkPpjViwAFyrWdPD3as6UqmFbAKX07-pCvU_iY8uzKPWFSlB3gquyMPX62YiQ"/>
<div class="absolute top-1 left-1 bg-tertiary text-on-tertiary-container text-[8px] font-bold px-1 rounded-sm uppercase">Verified</div>
</div>
<div>
<p class="font-title-lg text-[16px] text-primary">Penthouse - Rue de Rivoli</p>
<p class="text-body-md text-on-surface-variant line-clamp-1">75001 Paris • 145m² • 4p</p>
</div>
</div>
</td>
<td class="px-lg py-lg">
<div class="flex flex-col">
<span class="text-body-md font-semibold text-on-surface">Marc Lemoine</span>
<span class="text-label-sm text-on-surface-variant">m.lemoine@email.com</span>
</div>
</td>
<td class="px-lg py-lg text-body-md text-on-surface">Appartement</td>
<td class="px-lg py-lg text-body-md text-on-surface">12 Oct 2023</td>
<td class="px-lg py-lg">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-label-sm font-bold bg-error-container text-on-error-container border border-error/20">
                                    URGENT
                                </span>
</td>
<td class="px-lg py-lg text-right">
<div class="flex items-center justify-end gap-sm opacity-0 group-hover:opacity-100 transition-opacity">
<button class="p-2 rounded-lg text-primary hover:bg-primary-container hover:text-on-primary-container transition-colors" title="Prendre en charge">
<span class="material-symbols-outlined text-[20px]">assignment_turned_in</span>
</button>
<button class="p-2 rounded-lg text-secondary hover:bg-secondary-container transition-colors" title="Documents">
<span class="material-symbols-outlined text-[20px]">description</span>
</button>
<button class="p-2 rounded-lg text-secondary hover:bg-secondary-container transition-colors">
<span class="material-symbols-outlined text-[20px]">more_vert</span>
</button>
</div>
</td>
</tr>
<!-- Row 2: Normal -->
<tr class="hover:bg-primary-fixed/10 transition-colors group">
<td class="px-lg py-lg">
<div class="flex items-center gap-md">
<div class="h-14 w-14 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
<img class="h-full w-full object-cover" data-alt="Contemporary detached villa with a manicured garden and swimming pool at sunset. The architectural design is minimalist with large glass facades, warm interior lights glowing, high-end property marketing aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBtkMluHa5a3TEs5EsaafgWpUQ0UQnk28BlzXPOI2O53WRXXxrmAnr8uoJpwl75jXJD4uVCp0qgLptIBAuWRvQowut_dZcH_5TajHwCbf5iajdddyC5OCn0vl-IKsHVMqK1lOhWVyC_L9kXIWtKc6oFwfLcnvE43LnOXKCZ2G-XpgdDSc6TU4rDYSRl8ui5SxfWq7cNhYjwXgc-02kARW8pKI5W0TnypafShFoPOHlRPnm7RiV11nULPJEtwnpnaSbuudvZfEHg5U"/>
</div>
<div>
<p class="font-title-lg text-[16px] text-primary">Villa Belle Époque</p>
<p class="text-body-md text-on-surface-variant line-clamp-1">Biarritz • 280m² • 6p</p>
</div>
</div>
</td>
<td class="px-lg py-lg">
<div class="flex flex-col">
<span class="text-body-md font-semibold text-on-surface">Sophie Girard</span>
<span class="text-label-sm text-on-surface-variant">sophie.g@me.com</span>
</div>
</td>
<td class="px-lg py-lg text-body-md text-on-surface">Maison</td>
<td class="px-lg py-lg text-body-md text-on-surface">14 Oct 2023</td>
<td class="px-lg py-lg">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-label-sm font-bold bg-primary-fixed text-primary border border-primary/20">
                                    NORMAL
                                </span>
</td>
<td class="px-lg py-lg text-right">
<div class="flex items-center justify-end gap-sm opacity-0 group-hover:opacity-100 transition-opacity">
<button class="p-2 rounded-lg text-primary hover:bg-primary-container hover:text-on-primary-container transition-colors" title="Prendre en charge">
<span class="material-symbols-outlined text-[20px]">assignment_turned_in</span>
</button>
<button class="p-2 rounded-lg text-secondary hover:bg-secondary-container transition-colors" title="Documents">
<span class="material-symbols-outlined text-[20px]">description</span>
</button>
<button class="p-2 rounded-lg text-secondary hover:bg-secondary-container transition-colors">
<span class="material-symbols-outlined text-[20px]">more_vert</span>
</button>
</div>
</td>
</tr>
<!-- Row 3: In Progress (Special State) -->
<tr class="hover:bg-primary-fixed/10 transition-colors group">
<td class="px-lg py-lg">
<div class="flex items-center gap-md">
<div class="h-14 w-14 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
<img class="h-full w-full object-cover" data-alt="Loft style apartment in a converted industrial building, featuring exposed brick walls, high ceilings, large black-framed windows, and minimalist decor. Professional interior photography, bright and airy light mode." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBM_5sHyV6TT1prUHnld4mhQ0ZtvPfCu8Ie0ogTJuheiY-LkUrDgGPTMoweqE2Pv7a_J4cb232xmjuyE5UJTkyrERwsajj6cmiS5nHER2uzPWRV-ZqVUrRawhItjegwDvNJGc9ZcioX20g7wUzgrBFrdlgJibI-NQ86wyKdxVySfKwcq-tsSZQxJjqPEWY94_vRNIa5pXJ2Ys-EzRvLpXiNFqbdUFm7KajSCXJA_9D45Jy9FCVyb8DFQqyy2LpZBv_ClVxePoGmbG8"/>
</div>
<div>
<p class="font-title-lg text-[16px] text-primary">Loft Industriel - Lyon 7</p>
<p class="text-body-md text-on-surface-variant line-clamp-1">Lyon • 92m² • 3p</p>
</div>
</div>
</td>
<td class="px-lg py-lg">
<div class="flex flex-col">
<span class="text-body-md font-semibold text-on-surface">Thomas Dubreuil</span>
<span class="text-label-sm text-on-surface-variant">t.dubreuil@gmail.com</span>
</div>
</td>
<td class="px-lg py-lg text-body-md text-on-surface">Appartement</td>
<td class="px-lg py-lg text-body-md text-on-surface">15 Oct 2023</td>
<td class="px-lg py-lg">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-label-sm font-bold bg-primary-fixed text-primary border border-primary/20">
                                    NORMAL
                                </span>
</td>
<td class="px-lg py-lg text-right">
<div class="flex items-center justify-end gap-sm opacity-0 group-hover:opacity-100 transition-opacity">
<button class="px-3 py-1.5 rounded-lg bg-surface-container-high text-primary font-bold text-label-md flex items-center gap-xs border border-primary/20">
<span class="material-symbols-outlined text-[16px]">edit_note</span>
                                        Rédiger rapport
                                    </button>
<button class="p-2 rounded-lg text-secondary hover:bg-secondary-container transition-colors">
<span class="material-symbols-outlined text-[20px]">more_vert</span>
</button>
</div>
</td>
</tr>
<!-- Row 4 -->
<tr class="hover:bg-primary-fixed/10 transition-colors group">
<td class="px-lg py-lg">
<div class="flex items-center gap-md">
<div class="h-14 w-14 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
<img class="h-full w-full object-cover" data-alt="Traditional suburban family home with a two-car garage and a front porch. Green lawn, blue sky, soft afternoon sunlight, professional real estate photography with vibrant but natural colors." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMbdeI1zAEqiB1QEfZPqdzEy8RAvF7G_uXPFMNlSEXHxp4zciJorrQJEfYn9jyii7xhvazUs4iQ_ZzF4SsJuYjxJ01JFuCSbDyuB_YquyXQe5i0marr8J0dyYJKUWQICJMu_GFclmyh4aYj69mWEL3wILPWvnJvWvW7aXkLJ1399G_296hCrL2RFok1tJdh-MCtGLnUQxweLoDjHRj-q-wXwc-lQU36xE2nl2dm2MmOhHiGQpp1RQ-trQT8yPTHWkqzx7xbYgeNYw"/>
</div>
<div>
<p class="font-title-lg text-[16px] text-primary">Maison Familiale - Bordeaux</p>
<p class="text-body-md text-on-surface-variant line-clamp-1">Bordeaux • 120m² • 5p</p>
</div>
</div>
</td>
<td class="px-lg py-lg">
<div class="flex flex-col">
<span class="text-body-md font-semibold text-on-surface">Julie Morel</span>
<span class="text-label-sm text-on-surface-variant">j.morel@laposte.fr</span>
</div>
</td>
<td class="px-lg py-lg text-body-md text-on-surface">Maison</td>
<td class="px-lg py-lg text-body-md text-on-surface">15 Oct 2023</td>
<td class="px-lg py-lg">
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-label-sm font-bold bg-error-container text-on-error-container border border-error/20">
                                    URGENT
                                </span>
</td>
<td class="px-lg py-lg text-right">
<div class="flex items-center justify-end gap-sm opacity-0 group-hover:opacity-100 transition-opacity">
<button class="p-2 rounded-lg text-primary hover:bg-primary-container hover:text-on-primary-container transition-colors" title="Prendre en charge">
<span class="material-symbols-outlined text-[20px]">assignment_turned_in</span>
</button>
<button class="p-2 rounded-lg text-secondary hover:bg-secondary-container transition-colors" title="Documents">
<span class="material-symbols-outlined text-[20px]">description</span>
</button>
<button class="p-2 rounded-lg text-secondary hover:bg-secondary-container transition-colors">
<span class="material-symbols-outlined text-[20px]">more_vert</span>
</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<!-- Pagination / Footer -->
<div class="px-lg py-md bg-surface-container-low flex items-center justify-between border-t border-outline-variant">
<p class="text-label-md text-on-surface-variant">Affichage de 1 à 4 sur 12 biens non assignés</p>
<div class="flex items-center gap-sm">
<button class="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant disabled:opacity-50" disabled="">
<span class="material-symbols-outlined">chevron_left</span>
</button>
<div class="flex items-center gap-xs">
<button class="w-8 h-8 rounded-lg bg-primary text-on-primary font-bold text-label-md">1</button>
<button class="w-8 h-8 rounded-lg hover:bg-surface-container-high text-on-surface-variant font-bold text-label-md">2</button>
<button class="w-8 h-8 rounded-lg hover:bg-surface-container-high text-on-surface-variant font-bold text-label-md">3</button>
</div>
<button class="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant">
<span class="material-symbols-outlined">chevron_right</span>
</button>
</div>
</div>
</div>
<!-- Secondary Actions Grid (Bottom) -->
<div class="mt-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
<div class="bg-surface-container-lowest p-lg rounded-xl elevation-1 flex items-center gap-md hover:scale-[1.02] transition-transform cursor-pointer">
<div class="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
<span class="material-symbols-outlined">event_available</span>
</div>
<div>
<h3 class="font-bold text-body-lg text-on-surface">Planifier visite</h3>
<p class="text-label-sm text-on-surface-variant">Réserver un créneau</p>
</div>
</div>
<div class="bg-surface-container-lowest p-lg rounded-xl elevation-1 flex items-center gap-md hover:scale-[1.02] transition-transform cursor-pointer">
<div class="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed-variant">
<span class="material-symbols-outlined">folder_zip</span>
</div>
<div>
<h3 class="font-bold text-body-lg text-on-surface">Voir documents</h3>
<p class="text-label-sm text-on-surface-variant">Mandats &amp; Titres</p>
</div>
</div>
<div class="bg-surface-container-lowest p-lg rounded-xl elevation-1 flex items-center gap-md hover:scale-[1.02] transition-transform cursor-pointer">
<div class="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed-variant">
<span class="material-symbols-outlined">rate_review</span>
</div>
<div>
<h3 class="font-bold text-body-lg text-on-surface">Rédiger rapport</h3>
<p class="text-label-sm text-on-surface-variant">Inspection technique</p>
</div>
</div>
<div class="bg-primary p-lg rounded-xl shadow-lg flex items-center gap-md hover:scale-[1.02] transition-transform cursor-pointer group">
<div class="w-12 h-12 rounded-full bg-on-primary-fixed-variant flex items-center justify-center text-on-primary">
<span class="material-symbols-outlined">auto_fix_high</span>
</div>
<div>
<h3 class="font-bold text-body-lg text-on-primary">Assistant IA</h3>
<p class="text-label-sm text-on-primary/70">Analyse de conformité</p>
</div>
</div>
</div>
</main>
<!-- Contextual Micro-interactions Script -->
<script>
        document.querySelectorAll('tr').forEach(row => {
            row.addEventListener('click', (e) => {
                if (e.target.closest('button')) return;
                console.log('Opening detail view for property...');
            });
        });

        // Simple animation for the add button hover
        const addBtn = document.querySelector('button.bg-primary');
        if(addBtn) {
            addBtn.addEventListener('mousedown', () => {
                addBtn.classList.add('scale-95');
            });
            addBtn.addEventListener('mouseup', () => {
                addBtn.classList.remove('scale-95');
            });
        }
    </script>
</body></html>
Faite la page pour l'agent qui recupere les biens soumis pour la verification