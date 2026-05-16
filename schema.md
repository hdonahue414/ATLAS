# MFA Dashboard v3 Schema

This version uses explicit subvariables, not hand-entered category totals.

## Score formula

For each school and category:

1. Average all `subvariables[].value` within the category.
2. Multiply by the active category weight.
3. Sum all categories.
4. Normalize to `/1000` using the active weight total.

## Evidence confidence

Each subvariable has:
- `value`: 0.0 to 1.0
- `confidence`: 0.0 to 1.0
- `pending`: true/false
- `evidence`: array of notes/sources

Pending subvariables affect uncertainty ranges.

## New panels

- Evidence: contradiction logs + mentor dependency
- Relationships: contact history and emotional residue
- Failure modes: resilience under low-energy, financial stress, creative block, identity stress
- Location: city/COL/energy context
- Forecast: identity drift and 5-/15-year trajectory
- Presets: alternate weighting models

## Important methodological note

This is still a curated decision model, not an autonomous AI researcher. It can accept new web findings, but live web updating requires an external API/backend or manually updated `data.json`.


# v4 Visualization Additions

## Added panels
- Radar: profile shape for each school
- Topology map: structure vs sustainability spatial clustering
- Uncertainty: low/base/high score bands
- Score timeline: historical score movement
- Energy budget: estimated usable creative energy reserve
- Relationship network: faculty/contact network
- Identity safety: HRC MEI + politics + identity-stress resilience
- Portfolio resonance: project/school compatibility
- Admissions quadrant: desirability vs attainability
- Scenario cascade: simple stress-test recalculations

## HRC MEI field
`hrc_mei` contains:
- `mei_score`: numeric 0-100 or null if not verified
- `mei_year`: year of score/proxy
- `mei_city`: exact city or proxy city
- `mei_status`: whether verified/current/proxy/pending
- `mei_note`: caveats

Important: HRC MEI is not a full “trans safety score.” It evaluates municipal LGBTQ-inclusive policies, laws, and services. The dashboard keeps MEI separate from politics/legal and identity-stress resilience.
