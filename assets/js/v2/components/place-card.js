function asText(value) {
  return value == null ? '' : String(value).trim();
}

function placeName(place) {
  if (typeof place === 'string') return place;
  return place?.name || place?.label || place?.title || 'Unnamed place';
}

function placeCategory(place) {
  if (!place || typeof place === 'string') return '';
  const value = place.category || place.type || place.anchor_type || '';
  return asText(value).replaceAll('_', ' ');
}

function placeArea(place) {
  if (!place || typeof place === 'string') return '';
  return asText(place.neighborhood || place.district || place.area || place.location || '');
}

function placeNote(place) {
  if (!place || typeof place === 'string') return '';
  return asText(place.relevance_note || place.note || place.description || place.summary || '');
}

function placeWebsite(place) {
  if (!place || typeof place === 'string') return '';
  return asText(place.website || place.url || place.link || '');
}

function placeInstagram(place) {
  if (!place || typeof place === 'string') return '';
  return asText(place.instagram || place.instagram_url || place.ig || '');
}

function placeImage(place) {
  if (!place || typeof place === 'string') return '';
  return asText(place.photo || place.image || place.image_url || place.photo_url || place.image_local || '');
}

function placeTags(place) {
  if (!place || typeof place === 'string') return [];
  const tags = place.tags || place.sensory_tags || place.social_tags || [];
  return Array.isArray(tags) ? tags.map(asText).filter(Boolean) : [];
}

function detailRow(label, value, escapeHtml) {
  if (!value) return '';
  return `<p><span>${escapeHtml(label)}</span>${escapeHtml(value)}</p>`;
}

export function renderPlaceCard(place, options = {}) {
  const escapeHtml = options.escapeHtml;
  const name = placeName(place);
  const category = placeCategory(place);
  const area = placeArea(place);
  const note = placeNote(place);
  const website = placeWebsite(place);
  const instagram = placeInstagram(place);
  const image = placeImage(place);
  const tags = placeTags(place);
  const hasDetails = Boolean(note || website || instagram || image || tags.length);

  const main = `
    <div class="v2-place-card-main">
      <strong>${escapeHtml(name)}</strong>
      <div class="v2-place-card-meta">
        ${category ? `<span>${escapeHtml(category)}</span>` : ''}
        ${area ? `<span>${escapeHtml(area)}</span>` : ''}
      </div>
    </div>
  `;

  if (!hasDetails) {
    return `
      <article class="v2-place-card v2-place-card--static">
        ${main}
      </article>
    `;
  }

  return `
    <details class="v2-place-card">
      <summary>
        ${main}
        <span class="v2-place-card-affordance">Details</span>
      </summary>

      <div class="v2-place-card-details">
        ${image ? `<img src="${escapeHtml(image)}" alt="" loading="lazy">` : ''}
        ${detailRow('Why it matters', note, escapeHtml)}
        ${(website || instagram) ? `
          <div class="v2-place-card-links">
            ${website ? `<a href="${escapeHtml(website)}" target="_blank" rel="noreferrer">Website</a>` : ''}
            ${instagram ? `<a href="${escapeHtml(instagram)}" target="_blank" rel="noreferrer">Instagram</a>` : ''}
          </div>
        ` : ''}
        ${tags.length ? `<div class="v2-place-card-tags">${tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}</div>` : ''}
      </div>
    </details>
  `;
}

export function renderPlaceCardGroup(title, places, options = {}) {
  const escapeHtml = options.escapeHtml;
  const items = Array.isArray(places) ? places.filter(Boolean) : [];

  if (!items.length) return '';

  return `
    <section class="v2-place-card-group">
      <div class="v2-section-kicker">Place anchors</div>
      <h3>${escapeHtml(title)}</h3>
      <div class="v2-place-card-grid">
        ${items.map(place => renderPlaceCard(place, { escapeHtml })).join('')}
      </div>
    </section>
  `;
}
