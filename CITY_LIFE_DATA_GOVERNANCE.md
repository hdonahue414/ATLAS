# City/Life Data Governance

City/Life is an interpretive lived-environment system for ATLAS. It should remain curated, sparse where necessary, and oriented toward inhabitation rather than directory coverage.

## Core Philosophy

City/Life exists to model:

- environmental coherence
- daily inhabitation
- social ecology
- recoverability
- relationship sustainability
- routine friction
- participatory culture
- livability
- sustainable creative life

It does not exist to model generic things to do, tourism value, nightlife volume, restaurant quality, or city-guide completeness.

The core question is not "what is available here?" but "what kinds of life, recovery, community, and creative practice can this environment support over time?"

## Environmental Anchors

An Environmental Anchor is a place, structure, or recurring local node that materially shapes everyday life. It should help ATLAS interpret how a person or couple might build routines, recover from stress, participate in culture, find community, or remain creatively alive.

Strong candidates include:

- recurring third places
- queer/community infrastructure
- bookstores
- cafes with genuine social or creative function
- participatory culture spaces
- parks and recovery environments
- neighborhoods with meaningful social or environmental texture
- arts/community spaces tied to sustainable lived experience

Weak or non-qualifying candidates include:

- generic tourist attractions
- random restaurants
- generic bars or clubs
- one-off novelty locations
- places with no environmental or life relevance
- exhaustive city listings

Environmental Anchors should be selected because they reveal the metabolism of a place, not because they are popular.

## Anchor Categories

`neighborhood_anchor`: A neighborhood, district, corridor, or everyday geographic texture that affects routine, cost, access, safety, recovery, and social belonging.

`third_place_anchor`: A recurring informal place outside home and school where routine, low-pressure public life, writing, conversation, or decompression can happen.

`queer_community_anchor`: Community infrastructure, resource centers, recurring spaces, or social/civic nodes that matter for queer and trans belonging, safety, or support.

`arts_culture_anchor`: Arts venues, cultural institutions, galleries, cinemas, creative schools, or public culture spaces that shape sustainable creative life.

`participatory_culture_anchor`: Places where the user can do more than consume culture: readings, workshops, volunteer culture, public talks, community arts, festivals, or shared making.

`recoverability_anchor`: Parks, gardens, quiet routes, water, libraries, calm interiors, and other environments that support nervous-system recovery and ordinary repair.

`documentary_world_node`: Transitional category for documentary-world proximity such as festivals, film organizations, public media, and nonfiction communities. This remains supported for now, but many of these items should eventually move into Documentary & Professional Infrastructure.

## Density Rules

City/Life should remain selective.

Recommended starting density is roughly 6-10 strong anchors per school/city ecosystem. More can be added when they clarify distinct environmental functions, but quantity should never be treated as better evidence by itself.

Avoid:

- overcrowding overview cards or modals
- repeating the same function through many similar venues
- adding places because they are famous rather than interpretively useful
- turning City/Life into a city directory
- flattening anchors, conditions, and synthesis into identical lists

Prefer:

- fewer, stronger anchors
- clear functional diversity
- recurring life relevance
- editorial atmosphere
- sparse-data elegance

## Fields

Required fields:

- `name`
- `anchor_type`

Optional fields:

- `district`
- `relevance_note`
- `website_url`
- `instagram_url`
- `image_url`
- `sensory_tags`
- `social_tags`

Missing optional fields should not block rendering or editing. Sparse anchors are acceptable when they are conceptually useful and clearly incomplete.

## Image And Media Policy

Images should support atmosphere and interpretation. They should not create a tourism-gallery feel.

Use images when they clarify:

- environmental mood
- scale
- texture
- recoverability
- community presence
- institutional atmosphere

Avoid excessive media density, generic promotional imagery, image-heavy directories, and visuals that make anchors feel like travel recommendations. Thumbnails should remain supportive and restrained.

## Epistemic Guidance

ATLAS should preserve differences between knowledge states:

- `verified`: grounded in direct evidence or reliable source material
- `inferred`: reasoned from adjacent evidence, patterns, or context
- `synthesis`: interpretive summary created from multiple signals
- `institutional_claim`: language or claims made by a school, institution, venue, or official source
- `speculative`: plausible but weakly evidenced interpretation
- `unresolved`: known unknown, contradiction, missing evidence, or deliberately open question

City/Life should not pretend environmental reads are factual certainties. Interpretive synthesis is valuable, but it must not masquerade as evidence. ATLAS intentionally preserves ambiguity when the environment is not yet known.

## Boundary With Documentary & Professional Infrastructure

City/Life and Documentary & Professional Infrastructure overlap, but they should not collapse into one system.

City/Life is about inhabitation: daily rhythms, recoverability, community integration, routine friction, relationship sustainability, and lived environmental coherence.

Documentary & Professional Infrastructure is about professional and field ecology: festivals, documentary organizations, public media, distribution pathways, teaching pipelines, institutional documentary ecosystems, grant networks, production communities, alumni circulation, and documentary-world topology.

Items like RiverRun, Kartemquin, SFFILM, ITVS proximity, Full Frame, and public media ecosystems may remain temporarily supported in City/Life as `documentary_world_node`, but the long-term direction is to migrate many of these into Documentary & Professional Infrastructure.

## Tone And Style

Environmental synthesis should feel:

- observational
- interpretive
- human-centered
- editorial
- restrained
- documentary-oriented

Avoid:

- marketing language
- travel-blog tone
- generic city boosterism
- placeholder shorthand
- phrases like "California strong"
- score-speak
- optimization jargon
- rankings language

Good synthesis should read like a field note from an interpretive atlas, not a recommendation engine.

## Future Governance

Future expansion should preserve:

- moderation and curation discipline
- contradiction handling
- uncertainty preservation
- explicit boundaries between evidence and interpretation
- future ontology integration without premature schema collapse
- future epistemic rendering
- future documentary topology systems

City/Life should remain a living interpretive layer, not an exhaustive database. Its strength comes from meaningful selection, not coverage.
