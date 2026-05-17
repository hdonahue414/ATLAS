# ATLAS V2 Runtime Plan

Branch: `rebuild`

Reference branch: `stable`

Purpose: define a safe, staged rebuild path for ATLAS without destabilizing the working app.

This plan follows `docs/runtime-audit.md` and assumes the current app is a working prototype with accumulated runtime patch layers. The goal is not to clean the live app in place. The goal is to build a cleaner runtime beside it, verify parity view by view, then migrate only when the replacement is proven.

---

## Core principle

`stable` is the behavioral reference.

`rebuild` is the migration workspace.

The current production app should not be refactored in place. Every architectural improvement should first be additive, isolated, and reversible.

---

## Strategic goals

1. Turn `index.html` into a mount point over time.
2. Separate view rendering from runtime patches.
3. Separate CSS from JavaScript string injection.
4. Separate auth from City/Life, local data persistence, and editor tools.
5. Preserve static GitHub Pages compatibility.
6. Preserve JSON-driven architecture.
7. Preserve ontology/render coupling intentionally rather than accidentally.
8. Make evidence rendering a first-class component.
9. Remove monkey patches only after equivalent v2 behavior exists.
10. Keep old app accessible until v2 parity is proven.

---

## Non-goals

Do not introduce:

- backend infrastructure
- database
- serverless API
- React/Vue/Svelte conversion
- build system
- package manager requirement
- TypeScript migration
- schema migration
- automated data ingestion
- authentication backend

Do not attempt:

- full-app rewrite in one pass
- global CSS unification in one pass
- renderer refactor in place
- removal of legacy patch layers before replacement
- simultaneous visual redesign and runtime migration

---

## Target v2 structure

Initial additive structure:

```text
v2.html
assets/css/v2/
  tokens.css
  base.css
  layout.css
  components.css
  views/
    home.css
    research.css
    programs.css
    environment.css
    practice.css
    editor.css

assets/js/v2/
  main.js
  core/
    state.js
    data.js
    router.js
    events.js
    utils.js
  components/
    chips.js
    evidence-block.js
    hero-card.js
    metric-card.js
    modal.js
    rings.js
    school-picker.js
    score-card.js
  views/
    home.js
    research.js
    programs.js
    environment.js
    practice.js
    compare.js
    editor.js
```

This structure is intentionally static. It should work directly on GitHub Pages without a bundler.

---

## V2 boot model

`v2.html` should provide only:

- static document shell
- root mount node
- optional modal root
- CSS imports
- module script import

Example target shape:

```html
<div id="atlas-v2-root"></div>
<div id="atlas-v2-modal-root"></div>
<script type="module" src="assets/js/v2/main.js"></script>
```

`v2.html` should not contain:

- view logic
- data adapters
- hardcoded school renderers
- inline CSS beyond emergency fallback
- runtime monkey patches
- City/Life shims
- profile-mode overrides

---

## Data loading plan

V2 should initially load the same data source as the current app.

Preferred sequence:

1. Try `data.json`.
2. If unavailable, use a small explicit fallback strategy.
3. Do not copy the massive embedded dataset into v2 unless a deliberate decision is made.
4. Do not mutate `data.json` during runtime migration.

Important render-sensitive paths:

```js
schools[x].scores[category].subvariables[y].evidence
schools[x].location.energy_profile
schools[x].scores[category].subvariables[y].value
schools[x].scores[category].subvariables[y].confidence
schools[x].scores[category].notes
schools[x].location
schools[x].location_intelligence
schools[x].city_life
schools[x].source_trace
schools[x].relationship_tracker
schools[x].visual_identity.photo_local
schools[x].brand_colors
```

Important caution:

```js
system_modules.*.evidence
```

exists, but should not be treated as visible score evidence unless a v2 view explicitly renders it.

---

## Evidence component plan

Evidence must become a reusable component.

Confirmed visible source path:

```js
school.scores[categoryKey].subvariables[index].evidence
```

Normalization helper:

```js
export function normalizeEvidence(evidence) {
  if (!evidence) return [];
  if (Array.isArray(evidence)) return evidence.filter(Boolean).map(String);
  if (typeof evidence === "string" && evidence.trim()) return [evidence.trim()];
  return [];
}
```

Component behavior:

