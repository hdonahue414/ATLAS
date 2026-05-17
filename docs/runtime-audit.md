# ATLAS Runtime Audit

Branch: `rebuild`

Reference branch: `stable`

Purpose: document the current runtime before any rebuild, refactor, or visual consolidation work. This audit is documentation-only and intentionally does not change app behavior.

---

## Executive summary

ATLAS is currently a working static GitHub Pages application, but the runtime is no longer cleanly modular. It has evolved into a layered prototype architecture: `index.html` provides the document shell, but also carries a large inline style block, inline runtime shims, City/Life adapters, and `VIEWS` overrides. The JS modules exist, but several of them inject CSS dynamically, patch global functions after load, and override views at runtime.

The application should not be cleaned in place. The safest migration strategy is to preserve `stable` as behavioral reference, use `rebuild` for documentation and parallel development, then create a v2 runtime beside the current app and migrate one view at a time.

Primary risk: many visible features depend on post-render correction rather than clean first-pass rendering. Removing or refactoring a patch layer before replacing its behavior will likely break working UI.

---

## Current boot sequence

Observed from `index.html` and loaded script order:

1. Browser loads `index.html`.
2. `assets/css/styles.css` loads first.
3. A very large inline `<style>` block loads in `index.html`.
4. Body renders static mount elements:
   - `#gate`
   - `#splash`
   - `.mobileTop`
   - `.shell`
   - `#sideNav`
   - `#mobileNav`
   - `#panel`
   - `#jsonModal`
5. Scripts load in this order:
   - `assets/js/state.js`
   - `assets/js/data-loader.js`
   - `assets/js/scoring.js`
   - `assets/js/renderers.js`
   - inline script in `index.html`
   - `assets/js/charts.js`
   - `assets/js/validation.js`
   - `assets/js/json-editor.js`
   - `assets/js/search.js`
   - `assets/js/auth.js`
   - `assets/js/app.js`
6. `app.js` dynamically injects `assets/js/app-core.js` and installs additional “final blocking fixes” after `app-core.js` loads.
7. `app-core.js` installs navigation relabeling, environment viewer overrides, Tori/authored summary overrides, search drawer, final cleanup patches, selector normalization, and then calls `init()`.
8. `auth.js` also contains authentication logic and a large City/Life metadata shim, local-storage working-data behavior, anchor editing tools, and Tori/environment modal logic.

---

## File ownership map

### `index.html`

Current role:

- document shell
- login/splash/modal mount structure
- global inline style container
- City/Life pilot anchor constants
- environmental anchor renderer helpers
- Tori-mode overview overrides
- `VIEWS.overview` and `VIEWS.programs` monkey-patching
- script load orchestration

Problem:

`index.html` is not just a mount point. It behaves as a runtime patch container. This makes it dangerous to edit for “simple cleanup,” because apparently decorative inline code may actually drive live behavior.

Desired v2 role:

- static mount point only
- minimal shell
- imports CSS and bootstrap JS
- no view logic
- no injected data adapters
- no renderer overrides

---

### `assets/css/styles.css`

Current role:

- base style system
- layout styles
- card/grid/nav/modal styles
- older and current view styling

Risk:

Not fully audited yet because many active styles are injected from JS and inline `index.html`. Global CSS changes are high-risk because they interact with injected `!important` overrides.

Desired v2 role:

- static design tokens
- base layout
- reusable component classes
- view-level CSS imported predictably

---

### `assets/js/state.js`

Current role:

- global app state
- profile definitions
- active profile state
- NAV definition

Globals defined include:

- `DATA`
- `weights`
- `view`
- `selected`
- `compareA`
- `compareB`
- `preset`
- `ATLAS_PROFILES`
- `activeProfile`
- `NAV`

Notes:

`NAV` is defined here but later relabeled by `app-core.js`, which means navigation labels are not source-of-truth stable in one place.

---

### `assets/js/data-loader.js`

Current role:

- embedded fallback data source
- data loading logic
- contains full `EMBEDDED_DATA` object
- includes all school records, categories, score subvariables, system modules, source traces, etc.

