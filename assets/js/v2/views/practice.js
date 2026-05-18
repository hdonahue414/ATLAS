import { renderHeroCard } from '../components/hero-card.js';

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value.filter(Boolean) : [value];
}

function scoreCategory(school, key) {
  const values = asArray(school?.scores?.[key]?.subvariables)
    .map(item => item?.value)
    .filter(value => typeof value === 'number' && !Number.isNaN(value));

  if (!values.length) return null;
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 100);
}

function moduleScore(school, key, fallback = null) {
  const value = school?.system_modules?.[key]?.score;
  if (typeof value === 'number' && !Number.isNaN(value)) return Math.round(value * 100);
  return fallback;
}

function renderPracticeAxis(title, note, score, escapeHtml) {
  return `
    <article class="v2-practice-axis">
      <div>
        <span>${escapeHtml(title)}</span>
        <strong>${score ?? '—'}</strong>
      </div>
      <p>${escapeHtml(note)}</p>
    </article>
  `;
}

function renderFormationStages(school, escapeHtml) {
  const stages = [
    {
      title: 'Application season',
      body: school?.application_readiness?.summary || 'Portfolio readiness depends on whether the nonfiction materials can make the fit legible without overexplaining the artist trajectory.'
    },
    {
      title: 'First-year formation',
      body: school?.practice_read?.first_year || 'The first year tests stamina, critique rhythm, and whether the program protects observational patience under assignment pressure.'
    },
    {
      title: 'Thesis stretch',
      body: school?.practice_read?.thesis || 'The thesis period tests whether long-form work, advising cadence, and recoverability can coexist without turning the program into an endurance test.'
    },
    {
      title: 'Post-MFA continuity',
      body: school?.practice_read?.future || 'The exit question is whether the program leaves behind a sustainable documentary identity rather than only a completed film.'
    }
  ];

  return `
    <section class="v2-practice-trajectory">
      <p class="v2-section-kicker">Formation trajectory</p>
      <h3>Filmmaker practice over time</h3>
      <div>
        ${stages.map(stage => `
          <article>
            <span>${escapeHtml(stage.title)}</span>
            <p>${escapeHtml(stage.body)}</p>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

export function renderPracticeView(school, options = {}) {
  const escapeHtml = options.escapeHtml;
  const schoolPicker = options.schoolPicker || '';

  if (!school) return '<p>No school loaded.</p>';

  const documentary = scoreCategory(school, 'documentary');
  const mentorship = scoreCategory(school, 'mentorship');
  const teaching = scoreCategory(school, 'teaching');
  const thesis = moduleScore(school, 'thesis_completion', documentary);
  const recovery = moduleScore(school, 'thesis_recovery', mentorship);
  const creative = moduleScore(school, 'creative_metabolism', documentary);

  return `
    <div class="v2-practice-view">
      ${renderHeroCard(school, { escapeHtml, schoolPicker })}

      <section class="v2-practice-lede">
        <p class="v2-section-kicker">Practice ecology</p>
        <h2>What kind of filmmaker this place trains into being</h2>
        <p>
          This view separates practice formation from institutional overview. It reads the program as a pressure environment for documentary method, thesis survival, teaching identity, critique metabolism, and long-term creative continuity.
        </p>
      </section>

      <section class="v2-practice-grid">
        ${renderPracticeAxis('Documentary method', 'Compatibility with observational, relational, human-centered nonfiction practice.', documentary, escapeHtml)}
        ${renderPracticeAxis('Mentorship access', 'Likelihood that faculty structure, feedback, and advising remain usable under stress.', mentorship, escapeHtml)}
        ${renderPracticeAxis('Thesis survivability', 'Capacity to carry long-form work through ambiguity without collapse or drift.', thesis, escapeHtml)}
        ${renderPracticeAxis('Recovery rhythm', 'Whether the program leaves enough space for sustained work rather than depletion.', recovery, escapeHtml)}
        ${renderPracticeAxis('Creative metabolism', 'The implied pace of making, revising, absorbing critique, and re-entering production.', creative, escapeHtml)}
        ${renderPracticeAxis('Teaching continuity', 'How clearly practice can become pedagogy, mentorship, and an academic future.', teaching, escapeHtml)}
      </section>

      ${renderFormationStages(school, escapeHtml)}
    </div>
  `;
}
