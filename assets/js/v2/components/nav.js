export const V2_NAV_ITEMS = [
  { id: 'programs', label: 'Programs' },
  { id: 'research', label: 'Research' }
];

export function renderNav(activeView, options = {}) {
  const items = options.items || V2_NAV_ITEMS;

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
