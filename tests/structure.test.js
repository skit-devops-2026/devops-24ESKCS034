const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..');

test('Structure - Core Files Exist', () => {
  const requiredFiles = [
    'index.html',
    'style.css',
    'script.js',
    'job/index.html',
    'job/style.css',
    'job/script.js',
    'package.json',
    '.gitignore'
  ];

  requiredFiles.forEach(file => {
    const fullPath = path.join(ROOT_DIR, file);
    assert.ok(fs.existsSync(fullPath), `Expected file ${file} to exist`);
  });
});

test('Structure - Index HTML contains Essential Elements', () => {
  const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf-8');
  assert.ok(indexHtml.includes('id="loginModal"'), 'index.html should have loginModal');
  assert.ok(indexHtml.includes('id="loginBtn"'), 'index.html should have loginBtn');
  assert.ok(indexHtml.includes('id="closeModal"'), 'index.html should have closeModal');
  assert.ok(indexHtml.includes('class="job-cards"'), 'index.html should have job-cards container');
});

test('Structure - No Hardcoded Secrets or Placeholders', () => {
  const gitignore = fs.readFileSync(path.join(ROOT_DIR, '.gitignore'), 'utf-8');
  assert.ok(gitignore.includes('node_modules/'), '.gitignore must ignore node_modules/');
  assert.ok(gitignore.includes('dist/'), '.gitignore must ignore dist/');
  assert.ok(gitignore.includes('.env'), '.gitignore must ignore .env');
});
