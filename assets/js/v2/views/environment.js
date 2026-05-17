function asArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return [value];
}

function renderTextList(title, items, escapeHtml) {
  const normalized = asArray(items).map(String).map(item => item.trim()).filter(Boolean);

  if (!normalized.length) return '';

  return `
    <section class="v2-environment-group">
      <h3>${escapeHtml(title)}</h3>
      <div class="v2-environment-list">
        ${normalized.map(item => `<p>${escapeHtml(item)}</p>`).join('')}
      </div>
    </section>
  `;
}

function renderAnchor(title, anchor, escapeHtml) {
  if (!anchor) return '';

  if (typeof anchor === 'string') {
    return `<article class="v2-environment-anchor"><strong>${escapeHtml(anchor)}</strong></article>`;
  }

  const name = anchor.name || anchor.label || anchor.title || 'Unnamed anchor';
  const type = anchor.type || anchor.anchor_type || anchor.category || '';
  const note = anchor.relevance_note || anchor.note || anchor.description || anchor.summary || '';
  const district = anchor.district || anchor.neighborhood || anchor.area || '';

  return `
    <article class="v2-environment-anchor">
      <strong>${escapeHtml(name)}</strong>
      ${type ? `<span>${escapeHtml(String(type).replaceAll('_', ' '))}</span>` : ''}
      ${district ? `<p>${escapeHtml(district)}</p>` : ''}
      ${note ? `<p>${escapeHtml(note)}</p>` : ''}
    </article>
  `;
}

function renderAnchorGroup(title, anchors, escapeHtml) {
  const normalized = asArray(anchors);

  if (!normalized.length) return '';

  return `
    <section class="v2-environment-group">
      <h3>${escapeHtml(title)}</h3>
      <div class="v2-environment-anchor-grid">
        ${normalized.map(anchor => renderAnchor(title, anchor, escapeHtml)).join('')}
      </div>
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

export function renderEnvironmentView(school, options = {}) {
  const escapeHtml = options.escapeHtml;

  if (!school) {
    return '<p>No school loaded.</p>';
  }

  const location = school.location || {};
  const locationIntel = school.location_intelligence || {};
  const cityLife = school.city_life || {};
  const anchors = collectCityLifeAnchors(school);
  const place = [location.city, location.state].filter(Boolean).join(', ');

  return `
    <div class="v2-environment-view">
      <header class="v2-environment-header">
        <div class="v2-muted">Environment</div>
        <h2>${escapeHtml(school.name)}</h2>
        ${place ? `<p class="v2-muted">${escapeHtml(place)}</p>` : ''}
      </header>

      <section class="v2-environment-summary">
        <article class="v2-environment-group">
          <h3>Location profile</h3>
          ${location.setting ? `<p><strong>Setting:</strong> ${escapeHtml(location.setting)}</p>` : ''}
          ${location.region ? `<p><strong>Region:</strong> ${escapeHtml(location.region)}</p>` : ''}
          ${location.energy_profile ? `<p><strong>Energy profile:</strong> ${escapeHtml(location.energy_profile)}</p>` : ''}
        </article>
      </section>

      <div class="v2-environment-stack">
        ${renderTextList('Environmental conditions', cityLife.sensory_social_tags || locationIntel.sensory_social_tags, escapeHtml)}
        ${renderTextList('Livability notes', cityLife.livability_notes || locationIntel.livability_notes || locationIntel.notes, escapeHtml)}
        ${renderTextList('Relationship / life-fit notes', cityLife.relationship_life_fit_notes || locationIntel.relationship_life_fit_notes, escapeHtml)}
        ${renderAnchorGroup('Neighborhood anchors', anchors.neighborhoods, escapeHtml)}
        ${renderAnchorGroup('Third-place anchors', anchors.thirdPlaces, escapeHtml)}
        ${renderAnchorGroup('Queer / community anchors', anchors.queerCommunity, escapeHtml)}
        ${renderAnchorGroup('Arts / culture / documentary-world anchors', anchors.artsCulture, escapeHtml)}
        ${renderAnchorGroup('User environmental anchors', anchors.environmentalAnchors, escapeHtml)}
      </div>
    </div>
  `;
}
