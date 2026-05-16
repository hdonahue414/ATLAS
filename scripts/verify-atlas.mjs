#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const failures = [];
const warnings = [];

function rel(path) {
  return path.replace(root + '/', '');
}

function file(path) {
  return join(root, path);
}

function read(path) {
  return readFileSync(file(path), 'utf8');
}

function ok(label) {
  console.log(`OK  ${label}`);
}

function fail(label, error) {
  failures.push(`${label}: ${error.message || error}`);
}

function warn(label) {
  warnings.push(label);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function checkSyntax(path, source) {
  new vm.Script(source, { filename: path });
}

function checkFileExists(path) {
  assert(existsSync(file(path)), `${path} is missing`);
}

function parseHtmlAssetRefs(html, attr, ext) {
  const pattern = new RegExp(`${attr}="([^"]+\\.${ext})(?:\\?[^"]*)?"`, 'g');
  return [...html.matchAll(pattern)].map(match => match[1]);
}

function checkJsonData() {
  const data = JSON.parse(read('data.json'));
  assert(data && typeof data === 'object', 'data.json must parse to an object');
  assert(data.meta && typeof data.meta === 'object', 'data.json missing meta object');
  assert(Array.isArray(data.schools), 'data.json missing schools array');
  assert(data.schools.length > 0, 'data.json schools array is empty');

  data.schools.forEach((school, index) => {
    assert(school && typeof school === 'object', `school ${index} is not an object`);
    assert(typeof school.name === 'string' && school.name.trim(), `school ${index} missing name`);
    if (!school.scores || typeof school.scores !== 'object') warn(`${school.name}: missing scores object`);
    if (!school.location && !school.location_intelligence) warn(`${school.name}: missing location/location_intelligence`);
  });

  JSON.parse(JSON.stringify(data));
  ok(`data.json parses with ${data.schools.length} schools`);
}

function checkHtmlAndAssets() {
  const html = read('index.html');
  assert(/<div id="gate"/.test(html), 'login gate markup missing');
  assert(/onclick="unlock\(\)"/.test(html), 'login button no longer calls unlock()');

  const jsRefs = parseHtmlAssetRefs(html, 'src', 'js');
  const cssRefs = parseHtmlAssetRefs(html, 'href', 'css');
  [...jsRefs, ...cssRefs].forEach(checkFileExists);
  ok(`index.html references ${jsRefs.length} JS and ${cssRefs.length} CSS assets that exist`);

  const inlineScripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]
    .map(match => match[1].trim())
    .filter(Boolean);
  inlineScripts.forEach((source, index) => checkSyntax(`index.html inline script ${index + 1}`, source));
  ok(`index.html inline scripts parse (${inlineScripts.length})`);

  return jsRefs;
}

function checkJavaScript(jsRefs) {
  const files = [...new Set(jsRefs)].filter(path => path.startsWith('assets/js/'));
  files.forEach(path => checkSyntax(path, read(path)));
  ok(`JavaScript assets parse (${files.length})`);
}

function checkAuthSurface() {
  const auth = read('assets/js/auth.js');
  assert(/function unlock\(/.test(auth), 'auth.js missing unlock()');
  assert(/authenticateAtlasProfile/.test(auth), 'auth.js missing profile authentication helper');
  assert(/keydown/.test(auth) && /Enter/.test(auth), 'auth.js missing Enter-key login handler');
  assert(!/Playwright|Selenium|webdriver/i.test(auth), 'browser automation code found in auth.js');
  ok('auth login surface is present');
}

try {
  checkJsonData();

  const jsRefs = checkHtmlAndAssets();
  checkJavaScript(jsRefs);
  checkAuthSurface();

  if (warnings.length) {
    console.log('\nWarnings:');
    warnings.forEach(item => console.log(`WARN ${item}`));
  }

  console.log('\nATLAS lightweight verification passed. Manual browser verification remains final authority.');
} catch (error) {
  fail('verification stopped', error);
}

if (failures.length) {
  console.error('\nFailures:');
  failures.forEach(item => console.error(`FAIL ${item}`));
  process.exitCode = 1;
}
