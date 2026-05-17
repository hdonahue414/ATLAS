import { renderHeroCard } from '../components/hero-card.js';
import { renderSectionGroup, renderTextNotes } from '../components/section-group.js';

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

function readableType(anchor) {
  const type = anchor?.type || anchor?.anchor_type || anchor?.category || '';
  return type ? String(type).replaceAll('_', ' ') : '';
}

function anchorName(anchor) {
  if (typeof anchor === 'string') return anchor;
  return anchor?.name || anchor?.label || anchor?.title || 'Unnamed anchor';
}

function anchorNote(anchor) {
  if (!anchor || typeof anchor === 'string') return '';
  return anchor.relevance_note || anchor.note || anchor.description || anchor.summary || '';
}

function anchorArea(anchor) {
  if (!anchor || typeof anchor === 'string') return '';
  return anchor.district || anchor.neighborhood || anchor.area || '';
}

function anchorWebsite(anchor) {
  if (!anchor || typeof anchor === 'string') return '';
  return anchor.website || anchor.url || anchor.link || '';
}

function anchorInstagram(anchor) {
  if (!anchor || typeof anchor === 'string') return '';
  return anchor.instagram || anchor.instagram_url || anchor.ig || '';
}

function anchorImage(anchor) {
  if (!anchor || typeof anchor === 'string') return '';
  return anchor.photo || anchor.image || anchor.image_url || anchor.photo_url || '';
}

function renderPlaceChip(anchor, escapeHtml) {
  const name = anchorName(anchor);
  const type = readableType(anchor);
  const area = anchorArea(anchor);
  const note = anchorNote(anchor);
  const website = anchorWebsite(anchor);
  const instagram = anchorInstagram(anchor);
  const image = anchorImage(anchor);
  const hasDetails = Boolean(area || note || website || instagram || image);

  return `
    <details class="v2-place-chip" ${hasDetails ? '' : 'open'}>
      <summary>
        <span class="v2-place-name">${escapeHtml(name)}</span>
        ${type ? `<span class="v2-place-type">${escapeHtml(type)}</span>` : ''}
      </summary>
      ${hasDetails ? `
        <div class="v2-place-details">
          ${image ? `<img src="${escapeHtml(image)}" alt="" loading="lazy">` : ''}
          ${area ? `<p><strong>Area</strong>${escapeHtml(area)}</p>` : ''}
          ${note ? `<p><strong>Why it matters</strong>${escapeHtml(note)}</p>` : ''}
          ${(website || instagram) ? `
            <div class="v2-place-links">
              ${website ? `<a href="${escapeHtml(website)}" target="_blank" rel="noreferrer">Website</a>` : ''}
              ${instagram ? `<a href="${escapeHtml(instagram)}" target="_blank" rel="noreferrer">Instagram</a>` : ''}
            </div>
          ` : ''}
        </div>
      ` : ''}
    </details>
  `;
}

function renderAnchorGroup(title, anchors, escapeHtml) {
  const items = asArray(anchors);
  const content = items.length
    ? `<div class="v2-place-chip-grid">${items.map(anchor => renderPlaceChip(anchor, escapeHtml)).join('')}</div>`
    : '<p class="v2-empty-note">No anchors recorded.</p>';

  return `
    <section class="v2-place-group">
      <div class="v2-section-kicker">Place anchors</div>
      <h3>${escapeHtml(title)}</h3>
      ${content}
    </section>
  `;
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
        <div class="v2-production-grid v2-place-grid">
          ${renderAnchorGroup('Neighborhood anchors', anchors.neighborhoods, escapeHtml)}
          ${renderAnchorGroup('Third-place anchors', anchors.thirdPlaces, escapeHtml)}
          ${renderAnchorGroup('Queer / community anchors', anchors.queerCommunity, escapeHtml)}
          ${renderAnchorGroup('Arts / culture / documentary-world anchors', anchors.artsCulture, escapeHtml)}
        </div>
      </div>
    </div>
  `;
}
