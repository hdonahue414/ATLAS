import { renderHeroCard } from '../components/hero-card.js';
import { renderScoreCategory } from '../components/score-card.js';

const CATEGORY_TITLES = {
  mentorship: 'Mentorship',
  documentary: 'Documentary Infrastructure',
  teaching: 'Teaching / Academic Prep',
  funding: 'Funding / Financial Sustainability',
  livability: 'Livability',
  politics: 'Politics / Legal Environment',
  philosophy: 'Philosophical / Artistic Alignment'
};

function renderScoreCategories(school, options = {}) {
  const escapeHtml = options.escapeHtml;
  const scores = school?.scores || {};

  return Object.entries(scores)
    .map(([categoryKey, category]) => renderScoreCategory(categoryKey, category, {
      title: CATEGORY_TITLES[categoryKey] || categoryKey,
      escapeHtml
    }))
    .join('');
}

export function renderProgramsView(school, options = {}) {
  const escapeHtml = options.escapeHtml;

  if (!school) {
    return '<p>No school loaded.</p>';
  }

  return `
    <div class="v2-programs-view">
      ${renderHeroCard(school, { escapeHtml })}

      <div class="v2-score-stack">
        ${renderScoreCategories(school, { escapeHtml })}
      </div>
    </div>
  `;
}
