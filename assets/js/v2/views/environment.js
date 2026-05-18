import { renderHeroCard } from '../components/hero-card.js';
import { renderPlaceCardGroup } from '../components/place-card.js';
import { renderSectionGroup, renderTextNotes } from '../components/section-group.js';

const WAKE_PLACE_METADATA = {
  'Downtown / Innovation Quarter': {
    category: 'neighborhood anchor',
    neighborhood: 'Downtown Winston-Salem',
    relevance_note: 'Primary low-friction daily-life zone around the Brookstown and Innovation Quarter orbit.'
  },
  'West End': {
    category: 'neighborhood anchor',
    neighborhood: 'West End',
    relevance_note: 'Historic, walkable neighborhood texture near downtown; useful as a quieter residential and café-life counterweight.'
  },
  Ardmore: {
    category: 'neighborhood anchor',
    neighborhood: 'Ardmore',
    relevance_note: 'Established residential neighborhood with calmer daily-life texture than the downtown core.'
  },
  'Washington Park': {
    category: 'neighborhood anchor',
    neighborhood: 'Washington Park',
    relevance_note: 'Green-space and residential anchor for lower-stimulation routines close to central Winston-Salem.'
  },
  Brookstown: {
    category: 'program-life anchor',
    neighborhood: 'Brookstown / Downtown',
    relevance_note: 'Physical orbit for Wake’s documentary program and a key daily-life geography anchor.'
  },
  'Innovation Quarter': {
    category: 'district anchor',
    neighborhood: 'Downtown Winston-Salem',
    website: 'https://www.innovationquarter.com/',
    instagram: 'https://www.instagram.com/innovationquarter/',
    relevance_note: 'Downtown district anchor near Wake’s Brookstown orbit; relevant to daily movement and institutional geography.'
  },
  RiverRun: {
    category: 'film festival / documentary ecosystem',
    neighborhood: 'Winston-Salem',
    website: 'https://riverrunfilm.com/',
    instagram: 'https://www.instagram.com/riverrunfilm/',
    relevance_note: 'Regional film-festival ecosystem anchor with year-round screenings and festival infrastructure.'
  },
  'Camino Bakery': {
    category: 'café / third place',
    neighborhood: 'Downtown Winston-Salem',
    website: 'https://www.caminobakery.com/',
    instagram: 'https://www.instagram.com/caminobakery/',
    relevance_note: 'Café and workspace anchor for routine, low-key meetings, and non-bar social texture.'
  },
  Krankies: {
    category: 'café / music / third place',
    neighborhood: 'Downtown Winston-Salem',
    website: 'https://www.krankies.com/',
    instagram: 'https://www.instagram.com/krankiesws/',
    relevance_note: 'Coffee, food, and local culture node; useful for everyday rhythm and creative-life texture.'
  },
  Bookmarks: {
    category: 'bookstore / literary third place',
    neighborhood: 'Downtown Winston-Salem',
    website: 'https://www.bookmarksnc.org/',
    instagram: 'https://www.instagram.com/bookmarksnc/',
    relevance_note: 'Independent literary nonprofit and bookstore; useful as a low-friction cultural and community anchor.'
  },
  'North Star LGBTQ+ Community Center': {
    category: 'queer community infrastructure',
    neighborhood: 'Winston-Salem',
    website: 'https://www.northstarlgbtcc.com/',
    instagram: 'https://www.instagram.com/northstarlgbtcc/',
    relevance_note: 'Local LGBTQ+ community infrastructure anchor for social and support context outside the program.'
  },
  'Winston-Salem LGBTQIA+ resources': {
    category: 'queer community infrastructure',
    neighborhood: 'Winston-Salem',
    relevance_note: 'Broader queer-resource placeholder; should eventually be split into specific named institutions and services.'
  },
  'Full Frame radius': {
    category: 'regional documentary ecosystem',
    neighborhood: 'Durham / North Carolina',
    website: 'https://www.fullframefest.org/',
    instagram: 'https://www.instagram.com/fullframefest/',
    relevance_note: 'Regional documentary-festival radius relevant to North Carolina nonfiction culture, even if not daily local infrastructure.'
  }
};

function asArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return [value];
}

function anchorName(anchor) {
  if (typeof anchor === 'string') return anchor;
  return anchor?.name || anchor?.label || anchor?.title || '';
}

function enrichAnchor(anchor) {
  const name = anchorName(anchor);
  const metadata = WAKE_PLACE_METADATA[name];

  if (!metadata) return anchor;

  if (typeof anchor === 'string') {
    return { name: anchor, ...metadata };
  }

  return { ...metadata, ...anchor, name };
}

