import { loadAtlasData } from './core/data.js';
import { state } from './core/state.js';
import { setSelectedSchool, setView } from './core/router.js';
import { escapeHtml } from './core/utils.js';
import { renderNav, bindNav } from './components/nav.js';
import { renderSchoolPicker, bindSchoolPicker } from './components/school-picker.js';
import { renderProgramsView } from './views/programs.js';
import { renderResearchView } from './views/research.js';
import { renderEnvironmentView } from './views/environment.js';

const root = document.getElementById('atlas-v2-root');

const VIEW_TITLES = {
  programs: 'Programs',
  research: 'Research',
  environment: 'Environment'
};

function renderActiveView(selectedSchool) {
  switch (state.activeView) {
    case 'environment':
      return `
        <div class="v2-grid">
          <aside class="v2-panel">
            <h2>Schools</h2>
            ${renderSchoolPicker(state.schools, state.selectedIndex, {
              escapeHtml
            })}
          </aside>

          <section class="v2-panel">
            ${renderEnvironmentView(selectedSchool, {
              escapeHtml
            })}
          </section>
        </div>
      `;

    case 'research':
      return `
        <div class="v2-grid">
          <aside class="v2-panel">
            <h2>Schools</h2>
            ${renderSchoolPicker(state.schools, state.selectedIndex, {
              escapeHtml
            })}
          </aside>

          <section class="v2-panel">
            ${renderResearchView(selectedSchool, {
              escapeHtml
            })}
          </section>
        </div>
      `;

    case 'programs':
    default:
      return `
        <section class="v2-programs-shell">
          ${renderProgramsView(selectedSchool, {
            escapeHtml,
            schools: state.schools,
            selectedIndex: state.selectedIndex
          })}
        </section>
      `;
  }
}

function render() {
  const selectedSchool = state.schools[state.selectedIndex];

  root.innerHTML = `
    <div class="v2-shell">
      <header class="v2-page-header">
        <h1>${escapeHtml(VIEW_TITLES[state.activeView] || 'ATLAS')}</h1>
        ${renderNav(state.activeView)}
      </header>

      ${renderActiveView(selectedSchool)}
    </div>
  `;

  bindSchoolPicker(root, (index) => {
    setSelectedSchool(state, index);
    render();
  });

  bindNav(root, (viewName) => {
    setView(state, viewName);
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
