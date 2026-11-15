import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';

describe('features/auth (authController & authRoutes)', () => {
  const email = `auth_${Date.now()}@edustream.com`;

  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lms_test');
    }
  });

  after(async () => {
  });

  it('Registers a new user and returns a JWT token (201)', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Auth Tester',
      email,
      password: 'Password123!',
      role: 'instructor'
    });
    assert.equal(res.status, 201);
    assert.ok(res.body.token);
  });

  it('Logs in an existing user with valid credentials (200)', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email,
      password: 'Password123!'
    });
    assert.equal(res.status, 200);
    assert.ok(res.body.token);
  });

  it('Rejects invalid login password (401)', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email,
      password: 'WrongPassword!'
    });
    assert.equal(res.status, 401);
  });
});