function uniqueAnchors(anchors) {
  const seen = new Set();
  return asArray(anchors).filter(anchor => {
    const name = anchorName(anchor).toLowerCase().trim();
    if (!name || seen.has(name)) return false;
    seen.add(name);
    return true;
  });
}

function enrichAnchors(anchors) {
  return uniqueAnchors(asArray(anchors).map(enrichAnchor));
}

function normalizeAnchorType(anchor) {
  if (!anchor || typeof anchor === 'string') return '';

  return String(anchor.anchor_type || anchor.type || anchor.category || '')
    .toLowerCase()
    .replaceAll('-', '_')
    .trim();
}

function anchorsByType(anchors, matchers = []) {
  return uniqueAnchors(anchors.filter(anchor => {
    const type = normalizeAnchorType(anchor);
    return matchers.some(matcher => type.includes(matcher));
  }));
}

function renderTextList(title, items, escapeHtml) {
  const normalized = asArray(items).map(String).map(item => item.trim()).filter(Boolean);

  return renderSectionGroup(
    title,
    renderTextNotes(normalized, { escapeHtml }),
    { escapeHtml, kicker: 'Environmental read' }
  );
}

function collectCityLifeAnchors(school) {
  const cityLife = school?.city_life || {};
  const locationIntel = school?.location_intelligence || {};

  const environmentalAnchors = enrichAnchors(cityLife.environmental_anchors);

  const neighborhoods = enrichAnchors([
    ...anchorsByType(environmentalAnchors, ['neighborhood']),
    ...asArray(cityLife.neighborhoods || locationIntel.neighborhoods)
  ]);

  const thirdPlaces = enrichAnchors([
    ...anchorsByType(environmentalAnchors, ['third_place', 'participatory_culture']),
    ...asArray(cityLife.third_places || cityLife.points_of_interest || locationIntel.points_of_interest)
  ]);

  const queerCommunity = enrichAnchors([
    ...anchorsByType(environmentalAnchors, ['queer', 'lgbt']),
    ...asArray(cityLife.queer_community_infrastructure || locationIntel.lgbtq_resources)
  ]);

  const artsCulture = enrichAnchors([
    ...anchorsByType(environmentalAnchors, ['arts_culture', 'documentary_world']),
    ...asArray(cityLife.arts_community_infrastructure || cityLife.documentary_world_nodes || school?.documentary_ecosystem)
  ]);

  return {
    neighborhoods,
    thirdPlaces,
    queerCommunity,
    artsCulture,
    environmentalAnchors
  };
}

function renderLocationProfile(location, escapeHtml) {
  const notes = [
    location.setting && `Setting: ${location.setting}`,
    location.region && `Region: ${location.region}`,
    location.energy_profile && `Energy profile: ${location.energy_profile}`
  ].filter(Boolean);

  return renderSectionGroup(
    'Location profile',
    renderTextNotes(notes, { escapeHtml }),
    { escapeHtml, kicker: 'Environmental frame' }
  );
}

export function renderEnvironmentView(school, options = {}) {
  const escapeHtml = options.escapeHtml;
  const schoolPicker = options.schoolPicker || '';

  if (!school) {
    return '<p>No school loaded.</p>';
  }

  const location = school.location || {};
  const locationIntel = school.location_intelligence || {};
  const cityLife = school.city_life || {};
  const anchors = collectCityLifeAnchors(school);

  return `
    <div class="v2-environment-view v2-production-view">
      ${renderHeroCard(school, { escapeHtml, schoolPicker })}

      <section class="v2-environment-lede">
        <p class="v2-section-kicker">Lived geography</p>
        <h2>Can ordinary life hold the work?</h2>
        <p>Environment is treated as a working ecology: repeatable routines, queer/community infrastructure, third places, transit friction, and documentary-world access.</p>
      </section>

      <div class="v2-production-stack">
        <section class="v2-production-card">
          ${renderLocationProfile(location, escapeHtml)}
        </section>

        <section class="v2-production-card">
          ${renderTextList('Livability notes', cityLife.livability_notes || locationIntel.livability_notes || locationIntel.notes, escapeHtml)}
        </section>

        <div class="v2-production-grid">
          ${renderPlaceCardGroup('Neighborhood anchors', anchors.neighborhoods, { escapeHtml })}
          ${renderPlaceCardGroup('Third-place anchors', anchors.thirdPlaces, { escapeHtml })}
          ${renderPlaceCardGroup('Queer / community anchors', anchors.queerCommunity, { escapeHtml })}
          ${renderPlaceCardGroup('Arts / culture / documentary-world anchors', anchors.artsCulture, { escapeHtml })}
        </div>
      </div>
    </div>
  `;
}
