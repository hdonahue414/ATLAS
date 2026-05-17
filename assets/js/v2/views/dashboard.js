export function renderDashboardView(schools, options = {}) {
  const escapeHtml = options.escapeHtml;

  return `
    <section class="v2-dashboard-shell">
      <div class="v2-dashboard-grid">
        ${schools.map((school, index) => {
          const city = school.location?.city || '';
          const state = school.location?.state || '';
          const location = [city, state].filter(Boolean).join(', ');
          const score = school.fit_score || school.composite_score || 75;
          const image = school.visual_identity?.environment_image || school.visual_identity?.photo_local || '';
          const accent = school.brand_colors?.accent || '#9de7d7';
          const chips = (school.environment?.anchors || [])
            .slice(0, 4)
            .map(anchor => `<span>${escapeHtml(anchor.name || anchor)}</span>`)
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

                <button class="v2-dashboard-button" type="button">
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
