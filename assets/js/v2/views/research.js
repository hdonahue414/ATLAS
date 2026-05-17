import { renderEvidenceBlock } from '../components/evidence-block.js';

function asArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return [value];
}

function collectScoreEvidence(school) {
  const scores = school?.scores || {};
  const items = [];

  Object.entries(scores).forEach(([categoryKey, category]) => {
    asArray(category?.subvariables).forEach(subvariable => {
      asArray(subvariable?.evidence).forEach(evidence => {
        items.push({
          categoryKey,
          label: subvariable?.label || subvariable?.name || subvariable?.title || 'Subvariable',
          evidence
        });
      });
    });
  });

  return items;
}

function renderTraceGroup(title, items, escapeHtml) {
  const normalized = asArray(items);

  if (!normalized.length) return '';

  return `
    <section class="v2-research-group">
      <h3>${escapeHtml(title)}</h3>
      <div class="v2-research-list">
        ${normalized.map(item => `<p>${escapeHtml(typeof item === 'string' ? item : JSON.stringify(item))}</p>`).join('')}
      </div>
    </section>
  `;
}

function renderRelationshipTracker(school, escapeHtml) {
  const records = asArray(school?.relationship_tracker);

  if (!records.length) return '';

  return `
    <section class="v2-research-group">
      <h3>Relationship signals</h3>
      <div class="v2-research-list">
        ${records.map(record => `
          <article class="v2-research-item">
            <strong>${escapeHtml(record.person || 'Unknown contact')}</strong>
            <span>${escapeHtml(record.role || '')}</span>
            <p>${escapeHtml([record.tone, record.residue].filter(Boolean).join(' / '))}</p>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderScoreEvidenceSummary(school, escapeHtml) {
  const evidenceItems = collectScoreEvidence(school);

  if (!evidenceItems.length) return '';

  return `
    <section class="v2-research-group">
      <h3>Score evidence</h3>
      <div class="v2-research-list">
        ${evidenceItems.map(item => `
          <article class="v2-research-item">
            <strong>${escapeHtml(item.label)}</strong>
            <span>${escapeHtml(item.categoryKey)}</span>
            <p>${escapeHtml(item.evidence)}</p>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

export function renderResearchView(school, options = {}) {
  const escapeHtml = options.escapeHtml;

  if (!school) {
    return '<p>No school loaded.</p>';
  }

  const sourceTrace = school.source_trace || {};

  return `
    <div class="v2-research-view">
      <header class="v2-research-header">
        <div class="v2-muted">Research dossier</div>
        <h2>${escapeHtml(school.name)}</h2>
        <p class="v2-muted">
          Evidence, uncertainty, relationship signals, and score-level provenance.
        </p>
      </header>

      <div class="v2-research-stack">
        ${renderTraceGroup('Verified traces', sourceTrace.verified, escapeHtml)}
        ${renderTraceGroup('Inferred reads', sourceTrace.inferred, escapeHtml)}
        ${renderTraceGroup('Speculative threads', sourceTrace.speculative, escapeHtml)}
        ${renderTraceGroup('Unresolved questions', sourceTrace.unresolved, escapeHtml)}
        ${renderTraceGroup('Contradictions / tensions', school.contradictions, escapeHtml)}
        ${renderRelationshipTracker(school, escapeHtml)}
        ${renderScoreEvidenceSummary(school, escapeHtml)}
        ${renderEvidenceBlock(school.public_testimony?.map(item => item.summary), {
          label: 'Public testimony summaries',
          escapeHtml
        })}
      </div>
    </div>
  `;
}
