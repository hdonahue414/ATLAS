export function renderContextStrip(school, options = {}) {
  const escapeHtml = options.escapeHtml;
  const schoolPicker = options.schoolPicker || '';
  const city = school?.location?.city || '';
  const state = school?.location?.state || '';
  const location = [city, state].filter(Boolean).join(', ');
  const note = school?.summary || school?.environmental_summary || school?.fit_summary || '';

  return `
    <section class="v2-context-strip">
      <div>
        <p class="v2-section-kicker">Active dossier</p>
        <h2>${escapeHtml(school?.name || 'Program')}</h2>
        <p>${escapeHtml([location, note].filter(Boolean).join(' · '))}</p>
      </div>
      ${schoolPicker}
    </section>
  `;
}
