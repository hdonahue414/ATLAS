import { renderEvidenceBlock } from '../components/evidence-block.js';
import { renderHeroCard } from '../components/hero-card.js';
import { renderFieldNote, renderSectionGroup, renderTextNotes } from '../components/section-group.js';

function asArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return [value];
}

function readableResearchText(item) {
  if (!item) return '';
  if (typeof item === 'string') return item;

  if (typeof item === 'object') {
    return [
      item.summary,
      item.notes,
      item.note,
      item.finding,
      item.description,
      item.text,
      item.claim,
      item.question,
      item.tension,
      item.outcome_pattern,
      item.interpretation
    ].filter(Boolean).join(' / ');
  }

  return String(item);
}

function percent(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '';
  return `${Math.round(value * 100)}%`;
}

function confidenceLabel(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '';
  if (value >= 0.85) return 'high confidence';
  if (value >= 0.65) return 'moderate confidence';
  return 'tentative read';
}

function collectScoreEvidence(school) {
  const scores = school?.scores || {};
  const items = [];

  Object.entries(scores).forEach(([categoryKey, category]) => {
    asArray(category?.subvariables).forEach(subvariable => {
      const evidence = asArray(subvariable?.evidence).map(readableResearchText).filter(Boolean);

      if (!evidence.length) return;

      items.push({
        categoryKey,
        label: subvariable?.label || subvariable?.name || subvariable?.title || 'Subvariable',
        value: subvariable?.value,
        confidence: subvariable?.confidence,
        pending: Boolean(subvariable?.pending),
        evidence
      });
    });
  });

  return items;
}

function renderTraceColumn(title, items, escapeHtml) {
  const normalized = asArray(items).map(readableResearchText).filter(Boolean);

  return `
    <article class="v2-trace-column">
      <span>${escapeHtml(title)}</span>
      <div class="v2-trace-pills">
        ${normalized.length ? normalized.map(item => `<p>${escapeHtml(item)}</p>`).join('') : '<p class="v2-empty-note">No entries recorded.</p>'}
      </div>
    </article>
  `;
}

function renderSourceTrace(sourceTrace, escapeHtml) {
  return `
    <section class="v2-production-card v2-source-trace-card">
      <h3>Source trace</h3>
      <div class="v2-trace-grid">
        ${renderTraceColumn('verified', sourceTrace.verified, escapeHtml)}
        ${renderTraceColumn('inferred', sourceTrace.inferred, escapeHtml)}
        ${renderTraceColumn('speculative', sourceTrace.speculative, escapeHtml)}
        ${renderTraceColumn('unresolved', sourceTrace.unresolved, escapeHtml)}
      </div>
    </section>
  `;
}

function renderRelationshipTracker(school, escapeHtml) {
  const records = asArray(school?.relationship_tracker);
  const content = records.map(record => renderFieldNote(
    record.person || 'Unknown contact',
    [record.tone, record.residue].filter(Boolean).join(' / '),
    { escapeHtml, meta: record.role || '' }
  )).join('');

  return renderSectionGroup('Relationship signals', content, {
    escapeHtml,
    kicker: 'Direct contact'
  });
}

function renderScoreEvidenceCard(item, escapeHtml) {
  const score = percent(item.value);
  const confidence = confidenceLabel(item.confidence);
  const primaryEvidence = item.evidence[0] || '';
  const extraEvidence = item.evidence.slice(1);

  return `
    <article class="v2-provenance-card">
      <div class="v2-provenance-card-topline">
        <span>${escapeHtml(item.categoryKey)}</span>
        ${score ? `<strong>${escapeHtml(score)}</strong>` : ''}
      </div>
      <h4>${escapeHtml(item.label)}</h4>
      <p>${escapeHtml(primaryEvidence)}</p>
      <div class="v2-provenance-meta">
        ${confidence ? `<span>${escapeHtml(confidence)}</span>` : ''}
        ${item.pending ? '<span>pending</span>' : ''}
      </div>
      ${extraEvidence.length ? `
        <details class="v2-provenance-more">
          <summary>More evidence</summary>
          <div>
            ${extraEvidence.map(evidence => `<p>${escapeHtml(evidence)}</p>`).join('')}
          </div>
        </details>
      ` : ''}
    </article>
  `;
}

function renderScoreEvidenceSummary(school, escapeHtml) {
  const evidenceItems = collectScoreEvidence(school).slice(0, 16);

  return `
    <section class="v2-score-provenance">
      <div class="v2-section-kicker">Score provenance</div>
      <div class="v2-score-provenance-header">
        <h3>Score evidence</h3>
        <p>Subvariable evidence compressed into readable support cards.</p>
      </div>
      <div class="v2-provenance-grid">
        ${evidenceItems.map(item => renderScoreEvidenceCard(item, escapeHtml)).join('')}
      </div>
    </section>
  `;
}

export function renderResearchView(school, options = {}) {
  const escapeHtml = options.escapeHtml;
  const schoolPicker = options.schoolPicker || '';

  if (!school) {
    return '<p>No school loaded.</p>';
  }

  const sourceTrace = school.source_trace || {};

  return `
    <div class="v2-research-view v2-production-view">
      ${renderHeroCard(school, { escapeHtml, schoolPicker })}

      <div class="v2-production-stack">
        ${renderSourceTrace(sourceTrace, escapeHtml)}

        <div class="v2-production-two-up">
          <section class="v2-production-card">
            ${renderSectionGroup('Contradictions / tensions', renderTextNotes(asArray(school.contradictions).map(readableResearchText), { escapeHtml }), { escapeHtml, kicker: 'Adversarial read' })}
          </section>

          <section class="v2-production-card">
            ${renderRelationshipTracker(school, escapeHtml)}
          </section>
        </div>

        <section class="v2-production-card">
          ${renderScoreEvidenceSummary(school, escapeHtml)}
        </section>

        <section class="v2-production-card">
          ${renderEvidenceBlock(school.public_testimony?.map(item => item.summary), {
            label: 'Public testimony summaries',
            escapeHtml
          })}
        </section>
      </div>
    </div>
  `;
}
