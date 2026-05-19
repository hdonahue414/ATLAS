function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value.filter(Boolean) : [value];
}

function pct(value, fallback = 0.5) {
  const number = typeof value === 'number' && !Number.isNaN(value) ? value : fallback;
  return Math.round(Math.max(0, Math.min(1, number)) * 100);
}

function avg(values, fallback = 0.5) {
  const numbers = values.filter(value => typeof value === 'number' && !Number.isNaN(value));
  if (!numbers.length) return fallback;
  return numbers.reduce((sum, value) => sum + value, 0) / numbers.length;
}

function scoreCategory(school, key) {
  const subvariables = asArray(school?.scores?.[key]?.subvariables)
    .map(item => item?.value)
    .filter(value => typeof value === 'number' && !Number.isNaN(value));

  return avg(subvariables, 0.5);
}

function moduleScore(school, key, fallback = 0.5) {
  const value = school?.system_modules?.[key]?.score;
  return typeof value === 'number' && !Number.isNaN(value) ? value : fallback;
}

function inferCurriculumProfile(school) {
  const documentary = scoreCategory(school, 'documentary');
  const mentorship = scoreCategory(school, 'mentorship');
  const teaching = scoreCategory(school, 'teaching');
  const philosophy = scoreCategory(school, 'philosophy');
  const funding = scoreCategory(school, 'funding');
  const completion = moduleScore(school, 'thesis_completion', documentary);
  const recovery = moduleScore(school, 'thesis_recovery', mentorship);
  const creativeMetabolism = moduleScore(school, 'creative_metabolism', philosophy);
  const productionFeasibility = moduleScore(school, 'production_feasibility', documentary);
  const theorySaturation = moduleScore(school, 'theory_saturation', 0.5);

  return {
    production: avg([documentary, productionFeasibility]),
    structure: avg([mentorship, completion]),
    teaching,
    theory: avg([theorySaturation, school?.topology_axes?.academic]),
    recovery,
    thesis: completion,
    sustainability: avg([recovery, creativeMetabolism, funding])
  };
}

function defaultFormationArc(school) {
  const profile = inferCurriculumProfile(school);
  const title = school?.name || 'Program';

  return [
    {
      phase: 'Entry / Foundation',
      rhythm: 'Orientation, technical grounding, cohort calibration, and first institutional pressure read.',
      interpretation: `${title} begins as a calibration problem: how quickly the program asks the filmmaker to stabilize craft, language, expectations, and feedback rhythm.`,
      pressure: avg([profile.production, profile.theory], 0.55),
      autonomy: 0.35,
      recovery: profile.recovery,
      courses: courseFallback(school, 'foundation')
    },
    {
      phase: 'First Production Arc',
      rhythm: 'Production/editing cycles begin to reveal the hidden curriculum: critique style, feedback speed, collaboration norms, and faculty availability.',
      interpretation: 'Course requirements become lived weekly metabolism rather than catalog entries.',
      pressure: avg([profile.production, profile.structure], 0.65),
      autonomy: 0.52,
      recovery: profile.sustainability,
      courses: courseFallback(school, 'production')
    },
    {
      phase: 'Thesis Formation',
      rhythm: 'The project separates from assignments. Risk shifts from workload volume to conceptual endurance and advisor fit.',
      interpretation: 'The curriculum question becomes whether structure catches uncertainty before it hardens into creative paralysis.',
      pressure: avg([profile.thesis, profile.production], 0.72),
      autonomy: 0.72,
      recovery: profile.recovery,
      courses: courseFallback(school, 'thesis')
    },
    {
      phase: 'Professional / Teaching Exit',
      rhythm: 'The final arc converts the MFA into future practice: teaching, distribution, ethics, career habits, and post-program survivability.',
      interpretation: 'A good curriculum should not only produce a thesis; it should leave behind a workable documentary life.',
      pressure: avg([profile.teaching, profile.thesis], 0.62),
      autonomy: 0.86,
      recovery: profile.sustainability,
      courses: courseFallback(school, 'exit')
    }
  ];
}

function courseFallback(school, phase) {
  const name = school?.name || '';
  const wake = name === 'Wake Forest';

  if (wake) {
    const wakeCourses = {
      foundation: ['DOC 728 — Documentary History', 'DOC 717 — Fundamentals of Editing', 'DOC 713 — Documentary Storytelling I'],
      production: ['DOC 715 — Cinematography and Sound', 'DOC 724 — Advanced Story Editing', 'DOC 722 — Documentary Storytelling II'],
      thesis: ['DOC 735 — Law and Ethics', 'DOC 734 — Advanced Cinematography and Sound', 'DOC 737 — Documentary Storytelling III', 'DOC 748 — Creative Thesis'],
      exit: ['DOC 718 — Social Media & Marketing in the Creative Arts', 'DOC 755 — Professional Seminar: Entrepreneurial Filmmaking', 'DOC 751 — Professional Seminar: Teaching in Higher Education']
    };
    return wakeCourses[phase] || [];
  }

  return asArray(school?.curriculum?.[phase])
    .map(item => typeof item === 'string' ? item : item?.title || item?.name || item?.course)
    .filter(Boolean);
}

