export const V2_NAV_ITEMS = [
  { id: 'dashboard', label: 'Home', icon: '⌂' },
  { id: 'programs', label: 'Programs', icon: '⇄' },
  { id: 'curriculum', label: 'Curriculum', icon: '▦' },
  { id: 'research', label: 'Research', icon: '◇' },
  { id: 'environment', label: 'Environment', icon: '⌖' },
  { id: 'practice', label: 'Practice', icon: '●' }
];

export function renderNav(activeView, options = {}) {
  const items = options.items || V2_NAV_ITEMS;
  const variant = options.variant || 'top';

  if (variant === 'sidebar') {
    return `
      <nav class="v2-rail-nav" aria-label="ATLAS primary navigation">
        <button class="v2-rail-menu" data-view="dashboard" type="button" aria-label="Home" title="Home">☰</button>
        <div class="v2-rail-group">
          ${items.map(item => `
            <button
              class="v2-rail-button ${activeView === item.id ? 'active' : ''}"
              data-view="${item.id}"
              type="button"
              aria-label="${item.label}"
              title="${item.label}"
            >
              <span aria-hidden="true">${item.icon}</span>
            </button>
          `).join('')}
        </div>
      </nav>
    `;
  }

  return `
    <nav class="v2-topnav" aria-label="V2 primary navigation">
      ${items.map(item => `
        <button
          class="v2-nav-button ${activeView === item.id ? 'active' : ''}"
          data-view="${item.id}"
          type="button"
        >
          ${item.label}
        </button>
      `).join('')}
    </nav>
  `;
}

export function bindNav(root, onSelect) {
  root.querySelectorAll('[data-view]').forEach(button => {
    button.addEventListener('click', () => {
      onSelect(button.dataset.view);
    });
  });
}
