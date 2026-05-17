export function normalizeEvidence(evidence) {
  if (!evidence) return [];

  if (Array.isArray(evidence)) {
    return evidence.map(String).map(item => item.trim()).filter(Boolean);
  }

  if (typeof evidence === 'string' && evidence.trim()) {
    return [evidence.trim()];
  }

  return [];
}

export function renderEvidenceBlock(evidence, options = {}) {
  const items = normalizeEvidence(evidence);
  const label = options.label || 'Evidence';
  const escapeHtml = options.escapeHtml;

  if (!items.length) return '';

  return `
    <div class="v2-evidence-chip-block" aria-label="${escapeHtml(label)}">
      <span class="v2-evidence-chip-label">${escapeHtml(label)}</span>
      <div class="v2-evidence-chip-list">
        ${items.map(item => `<span class="v2-evidence-chip">${escapeHtml(item)}</span>`).join('')}
      </div>
    </div>
  `;
}