- If evidence exists, render a compact evidence block.
- If evidence is absent, render nothing.
- Support arrays and strings.
- Do not create modals for evidence in v1.
- Keep evidence visually secondary.

Possible labels:

- `Evidence`
- `Why this score?`
- `Source notes`

Preferred initial UI:

- small disclosure under subvariable
- muted archival styling
- no global overlay

---

## Migration phases

### Phase 0 — Documentation foundation

Status: started.

Completed:

- `docs/runtime-audit.md`

This file:

- maps boot sequence
- identifies file ownership
- identifies runtime patch layers
- identifies dangerous-touch areas
- recommends v2 migration path

Next documentation target:

- this file: `docs/v2-runtime-plan.md`

Acceptance:

- no app behavior changes
- docs committed on `rebuild`

---

### Phase 1 — Create isolated v2 shell

Goal:

Create `v2.html` and minimal v2 assets without changing the current app.

Files to add:

```text
v2.html
assets/css/v2/tokens.css
assets/css/v2/base.css
assets/css/v2/layout.css
assets/css/v2/components.css
assets/js/v2/main.js
assets/js/v2/core/data.js
assets/js/v2/core/state.js
assets/js/v2/core/router.js
assets/js/v2/core/utils.js
```

Initial behavior:

- load data
- render static shell
- render active school list
- no auth requirement initially unless easy and safe
- no replacement of `index.html`

Acceptance:

- current `index.html` unchanged
- `v2.html` loads independently
- no changes to `data.json`
- no production behavior impact
- no console errors on v2 shell

Commit message:

```text
Add isolated v2 runtime shell
```

---

### Phase 2 — Build core components

Goal:

Create reusable rendering pieces before porting full views.

Files likely to add:

```text
assets/js/v2/components/chips.js
assets/js/v2/components/evidence-block.js
assets/js/v2/components/metric-card.js
assets/js/v2/components/rings.js
assets/js/v2/components/school-picker.js
assets/js/v2/components/score-card.js
assets/js/v2/components/hero-card.js
```

Initial components:

1. `evidence-block.js`
2. `score-card.js`
3. `school-picker.js`
4. `hero-card.js`

Acceptance:

- components are pure render helpers
- no global monkey patches
- no dynamic CSS injection
- no dependency on legacy `VIEWS`
- evidence renders from confirmed subvariable paths

Commit message:

```text
Add v2 core UI components
```

---

### Phase 3 — Port Research/Evidence view first

Goal:

Create the first meaningful v2 view.

Why Research first:

- ontology-heavy
- evidence-centered
- less interaction-heavy than Programs or Environment
- validates data traversal and evidence rendering
- lower risk than JSON editor/search/auth

Files likely to add:

```text
assets/js/v2/views/research.js
assets/css/v2/views/research.css
```

View should render:

- active schools
- source trace summary
- visible score evidence snippets
- unresolved questions
- relationship evidence where relevant

Acceptance:

- v2 Research renders all active schools
- evidence from `scores.*.subvariables[*].evidence` is visible
- no dependence on legacy `search.js` research renderer
- no mutation of app state outside v2

Commit message:

```text
Port Research view to v2 runtime
```

---

### Phase 4 — Port Programs view

Goal:

Create v2 canonical Program view.

Files likely to add:

```text
assets/js/v2/views/programs.js
assets/css/v2/views/programs.css
```

Programs v2 should render:

- school hero
- school selector
- score categories
- subvariables
- confidence values
- evidence blocks
- source trace
- selected school state

Acceptance:

- school switching works
- score values match current app
- subvariable evidence visible
- no monkey patches
- no dynamic CSS injection
- no dependency on legacy `programDossierView()`

Commit message:

```text
Port Programs view to v2 runtime
```

---

### Phase 5 — Port Environment / City-Life

Goal:

Separate current City/Life architecture into clean components.

Current logic is scattered across:

- `index.html`
- `app-core.js`
- `auth.js`
- `renderers.js`

V2 should separate:

- environmental anchors
- anchor cards
- city/life synthesis
- relationship/life-fit synthesis
- Tori environmental context
- documentary-world nodes
- modal behavior

Files likely to add:

