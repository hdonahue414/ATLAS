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

const RESEARCH_CLUSTERS = {
  formation_support: {
    title: 'Formation Support',
    keys: ['mentorship', 'teaching'],
    frame: 'Advising, pedagogy, cohort structure, and the degree to which the program appears to hold a filmmaker through uncertainty rather than simply evaluate output.'
  },
  documentary_method: {
    title: 'Documentary Method',
    keys: ['documentary', 'philosophy'],
    frame: 'Evidence about the program’s nonfiction grammar: observational compatibility, ethical practice, methodology, theory pressure, and risk of aesthetic drift.'
  },
  material_conditions: {
    title: 'Material Conditions',
    keys: ['funding', 'livability', 'politics'],
    frame: 'The practical ecology around the work: money, housing, local infrastructure, legal climate, daily recovery, and background stress.'
  }
};

function categoryLabel(key, category) {
  const labels = {
    mentorship: 'Mentorship Structure',
    documentary: 'Documentary Practice',
    teaching: 'Teaching Formation',
    funding: 'Financial Sustainability',
    livability: 'Daily-Life Sustainability',
    politics: 'Legal / Political Climate',
    philosophy: 'Methodological Alignment'
  };

  return category?.label || labels[key] || titleCase(key);
}

function categoryFrame(key) {
  const frames = {
    mentorship: 'Relational support, accountability, feedback rhythm, and faculty visibility under pressure.',
    documentary: 'Compatibility with the filmmaker’s nonfiction practice rather than broad media drift.',
    teaching: 'Whether the curriculum plausibly converts documentary practice into future classroom and mentorship capacity.',
    funding: 'How much practical exposure remains after tuition, stipend, cost of living, and debt risk are combined.',
    livability: 'Whether the city can sustain repeatable daily rhythms, recovery, community access, and production life.',
    politics: 'How local/state conditions affect safety, stress, institutional friction, and long-term life fit.',
    philosophy: 'The program’s implied values: ethics, relation, theory, authorship, community, and artistic pressure.'
  };

  return frames[key] || 'Interpretive evidence grouped from the scoring model.';
}

function categoryClusterKey(categoryKey) {
  const found = Object.entries(RESEARCH_CLUSTERS).find(([, cluster]) => cluster.keys.includes(categoryKey));
  return found ? found[0] : 'additional_signals';
}

function synthesizeSubvariable(item, categoryKey, school) {
  const name = item.label || item.name || item.title || 'research signal';
  const score = toScore(item.value);
  const chips = evidenceChips(item.evidence);
  const evidencePhrase = chips.length ? chips.slice(0, 3).join(', ') : 'recorded evidence';
  const status = epistemicStatus(item);
  const categoryNoun = categoryLabel(categoryKey, school?.scores?.[categoryKey]).toLowerCase();

  const scorePhrase = score === null
    ? 'remains unresolved'
    : score >= 90
      ? 'forms a high-weight support signal'
      : score >= 78
        ? 'reads as a durable but contextual signal'
        : score >= 62
          ? 'is mixed and should be read conditionally'
          : 'functions as a pressure point rather than a strength';

  const confidencePhrase = status === 'corroborated'
    ? 'The current record gives this read relatively stable footing.'
    : status === 'supported inference'
      ? 'The read is supported, but still depends partly on interpretation rather than direct confirmation.'
      : status === 'pending'
        ? 'This should stay provisional until direct evidence is added.'
        : 'This remains a working interpretation rather than a settled finding.';

  return `${titleCase(name)} ${scorePhrase} inside ${categoryNoun}. The active evidence base points to ${evidencePhrase}. ${confidencePhrase}`;
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
      clusterKey: categoryClusterKey(key),
      title: categoryLabel(key, category),
      score: categoryAverage(category),
      notes: category?.notes || categoryFrame(key),
      frame: categoryFrame(key),
      signals
    };
  });
}

function collectResearchClusters(dossiers) {
  const clusters = Object.entries(RESEARCH_CLUSTERS).map(([key, config]) => {
    const children = dossiers.filter(dossier => dossier.clusterKey === key);
    const scores = children.map(child => child.score).filter(score => typeof score === 'number');
    return {
      key,
      title: config.title,
      frame: config.frame,
      score: scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : null,
      dossiers: children
    };
  }).filter(cluster => cluster.dossiers.length);

  const additional = dossiers.filter(dossier => dossier.clusterKey === 'additional_signals');
  if (additional.length) {
    clusters.push({
      key: 'additional_signals',
      title: 'Additional Signals',
      frame: 'Secondary or uncategorized evidence that still affects the research read.',
      score: null,
      dossiers: additional
    });
  }

  return clusters;
}

