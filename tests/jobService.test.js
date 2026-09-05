const test = require('node:test');
const assert = require('node:assert');
const { DEFAULT_JOBS, filterJobs, paginate, validateJobPost } = require('../src/jobService.js');

test('Job Service - Dataset Integrity', () => {
  assert.ok(Array.isArray(DEFAULT_JOBS), 'DEFAULT_JOBS should be an array');
  assert.strictEqual(DEFAULT_JOBS.length, 6, 'Should contain 6 initial jobs');
  DEFAULT_JOBS.forEach(job => {
    assert.ok(job.id, 'Job should have an id');
    assert.ok(job.title, 'Job should have a title');
    assert.ok(job.company, 'Job should have a company');
    assert.ok(job.location, 'Job should have a location');
  });
});

test('Job Service - Filter by Search Query', () => {
  const cloudResults = filterJobs(DEFAULT_JOBS, { query: 'cloud' });
  assert.strictEqual(cloudResults.length, 1);
  assert.strictEqual(cloudResults[0].title, 'Cloud Engineer');

  const emptyResults = filterJobs(DEFAULT_JOBS, { query: 'nonexistent-xyz-role' });
  assert.strictEqual(emptyResults.length, 0);
});

test('Job Service - Filter by Category and Location', () => {
  const categoryResults = filterJobs(DEFAULT_JOBS, { categories: ['Management'] });
  assert.strictEqual(categoryResults.length, 2);

  const locationResults = filterJobs(DEFAULT_JOBS, { locations: ['Hyderabad'] });
  assert.strictEqual(locationResults.length, 1);
  assert.strictEqual(locationResults[0].location, 'Hyderabad');

  const combined = filterJobs(DEFAULT_JOBS, {
    categories: ['Programming'],
    locations: ['Texas']
  });
  assert.strictEqual(combined.length, 1);
  assert.strictEqual(combined[0].title, 'Software Tester');
});

test('Job Service - Pagination Functionality', () => {
  const page1 = paginate(DEFAULT_JOBS, 1, 2);
  assert.strictEqual(page1.items.length, 2);
  assert.strictEqual(page1.totalPages, 3);
  assert.strictEqual(page1.currentPage, 1);
  assert.strictEqual(page1.totalItems, 6);

  const page2 = paginate(DEFAULT_JOBS, 2, 2);
  assert.strictEqual(page2.items.length, 2);
  assert.strictEqual(page2.currentPage, 2);
  assert.notStrictEqual(page1.items[0].id, page2.items[0].id);
});

test('Job Service - Job Posting Validation', () => {
  const validJob = {
    title: 'DevOps Engineer',
    company: 'Acme Corp',
    location: 'Remote',
    category: 'Networking',
    description: 'Lead automated CI/CD pipeline deployments and Kubernetes infrastructure.'
  };

  const validResult = validateJobPost(validJob);
  assert.strictEqual(validResult.valid, true);
  assert.strictEqual(validResult.errors.length, 0);

  const invalidJob = {
    title: '',
    company: '',
    location: '',
    category: '',
    description: 'too short'
  };
  const invalidResult = validateJobPost(invalidJob);
  assert.strictEqual(invalidResult.valid, false);
  assert.ok(invalidResult.errors.length >= 4);
});
