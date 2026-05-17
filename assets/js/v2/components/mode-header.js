function safeModeClass(mode) {
  return String(mode || 'default').replace(/[^a-z0-9_-]/gi, '').toLowerCase();
}

function cssUrl(value) {
  return String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

export function renderModeHeader(mode, school, options = {}) {
  const escapeHtml = options.escapeHtml;
  const className = safeModeClass(mode);
  const eyebrow = options.eyebrow || mode;
  const description = options.description || '';
  const image = options.image || school?.visual_identity?.photo_local || school?.image || school?.photo || '';
  const title = options.title || school?.name || 'Untitled';
  const meta = options.meta || '';
  const imageStyle = image ? ` style="--v2-mode-image: url(&quot;${cssUrl(image)}&quot;)"` : '';

  return `
    <header class="v2-mode-header v2-mode-header--${className}${image ? ' has-image' : ''}"${imageStyle}>
      <div class="v2-mode-header-content">
        <div class="v2-mode-eyebrow">${escapeHtml(eyebrow)}</div>
        <h2>${escapeHtml(title)}</h2>
        ${meta ? `<p class="v2-mode-meta">${escapeHtml(meta)}</p>` : ''}
        ${description ? `<p class="v2-mode-description">${escapeHtml(description)}</p>` : ''}
      </div>
    </header>
  `;
}
