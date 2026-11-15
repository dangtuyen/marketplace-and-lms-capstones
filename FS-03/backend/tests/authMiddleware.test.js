import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../server.js';

describe('middleware/authMiddleware.js', () => {
  it('Rejects requests with missing Authorization header (403)', async () => {
    const res = await request(app).get('/api/revenue/instructor/revenue');
    assert.equal(res.status, 403);
  });

  it('Rejects malformed JWT tokens (403)', async () => {
    const res = await request(app)
      .get('/api/revenue/instructor/revenue')
      .set('Authorization', 'Bearer malformed.token.value');
    assert.equal(res.status, 403);
  });

  it('Blocks student role from instructor-only routes (403)', async () => {
    const token = jwt.sign(
      { _id: '65f1a2b3c4d5e6f7a8b9c0d1', role: 'student' },
      process.env.JWT_SECRET || 'supersecretkey123'
    );
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Blocked Course', price: 20 });
    assert.ok([401, 403].includes(res.status));
  });
});
