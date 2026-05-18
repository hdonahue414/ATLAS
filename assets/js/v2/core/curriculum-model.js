export function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value.filter(Boolean) : [value];
}

export function pct(value, fallback = 0.5) {
  const number = typeof value === 'number' && !Number.isNaN(value) ? value : fallback;
  return Math.round(Math.max(0, Math.min(1, number)) * 100);
}

export function avg(values, fallback = 0.5) {
  const numbers = values.filter(value => typeof value === 'number' && !Number.isNaN(value));
  if (!numbers.length) return fallback;
  return numbers.reduce((sum, value) => sum + value, 0) / numbers.length;
}

export function scoreCategory(school, key) {
  const subvariables = asArray(school?.scores?.[key]?.subvariables)
    .map(item => item?.value)
    .filter(value => typeof value === 'number' && !Number.isNaN(value));

  return avg(subvariables, 0.5);
}

export function moduleScore(school, key, fallback = 0.5) {
  const value = school?.system_modules?.[key]?.score;
  return typeof value === 'number' && !Number.isNaN(value) ? value : fallback;
}

export function inferCurriculumProfile(school) {
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

function courseObject(code, title, credits = null) {
  return { code, title, credits };
}

export function courseFallback(school, phase) {
  const name = school?.name || '';
  const wake = name === 'Wake Forest';

  if (wake) {
    const wakeCourses = {
      foundation: [
        courseObject('DOC 728', 'Documentary History'),
        courseObject('DOC 717', 'Fundamentals of Editing'),
        courseObject('DOC 713', 'Documentary Storytelling I')
      ],
      production: [
        courseObject('DOC 715', 'Cinematography and Sound'),
        courseObject('DOC 724', 'Advanced Story Editing'),
        courseObject('DOC 722', 'Documentary Storytelling II')
      ],
      thesis: [
        courseObject('DOC 735', 'Law and Ethics'),
        courseObject('DOC 734', 'Advanced Cinematography and Sound'),
        courseObject('DOC 737', 'Documentary Storytelling III'),
        courseObject('DOC 748', 'Creative Thesis')
      ],
      exit: [
        courseObject('DOC 718', 'Social Media & Marketing in the Creative Arts'),
        courseObject('DOC 755', 'Professional Seminar: Entrepreneurial Filmmaking'),
        courseObject('DOC 751', 'Professional Seminar: Teaching in Higher Education')
      ]
    };
    return wakeCourses[phase] || [];
  }

  return asArray(school?.curriculum?.[phase])
    .map(item => {
      if (typeof item === 'string') return { code: '', title: item, credits: null };
      return {
        code: item?.code || '',
        title: item?.title || item?.name || item?.course || '',
        credits: typeof item?.credits === 'number' ? item.credits : null
      };
    })
    .filter(course => course.title || course.code);
}

export function makeDefaultCurriculumPhases(school) {
  const profile = inferCurriculumProfile(school);
  const title = school?.name || 'Program';

  return [
    {
      id: 'entry_foundation',
      phase: 'Entry / Foundation',
      rhythm: 'Orientation, technical grounding, cohort calibration, and first institutional pressure read.',
      interpretation: `${title} begins as a calibration problem: how quickly the program asks the filmmaker to stabilize craft, language, expectations, and feedback rhythm.`,
      pressure: avg([profile.production, profile.theory], 0.55),
      autonomy: 0.35,
      recovery: profile.recovery,
      courses: courseFallback(school, 'foundation'),
      source_status: 'generated_from_existing_model'
    },
    {
      id: 'first_production_arc',
      phase: 'First Production Arc',
      rhythm: 'Production/editing cycles begin to reveal the hidden curriculum: critique style, feedback speed, collaboration norms, and faculty availability.',
      interpretation: 'This is where course requirements stop being catalog entries and become a lived weekly metabolism.',
      pressure: avg([profile.production, profile.structure], 0.65),
      autonomy: 0.52,
      recovery: profile.sustainability,
      courses: courseFallback(school, 'production'),
      source_status: 'generated_from_existing_model'
    },
    {
      id: 'thesis_formation',
      phase: 'Thesis Formation',
      rhythm: 'The project begins to separate from assignments. Risk shifts from workload volume to conceptual endurance and advisor fit.',
      interpretation: 'The main curriculum question becomes whether the structure catches uncertainty before it hardens into creative paralysis.',
      pressure: avg([profile.thesis, profile.production], 0.72),
      autonomy: 0.72,
      recovery: profile.recovery,
      courses: courseFallback(school, 'thesis'),
      source_status: 'generated_from_existing_model'
    },
    {
      id: 'professional_teaching_exit',
      phase: 'Professional / Teaching Exit',
      rhythm: 'The final arc converts the MFA into a future practice: teaching, distribution, ethics, career habits, and post-program survivability.',
      interpretation: 'This phase matters because a good curriculum should not only produce a thesis; it should leave behind a workable documentary life.',
      pressure: avg([profile.teaching, profile.thesis], 0.62),
      autonomy: 0.86,
      recovery: profile.sustainability,
      courses: courseFallback(school, 'exit'),
      source_status: 'generated_from_existing_model'
    }
  ];
}

export function normalizeCurriculumPhase(phase, index = 0) {
  const courses = asArray(phase?.courses).map(course => {
    if (typeof course === 'string') {
      return { code: '', title: course, credits: null };
    }

    return {
      code: course?.code || '',
      title: course?.title || course?.name || course?.course || '',
      credits: typeof course?.credits === 'number' ? course.credits : null
    };
  }).filter(course => course.title || course.code);

  return {
    id: phase?.id || `phase_${index + 1}`,
    phase: phase?.phase || phase?.term || phase?.label || 'Curriculum phase',
    rhythm: phase?.rhythm || phase?.summary || phase?.description || 'No rhythm note recorded.',
    interpretation: phase?.interpretation || phase?.notes || 'No interpretation recorded.',
    pressure: typeof phase?.pressure === 'number' ? phase.pressure : 0.55,
    autonomy: typeof phase?.autonomy === 'number' ? phase.autonomy : 0.5,
    recovery: typeof phase?.recovery === 'number' ? phase.recovery : 0.5,
    courses,
    source_status: phase?.source_status || 'explicit_json'
  };
}

export function normalizeSchoolCurriculum(school) {
  if (!school) return school;

  const explicitPhases = asArray(school?.curriculum?.phases || school?.curriculum_plan?.phases || school?.course_sequence);
  const normalizedPhases = explicitPhases.length
    ? explicitPhases.map(normalizeCurriculumPhase)
    : makeDefaultCurriculumPhases(school).map(normalizeCurriculumPhase);

  return {
    ...school,
    curriculum: {
      ...(school.curriculum || {}),
      source_status: explicitPhases.length ? 'explicit_json' : 'generated_from_existing_model',
      phases: normalizedPhases
    }
  };
}

export function normalizeAtlasCurriculum(data) {
  return {
    ...data,
    schools: asArray(data?.schools).map(normalizeSchoolCurriculum)
  };
}
