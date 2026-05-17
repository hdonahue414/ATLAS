export function renderSchoolPicker(schools, selectedIndex, options = {}) {
  const escapeHtml = options.escapeHtml;

  if (!Array.isArray(schools) || !schools.length) {
    return '<p class="v2-muted">No schools available.</p>';
  }

  return `
    <div class="v2-school-list">
      ${schools.map((school, index) => `
        <button
          class="v2-school-button ${index === selectedIndex ? 'active' : ''}"
          data-school-index="${index}"
          type="button"
        >
          ${escapeHtml(school.name)}
        </button>
      `).join('')}
    </div>
  `;
}

export function bindSchoolPicker(root, onSelect) {
  root.querySelectorAll('[data-school-index]').forEach(button => {
    button.addEventListener('click', () => {
      onSelect(Number(button.dataset.schoolIndex));
    });
  });
}
