import { renderEvidenceBlock } from './evidence-block.js';

function formatPercent(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return null;
  return `${Math.round(value * 100)}%`;
}

function subvariableLabel(subvariable) {
  return subvariable?.label || subvariable?.name || subvariable?.title || 'Unnamed subvariable';
}

function confidenceLabel(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return null;

  if (value >= 0.85) return 'high';
  if (value >= 0.65) return 'moderate';
  return 'tentative';
}

function average(values) {
  const valid = values.filter(value => typeof value === 'number' && !Number.isNaN(value));
  if (!valid.length) return null;
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

function categorySummary(subvariables) {
  const score = average(subvariables.map(subvariable => subvariable.value));
  const confidence = average(subvariables.map(subvariable => subvariable.confidence));
  const pendingCount = subvariables.filter(subvariable => subvariable.pending).length;

  return {
    score,
    confidence,
    pendingCount,
    scoreLabel: formatPercent(score),
    confidenceLabel: confidenceLabel(confidence),
    meter: score == null ? 0 : Math.max(0, Math.min(100, Math.round(score * 100)))
  };
}

function normalizeEvidence(evidence) {
  if (!evidence) return [];
  if (Array.isArray(evidence)) return evidence.map(String).map(item => item.trim()).filter(Boolean);
  if (typeof evidence === 'string' && evidence.trim()) return [evidence.trim()];
  return [];
}

function renderEvidencePreview(evidence, escapeHtml) {
  const first = normalizeEvidence(evidence)[0];
  if (!first) return '';

  return `
    <p class="v2-subvariable-evidence-preview">
      ${escapeHtml(first)}
    </p>
  `;
}

export function renderScoreCategory(categoryKey, category, options = {}) {
  const escapeHtml = options.escapeHtml;
  const title = options.title || category?.label || categoryKey;
  const subvariables = Array.isArray(category?.subvariables) ? category.subvariables : [];

  if (!category || !subvariables.length) return '';

  const summary = categorySummary(subvariables);

  return `
    <article class="v2-score-card">
      <header class="v2-score-card-header">
        <div class="v2-score-card-heading">
          <div class="v2-score-kicker">Interpretive layer</div>
          <h3>${escapeHtml(title)}</h3>
          ${category.notes ? `<p class="v2-score-note">${escapeHtml(category.notes)}</p>` : ''}
        </div>

        <aside class="v2-score-radar" aria-label="Category summary">
          <div class="v2-score-ring" style="--v2-ring:${summary.meter}%">
            <span>${summary.scoreLabel ? escapeHtml(summary.scoreLabel) : '—'}</span>
          </div>
          <div class="v2-score-radar-meta">
            ${summary.confidenceLabel ? `<span>${escapeHtml(summary.confidenceLabel)} confidence</span>` : ''}
            <span>${subvariables.length} signals</span>
            ${summary.pendingCount ? `<span>${summary.pendingCount} pending</span>` : ''}
          </div>
        </aside>
      </header>

      <div class="v2-subvariable-list">
        ${subvariables.map(subvariable => {
          const value = formatPercent(subvariable.value);
          const confidence = confidenceLabel(subvariable.confidence);
          const meter = Math.max(0, Math.min(100, Math.round((subvariable.value || 0) * 100)));

          return `
            <section class="v2-subvariable">
              <div class="v2-subvariable-main">
                <div class="v2-subvariable-copy">
                  <h4>${escapeHtml(subvariableLabel(subvariable))}</h4>
                  <div class="v2-subvariable-meta">
                    ${value ? `<span>${escapeHtml(value)}</span>` : ''}
                    ${confidence ? `<span>${escapeHtml(confidence)}</span>` : ''}
                    ${subvariable.pending ? '<span class="v2-pending">pending</span>' : ''}
                  </div>
                  ${renderEvidencePreview(subvariable.evidence, escapeHtml)}
                </div>
                <div class="v2-mini-meter" aria-hidden="true">
                  <span style="--v2-meter:${meter}%"></span>
                </div>
              </div>

              ${renderEvidenceBlock(subvariable.evidence, {
                label: 'More field notes',
                escapeHtml
              })}
            </section>
          `;
        }).join('')}
      </div>
    </article>
  `;
}
