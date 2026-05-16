# ENVIRONMENT_UI_WIREFRAME.md

## Purpose

The Environment page is the viewer-facing environmental interpretation surface for ATLAS.

It should not behave like a data dump, editor panel, location directory, or recycled collection of app fragments. It should translate City/Life data into a coherent, cinematic, human-readable environmental reading.

The page should answer:

Could someone live here?  
What would daily life feel like?  
What kinds of routines, communities, and recovery spaces exist?  
What are the environmental risks?  
What kinds of social and creative life are possible here?

---

## Core Rule

The Environment page must be authored, not assembled.

It should not directly expose raw City/Life structures, ontology terms, editor controls, or internal categories unless they have been translated into viewer-facing language.

Internal terms like `recoverability_anchor`, `participatory_culture_anchor`, `synthesis`, `conditions`, or `documentary_world_node` should not appear in the viewer-facing UI.

---

## Distinction From Overview

The Environment page must not visually or structurally reuse the Overview dashboard system.

Overview is:
- comparative
- score-first
- evaluative
- compact
- dashboard-oriented

Environment should be:
- immersive
- spatial
- environmental
- interpretive
- slower
- more editorial

Environment cards should not feel like score tiles with different content.

Avoid:
- radial score dominance
- compact dashboard density
- identical card proportions
- repeated Overview layouts
- duplicated visual rhythm
- “grid of score cards” feeling

Environment should instead feel closer to:
- editorial spreads
- documentary field notes
- environmental portraits
- lived-world snapshots

Possible directional differences:
- larger image emphasis
- asymmetrical layout
- fewer cards per row
- more breathing room
- softer hierarchy
- lower information density
- environmental prose replacing metrics
- anchored atmosphere over comparison logic

Overview asks:
“How does this program score?”

Environment asks:
“What does life here actually feel like?”

---

## Layout Structure

### 1. Page Header

Title:

Environment

Subtitle:

City & Life, daily rhythm, anchors, and lived context.

The header should be simple and restrained. No large explanatory manifesto block. No repeated governance text.

---

### 2. Featured Environment Grid

Primary surface.

A responsive grid of school environment cards.

These should NOT reuse the Overview card structure directly.

Environment cards should feel:
- more spacious
- more environmental
- more atmospheric
- less evaluative
- less dashboard-oriented

Each card should be image-forward and cinematic, but distinct from Overview cards.

Each card contains:

School name  
City/location  
One concise environmental synthesis sentence  
2–4 selected anchor chips  
Environmental Context button

Cards must not horizontally overflow the app shell.

No sideways scrolling.  
No giant horizontal carousel unless intentionally designed later.

Cards should wrap responsively into rows.

---

### 3. Environmental Context Modal

Clicking Environmental Context opens the shared page-level modal.

The card itself should not navigate.

The modal contains:

Full environmental synthesis  
Livability reading  
Daily rhythm notes  
Relationship/life-fit notes  
Selected anchors  
Community/recoverability notes  
Risks and unresolved uncertainty

The modal should be the place where depth appears. The card surface remains clean.

The modal should feel like:
- interpretive field notes
- lived-environment reading
- documentary-world context

—not:
- a dashboard
- a second detail page
- a data dump

---

### 4. Focused Environmental Read Section

Below the card grid, show one selected school’s deeper environmental read only if a school is selected.

This section should feel like field notes, not a dashboard.

Possible subsections:

Daily Rhythm  
Social Ecology  
Recoverability  
Relationship Sustainability  
Environmental Risks  
Strongest Anchors

Use prose and curated chips. Avoid metric grids.

---

### 5. Anchor Gallery / Field Notes

A later section may show curated environmental anchors across schools.

This should not look like a directory.

Each anchor should explain why it matters environmentally.

Good:

“Bookmarks functions as a repeatable cultural third place and low-friction public routine anchor.”

Bad:

“participatory_culture_anchor”

---

### 6. Authoring Controls

Authoring tools do not belong in the main Environment viewer surface.

Do not show by default:

Add Anchor  
Copy JSON + Open GitHub  
Reset local edits  
raw editor utilities  
schema/governance controls

If needed, place them behind an “Edit Environment Data” affordance or keep them in the existing JSON/editor workflow.

---

## Visual Direction

The Environment page should feel:

cinematic  
spatial  
editorial  
observational  
environmental  
calm  
image-forward  
documentary-field-notebook adjacent

It should avoid:

Yelp/travel-guide layouts  
tourism browsing  
admin dashboards  
raw ontology displays  
metric grids  
horizontal overflow  
CMS/editor controls  
random reused UI fragments  
large explanatory panels  
SaaS/productivity aesthetics

---

## Card Rules

Environment cards should follow these rules:

No horizontal overflow.  
No internal editor controls.  
No raw ontology category labels.  
No long paragraphs.  
No more than 4 visible chips.  
No metric grids.  
No nested translucent panels.  
No auto-navigation to Program pages.  
Environmental Context button is the only required interaction.

---

## Language Rules

Viewer-facing Environment language should be human and interpretive.

Use language like:

“Small-city rhythm with repeatable café, arts, and festival anchors.”

“Chicago offers deep creative infrastructure, but daily life may carry higher fragmentation and recovery costs.”

“Santa Cruz is values-aligned and socially textured, but rent pressure may dominate the lived experience.”

Avoid:

“California strong.”  
“Major concern.”  
“participatory culture anchor.”  
“relationship/life-fit synthesis.”  
“conditions.”  
“synthesis notes.”  
“Drawn from 10 anchors.”

---

## Relationship to Tori Mode

Tori Mode and Environment share the same environmental intelligence layer.

Difference:

Tori Mode is a profile-specific overview lens.  
Environment is the broader environmental atlas surface.

Tori Mode asks:

“Would this life work for Tori and the relationship?”

Environment asks:

“What is the lived ecology of this place?”

---

## Relationship to Harper Mode

Harper Mode remains program-first.

Environment provides secondary lived-context interpretation.

Harper should be able to access Environmental Context, but Environment should not become a Program page.

---

## Relationship to Documentary & Professional Infrastructure

Documentary/professional nodes should not dominate Environment.

If included, they should appear only where they affect lived creative ecology.

Examples:

A local festival may matter environmentally if it shapes recurring community rhythm.  
Kartemquin belongs primarily in Documentary & Professional Infrastructure, not ordinary City/Life.

---

## Implementation Guardrails

Before implementing the Environment page:

Do not reuse raw Location tab output without redesigning it.  
Do not dump City/Life fields directly onto the page.  
Do not expose editor controls by default.  
Do not create horizontal scrolling.  
Do not build a map interface yet.  
Do not build topology systems yet.  
Do not add new schema requirements.

First implementation should only create:

header  
responsive image-card grid  
clean Environmental Context buttons  
page-level modal access  
no editor/admin clutter

---

## Acceptance Criteria

The Environment page passes if:

It fits within the app shell without horizontal scrolling.  
It reads as a coherent authored page.  
It does not expose ontology jargon.  
It does not show editor controls by default.  
It preserves cinematic visual identity.  
It offers environmental interpretation at a glance.  
It uses modal depth instead of visible clutter.  
It feels like ATLAS, not a dashboard or directory.
