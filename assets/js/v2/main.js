import { loadAtlasData } from './core/data.js';
import { state } from './core/state.js';
import { setSelectedSchool } from './core/router.js';
import { escapeHtml } from './core/utils.js';
import { renderScoreCategory } from './components/score-card.js';
import { renderSchoolPicker, bindSchoolPicker } from './components/school-picker.js';

const root = document.getElementById('atlas-v2-root');

const CATEGORY_TITLES = {
  mentorship: 'Mentorship',
  documentary: 'Documentary Infrastructure',
  teaching: 'Teaching / Academic Prep',
  funding: 'Funding / Financial Sustainability',
  livability: 'Livability',
  politics: 'Politics / Legal Environment',
  philosophy: 'Philosophical / Artistic Alignment'
};

function renderScoreCategories(school) {
  const scores = school?.scores || {};

  return Object.entries(scores)
    .map(([categoryKey, category]) => renderScoreCategory(categoryKey, category, {
      title: CATEGORY_TITLES[categoryKey] || categoryKey,
      escapeHtml
    }))
    .join('');
}

function render() {
  const selectedSchool = state.schools[state.selectedIndex];

  root.innerHTML = `
    <div class="v2-shell">
      <div class="v2-panel">
        <div class="v2-muted">ATLAS V2 Runtime</div>
        <h1>Documentary Futures Atlas</h1>
        <p class="v2-muted">
          Isolated rebuild runtime. Current app behavior remains untouched.
        </p>
      </div>

      <div class="v2-grid">
        <aside class="v2-panel">
          <h2>Schools</h2>
          ${renderSchoolPicker(state.schools, state.selectedIndex, {
            escapeHtml
          })}
        </aside>

        <section class="v2-panel">
          ${selectedSchool ? `
            <div class="v2-muted">Selected school</div>
            <h2>${escapeHtml(selectedSchool.name)}</h2>
            <p class="v2-muted">
              ${escapeHtml(selectedSchool.location?.city || '')}
              ${selectedSchool.location?.state ? ', ' + escapeHtml(selectedSchool.location.state) : ''}
            </p>

            <div class="v2-panel">
              <div class="v2-muted">Energy profile</div>
              <p>
                ${escapeHtml(selectedSchool.location?.energy_profile || 'No energy profile available.')}
              </p>
            </div>

            <div class="v2-score-stack">
              ${renderScoreCategories(selectedSchool)}
            </div>
          ` : '<p>No schools loaded.</p>'}
        </section>
      </div>
    </div>
  `;

  bindSchoolPicker(root, (index) => {
    setSelectedSchool(state, index);
    render();
  });
}

async function boot() {
  try {
    const data = await loadAtlasData();
    state.schools = data.schools || [];
    render();
  } catch (error) {
    root.innerHTML = `
      <div class="v2-panel">
        <h1>ATLAS V2 Runtime Error</h1>
        <p>${escapeHtml(error.message)}</p>
      </div>
    `;

    console.error(error);
  }
}

boot();
