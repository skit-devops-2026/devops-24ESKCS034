const test = require('node:test');
const assert = require('node:assert');
const { validateEmail } = require('../src/jobService.js');

test('Auth Validation - Valid Email Formats', () => {
  assert.strictEqual(validateEmail('user@example.com'), true);
  assert.strictEqual(validateEmail('recruiter.hr@techcorp.co.uk'), true);
  assert.strictEqual(validateEmail('student_24eskcs034@skit.ac.in'), true);
});

test('Auth Validation - Invalid Email Formats', () => {
  assert.strictEqual(validateEmail(''), false);
  assert.strictEqual(validateEmail(null), false);
  assert.strictEqual(validateEmail(undefined), false);
  assert.strictEqual(validateEmail('plainaddress'), false);
  assert.strictEqual(validateEmail('@missingusername.com'), false);
  assert.strictEqual(validateEmail('missingdomain@.com'), false);
  assert.strictEqual(validateEmail('user@domain'), false);
});
