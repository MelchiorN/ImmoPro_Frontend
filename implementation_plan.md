# Replace all icons with Lucide Vue Next

This plan covers migrating all icons in the `IMMOPRO_FRONTEND` project from `material-symbols-outlined` (and some SVGs) to `lucide-vue-next` components.

## User Review Required

> [!WARNING]
> Please review the mapping below and confirm if you agree with the Lucide equivalents for your Material Symbols. Once approved, I will systematically replace them in all 17 files and ensure the new icons are correctly imported and rendered.

## Open Questions

> [!IMPORTANT]
> The dynamic icons in your KPI cards (e.g. `icon: 'group'`) will be changed from strings to actual Vue components (e.g. `icon: Users`), and the template will use `<component :is="kpi.icon" />`. This is already done in `app/pages/agent/index.vue` and will be replicated across the admin/agent pages. Does this approach work for you?

## Proposed Changes

We will modify the following 17 Vue components and pages. For each file, we will:
1. Replace `<span class="material-symbols-outlined">...</span>` tags with the corresponding `<LucideIcon class="..." />`.
2. Add the required `import { ... } from 'lucide-vue-next'` to the `<script setup>`.
3. Refactor dynamic icon rendering (`{{ kpi.icon }}`) to use `<component :is="..." />`.

### Component Files

#### [MODIFY] [AdminSidebar.vue](file:///d:/Th Stage/Projet/ImmoPro/IMMOPRO_FRONTEND/app/components/AdminSidebar.vue)
#### [MODIFY] [AgentSidebar.vue](file:///d:/Th Stage/Projet/ImmoPro/IMMOPRO_FRONTEND/app/components/AgentSidebar.vue)
#### [MODIFY] [AdminHeader.vue](file:///d:/Th Stage/Projet/ImmoPro/IMMOPRO_FRONTEND/app/components/AdminHeader.vue)
#### [MODIFY] [AgentHeader.vue](file:///d:/Th Stage/Projet/ImmoPro/IMMOPRO_FRONTEND/app/components/AgentHeader.vue)
#### [MODIFY] [OtpModal.vue](file:///d:/Th Stage/Projet/ImmoPro/IMMOPRO_FRONTEND/app/components/auth/OtpModal.vue)
#### [MODIFY] [BienDetailModal.vue](file:///d:/Th Stage/Projet/ImmoPro/IMMOPRO_FRONTEND/app/components/agent/BienDetailModal.vue)
#### [MODIFY] [RapportModal.vue](file:///d:/Th Stage/Projet/ImmoPro/IMMOPRO_FRONTEND/app/components/agent/RapportModal.vue)
#### [MODIFY] [RapportAdminModal.vue](file:///d:/Th Stage/Projet/ImmoPro/IMMOPRO_FRONTEND/app/components/admin/RapportAdminModal.vue)
#### [MODIFY] [BienDetailAdminModal.vue](file:///d:/Th Stage/Projet/ImmoPro/IMMOPRO_FRONTEND/app/components/admin/BienDetailAdminModal.vue)

### Page Files

#### [MODIFY] [verify.vue](file:///d:/Th Stage/Projet/ImmoPro/IMMOPRO_FRONTEND/app/pages/auth/verify.vue)
#### [MODIFY] [register.vue](file:///d:/Th Stage/Projet/ImmoPro/IMMOPRO_FRONTEND/app/pages/auth/register.vue)
#### [MODIFY] [login.vue](file:///d:/Th Stage/Projet/ImmoPro/IMMOPRO_FRONTEND/app/pages/auth/login.vue)
#### [MODIFY] [admin/index.vue](file:///d:/Th Stage/Projet/ImmoPro/IMMOPRO_FRONTEND/app/pages/admin/index.vue)
#### [MODIFY] [admin/users/index.vue](file:///d:/Th Stage/Projet/ImmoPro/IMMOPRO_FRONTEND/app/pages/admin/users/index.vue)
#### [MODIFY] [admin/properties.vue](file:///d:/Th Stage/Projet/ImmoPro/IMMOPRO_FRONTEND/app/pages/admin/properties.vue)
#### [MODIFY] [admin/agents/index.vue](file:///d:/Th Stage/Projet/ImmoPro/IMMOPRO_FRONTEND/app/pages/admin/agents/index.vue)
#### [MODIFY] [agent/check.vue](file:///d:/Th Stage/Projet/ImmoPro/IMMOPRO_FRONTEND/app/pages/agent/check.vue)

### Example Icon Mappings

- `error` / `error_outline` -> `AlertCircle`
- `progress_activity` -> `Loader2` (with `animate-spin` class)
- `mail` -> `Mail`
- `public` -> `Globe`
- `location_city` -> `Building2`
- `location_on` -> `MapPin`
- `visibility` -> `Eye`
- `visibility_off` -> `EyeOff`
- `domain` -> `Building`
- `check_circle` -> `CheckCircle2`
- `lock` -> `Lock`
- `search` -> `Search`
- `inbox` -> `Inbox`
- `home` -> `Home`
- `group` -> `Users`
- `history` -> `History`
- `chevron_left` -> `ChevronLeft`
- `chevron_right` -> `ChevronRight`
- `close` -> `X`

## Verification Plan

### Manual Verification
- We will review the modified files and verify the frontend visually to ensure all icons display correctly and without layout issues using `lucide-vue-next`.
- Test dynamic icon states (like checking properties list statuses, or showing/hiding password).
