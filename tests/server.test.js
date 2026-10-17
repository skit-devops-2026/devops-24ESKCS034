const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const server = require('../server.js');

const TEST_PORT = 3456;

test('Server - Health Check & Metrics Endpoints', async (t) => {
  await new Promise((resolve) => server.listen(TEST_PORT, '127.0.0.1', resolve));

  t.after(() => {
    return new Promise((resolve) => server.close(resolve));
  });

  // Test /health endpoint
  await test('GET /health returns 200 and valid JSON', async () => {
    const res = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${TEST_PORT}/health`, (r) => {
        let data = '';
        r.on('data', chunk => data += chunk);
        r.on('end', () => resolve({ statusCode: r.statusCode, data }));
      }).on('error', reject);
    });

    assert.strictEqual(res.statusCode, 200);
    const body = JSON.parse(res.data);
    assert.strictEqual(body.status, 'UP');
    assert.strictEqual(body.service, 'insiderjobs-portal');
    assert.ok(body.uptime >= 0);
  });

  // Test /metrics endpoint
  await test('GET /metrics returns Prometheus text format', async () => {
    const res = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${TEST_PORT}/metrics`, (r) => {
        let data = '';
        r.on('data', chunk => data += chunk);
        r.on('end', () => resolve({ statusCode: r.statusCode, data }));
      }).on('error', reject);
    });

    assert.strictEqual(res.statusCode, 200);
    assert.ok(res.data.includes('insiderjobs_up 1'));
    assert.ok(res.data.includes('http_requests_total'));
    assert.ok(res.data.includes('process_resident_memory_bytes'));
    assert.ok(res.data.includes('insiderjobs_active_listings 6'));
  });

  // Test /api/jobs endpoint
  await test('GET /api/jobs returns paginated job listing', async () => {
    const res = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${TEST_PORT}/api/jobs?query=Cloud`, (r) => {
        let data = '';
        r.on('data', chunk => data += chunk);
        r.on('end', () => resolve({ statusCode: r.statusCode, data }));
      }).on('error', reject);
    });

    assert.strictEqual(res.statusCode, 200);
    const body = JSON.parse(res.data);
    assert.strictEqual(body.totalItems, 1);
    assert.strictEqual(body.items[0].title, 'Cloud Engineer');
  });

  // Test /api/categories endpoint
  await test('GET /api/categories returns category counts', async () => {
    const res = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${TEST_PORT}/api/categories`, (r) => {
        let data = '';
        r.on('data', chunk => data += chunk);
        r.on('end', () => resolve({ statusCode: r.statusCode, data }));
      }).on('error', reject);
    });

    assert.strictEqual(res.statusCode, 200);
    const body = JSON.parse(res.data);
    assert.ok(body.categories.Programming >= 1);
  });

  // Test Static Page /
  await test('GET / returns HTML content', async () => {
    const res = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${TEST_PORT}/`, (r) => {
        let data = '';
        r.on('data', chunk => data += chunk);
        r.on('end', () => resolve({ statusCode: r.statusCode, data }));
      }).on('error', reject);
    });

    assert.strictEqual(res.statusCode, 200);
    assert.ok(res.data.includes('InsiderJobs'));
  });

  // Test 404
  await test('GET /non-existent-page returns 404', async () => {
    const res = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${TEST_PORT}/non-existent-page`, (r) => {
        let data = '';
        r.on('data', chunk => data += chunk);
        r.on('end', () => resolve({ statusCode: r.statusCode, data }));
      }).on('error', reject);
    });

    assert.strictEqual(res.statusCode, 404);
  });
});
