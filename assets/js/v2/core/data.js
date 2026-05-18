import { normalizeAtlasCurriculum } from './curriculum-model.js';

export async function loadAtlasData() {
  const response = await fetch('./data.json');

  if (!response.ok) {
    throw new Error(`Failed to load data.json (${response.status})`);
  }

  const rawData = await response.json();
  return normalizeAtlasCurriculum(rawData);
}
