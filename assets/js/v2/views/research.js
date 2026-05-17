import { renderEvidenceBlock } from '../components/evidence-block.js';
import { renderFieldNote, renderSectionGroup, renderTextNotes } from '../components/section-group.js';
import { renderModeHeader } from '../components/mode-header.js';

function asArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return [value];
}

function readableResearchText(item) {
  if (!item) return '';
  if (typeof item === 'string') return item;

  if (typeof item === 'object') {
    if (item.signal_a || item.signal_b || item.interpretation) {
      return [
        item.signal_a && `Signal A: ${item.signal_a}`,
        item.signal_b && `Signal B: ${item.signal_b}`,
        item.interpretation && `Interpretation: ${item.interpretation}`,
        typeof item.severity === 'number' && `Severity: ${Math.round(item.severity * 100)}%`
      ].filter(Boolean).join(' / ');
    }

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
      item.outcome_pattern
    ].filter(Boolean).join(' / ');
  }

  return String(item);
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

function renderScoreEvidenceSummary(school, escapeHtml) {
  const evidenceItems = collectScoreEvidence(school);
  const content = evidenceItems.slice(0, 12).map(item => renderFieldNote(
    item.label,
    readableResearchText(item.evidence),
    { escapeHtml, meta: item.categoryKey }
  )).join('');

  return renderSectionGroup('Score evidence', content, {
    escapeHtml,
    kicker: 'Score provenance'
  });
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
      ${renderModeHeader('research', school, {
        escapeHtml,
        eyebrow: 'Research dossier',
        description: 'Evidence, uncertainty, relationship signals, and score-level provenance.',
        schoolPicker
      })}

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
