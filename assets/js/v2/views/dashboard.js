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

function scoreForSchool(school) {
  const candidates = [
    school.fit_score,
    school.composite_score,
    school.overall_score,
    school.dashboard_score
  ];

  const numeric = candidates.find(value => typeof value === 'number' && !Number.isNaN(value));

  if (!numeric) return 75;
  if (numeric <= 1) return Math.round(numeric * 100);

  return Math.round(numeric);
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

          return `
            <article class="v2-dashboard-card" data-school-index="${index}" style="--v2-school-accent:${escapeHtml(accent)}">
              ${image ? `<img src="${escapeHtml(image)}" alt="" loading="lazy">` : ''}

              <div class="v2-dashboard-overlay"></div>

              <div class="v2-dashboard-score">
                <div class="v2-dashboard-ring" style="--v2-ring:${score}%">
                  <span>${score}</span>
                </div>
              </div>

              <div class="v2-dashboard-content">
                <h2>${escapeHtml(school.name)}</h2>
                <p class="v2-dashboard-location">${escapeHtml(location)}</p>

                <p class="v2-dashboard-summary">
                  ${escapeHtml(school.location?.energy_profile || 'No environmental summary recorded.')}
                </p>

                <div class="v2-dashboard-chips">
                  ${chips}
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