Critical finding:

This is not merely a loader. It contains a massive embedded dataset fallback. That creates possible duplication drift between `data.json` and embedded data. Any v2 architecture should explicitly decide whether embedded fallback remains, is generated, or is removed.

Render-sensitive paths confirmed tonight:

```js
schools[x].scores[category].subvariables[y].evidence
schools[x].location.energy_profile
```

Do not assume `system_modules.*.evidence` is visible unless separately wired.

---

### `assets/js/scoring.js`

Current role:

- score/category calculations
- weighting/preset logic dependencies

Risk:

Should not be touched until view migration has isolated rendering from scoring. Score behavior is core application behavior.

---

### `assets/js/renderers.js`

Current role:

- central renderer definitions
- `render()`
- `VIEWS`
- Programs dossier view
- Research/Evidence view
- Compare view
- Presets view
- Fit/Decision/Visuals/Location/Development views
- category blocks
- school cards
- source trace panels
- dynamically injected CSS for Program Dossier and Research Dossier

Critical finding:

Rendering and styling are coupled. Several renderer functions create `<style>` tags dynamically. This makes visual changes brittle because styles are not centralized.

Known relevant functions/areas:

- `render()`
- `VIEWS`
- `schoolCard()`
- `programDossierView()`
- `programCategorySections()`
- `categoryBlocks()`
- `evidenceView()`
- `researchFeatureCard()`
- compare-dossier installation functions

Evidence visibility target likely belongs near subvariable rendering in `programCategorySections()` or any future score/subscore component.

---

### `assets/js/charts.js`

Current role:

- chart rendering
- visual comparison layer

Migration risk:

Medium. Charts depend on current DOM timing and data/scoring globals. Do not port before core view shell and score components are stable.

---

### `assets/js/validation.js`

Current role:

- JSON/data validation helpers

Migration risk:

Low-to-medium. It is likely portable, but should stay untouched until JSON editor behavior is documented.

---

### `assets/js/json-editor.js`

Current role:

- JSON modal behavior
- import/export/format/validate/load flows

Migration risk:

High. This is one of the most important operational tools in ATLAS. Do not rewrite until v2 shell is stable and data loading strategy is settled.

---

### `assets/js/search.js`

Current role:

- global search indexing
- result ranking
- result routing
- visible search snippets
- Research image fallback helpers
- additional focused Research/Evidence renderers and style injections

Critical finding:

`search.js` is not only search. It also contains Research/Evidence rendering and large dynamic CSS blocks. This is a major ownership leak.

Migration implication:

Search and Research view must be separated in v2.

---

### `assets/js/auth.js`

Current role:

- credential/profile login
- profile greeting
- splash behavior
- logout behavior
- profile refresh
- City/Life metadata shim
- localStorage working data
- environmental anchor editor
- GitHub JSON handoff helpers
- Tori modal/context behavior
- dynamic style injection
- patches to `boot`, `openJson`, `confirmJsonImport`, `loadJson`, `cityLifeRecord`, `cityLifeAnchorNode`, `cityLifePanel`, and Tori overview functions

Critical finding:

`auth.js` has significant non-auth responsibilities. It is currently a mixed auth + editor + City/Life + local persistence + UI patch layer.

Migration implication:

Auth should be split from:

- splash
- profile UI
- local data persistence
- City/Life anchor editing
- environmental modal behavior
- GitHub handoff tools

---

### `assets/js/app.js`

Current role:

- wrapper around `app-core.js`
- dynamically loads `app-core.js`
- installs “final blocking fixes”
- injects CSS overrides
- normalizes Practice selectors
- patches `render`, `setView`, and `atlasPracticeSelect`
- adds splash skip behavior
- runs interval watcher to keep fixing selector/splash state

Critical finding:

`app.js` is not an app bootstrap in the clean sense. It is a final patch layer.

Migration implication:

Do not delete or simplify it until its patches are individually mapped and replaced.

---

