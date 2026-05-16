# ATLAS Stabilization Checkpoint

Purpose: document the current `assets/js/auth.js` boundary after rapid City/Life, Tori Mode, Livability, editor, and GitHub handoff work. This is a no-behavior-change checkpoint.

## Auth-Owned Logic

The following logic correctly belongs in or near `assets/js/auth.js` for now:

- Profile credentials and profile lookup.
- Login and logout flow.
- Session/profile persistence through `sessionStorage`.
- Profile greeting updates.
- Splash launch timing and profile-specific greeting.
- Small splash subtitle injection, because it is tied to the login/splash moment.

## Temporary Non-Auth Shim Logic Currently In `auth.js`

The following sections are intentionally recognized as misplaced or only temporarily acceptable inside `auth.js`:

- City/Life adapter and Environmental Anchor merge helpers.
- User-editable Environmental Anchor editor helpers.
- Local working-data persistence through `atlasII.workingData.v1`.
- JSON import/export persistence hooks.
- Manual GitHub handoff helper.
- Livability Score display helpers.
- Tori overview card renderer and Environmental Context modal.
- City/Life panel augmentation.

These remain in place for now to preserve GitHub Pages behavior, script load order, and the approved static-only data flow.

## Why No Extraction In This Pass

A safe extraction would require touching `index.html` script order and cache query strings, then verifying that all globals are available when the shim runs. Because the current goal is stabilization, not feature work, moving runtime code now would create more risk than value.

## Recommended Next Cleanup

When behavior is stable enough for a dedicated refactor, extract in this order:

1. `assets/js/city-life-shim.js`
   - City/Life adapter helpers.
   - Environmental Anchor dedupe/merge helpers.
   - Anchor editor rendering and save/delete helpers.

2. `assets/js/livability.js`
   - Livability score derivation.
   - Livability ring/panel display helpers.

3. `assets/js/tori-mode.js`
   - Tori overview card renderer.
   - Environmental Context modal state and rendering.

4. `assets/js/local-working-data.js`
   - LocalStorage restore/save/reset helpers.
   - JSON import/editor persistence hooks.
   - GitHub handoff helper.

After extraction, `auth.js` should return to profile, login/logout, greeting, and splash responsibilities only.

## Guardrails For Future Extraction

- Preserve static-only GitHub Pages compatibility.
- Keep `data.json` as the live render source.
- Do not merge ontology files into `data.json`.
- Preserve localStorage key `atlasII.workingData.v1`.
- Preserve manual GitHub handoff URL: `https://github.com/hdonahue414/ATLAS-II/edit/main/data.json`.
- Preserve Harper/Tori profile distinctions without separate routes or duplicated data models.
- Bump script query strings in `index.html` when extracted files are added or changed.

## Manual Verification After Any Future Extraction

- Login/logout for Harper and Tori.
- Splash wordmark, subtitle, and profile greeting.
- Harper overview and Program detail.
- Tori overview and Environmental Context modal.
- City/Life detail panels.
- Anchor add/edit/delete with local persistence.
- JSON import/export/editor workflow.
- Copy JSON + Open GitHub workflow.
- Evidence, Search, Compare, and Charts.
