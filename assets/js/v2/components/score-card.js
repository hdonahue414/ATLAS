import { renderEvidenceBlock } from './evidence-block.js';

function formatPercent(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '—';
  return `${Math.round(value * 100)}%`;
}

function subvariableLabel(subvariable) {
  return subvariable?.label || subvariable?.name || subvariable?.title || 'Unnamed subvariable';
}

export function renderScoreCategory(categoryKey, category, options = {}) {
  const escapeHtml = options.escapeHtml;
  const title = options.title || category?.label || categoryKey;
  const subvariables = Array.isArray(category?.subvariables) ? category.subvariables : [];

  if (!category || !subvariables.length) return '';

  return `
    <article class="v2-score-card">
      <header class="v2-score-card-header">
        <div>
          <div class="v2-muted">Score category</div>
          <h3>${escapeHtml(title)}</h3>
        </div>
      </header>

      ${category.notes ? `
        <p class="v2-score-note">${escapeHtml(category.notes)}</p>
      ` : ''}

      <div class="v2-subvariable-list">
        ${subvariables.map(subvariable => `
          <section class="v2-subvariable">
            <div class="v2-subvariable-main">
              <div>
                <h4>${escapeHtml(subvariableLabel(subvariable))}</h4>
                ${subvariable.pending ? '<span class="v2-pending">pending</span>' : ''}
              </div>
              <div class="v2-subvariable-values">
                <strong>${formatPercent(subvariable.value)}</strong>
                <span>${formatPercent(subvariable.confidence)} confidence</span>
              </div>
            </div>
            <div class="v2-bar" aria-hidden="true">
              <span style="width:${Math.max(0, Math.min(100, Math.round((subvariable.value || 0) * 100)))}%"></span>
            </div>
            ${renderEvidenceBlock(subvariable.evidence, {
              label: 'Evidence',
              escapeHtml
            })}
          </section>
        `).join('')}
      </div>
    </article>
  `;
}
