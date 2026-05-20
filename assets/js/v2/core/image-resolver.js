const CITY_IMAGES = {
  'Ohio': 'athens_ohio.png',
  'Wake Forest': 'winston_salem.png',
  'Temple': 'philadelphia.png',
  'Northwestern': 'evanston.png',
  'DePaul': 'chicago.png',
  'Buffalo': 'buffalo.png',
  'Syracuse': 'syracuse.png',
  'Stanford': 'palo_alto.png',
  'UCSC': 'santa_cruz.png'
};

const PROGRAM_IMAGES = {
  'Ohio': 'ohiou.png',
  'Wake Forest': 'brookstown.png',
  'UCSC': 'ucsc.png',
  'Stanford': 'stanford.png',
  'Northwestern': 'northwestern.png',
  'Buffalo': 'ub.png',
  'Syracuse': 'syracuseu.png',
  'DePaul': 'depaul.png',
  'Temple': 'temple.png'
};

function baseName(school) {
  const name = school?.name || '';
  if (name.includes('Wake')) return 'Wake Forest';
  if (name.includes('Northwestern')) return 'Northwestern';
  if (name.includes('Stanford')) return 'Stanford';
  if (name.includes('DePaul')) return 'DePaul';
  if (name.includes('Syracuse')) return 'Syracuse';
  if (name.includes('Temple')) return 'Temple';
  if (name.includes('Ohio')) return 'Ohio';
  if (name.includes('UCSC') || name.includes('Santa Cruz')) return 'UCSC';
  if (name.includes('Buffalo') || name.includes('UB')) return 'Buffalo';
  return name;
}

function imagePath(filename) {
  return filename ? `assets/cities/${filename}` : '';
}

export function imageForPage(school, page = 'program') {
  const key = baseName(school);
  const cityFilename = CITY_IMAGES[key];
  const programFilename = PROGRAM_IMAGES[key];

  if (page === 'home' || page === 'environment') {
    return imagePath(cityFilename) || school?.visual_identity?.environment_image || school?.visual_identity?.photo_local || '';
  }

  if (page === 'compare' || page === 'programs' || page === 'practice') {
    return imagePath(programFilename) || school?.visual_identity?.photo_local || school?.visual_identity?.environment_image || '';
  }

  return imagePath(programFilename || cityFilename) || school?.visual_identity?.photo_local || school?.visual_identity?.environment_image || '';
}