### `assets/js/app-core.js`

Current role:

- real app bootstrap layer
- nav rendering
- view setting
- environment viewer installation
- environment modal copy
- Tori authored summaries
- search drawer installation
- final cleanup patches
- selector/splash normalization
- calls `init()`

Critical finding:

`app-core.js` is a second app layer that sits after the original modules. It contains core behavior, injected styles, view overrides, and post-render corrections.

Migration implication:

This file should be treated as the behavioral patch manifest for v2 planning. Each installed behavior should be extracted into a named component/module only after parity is confirmed.

---

## Runtime patch inventory

Known patch types:

### Inline CSS patches

Located in:

- `index.html`
- `app.js`
- `app-core.js`
- `renderers.js`
- `auth.js`
- `search.js`

These include:

- tooltip/z-index fixes
- splash animation fixes
- JSON import styling
- City/Life panel styling
- environmental anchor styling
- selector/chip styling
- search drawer styling
- research dossier styling
- program dossier styling
- final cleanup styles

### Monkey patches / runtime overrides

Known examples:

- `VIEWS.overview` overwritten in `index.html`
- `VIEWS.programs` overwritten in `index.html`
- `render()` wrapped in `app.js`
- `setView()` wrapped in `app.js`
- `atlasPracticeSelect()` wrapped in `app.js`
- `VIEWS.location` replaced by `app-core.js`
- `VIEWS.editor` patched to remove `open` attributes from details
- `runAtlasSplash()` patched/replaced
- `boot()` patched in `auth.js`
- `openJson()` patched in `auth.js`
- `confirmJsonImport()` patched in `auth.js`
- `loadJson()` patched in `auth.js`
- `cityLifeRecord()` patched in `auth.js`
- `cityLifeAnchorNode()` patched in `auth.js`
- `cityLifePanel()` patched in `auth.js`

### Interval / watcher behavior

Known examples:

- `app.js` repeatedly calls `removeSplashSubtitles()` and `normalizePracticeSelector()` for a fixed number of tries.
- `app-core.js` starts repeated final cleanup and selector/splash normalization loops.

These are symptoms of unstable first-pass rendering.

---

## View ownership map

### Overview / Home

Defined in `renderers.js` as `VIEWS.overview`, then overridden by `index.html` for Tori mode and later affected by Tori summary functions in `app-core.js` and `auth.js`.

Risk: high due to layered overrides.

---

### Programs

Defined in `renderers.js` via `programDossierView()` and `VIEWS.programs`, then extended by `index.html` to append `cityLifePanel()`.

Important components:

- `programDossierView()`
- `programCategorySections()`
- `programFieldNotes()`
- `programTemperamentRows()`
- `cityLifePanel()` appended externally

Risk: high. Programs is visually central and has multiple layers attached.

---

### Environment / Location

Originally part of `VIEWS.location`, then relabeled as Environment by `app-core.js`. Environment viewer is installed by `installEnvironmentViewer()` and uses custom card rendering.

Risk: high. It depends on City/Life helpers, images, modal context, and generated summaries.

---

### Research / Evidence

Defined/overridden in multiple places:

- basic `evidenceView()` in `index.html`
- research dossier view in `renderers.js`
- focused research rendering in `search.js`

Risk: medium. It is conceptually important but may be a good first v2 migration because it is data-heavy and less interaction-heavy than Programs/Environment.

---

### Practice / Development

Originally `VIEWS.development`. Later selector/chip behavior is normalized by `app.js` and `app-core.js`.

Risk: high if touched directly. Selector layout has already required repeated runtime fixes.

---

### Compare

Defined in `renderers.js`, with additional compare dossier installation code later in the same file.

Known issue: compare dropdown synchronization bug remains on roadmap.

Risk: medium.

---

### JSON Editor / Import

HTML shell lives in `index.html`, logic in `json-editor.js`, plus local-storage and GitHub handoff patches in `auth.js`.

Risk: very high. Do not touch until data-loading and local persistence are separated.

---

### Search

