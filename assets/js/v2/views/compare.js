function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value.filter(Boolean) : [value];
}

function scoreCategory(school, key) {
  const values = asArray(school?.scores?.[key]?.subvariables)
    .map(item => item?.value)
    .filter(value => typeof value === 'number' && !Number.isNaN(value));

  if (!values.length) return null;
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 100);
}

function moduleScore(school, key) {
  const value = school?.system_modules?.[key]?.score;
  if (typeof value !== 'number' || Number.isNaN(value)) return null;
  return Math.round(value * 100);
}

function overallScore(school) {
  const direct = [school?.fit_score, school?.composite_score, school?.overall_score]
    .find(value => typeof value === 'number' && !Number.isNaN(value));

  if (typeof direct === 'number') {
    return direct <= 1 ? Math.round(direct * 100) : Math.round(direct > 100 ? direct / 10 : direct);
  }

  const values = Object.keys(school?.scores || {})
    .map(key => scoreCategory(school, key))
    .filter(value => typeof value === 'number');

  if (!values.length) return null;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function strongestSignals(school, limit = 3) {
  return Object.entries(school?.scores || {})
    .flatMap(([categoryKey, category]) => asArray(category?.subvariables).map(item => ({
      label: item?.label || item?.name || item?.title || categoryKey,
      value: typeof item?.value === 'number' ? Math.round(item.value * 100) : null,
      category: category?.label || categoryKey
    })))
    .filter(item => typeof item.value === 'number')
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

function weakestSignals(school, limit = 3) {
  return Object.entries(school?.scores || {})
    .flatMap(([categoryKey, category]) => asArray(category?.subvariables).map(item => ({
      label: item?.label || item?.name || item?.title || categoryKey,
      value: typeof item?.value === 'number' ? Math.round(item.value * 100) : null,
      category: category?.label || categoryKey
    })))
    .filter(item => typeof item.value === 'number')
    .sort((a, b) => a.value - b.value)
    .slice(0, limit);
}

function categoryRows(schools) {
  const keys = ['mentorship', 'documentary', 'teaching', 'funding', 'livability', 'politics', 'philosophy'];
  const labels = {
    mentorship: 'Mentorship',
    documentary: 'Documentary practice',
    teaching: 'Teaching future',
    funding: 'Financial sustainability',
    livability: 'Daily-life fit',
    politics: 'Legal / political climate',
    philosophy: 'Methodological alignment'
  };

  return keys.map(key => ({
    key,
    label: labels[key],
    values: schools.map(school => scoreCategory(school, key))
  }));
}

function curriculumRows(schools) {
  return [
    ['thesis_completion', 'Thesis survivability'],
    ['thesis_recovery', 'Recovery support'],
    ['creative_metabolism', 'Creative metabolism'],
    ['production_feasibility', 'Production feasibility'],
    ['theory_saturation', 'Theory saturation']
  ].map(([key, label]) => ({
    key,
    label,
    values: schools.map(school => moduleScore(school, key))
  }));
}

function formatValue(value) {
  return typeof value === 'number' ? String(value) : '—';
}

function renderSignalList(title, signals, escapeHtml) {
  return `
    <div class="v2-compare-signal-list">
      <span>${escapeHtml(title)}</span>
      ${signals.length ? signals.map(signal => `
        <p><strong>${escapeHtml(formatValue(signal.value))}</strong>${escapeHtml(signal.label)}</p>
      `).join('') : '<p>No signals recorded.</p>'}
    </div>
  `;
}

function renderMetricRow(row, schools, escapeHtml) {
  const values = row.values.filter(value => typeof value === 'number');
  const max = values.length ? Math.max(...values) : null;

  return `
    <div class="v2-compare-row">
      <div class="v2-compare-row-label">${escapeHtml(row.label)}</div>
      ${schools.map((school, index) => {
        const value = row.values[index];
        const isMax = typeof value === 'number' && value === max && values.length > 1;
        return `
          <div class="v2-compare-cell ${isMax ? 'is-strongest' : ''}">
            <strong>${escapeHtml(formatValue(value))}</strong>
            <span style="--v2-compare-meter:${typeof value === 'number' ? value : 0}%"></span>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderSchoolSummary(school, escapeHtml) {
  const city = school?.location?.city || '';
  const state = school?.location?.state || '';
  const location = [city, state].filter(Boolean).join(', ');
  const image = school?.visual_identity?.environment_image || school?.visual_identity?.photo_local || '';
  const accent = school?.brand_colors?.accent || '#9de7d7';
  const score = overallScore(school);

  return `
    <article class="v2-compare-school-card" style="--v2-school-accent:${escapeHtml(accent)}">
      ${image ? `<img src="${escapeHtml(image)}" alt="" loading="lazy">` : ''}
      <div class="v2-compare-school-overlay"></div>
      <div class="v2-compare-school-body">
        <span>${escapeHtml(location || 'Location not recorded')}</span>
        <h3>${escapeHtml(school.name)}</h3>
        <strong>${escapeHtml(formatValue(score))}</strong>
      </div>
    </article>
  `;
}

export function renderCompareView(schools, options = {}) {
  const escapeHtml = options.escapeHtml;
  const selectedSchools = asArray(schools).slice(0, 6);

  if (!selectedSchools.length) return '<p>No schools loaded.</p>';

  return `
    <div class="v2-compare-view">
      <section class="v2-compare-lede">
        <p class="v2-section-kicker">Decision matrix</p>
        <h2>Compare programs as environments, not rankings</h2>
        <p>Compare compresses the same evidence system into a cross-school read: fit signals, pressure points, curriculum behavior, and practical survivability.</p>
      </section>

      <section class="v2-compare-school-grid">
        ${selectedSchools.map(school => renderSchoolSummary(school, escapeHtml)).join('')}
      </section>

      <section class="v2-compare-table-card">
        <div class="v2-compare-section-head">
          <p class="v2-section-kicker">Core fit dimensions</p>
          <h3>Interpretive score comparison</h3>
        </div>
        <div class="v2-compare-table" style="--v2-compare-columns:${selectedSchools.length};">
          <div class="v2-compare-row v2-compare-header-row">
            <div></div>
            ${selectedSchools.map(school => `<div>${escapeHtml(school.name)}</div>`).join('')}
          </div>
          ${categoryRows(selectedSchools).map(row => renderMetricRow(row, selectedSchools, escapeHtml)).join('')}
        </div>
      </section>

      <section class="v2-compare-table-card">
        <div class="v2-compare-section-head">
          <p class="v2-section-kicker">Formation pressure</p>
          <h3>Curriculum and thesis behavior</h3>
        </div>
        <div class="v2-compare-table" style="--v2-compare-columns:${selectedSchools.length};">
          <div class="v2-compare-row v2-compare-header-row">
            <div></div>
            ${selectedSchools.map(school => `<div>${escapeHtml(school.name)}</div>`).join('')}
          </div>
          ${curriculumRows(selectedSchools).map(row => renderMetricRow(row, selectedSchools, escapeHtml)).join('')}
        </div>
      </section>

      <section class="v2-compare-signal-grid">
        ${selectedSchools.map(school => `
          <article class="v2-compare-signal-card">
            <p class="v2-section-kicker">${escapeHtml(school.name)}</p>
            ${renderSignalList('Strongest signals', strongestSignals(school), escapeHtml)}
            ${renderSignalList('Pressure points', weakestSignals(school), escapeHtml)}
          </article>
        `).join('')}
      </section>
    </div>
  `;
}
