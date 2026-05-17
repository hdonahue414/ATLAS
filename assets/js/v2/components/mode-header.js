function safeModeClass(mode) {
  return String(mode || 'default').replace(/[^a-z0-9_-]/gi, '').toLowerCase();
}

export function renderModeHeader(mode, school, options = {}) {
  const escapeHtml = options.escapeHtml;
  const className = safeModeClass(mode);
  const eyebrow = options.eyebrow || mode;
  const description = options.description || '';
  const image = options.image || school?.visual_identity?.photo_local || '';
  const title = options.title || school?.name || 'Untitled';
  const meta = options.meta || '';

  return `
    <header class="v2-mode-header v2-mode-header--${className}">
      ${image ? `<img src="${escapeHtml(image)}" alt="" loading="lazy">` : ''}
      <div class="v2-mode-header-content">
        <div class="v2-mode-eyebrow">${escapeHtml(eyebrow)}</div>
        <h2>${escapeHtml(title)}</h2>
        ${meta ? `<p class="v2-mode-meta">${escapeHtml(meta)}</p>` : ''}
        ${description ? `<p class="v2-mode-description">${escapeHtml(description)}</p>` : ''}
      </div>
    </header>
  `;
}