Search indexing and drawer behavior split across `search.js` and `app-core.js`.

Risk: medium-to-high. Search touches routing, selected school state, and view switching.

---

## Render-sensitive data paths

Confirmed visible or render-sensitive:

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

Important correction:

```js
system_modules.*.evidence
```

exists and may be useful ontology, but is not the primary visible evidence path unless explicitly wired.

---

## Dangerous-touch areas

Do not modify casually:

1. `index.html` inline scripts
2. `app.js` final blocking fixes
3. `app-core.js` installer functions
4. `auth.js` because it contains much more than auth
5. JSON editor/import flow
6. `render()` and `setView()`
7. `VIEWS` object and overrides
8. school picker/chip styling
9. splash/login behavior
10. `data-loader.js` embedded fallback data
11. `cityLifeRecord()` and related City/Life functions
12. search drawer and global search result routing
13. global CSS selectors with `!important`
14. any interval/watch-loop patch until replaced

---

## Safer first migration targets

Recommended migration sequence:

### 1. Documentation / architecture only

Create additional docs:

- `docs/v2-runtime-plan.md`
- `docs/view-ownership-map.md`
- `docs/data-render-paths.md`

No behavior changes.

### 2. Parallel v2 shell

Create a non-production shell:

```text
v2.html
assets/js/v2/
assets/css/v2/
```

Do not replace `index.html`.

Goal:

- load same data source
- render minimal nav
- render one static view
- prove no impact on current app

### 3. Evidence component

Build an isolated helper/component for:

```js
scores.*.subvariables[*].evidence
```

Do not patch the existing live renderer first unless strictly needed.

### 4. Research/Evidence v2

Recommended first real view migration.

Why:

- conceptually central
- lower interaction risk than Programs/Environment
- can validate evidence rendering
- can validate data traversal patterns

### 5. Programs v2

Build canonical program-detail view from clean components:

- hero
- school picker
- score category sections
- subvariable evidence
- source trace
- city/life attachment

### 6. Environment / City-Life v2

Port after Programs because current environment logic is heavily shimmed.

### 7. Practice / Curriculum v2

Port after shared visual systems exist.

### 8. Editor/Search/Auth last

These are operationally important and too entangled to migrate early.

---

## Proposed v2 architecture

Target shape:

```text
v2.html
assets/css/v2/
  tokens.css
  base.css
  layout.css
  components.css
  views/
    home.css
    programs.css
    research.css
    environment.css
    practice.css
    editor.css

assets/js/v2/
  main.js
  core/
    state.js
    data.js
    router.js
    auth.js
    events.js
    utils.js
  render/
    shell.js
    nav.js
    home.js
    programs.js
    research.js
    environment.js
    practice.js
    editor.js
    compare.js
  components/
    hero-card.js
    school-picker.js
    score-card.js
    evidence-block.js
    metric-card.js
    modal.js
    search.js
    rings.js
    chips.js
```

Key principle:

`index.html` should eventually become a mount point, not the app.

---

## V2 migration rules

1. Do not refactor stable in place.
2. Do not remove legacy patch layers until replacement behavior exists.
3. Do not change JSON schema during runtime migration.
4. Do not change scoring logic during view migration.
5. Do not globally rewrite CSS.
6. Do not combine visual unification with architecture migration in one commit.
7. Port one view at a time.
8. Verify against `stable` after every step.
9. Keep old app accessible until v2 parity is proven.
10. Prefer additive files over destructive edits.

---

## Immediate next task recommendation

Next implementation task should be:

```text
Create docs/v2-runtime-plan.md
```

No app behavior changes.

That doc should turn this audit into a step-by-step v2 construction plan with acceptance criteria for each phase.

---

## Bottom line

ATLAS is a successful prototype that has outgrown its patch-based runtime. The immediate danger is not that the app is broken; it is that future changes are likely to break it because behavior is distributed across inline scripts, injected styles, monkey patches, embedded fallback data, and post-render correction loops.

The safe path is a parallel rebuild, not in-place cleanup.
