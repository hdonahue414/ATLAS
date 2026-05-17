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

function renderTraceGroup(title, items, escapeHtml) {
  const normalized = asArray(items).map(readableResearchText).filter(Boolean);

  return renderSectionGroup(
    title,
    renderTextNotes(normalized, { escapeHtml }),
    { escapeHtml, kicker: 'Evidence trace' }
  );
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
  const content = evidenceItems.map(item => renderFieldNote(
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

  if (!school) {
    return '<p>No school loaded.</p>';
  }

  const sourceTrace = school.source_trace || {};

  return `
    <div class="v2-research-view">
      ${renderModeHeader('research', school, {
        escapeHtml,
        eyebrow: 'Research dossier',
        description: 'Evidence, uncertainty, relationship signals, and score-level provenance.'
      })}

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
