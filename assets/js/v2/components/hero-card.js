import { imageForPage } from '../core/image-resolver.js';

export function renderHeroCard(school, options = {}) {
  const escapeHtml = options.escapeHtml;
  const schoolPicker = options.schoolPicker || '';
  const page = options.page || 'programs';

  if (!school) {
    return '<p>No school selected.</p>';
  }

  const city = school.location?.city || '';
  const state = school.location?.state || '';
  const location = [city, state].filter(Boolean).join(', ');
  const energyProfile = school.location?.energy_profile || 'No energy profile available.';
  const image = imageForPage(school, page);
  const accent = school.brand_colors?.accent || 'var(--atlas-accent)';

  return `
    <section class="v2-hero-card" style="--v2-school-accent:${escapeHtml(accent)}">
      ${image ? `<img src="${escapeHtml(image)}" alt="" loading="lazy">` : ''}
      <div class="v2-hero-content">
        <h2>${escapeHtml(school.name)}</h2>
        ${location ? `<p class="v2-hero-place">${escapeHtml(location)}</p>` : ''}
        <p class="v2-hero-read">${escapeHtml(energyProfile)}</p>

        ${schoolPicker ? `
          <div class="v2-hero-picker-wrap">
            ${schoolPicker}
          </div>
        ` : ''}
      </div>
    </section>
  `;
}