function explicitCurriculumPhases(school) {
  const phases = asArray(school?.curriculum?.phases || school?.curriculum_plan?.phases || school?.course_sequence);
  return phases.map(phase => ({
    phase: phase.phase || phase.term || phase.label || 'Curriculum phase',
    rhythm: phase.rhythm || phase.summary || phase.description || 'No rhythm note recorded.',
    interpretation: phase.interpretation || phase.notes || 'No interpretation recorded.',
    pressure: typeof phase.pressure === 'number' ? phase.pressure : 0.55,
    autonomy: typeof phase.autonomy === 'number' ? phase.autonomy : 0.5,
    recovery: typeof phase.recovery === 'number' ? phase.recovery : 0.5,
    courses: asArray(phase.courses).map(course => typeof course === 'string' ? course : [course.code, course.title || course.name].filter(Boolean).join(' — ')).filter(Boolean)
  }));
}

function renderMeter(label, value, escapeHtml) {
  return `
    <div class="v2-curriculum-meter">
      <span>${escapeHtml(label)}</span>
      <div><i style="width:${pct(value)}%"></i></div>
      <strong>${pct(value)}</strong>
    </div>
  `;
}

function renderMetricChip(label, value, escapeHtml) {
  return `
    <span class="v2-curriculum-metric-chip">
      <em>${escapeHtml(label)}</em>
      <strong>${pct(value)}</strong>
      <i style="--v2-chip-meter:${pct(value)}%"></i>
    </span>
  `;
}

function renderCourseList(courses, escapeHtml) {
  if (!courses.length) {
    return `
      <div class="v2-course-empty">
        Course list not yet structured in JSON. Add courses under curriculum.phases[].courses to replace this placeholder.
      </div>
    `;
  }

  return `
    <div class="v2-course-list">
      ${courses.map(course => `<span>${escapeHtml(course)}</span>`).join('')}
    </div>
  `;
}

function renderPhase(phase, index, escapeHtml) {
  return `
    <article class="v2-curriculum-phase">
      <div class="v2-curriculum-index">${String(index + 1).padStart(2, '0')}</div>
      <div class="v2-curriculum-phase-main">
        <div class="v2-curriculum-phase-header">
          <div>
            <p class="v2-section-kicker">Formation phase</p>
            <h3>${escapeHtml(phase.phase)}</h3>
          </div>
          <div class="v2-curriculum-phase-metrics">
            ${renderMetricChip('Pressure', phase.pressure, escapeHtml)}
            ${renderMetricChip('Autonomy', phase.autonomy, escapeHtml)}
            ${renderMetricChip('Recovery', phase.recovery, escapeHtml)}
          </div>
        </div>

        <div class="v2-curriculum-phase-copy">
          <p class="v2-curriculum-rhythm">${escapeHtml(phase.rhythm)}</p>
          <p class="v2-curriculum-interpretation">${escapeHtml(phase.interpretation)}</p>
        </div>

        <details class="v2-course-drawer" open>
          <summary>Course evidence</summary>
          ${renderCourseList(phase.courses, escapeHtml)}
        </details>
      </div>
    </article>
  `;
}

function renderHiddenCurriculum(school, escapeHtml) {
  const modules = school?.system_modules || {};
  const cards = [
    ['Thesis survivability', moduleScore(school, 'thesis_completion', 0.5), modules.thesis_completion?.notes || 'Seeded from production/thesis structure.'],
    ['Recovery cycles', moduleScore(school, 'recovery_cycles', 0.5), modules.recovery_cycles?.notes || 'Seeded from sustainability and stress resilience.'],
    ['Creative metabolism', moduleScore(school, 'creative_metabolism', 0.5), modules.creative_metabolism?.notes || 'Approximates pacing fit; needs workload testimony.'],
    ['Teaching formation', scoreCategory(school, 'teaching'), school?.scores?.teaching?.notes || 'Teaching layer interpreted from program evidence.']
  ];

  return `
    <section class="v2-curriculum-hidden">
      <div class="v2-curriculum-hidden-header">
        <p class="v2-section-kicker">Hidden curriculum</p>
        <h3>Catalog pressure read</h3>
      </div>
      <div class="v2-curriculum-hidden-grid">
        ${cards.map(([title, value, note]) => `
          <article>
            <div>
              <strong>${escapeHtml(title)}</strong>
              <span>${pct(value)}</span>
            </div>
            <p>${escapeHtml(note)}</p>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

export function renderCurriculumView(school, options = {}) {
  const escapeHtml = options.escapeHtml;
  const schoolPicker = options.schoolPicker || '';

  if (!school) return '<p>No school loaded.</p>';

  const phases = explicitCurriculumPhases(school);
  const formationArc = phases.length ? phases : defaultFormationArc(school);
  const profile = inferCurriculumProfile(school);

  return `
    <div class="v2-curriculum-view">
      <section class="v2-compact-context">
        <div>
          <p class="v2-section-kicker">Curriculum metabolism</p>
          <h2>${escapeHtml(school.name)}</h2>
          <p>Course sequence as formation evidence: workload rhythm, autonomy, recovery, thesis pressure, and exit path.</p>
        </div>
        ${schoolPicker}
      </section>

      <section class="v2-curriculum-profile v2-curriculum-profile--standalone">
        ${renderMeter('Production load', profile.production, escapeHtml)}
        ${renderMeter('Structure', profile.structure, escapeHtml)}
        ${renderMeter('Teaching path', profile.teaching, escapeHtml)}
        ${renderMeter('Theory / discourse load', profile.theory, escapeHtml)}
      </section>

      <section class="v2-curriculum-timeline">
        ${formationArc.map((phase, index) => renderPhase(phase, index, escapeHtml)).join('')}
      </section>

      ${renderHiddenCurriculum(school, escapeHtml)}
    </div>
  `;
}
