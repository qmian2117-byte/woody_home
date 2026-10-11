import test from 'node:test';
import assert from 'node:assert/strict';
import { generateToken } from '../src/middleware/authMiddleware.js';
import jwt from 'jsonwebtoken';

test('generateToken creates a valid verifiable JWT with user claims', () => {
  const user = {
    id: 'user-123-uuid',
    email: 'customer@woodyhome.pk',
    role: 'customer',
    full_name: 'Ahmed Khan'
  };

  const token = generateToken(user);
  assert.ok(token);

  const decoded = jwt.decode(token);
  assert.equal(decoded.id, 'user-123-uuid');
  assert.equal(decoded.email, 'customer@woodyhome.pk');
  assert.equal(decoded.role, 'customer');
  assert.equal(decoded.full_name, 'Ahmed Khan');
});
