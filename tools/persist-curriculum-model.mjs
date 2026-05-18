import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  normalizeAtlasCurriculum
} from '../assets/js/v2/core/curriculum-model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const dataPath = path.join(repoRoot, 'data.json');

async function main() {
  const raw = await fs.readFile(dataPath, 'utf-8');
  const parsed = JSON.parse(raw);

  const normalized = normalizeAtlasCurriculum(parsed);

  await fs.writeFile(
    dataPath,
    JSON.stringify(normalized, null, 2) + '\n',
    'utf-8'
  );

  console.log('Persisted curriculum.phases into data.json');
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
