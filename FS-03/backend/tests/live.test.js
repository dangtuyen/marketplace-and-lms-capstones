import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';

describe('features/live (liveController & liveRoutes)', () => {
  let token = '';
  let courseId = '';

  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lms_test');
    }
    const auth = await request(app).post('/api/auth/register').send({
      name: 'Live Host',
      email: `live_${Date.now()}@test.com`,
      password: 'Password123!',
      role: 'instructor'
    });
    token = auth.body.token;

    const course = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Live Studio Test', description: 'WebRTC', price: 20, isLive: true });
    courseId = course.body._id;
  });

  after(async () => {
  });

  it('Provisions a LiveKit WebRTC access token for a valid course room (200)', async () => {
    const res = await request(app)
      .get(`/api/live/token/${courseId}`)
      .set('Authorization', `Bearer ${token}`);
    assert.equal(res.status, 200);
    assert.ok(res.body.token);
    assert.ok(res.body.serverUrl);
  });
});
