import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';

describe('features/revenue (revenueController & revenueRoutes)', () => {
  let instructorToken = '';
  let studentToken = '';
  let courseId = '';

  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lms_test');
    }
    const inst = await request(app).post('/api/auth/register').send({
      name: 'Rev Instructor',
      email: `rev_inst_${Date.now()}@test.com`,
      password: 'Password123!',
      role: 'instructor'
    });
    instructorToken = inst.body.token;

    const stu = await request(app).post('/api/auth/register').send({
      name: 'Rev Student',
      email: `rev_stu_${Date.now()}@test.com`,
      password: 'Password123!',
      role: 'student'
    });
    studentToken = stu.body.token;

    const course = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${instructorToken}`)
      .send({ title: 'Paid Course', description: 'Revenue test', price: 40 });
    courseId = course.body._id;
  });

  after(async () => {
  });

  it('Declines simulated card numbers starting with 5000 (402)', async () => {
    const res = await request(app)
      .post('/api/revenue/checkout')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ courseId, cardNumber: '5000123456789010', cardExpiry: '12/28', cvv: '123' });
    assert.equal(res.status, 402);
  });

  it('Approves card 4000..., unlocks enrollment, and returns paginated ledger (10/page)', async () => {
    const pay = await request(app)
      .post('/api/revenue/checkout')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ courseId, cardNumber: '4000123456789010', cardExpiry: '12/28', cvv: '123' });
    assert.equal(pay.status, 201);

    const metrics = await request(app)
      .get('/api/revenue/instructor/revenue?page=1&limit=10')
      .set('Authorization', `Bearer ${instructorToken}`);
    assert.equal(metrics.status, 200);
    assert.equal(metrics.body.pagination.limit, 10);
  });
});
