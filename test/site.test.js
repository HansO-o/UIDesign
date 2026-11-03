import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const html = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');
const js = await readFile(new URL('../public/main.js', import.meta.url), 'utf8');
test('static page has landmarks, named groups and linked assets', () => {
  for (const pattern of [/<main\b/, /<nav\b/, /role="radiogroup" aria-label="展示方式"/, /<fieldset/, /<legend/, /styles\.css/, /main\.js/]) assert.match(html, pattern);
  assert.equal((html.match(/role="radio"/g) || []).length, 3);
});
test('segment handles pointer cancellation and keyboard selection', () => {
  for (const pattern of [/pointerdown/, /pointermove/, /pointerup/, /pointercancel/, /ArrowRight/, /ArrowLeft/, /Home/, /End/, /setPointerCapture/]) assert.match(js, pattern);
});
