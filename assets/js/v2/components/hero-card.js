export function renderHeroCard(school, options = {}) {
  const escapeHtml = options.escapeHtml;

  if (!school) {
    return '<p>No school selected.</p>';
  }

  const city = school.location?.city || '';
  const state = school.location?.state || '';
  const location = [city, state].filter(Boolean).join(', ');
  const energyProfile = school.location?.energy_profile || 'No energy profile available.';

  return `
    <section class="v2-hero-card">
      <div class="v2-muted">Selected school</div>
      <h2>${escapeHtml(school.name)}</h2>
      ${location ? `<p class="v2-muted">${escapeHtml(location)}</p>` : ''}

      <div class="v2-panel v2-hero-energy">
        <div class="v2-muted">Energy profile</div>
        <p>${escapeHtml(energyProfile)}</p>
      </div>
    </section>
  `;
}
