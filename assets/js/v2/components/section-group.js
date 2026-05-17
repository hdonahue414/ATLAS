export function renderSectionGroup(title, content, options = {}) {
  const escapeHtml = options.escapeHtml;
  const kicker = options.kicker || 'Field notes';
  const modifier = options.modifier ? ` ${options.modifier}` : '';

  if (!content) return '';

  return `
    <section class="v2-section-group${modifier}">
      <div class="v2-section-kicker">${escapeHtml(kicker)}</div>
      <h3>${escapeHtml(title)}</h3>
      <div class="v2-section-content">
        ${content}
      </div>
    </section>
  `;
}

export function renderFieldNote(title, body, options = {}) {
  const escapeHtml = options.escapeHtml;
  const meta = options.meta || '';

  if (!title && !body) return '';

  return `
    <article class="v2-field-note">
      ${title ? `<strong>${escapeHtml(title)}</strong>` : ''}
      ${meta ? `<span>${escapeHtml(meta)}</span>` : ''}
      ${body ? `<p>${escapeHtml(body)}</p>` : ''}
    </article>
  `;
}

export function renderTextNotes(items, options = {}) {
  const escapeHtml = options.escapeHtml;
  const normalized = Array.isArray(items) ? items.filter(Boolean) : (items ? [items] : []);

  return normalized
    .map(item => `<p class="v2-text-note">${escapeHtml(String(item))}</p>`)
    .join('');
}
