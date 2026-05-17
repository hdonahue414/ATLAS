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

const VIEW_DESCRIPTIONS = {
  programs: 'Program fit, structure, and interpretive scoring.',
  research: 'Evidence provenance, contradictions, and source confidence.',
  environment: 'Lived-place intelligence, city rhythm, and daily-life anchors.'
};

function renderInlineSchoolPicker() {
  return `
    <div class="v2-inline-school-picker">
      ${renderSchoolPicker(state.schools, state.selectedIndex, { escapeHtml })}
    </div>
  `;
}

function renderActiveView(selectedSchool) {
  const picker = renderInlineSchoolPicker();

  switch (state.activeView) {
    case 'environment':
      return `
        <section class="v2-view-shell v2-view-shell--environment">
          ${renderEnvironmentView(selectedSchool, {
            escapeHtml,
            schoolPicker: picker
          })}
        </section>
      `;

    case 'research':
      return `
        <section class="v2-view-shell v2-view-shell--research">
          ${renderResearchView(selectedSchool, {
            escapeHtml,
            schoolPicker: picker
          })}
        </section>
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

function renderSidebar(selectedSchool) {
  return `
    <aside class="v2-sidebar" aria-label="ATLAS navigation">
      <div class="v2-sidebar-brand">
        <span>ATLAS</span>
        <small>Documentary Futures</small>
      </div>

      ${renderNav(state.activeView, { variant: 'sidebar' })}

      <section class="v2-sidebar-selector" aria-label="School selector">
        <div class="v2-sidebar-label">Active dossier</div>
        <strong>${selectedSchool ? escapeHtml(selectedSchool.name) : 'No school'}</strong>
        ${renderSchoolPicker(state.schools, state.selectedIndex, { escapeHtml })}
      </section>
    </aside>
  `;
}

function render() {
  const selectedSchool = state.schools[state.selectedIndex];
  const title = VIEW_TITLES[state.activeView] || 'ATLAS';
  const description = VIEW_DESCRIPTIONS[state.activeView] || '';

  root.innerHTML = `
    <div class="v2-app-shell">
      ${renderSidebar(selectedSchool)}

      <main class="v2-main-stage">
        <header class="v2-page-header">
          <div>
            <h1>${escapeHtml(title)}</h1>
            ${description ? `<p>${escapeHtml(description)}</p>` : ''}
          </div>
        </header>

        ${renderActiveView(selectedSchool)}
      </main>
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