```text
assets/js/v2/views/environment.js
assets/js/v2/components/environment-anchor.js
assets/js/v2/components/synthesis-panel.js
assets/css/v2/views/environment.css
```

Acceptance:

- environment cards render
- anchors render
- synthesis uses current data paths
- no inline pilot data unless explicitly migrated
- no modal complexity until basic view works

Commit message:

```text
Port Environment view to v2 runtime
```

---

### Phase 6 — Port Practice / Curriculum

Goal:

Create shared visual grammar for practice/curriculum/development pages.

Do this only after Programs and Environment provide reusable components.

Files likely to add:

```text
assets/js/v2/views/practice.js
assets/css/v2/views/practice.css
```

Possible subviews:

- Practice
- Curriculum
- Application/portfolio
- Thesis feasibility

Acceptance:

- no selector normalization patch required
- school picker uses shared component
- hero/card rhythm uses shared components
- no global CSS hacks

Commit message:

```text
Port Practice view to v2 runtime
```

---

### Phase 7 — Port Compare

Goal:

Create a clean compare view without dropdown sync bugs.

Files likely to add:

```text
assets/js/v2/views/compare.js
assets/css/v2/views/compare.css
```

Acceptance:

- both selectors update visually and functionally
- selected schools persist in v2 state
- score comparison matches current calculations
- no global side effects

Commit message:

```text
Port Compare view to v2 runtime
```

---

### Phase 8 — Port Search

Goal:

Separate search from Research rendering.

Current issue:

`search.js` currently owns search behavior and also contains major Research view code and dynamic CSS.

V2 should separate:

- search indexing
- result rendering
- result routing
- Research page rendering

Acceptance:

- search results route correctly
- search does not define page views
- search has no dynamic view CSS injection

Commit message:

```text
Port Search to v2 runtime
```

---

### Phase 9 — Port JSON editor/import

Goal:

Rebuild JSON editor last because it is operationally sensitive.

Do not touch until:

- v2 data loading is stable
- v2 state is stable
- v2 view rendering works
- local persistence strategy is decided

Acceptance:

- import preview works
- validation works
- download/export works
- no accidental data mutation
- editor does not own unrelated City/Life behavior

Commit message:

```text
Port JSON editor to v2 runtime
```

---

### Phase 10 — Production switch

Only after v2 parity.

Steps:

1. preserve old app as `legacy.html` or equivalent
2. switch `index.html` to v2 shell
3. keep legacy assets temporarily
4. deploy to GitHub Pages
5. test live app
6. only then remove old patch layers

Acceptance:

- live app loads
- login/profile works if retained
- all primary views render
- evidence visible
- JSON import/export works
- no console errors
- rollback path exists

Commit message:

```text
Switch ATLAS to v2 runtime
```

---

## Suggested first implementation prompt

```markdown
# ATLAS Rebuild Task — Add Isolated V2 Shell

Work on branch `rebuild` in `hdonahue414/ATLAS`.

Do not edit `index.html`.
Do not edit existing app JS/CSS.
Do not change `data.json`.
Do not change production behavior.

Create an isolated v2 shell:

- `v2.html`
- `assets/css/v2/tokens.css`
- `assets/css/v2/base.css`
- `assets/css/v2/layout.css`
- `assets/css/v2/components.css`
- `assets/js/v2/main.js`
- `assets/js/v2/core/data.js`
- `assets/js/v2/core/state.js`
- `assets/js/v2/core/router.js`
- `assets/js/v2/core/utils.js`

Initial v2 behavior:

- load `data.json`
- render a minimal ATLAS shell into `#atlas-v2-root`
- show school names from the loaded dataset
- show selected school name
- no auth requirement yet
- no production app replacement

Acceptance:

- current app remains untouched
- `v2.html` loads independently
- no console errors on v2 page
- no schema changes

Commit message:

`Add isolated v2 runtime shell`
```

---

## Rollback policy

Because v2 work is additive, rollback should be simple:

- do not route production to v2 until parity
- do not delete old files until after production switch is verified
- each phase should be its own commit
- if a phase fails, revert that phase only

---

## Current priority

Next step after this doc:

```text
Add isolated v2 runtime shell
```

Do not start by fixing visuals.
Do not start by cleaning CSS.
Do not start by removing legacy patch layers.

Start by creating a safe parallel runtime.
