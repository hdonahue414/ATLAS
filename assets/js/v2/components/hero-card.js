export function renderHeroCard(school, options = {}) {
  const escapeHtml = options.escapeHtml;

  if (!school) {
    return '<p>No school selected.</p>';
  }

  const city = school.location?.city || '';
  const state = school.location?.state || '';
  const location = [city, state].filter(Boolean).join(', ');
  const energyProfile = school.location?.energy_profile || 'No energy profile available.';
  const image = school.visual_identity?.photo_local || '';
  const accent = school.brand_colors?.accent || 'var(--atlas-accent)';

  return `
    <section class="v2-hero-card" style="--v2-school-accent:${escapeHtml(accent)}">
      ${image ? `<img src="${escapeHtml(image)}" alt="" loading="lazy">` : ''}
      <div class="v2-hero-content">
        <div class="v2-kicker">Program dossier</div>
        <h2>${escapeHtml(school.name)}</h2>
        ${location ? `<p class="v2-hero-place">${escapeHtml(location)}</p>` : ''}
        <p class="v2-hero-read">${escapeHtml(energyProfile)}</p>
      </div>
    </section>
  `;
}
