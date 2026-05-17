import { renderHeroCard } from '../components/hero-card.js';
import { renderFieldNote, renderSectionGroup, renderTextNotes } from '../components/section-group.js';

function asArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return [value];
}

function renderTextList(title, items, escapeHtml) {
  const normalized = asArray(items).map(String).map(item => item.trim()).filter(Boolean);

  return renderSectionGroup(
    title,
    renderTextNotes(normalized, { escapeHtml }),
    { escapeHtml, kicker: 'Environmental read' }
  );
}

function renderAnchor(anchor, escapeHtml) {
  if (!anchor) return '';

  if (typeof anchor === 'string') {
    return renderFieldNote(anchor, '', { escapeHtml });
  }

  const name = anchor.name || anchor.label || anchor.title || 'Unnamed anchor';
  const type = anchor.type || anchor.anchor_type || anchor.category || '';
  const note = anchor.relevance_note || anchor.note || anchor.description || anchor.summary || '';
  const district = anchor.district || anchor.neighborhood || anchor.area || '';
  const body = [district, note].filter(Boolean).join(' / ');

  return renderFieldNote(name, body, {
    escapeHtml,
    meta: type ? String(type).replaceAll('_', ' ') : ''
  });
}

function renderAnchorGroup(title, anchors, escapeHtml) {
  const content = asArray(anchors)
    .map(anchor => renderAnchor(anchor, escapeHtml))
    .join('');

  return renderSectionGroup(title, content, {
    escapeHtml,
    kicker: 'Place anchors'
  });
}

function collectCityLifeAnchors(school) {
  const cityLife = school?.city_life || {};
  const locationIntel = school?.location_intelligence || {};

  return {
    neighborhoods: asArray(cityLife.neighborhoods || locationIntel.neighborhoods),
    thirdPlaces: asArray(cityLife.third_places || cityLife.points_of_interest || locationIntel.points_of_interest),
    queerCommunity: asArray(cityLife.queer_community_infrastructure || locationIntel.lgbtq_resources),
    artsCulture: asArray(cityLife.arts_community_infrastructure || cityLife.documentary_world_nodes || school?.documentary_ecosystem),
    environmentalAnchors: asArray(cityLife.environmental_anchors)
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

      <div class="v2-production-stack">
        <section class="v2-production-card">
          ${renderLocationProfile(location, escapeHtml)}
        </section>
        <section class="v2-production-card">
          ${renderTextList('Livability notes', cityLife.livability_notes || locationIntel.livability_notes || locationIntel.notes, escapeHtml)}
        </section>
        <div class="v2-production-grid">
          ${renderAnchorGroup('Neighborhood anchors', anchors.neighborhoods, escapeHtml)}
          ${renderAnchorGroup('Third-place anchors', anchors.thirdPlaces, escapeHtml)}
          ${renderAnchorGroup('Queer / community anchors', anchors.queerCommunity, escapeHtml)}
          ${renderAnchorGroup('Arts / culture / documentary-world anchors', anchors.artsCulture, escapeHtml)}
        </div>
      </div>
    </div>
  `;
}
