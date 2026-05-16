# ATLAS Environment System Plan

## Purpose

The Environment system is the future coherent surface for ATLAS lived-environment interpretation. It should evolve the current Location tab, City/Life panels, Environmental Context modals, overview signals, anchor systems, and Tori Mode environmental reads into one shared interpretive system.

This document is a planning checkpoint. It does not require a runtime rewrite, schema migration, or ontology merge.

## 1. Core Philosophy

The Environment system models inhabitation rather than location.

It exists to interpret:

- daily rhythm
- routine feasibility
- environmental coherence
- social ecology
- recoverability
- relationship sustainability
- creative-life viability
- participatory culture
- neighborhood texture
- long-term lived experience

It should not become:

- a tourism guide
- a map of generic amenities
- a Yelp-style directory
- a city-ranking system
- a generic relocation checklist
- a dashboard of exposed submetrics

The central question is not "What is there to do?" The central question is: "What kind of life can be sustained here, and under what pressures?"

## 2. Naming Direction

Possible names:

- Environment
- City & Life
- Environment & Life
- Living Context
- City/Life
- Lived Environment

Recommended direction: **Environment** as the main navigation label, with **City & Life** as a section or interpretive layer inside it.

Reasoning:

- Environment is broad enough to include city, campus, housing texture, transit, sensory load, social infrastructure, and recoverability.
- City & Life remains useful as the human-scale sublanguage for anchors, daily rhythm, and relationship/life-fit interpretation.
- Living Context is accurate but softer and less system-like.
- Environment & Life is clear but slightly over-labeled for a primary nav surface.

Working model:

- Primary surface: **Environment**
- Internal layer: **City & Life**
- Reusable units: **Environmental Anchors**
- Detail modal: **Environmental Context**

## 3. System Relationships

### Harper Mode

Harper remains program-first. Environment should support documentary/program interpretation as secondary context:

- Does the place sustain the filmmaker's work?
- Does the environment support documentary practice over time?
- Does the city strengthen or weaken program fit?
- Are there local anchors that shape creative survival?

Harper should not become a livability dashboard.

### Tori Mode

Tori Mode is an environmental and relational interpretation lens. It should foreground:

- livability
- daily rhythm
- healthcare/recoverability
- social and community integration
- relationship sustainability
- creative-life ecology
- routine friction

Tori Mode is not a secondary Program dashboard. It should not route users into program-detail behavior from overview cards unless explicitly designed later.

### Program Pages

Program pages can include Environment as a contextual layer, but should preserve program interpretation as the primary frame. Environmental content belongs near fit, sustainability, contradiction, and long-term creative-life implications.

### Environmental Context Modals

Environmental Context modals are overview-level interpretive popups. They should provide a concise environmental read without changing page, route, or tab.

They are useful for:

- progressive disclosure
- overview card restraint
- profile-specific emphasis
- quick life-fit interpretation

They should not become a full replacement for the future Environment page.

### City/Life

City/Life is the current shared lived-environment interpretation layer. It should eventually become part of the Environment system rather than remain scattered across overview cards, modals, and detail inserts.

### Documentary & Professional Infrastructure

Documentary & Professional Infrastructure should remain distinct from City/Life.

Items such as festivals, documentary ecosystems, public media, professional circulation, teaching pathways, and institutional documentary networks should increasingly live in the professional layer, even when they have local/environmental relevance.

City/Life may temporarily support `documentary_world_node`, but that category should be treated as transitional.

### Environmental Anchors

Environmental Anchors are the core reusable place units. They should represent lived-environment infrastructure, not generic points of interest.

They can appear in:

- overview cards as limited chips
- Environmental Context modals as selected anchors
- Environment page sections as richer expandable nodes
- Program pages as contextual evidence
- future topology systems as place nodes

### Future Topology Systems

Environmental data should be prepared for later topology modeling without exposing topology machinery prematurely. Future graph/topology systems may connect:

- programs
- cities
- neighborhoods
- anchors
- documentary-world nodes
- social infrastructure
- recoverability spaces
- contradictions and uncertainty

## 4. Proposed Environment Page Structure

A future Environment page should be image-first, interpretive, and progressively disclosed.

Possible sections:

1. **Environmental Synthesis**
   - Short interpretive read of the place as a lived environment.
   - Should foreground habitability, rhythm, contradiction, and uncertainty.

2. **Neighborhoods**
   - Neighborhood anchors and residential texture.
   - Focus on daily life, recoverability, access, and social feel.

3. **Daily Rhythm**
   - Routine feasibility, time cost, sensory load, weather, pace, and ordinary-week structure.

4. **Third Places**
   - Recurring cafes, bookstores, cinemas, community rooms, and informal gathering spaces.
   - Selective, not comprehensive.

5. **Recoverability**
   - Parks, gardens, walking routes, quiet spaces, healthcare access, decompression infrastructure.

6. **Transit / Daily Friction**
   - Transit, walkability, car dependence, food access, distance pressure, fragmented routines.

7. **Social / Community Infrastructure**
   - Spaces and organizations that affect belonging, friendship formation, and social continuity.

8. **Queer / Community Infrastructure**
   - Direct queer community support, inclusive spaces, mutual aid, and safety/ambiguity notes.

