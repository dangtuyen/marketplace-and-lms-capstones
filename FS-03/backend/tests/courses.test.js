import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';

describe('features/courses (courseController & courseRoutes)', () => {
  let token = '';
  let courseId = '';

  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lms_test');
    }
    const res = await request(app).post('/api/auth/register').send({
      name: 'Instructor Course',
      email: `course_inst_${Date.now()}@test.com`,
      password: 'Password123!',
      role: 'instructor'
    });
    token = res.body.token;
  });

  after(async () => {
  });

  it('Creates a new course blueprint (201)', async () => {
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'HLS Streaming Architecture', description: 'FFmpeg & BullMQ', price: 45, isLive: true });
    assert.equal(res.status, 201);
    courseId = res.body._id;
  });

  it('Returns paginated public courses (200)', async () => {
    const res = await request(app).get('/api/courses?page=1&limit=6');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.courses));
  });

  it('Locks course access (isEnrolled: false) for unauthenticated guests', async () => {
    const res = await request(app).get(`/api/courses/${courseId}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.isEnrolled, false);
  });

  it('Updates course metadata (200)', async () => {
    const res = await request(app)
      .put(`/api/courses/${courseId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 60 });
    assert.equal(res.status, 200);
    assert.equal(res.body.price, 60);
  });
});
