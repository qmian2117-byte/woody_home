import test from 'node:test';
import assert from 'node:assert/strict';

import { successResponse, errorResponse } from '../src/utils/apiResponse.js';

const createMockResponse = () => ({
  statusCode: null,
  body: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(payload) {
    this.body = payload;
    return this;
  }
});

test('successResponse formats a standard success payload', () => {
  const res = createMockResponse();

  successResponse(res, 'Created', { id: 'abc' }, 201);

  assert.equal(res.statusCode, 201);
  assert.equal(res.body.success, true);
  assert.equal(res.body.message, 'Created');
  assert.deepEqual(res.body.data, { id: 'abc' });
  assert.match(res.body.timestamp, /^\d{4}-\d{2}-\d{2}T/);
});

test('errorResponse formats string and Error objects consistently', () => {
  const stringRes = createMockResponse();
  const errorRes = createMockResponse();

  errorResponse(stringRes, 'Bad request', 'Missing field', 400);
  errorResponse(errorRes, 'Server error', new Error('Database failed'), 500);

  assert.equal(stringRes.statusCode, 400);
  assert.equal(stringRes.body.success, false);
  assert.equal(stringRes.body.error, 'Missing field');

  assert.equal(errorRes.statusCode, 500);
  assert.equal(errorRes.body.success, false);
  assert.equal(errorRes.body.error, 'Database failed');
});