function topSummary(school, clusters) {
  const ranked = clusters
    .filter(item => typeof item.score === 'number')
    .sort((a, b) => b.score - a.score);
  const strongest = ranked.slice(0, 2).map(item => item.title.toLowerCase()).join(' and ');
  const weakest = ranked.slice(-1)[0]?.title?.toLowerCase();
  const contradictions = asArray(school?.contradictions).length;
  const unresolved = asArray(school?.source_trace?.unresolved).length;

  const firstSentence = strongest
    ? `${school.name} reads strongest through ${strongest}.`
    : `${school.name} has enough structured evidence for an interpretive dossier, but the signal hierarchy remains incomplete.`;

  const secondSentence = weakest
    ? `The conditional layer is ${weakest}; keep it open to revision.`
    : 'The weakest layer is not yet clearly separated from the evidence base.';

  const thirdSentence = contradictions || unresolved
    ? `${contradictions + unresolved} open tension${contradictions + unresolved === 1 ? '' : 's'} preserved.`
    : 'No major unresolved contradiction recorded.';

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
        <span class="v2-research-score-pill">${escapeHtml(score)}</span>
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
    <article class="v2-research-category-card">
      <div class="v2-research-category-head">
        <div>
          <span>${escapeHtml(dossier.title)}</span>
          <p>${escapeHtml(dossier.notes || dossier.frame)}</p>
        </div>
        <strong>${typeof dossier.score === 'number' ? escapeHtml(dossier.score) : '—'}</strong>
      </div>
      <div class="v2-research-signal-grid">
        ${dossier.signals.map(signal => renderSignalCard(signal, escapeHtml)).join('')}
      </div>
    </article>
  `;
}

function renderResearchCluster(cluster, escapeHtml) {
  return `
    <section class="v2-research-dossier-section">
      <div class="v2-research-section-head">
        <div>
          <p class="v2-section-kicker">Behavioral research cluster</p>
          <h3>${escapeHtml(cluster.title)}</h3>
          <p>${escapeHtml(cluster.frame)}</p>
        </div>
        <span class="v2-research-cluster-score">${typeof cluster.score === 'number' ? escapeHtml(cluster.score) : '—'}</span>
      </div>
      <div class="v2-research-category-stack">
        ${cluster.dossiers.map(dossier => renderCategoryDossier(dossier, escapeHtml)).join('')}
      </div>
    </section>
  `;
}

const TRACE_LABELS = {
  verified: 'Hard evidence',
  inferred: 'Interpretive read',
  speculative: 'Future-facing forecast',
  unresolved: 'Open file'
};

function renderTraceColumn(title, items, escapeHtml) {
  const normalized = asArray(items).map(readableResearchText).map(cleanEvidenceText).filter(Boolean);
  const label = TRACE_LABELS[title] || title;

  return `
    <article class="v2-research-trace-column" data-trace="${escapeHtml(title)}">
      <span>${escapeHtml(label)}</span>
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
        <p class="v2-section-kicker">Archive state</p>
        <h3>Evidence file</h3>
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

function testimonyType(item) {
  const text = `${item?.source_type || ''} ${item?.source || ''} ${item?.summary || ''}`.toLowerCase();
  if (text.includes('student') || text.includes('alum') || text.includes('alumni')) return 'student / alumni testimony';
  if (text.includes('press') || text.includes('article') || text.includes('news')) return 'external press';
  if (text.includes('institution') || text.includes('program') || text.includes('department')) return 'institutional claim';
  return item?.source_type || 'public signal';
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
          <article data-testimony-type="${escapeHtml(testimonyType(item))}">
            <span>${escapeHtml(testimonyType(item))}</span>
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
  const clusters = collectResearchClusters(dossiers);
  const sourceTrace = school.source_trace || {};

  return `
    <div class="v2-research-view v2-production-view">
      <section class="v2-compact-context">
        <div>
          <p class="v2-section-kicker">Research dossier</p>
          <h2>${escapeHtml(school.name)}</h2>
          <p>${escapeHtml(topSummary(school, clusters))}</p>
        </div>
        ${schoolPicker}
      </section>

      <div class="v2-research-board-grid">
        ${renderSourceTrace(sourceTrace, escapeHtml)}
        ${renderTensions(school, escapeHtml)}
        ${renderRelationshipSignals(school, escapeHtml)}
        ${renderPublicTestimony(school, escapeHtml)}
      </div>

      <div class="v2-research-dossier-stack">
        ${clusters.map(cluster => renderResearchCluster(cluster, escapeHtml)).join('')}
      </div>
    </div>
  `;
}
