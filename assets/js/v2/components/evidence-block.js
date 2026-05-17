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

  if (!items.length) return '';

  return `
    <details class="v2-evidence-block">
      <summary>${label}</summary>
      <div class="v2-evidence-list">
        ${items.map(item => `<p>${options.escapeHtml(item)}</p>`).join('')}
      </div>
    </details>
  `;
}