9. **Participatory Culture**
   - Places where a person can join cultural life, not merely consume it.

10. **Environmental Anchors**
    - Structured expandable place nodes with metadata and epistemic restraint.

11. **Relationship / Life-Fit Notes**
    - Two-person life viability, partner independence, social options, healthcare/recovery, routine stress.

12. **Atmosphere / Sensory Profile**
    - Environmental conditions: overstimulation, quiet, density, seasonal pressure, sensory texture.

13. **Documentary / Professional Crossover Points**
    - Local documentary ecosystem nodes that affect place, while clarifying professional-layer boundaries.

## 5. Interaction Philosophy

### Progressive Disclosure

Overview cards should remain cinematic and sparse. They should show only the strongest environmental signals. Deeper context belongs in popups, drawers, or the Environment page.

### Overview vs Detail

Overview should answer: "What is the environmental read at a glance?"

Detail should answer: "What evidence, anchors, conditions, and uncertainties produce that read?"

### Modal Usage

Environmental Context modals are appropriate for quick interpretive reads from overview cards. They should be page-level, explicit-state, and easy to close.

They should not:

- change routes
- expand cards inline
- destabilize grids
- expose full metric systems

### Card Usage

Cards should be used for individual repeated items, selected anchors, or compact interpretive sections. Avoid nested card stacks and dashboard grids.

### Anchor Interaction

Environmental Anchors should remain compact by default and expand only when useful. Expansion should reveal relevance, district, links, sensory/social tags, and epistemic uncertainty where available.

### Avoiding Dashboard Clutter

The Environment system should not expose all dimensions at once. Subscores and model components should remain secondary or expandable.

### Avoiding Tourism-App Feel

Do not present anchors as recommendations, ratings, or things-to-do lists. Anchor selection should be curated for life relevance.

## 6. Visual Direction

Preserve:

- cinematic/editorial atmosphere
- documentary archive aesthetic
- image-first composition
- restrained typography
- environmental mood
- interpretive atlas feeling
- subtle epistemic cues
- quiet negative space

Avoid:

- maps-heavy interfaces as the primary experience
- tourism-gallery aesthetics
- SaaS dashboards
- productivity-app density
- Yelp/travel-guide behavior
- app-store cards
- exposed KPI grids

The ideal Environment page should feel like a documentary field atlas: visual, interpretive, atmospheric, and disciplined.

## 7. Tori Mode Positioning

Tori Mode is a profile-aware environmental interpretation lens for life with Harper.

It should answer:

- Could we live here?
- Would Tori have a life here?
- Would this environment support the relationship?
- Would daily life, healthcare, social life, and creative-life ecology be sustainable?

Tori Mode should foreground:

- Livability Score
- daily rhythm
- relationship sustainability
- social/community integration
- healthcare/recoverability
- creative-life ecology
- strongest environmental anchors
- Environmental Context modal

Tori Mode should de-emphasize:

- admissions logic
- program scoring
- professional prestige
- documentary infrastructure unless it affects shared life
- exposed submetric machinery

Tori Mode should feel equally cinematic and intentional as Harper Mode, not like a utility mode.

## 8. Future Integration Notes

### Ontology Integration

Future ontology work should map Environment concepts to formal systems only after the UI language stabilizes. Do not merge ontology systems into live data prematurely.

### Epistemic Rendering

Environmental interpretation should distinguish verified information, inferred conditions, synthesis, institutional claims, speculative reads, and unresolved uncertainty.

Epistemic status should remain subtle. It should not turn the interface into citation software.

### Topology Systems

Future topology work may represent anchors, neighborhoods, programs, institutions, and documentary-world nodes as connected systems. The Environment page should prepare for this without exposing graph machinery too early.

### Environmental Scoring

Livability Score should remain interpretive and transparent. It should emerge from anchors, conditions, and synthesis, but should not replace them.

### Anchor Overflow Handling

As data grows, the system should enforce curation:

- limited overview chips
- selected modal anchors
- expandable detail sections
- grouping by environmental role
- avoidance of exhaustive directories

### Media / Image Systems

Images should support atmosphere and recognition, not become tourism galleries. Use thumbnails sparingly and keep the cinematic archive tone.

### Narrative Synthesis Systems

Future synthesis should produce short, human-readable environmental reads. Avoid placeholder shorthand, score-speak, and generic optimization language.

### Reverted Runtime Attempt

A first runtime Environment tab implementation was attempted and reverted because it assembled raw City/Life/editor fragments rather than producing an authored viewer-facing surface.

Future Environment work must be designed as a coherent page system, not composed from exposed internal modules. Viewer-facing surfaces should translate ontology, editor state, and model categories into human environmental interpretation rather than exposing internal category language directly.

## Implementation Principle

The next implementation phase should replace fragmentation with coherence gradually:

1. Stabilize the Environment naming and navigation model.
2. Move the Location tab toward Environment without breaking current behavior.
3. Reuse the shared City/Life adapter rather than creating new profile-specific data systems.
4. Preserve Harper/Tori profile emphasis through placement, weighting, and visibility.
5. Keep the system static-only and GitHub Pages compatible.
