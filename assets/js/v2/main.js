import { loadAtlasData } from './core/data.js';
import { state } from './core/state.js';
import { setSelectedSchool, setView } from './core/router.js';
import { escapeHtml } from './core/utils.js';
import { renderSchoolPicker, bindSchoolPicker } from './components/school-picker.js';
import { renderProgramsView } from './views/programs.js';

const root = document.getElementById('atlas-v2-root');

function renderActiveView(selectedSchool) {
  switch (state.activeView) {
    case 'research':
      return `
        <section class="v2-panel">
          <div class="v2-muted">Research</div>
          <h2>Research view placeholder</h2>
          <p class="v2-muted">
            Research/Evidence migration has not started yet.
          </p>
        </section>
      `;

    case 'programs':
    default:
      return `
        <section class="v2-panel">
          ${renderProgramsView(selectedSchool, {
            escapeHtml
          })}
        </section>
      `;
  }
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

        <nav class="v2-topnav">
          <button
            class="v2-nav-button ${state.activeView === 'programs' ? 'active' : ''}"
            data-view="programs"
            type="button"
          >
            Programs
          </button>

          <button
            class="v2-nav-button ${state.activeView === 'research' ? 'active' : ''}"
            data-view="research"
            type="button"
          >
            Research
          </button>
        </nav>
      </div>

      <div class="v2-grid">
        <aside class="v2-panel">
          <h2>Schools</h2>
          ${renderSchoolPicker(state.schools, state.selectedIndex, {
            escapeHtml
          })}
        </aside>

        ${renderActiveView(selectedSchool)}
      </div>
    </div>
  `;

  bindSchoolPicker(root, (index) => {
    setSelectedSchool(state, index);
    render();
  });

  root.querySelectorAll('[data-view]').forEach(button => {
    button.addEventListener('click', () => {
      setView(state, button.dataset.view);
      render();
    });
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
