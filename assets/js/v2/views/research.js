import { renderHeroCard } from '../components/hero-card.js';

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

function toScore(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return null;
  if (value <= 1) return Math.round(value * 100);
  if (value <= 100) return Math.round(value);
  return Math.round(value / 10);
}

function categoryAverage(category) {
  const values = asArray(category?.subvariables)
    .map(item => toScore(item?.value))
    .filter(value => typeof value === 'number' && !Number.isNaN(value));

  if (!values.length) return null;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function confidenceLabel(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'limited evidence';
  if (value >= 0.85) return 'high confidence';
  if (value >= 0.65) return 'moderate confidence';
  return 'tentative read';
}

function epistemicStatus(item) {
  if (item.pending) return 'pending';
  if (typeof item.confidence === 'number' && item.confidence >= 0.85) return 'corroborated';
  if (typeof item.confidence === 'number' && item.confidence >= 0.65) return 'supported inference';
  return 'working read';
}

function cleanEvidenceText(text) {
  return String(text || '')
    .replace(/\s*;\s*/g, ' / ')
    .replace(/\s+/g, ' ')
    .trim();
}

function evidenceChips(evidence) {
  return asArray(evidence)
    .map(readableResearchText)
    .map(cleanEvidenceText)
    .filter(Boolean)
    .flatMap(item => item.split(' / ').map(part => part.trim()).filter(Boolean))
    .filter((item, index, array) => array.indexOf(item) === index);
}

function titleCase(text) {
  return String(text || '')
    .replace(/[_/]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, letter => letter.toUpperCase());
}

function categoryLabel(key, category) {
  const labels = {
    mentorship: 'Mentorship & Structure',
    documentary: 'Documentary Practice',
    teaching: 'Teaching & Academic Formation',
    funding: 'Financial Sustainability',
    livability: 'Environmental Fit',
    politics: 'Political / Legal Context',
    philosophy: 'Philosophical Alignment'
  };

  return category?.label || labels[key] || titleCase(key);
}

function categoryFrame(key) {
  const frames = {
    mentorship: 'How reliably the program appears to hold students through uncertainty, thesis pressure, feedback cycles, and relational development.',
    documentary: 'How strongly the program infrastructure supports the user’s documentary practice rather than pulling it into adjacent but less compatible forms.',
    teaching: 'How clearly the program helps translate the MFA into future academic, classroom, and mentoring practice.',
    funding: 'How much material risk remains after tuition, stipend, cost of living, and debt exposure are considered together.',
    livability: 'How the local environment may support routine, recovery, community access, and ordinary-week sustainability.',
    politics: 'How legal, institutional, and local conditions shape risk, protection, and background stress.',
    philosophy: 'How well the program’s implied values align with relational, ethical, human-centered nonfiction practice.'
  };

  return frames[key] || 'Interpretive evidence grouped from the scoring model.';
}

function synthesizeSubvariable(item, categoryKey, school) {
  const name = item.label || item.name || item.title || 'research signal';
  const score = toScore(item.value);
  const chips = evidenceChips(item.evidence);
  const evidencePhrase = chips.length ? chips.slice(0, 3).join(', ') : 'recorded evidence';
  const status = epistemicStatus(item);
  const categoryNoun = categoryLabel(categoryKey, school?.scores?.[categoryKey]).toLowerCase();

  const scorePhrase = score === null
    ? 'is currently unresolved'
    : score >= 90
      ? 'is one of the strongest signals in this dossier'
      : score >= 78
        ? 'reads as a strong but still contextual signal'
        : score >= 62
          ? 'reads as a mixed or conditional signal'
          : 'marks a vulnerability or unresolved pressure point';

  const confidencePhrase = status === 'corroborated'
    ? 'The evidence is relatively stable across the current record.'
    : status === 'supported inference'
      ? 'The reading is supported, but still partly inferential.'
      : status === 'pending'
        ? 'The score should remain provisional until more direct evidence is added.'
        : 'This remains a working interpretation rather than a settled finding.';

  return `${titleCase(name)} ${scorePhrase} for ${categoryNoun}. The current basis is ${evidencePhrase}. ${confidencePhrase}`;
}

function collectCategoryDossiers(school) {
  const scores = school?.scores || {};

  return Object.entries(scores).map(([key, category]) => {
    const signals = asArray(category?.subvariables).map(subvariable => ({
      categoryKey: key,
      label: subvariable?.label || subvariable?.name || subvariable?.title || 'Research signal',
      score: toScore(subvariable?.value),
      confidence: subvariable?.confidence,
      pending: Boolean(subvariable?.pending),
      status: epistemicStatus(subvariable || {}),
      evidence: evidenceChips(subvariable?.evidence),
      synthesis: synthesizeSubvariable(subvariable || {}, key, school)
    }));

    return {
      key,
      title: categoryLabel(key, category),
      score: categoryAverage(category),
      notes: category?.notes || categoryFrame(key),
      frame: categoryFrame(key),
      signals
    };
  });
}

function topSummary(school, dossiers) {
  const top = dossiers
    .filter(item => typeof item.score === 'number')
    .sort((a, b) => b.score - a.score);
  const strongest = top.slice(0, 2).map(item => item.title.toLowerCase()).join(' and ');
  const weakest = top.slice(-1)[0]?.title?.toLowerCase();
  const contradictions = asArray(school?.contradictions).length;
  const unresolved = asArray(school?.source_trace?.unresolved).length;

  const firstSentence = strongest
    ? `${school.name} currently presents its strongest research signals around ${strongest}.`
    : `${school.name} has enough structured evidence to support an interpretive dossier, but the signal hierarchy remains incomplete.`;

  const secondSentence = weakest
    ? `The most fragile or conditional layer is ${weakest}, where evidence should be treated as context-dependent rather than settled.`
    : 'The weakest layer is not yet clearly separated from the rest of the evidence base.';

  const thirdSentence = contradictions || unresolved
    ? `The page preserves ${contradictions + unresolved} open tension${contradictions + unresolved === 1 ? '' : 's'} rather than flattening them into the score.`
    : 'No major unresolved contradiction is currently recorded, though absence of contradiction should not be treated as proof of completeness.';

  return `${firstSentence} ${secondSentence} ${thirdSentence}`;
}

function renderEvidenceChips(items, escapeHtml) {
  const chips = asArray(items).filter(Boolean);

  if (!chips.length) {
    return '<span class="v2-research-chip v2-research-chip--empty">no source tags recorded</span>';
  }

  return chips.map(item => `<span class="v2-research-chip">${escapeHtml(item)}</span>`).join('');
}

function renderSignalCard(signal, escapeHtml) {
  const score = typeof signal.score === 'number' ? signal.score : '—';
  const confidence = confidenceLabel(signal.confidence);

  return `
    <article class="v2-research-signal-card" data-status="${escapeHtml(signal.status)}">
      <div class="v2-research-signal-head">
        <div>
          <span class="v2-research-status">${escapeHtml(signal.status)}</span>
          <h4>${escapeHtml(titleCase(signal.label))}</h4>
        </div>
        <strong class="v2-research-score">${escapeHtml(score)}</strong>
      </div>

      <p>${escapeHtml(signal.synthesis)}</p>

      <div class="v2-research-card-footer">
        <span class="v2-research-confidence">${escapeHtml(confidence)}</span>
        ${signal.pending ? '<span class="v2-research-pending">pending</span>' : ''}
      </div>

      <div class="v2-research-chip-row">
        ${renderEvidenceChips(signal.evidence, escapeHtml)}
      </div>
    </article>
  `;
}

function renderCategoryDossier(dossier, escapeHtml) {
  return `
    <section class="v2-research-dossier-section">
      <div class="v2-research-section-head">
        <div>
          <p class="v2-section-kicker">Research cluster</p>
          <h3>${escapeHtml(dossier.title)}</h3>
          <p>${escapeHtml(dossier.notes || dossier.frame)}</p>
        </div>
        <strong>${typeof dossier.score === 'number' ? escapeHtml(dossier.score) : '—'}</strong>
      </div>

      <div class="v2-research-signal-grid">
        ${dossier.signals.map(signal => renderSignalCard(signal, escapeHtml)).join('')}
      </div>
    </section>
  `;
}

function renderTraceColumn(title, items, escapeHtml) {
  const normalized = asArray(items).map(readableResearchText).map(cleanEvidenceText).filter(Boolean);

  return `
    <article class="v2-research-trace-column">
      <span>${escapeHtml(title)}</span>
      <div>
        ${normalized.length ? normalized.map(item => `<p>${escapeHtml(item)}</p>`).join('') : '<p class="v2-empty-note">No entries recorded.</p>'}
      </div>
    </article>
  `;
}

function renderSourceTrace(sourceTrace, escapeHtml) {
  return `
    <section class="v2-research-source-board">
      <div class="v2-research-board-head">
        <p class="v2-section-kicker">Evidence state</p>
        <h3>Source trace</h3>
      </div>
      <div class="v2-research-trace-grid">
        ${renderTraceColumn('verified', sourceTrace.verified, escapeHtml)}
        ${renderTraceColumn('inferred', sourceTrace.inferred, escapeHtml)}
        ${renderTraceColumn('speculative', sourceTrace.speculative, escapeHtml)}
        ${renderTraceColumn('unresolved', sourceTrace.unresolved, escapeHtml)}
      </div>
    </section>
  `;
}

function renderTensions(school, escapeHtml) {
  const contradictions = asArray(school?.contradictions);
  const unresolved = asArray(school?.source_trace?.unresolved);
  const items = [
    ...contradictions.map(item => ({
      title: [item.signal_a, item.signal_b].filter(Boolean).join(' ↔ ') || 'Recorded tension',
      body: item.interpretation || readableResearchText(item),
      status: 'contradiction'
    })),
    ...unresolved.map(item => ({
      title: 'Unresolved question',
      body: readableResearchText(item),
      status: 'open question'
    }))
  ];

  return `
    <section class="v2-research-tension-board">
      <div class="v2-research-board-head">
        <p class="v2-section-kicker">Adversarial read</p>
        <h3>Contradictions and open questions</h3>
      </div>
      <div class="v2-research-tension-grid">
        ${items.length ? items.map(item => `
          <article>
            <span>${escapeHtml(item.status)}</span>
            <h4>${escapeHtml(item.title)}</h4>
            <p>${escapeHtml(item.body)}</p>
          </article>
        `).join('') : `
          <article>
            <span>no major contradiction recorded</span>
            <h4>Evidence still needs pressure testing</h4>
            <p>No explicit contradiction is recorded for this program, but missing contradiction data should not be mistaken for institutional certainty.</p>
          </article>
        `}
      </div>
    </section>
  `;
}

function renderRelationshipSignals(school, escapeHtml) {
  const records = asArray(school?.relationship_tracker);

  return `
    <section class="v2-research-relationship-board">
      <div class="v2-research-board-head">
        <p class="v2-section-kicker">Direct contact</p>
        <h3>Relationship signals</h3>
      </div>
      <div class="v2-research-relationship-grid">
        ${records.length ? records.map(record => `
          <article>
            <div>
              <h4>${escapeHtml(record.person || 'Unknown contact')}</h4>
              <span>${escapeHtml(record.role || 'contact')}</span>
            </div>
            <p>${escapeHtml([record.tone, record.residue].filter(Boolean).join(' / ') || 'No relationship note recorded.')}</p>
          </article>
        `).join('') : `
          <article>
            <div>
              <h4>No direct contact recorded</h4>
              <span>missing layer</span>
            </div>
            <p>This dossier currently lacks relationship-tracker evidence for the selected school.</p>
          </article>
        `}
      </div>
    </section>
  `;
}

function renderPublicTestimony(school, escapeHtml) {
  const testimony = asArray(school?.public_testimony);

  return `
    <section class="v2-research-testimony-board">
      <div class="v2-research-board-head">
        <p class="v2-section-kicker">Public testimony</p>
        <h3>External signal layer</h3>
      </div>
      <div class="v2-research-testimony-list">
        ${testimony.length ? testimony.map(item => `
          <article>
            <span>${escapeHtml(item.source_type || 'source')}</span>
            <p>${escapeHtml(item.summary || readableResearchText(item))}</p>
            <div class="v2-research-chip-row">
              ${renderEvidenceChips(item.implications || [], escapeHtml)}
            </div>
          </article>
        `).join('') : '<p class="v2-empty-note">No public testimony summaries recorded.</p>'}
      </div>
    </section>
  `;
}

export function renderResearchView(school, options = {}) {
  const escapeHtml = options.escapeHtml;
  const schoolPicker = options.schoolPicker || '';

  if (!school) return '<p>No school loaded.</p>';

  const dossiers = collectCategoryDossiers(school);
  const sourceTrace = school.source_trace || {};

  return `
    <div class="v2-research-view v2-production-view">
      ${renderHeroCard(school, { escapeHtml, schoolPicker })}

      <section class="v2-research-intel-summary">
        <div>
          <p class="v2-section-kicker">Research dossier</p>
          <h2>Evidence interpreted as institutional behavior</h2>
          <p>${escapeHtml(topSummary(school, dossiers))}</p>
        </div>
      </section>

      <div class="v2-research-board-grid">
        ${renderSourceTrace(sourceTrace, escapeHtml)}
        ${renderTensions(school, escapeHtml)}
        ${renderRelationshipSignals(school, escapeHtml)}
        ${renderPublicTestimony(school, escapeHtml)}
      </div>

      <div class="v2-research-dossier-stack">
        ${dossiers.map(dossier => renderCategoryDossier(dossier, escapeHtml)).join('')}
      </div>
    </div>
  `;
}
