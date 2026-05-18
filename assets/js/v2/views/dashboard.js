function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value.filter(Boolean) : [value];
}

function anchorName(anchor) {
  if (typeof anchor === 'string') return anchor;
  return anchor?.name || anchor?.label || anchor?.title || '';
}

function collectDashboardAnchors(school) {
  const cityLife = school?.city_life || {};
  const locationIntel = school?.location_intelligence || {};

  return [
    ...asArray(cityLife.environmental_anchors),
    ...asArray(cityLife.neighborhoods),
    ...asArray(cityLife.third_places),
    ...asArray(cityLife.points_of_interest),
    ...asArray(locationIntel.points_of_interest),
    ...asArray(locationIntel.neighborhoods),
    ...asArray(school?.documentary_ecosystem)
  ]
    .map(anchorName)
    .filter(Boolean)
    .filter((value, index, array) => array.indexOf(value) === index)
    .slice(0, 4);
}

function normalizePercent(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return null;
  if (value <= 1) return Math.round(value * 100);
  if (value > 100) return Math.round(value / 10);
  return Math.round(value);
}

function weightedScoreFromCategories(school) {
  const categories = school?.scores || {};
  const categoryScores = Object.values(categories)
    .map(category => {
      const subvariables = asArray(category?.subvariables)
        .map(item => item?.value)
        .filter(value => typeof value === 'number' && !Number.isNaN(value));

      if (!subvariables.length) return null;
      return subvariables.reduce((sum, value) => sum + value, 0) / subvariables.length;
    })
    .filter(value => typeof value === 'number' && !Number.isNaN(value));

  if (!categoryScores.length) return null;
  return Math.round((categoryScores.reduce((sum, value) => sum + value, 0) / categoryScores.length) * 100);
}

function scoreForSchool(school) {
  const history = asArray(school?.score_history).filter(value => typeof value === 'number' && !Number.isNaN(value));
  const latestHistory = history.length ? normalizePercent(history[history.length - 1]) : null;

  const directCandidates = [
    school?.fit_score,
    school?.composite_score,
    school?.overall_score,
    school?.dashboard_score
  ].map(normalizePercent).filter(value => value !== null);

  const categoryScore = weightedScoreFromCategories(school);
  const score = latestHistory ?? directCandidates[0] ?? categoryScore ?? 75;

  return Math.max(0, Math.min(100, score));
}

export function renderDashboardView(schools, options = {}) {
  const escapeHtml = options.escapeHtml;

  return `
    <section class="v2-dashboard-shell">
      <div class="v2-dashboard-grid">
        ${schools.map((school, index) => {
          const city = school.location?.city || '';
          const state = school.location?.state || '';
          const location = [city, state].filter(Boolean).join(', ');
          const score = scoreForSchool(school);
          const image = school.visual_identity?.environment_image || school.visual_identity?.photo_local || '';
          const accent = school.brand_colors?.accent || '#9de7d7';
          const chips = collectDashboardAnchors(school)
            .map(anchor => `<span>${escapeHtml(anchor)}</span>`)
            .join('');
          const ringDegrees = Math.round(score * 3.6);

          return `
            <article class="v2-dashboard-card" data-school-index="${index}" style="--v2-school-accent:${escapeHtml(accent)}; --v2-ring-deg:${ringDegrees}deg;">
              ${image ? `<img src="${escapeHtml(image)}" alt="" loading="lazy">` : ''}

              <div class="v2-dashboard-overlay"></div>

              <div class="v2-dashboard-score" aria-label="Fit score ${score} out of 100">
                <div class="v2-dashboard-ring">
                  <span>${score}</span>
                </div>
              </div>

              <div class="v2-dashboard-content">
                <div class="v2-dashboard-copy">
                  <h2>${escapeHtml(school.name)}</h2>
                  <p class="v2-dashboard-location">${escapeHtml(location)}</p>

                  <p class="v2-dashboard-summary">
                    ${escapeHtml(school.location?.energy_profile || 'No environmental summary recorded.')}
                  </p>

                  <div class="v2-dashboard-chips">
                    ${chips}
                  </div>
                </div>

                <button class="v2-dashboard-button" data-view-trigger="environment" data-school-index="${index}" type="button">
                  Environmental context
                </button>
              </div>
            </article>
          `;
        }).join('')}
      </div>
    </section>
  `;
}
