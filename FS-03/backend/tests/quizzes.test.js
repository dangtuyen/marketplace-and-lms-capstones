import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';

describe('features/quizzes (quizController & quizRoutes)', () => {
  let studentToken = '';
  let courseId = '';
  let quizId = '';
  let questions = [];

  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lms_test');
    }
    const inst = await request(app).post('/api/auth/register').send({
      name: 'Quiz Instructor',
      email: `q_inst_${Date.now()}@test.com`,
      password: 'Password123!',
      role: 'instructor'
    });
    const stu = await request(app).post('/api/auth/register').send({
      name: 'Quiz Student',
      email: `q_stu_${Date.now()}@test.com`,
      password: 'Password123!',
      role: 'student'
    });
    studentToken = stu.body.token;

    const course = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${inst.body.token}`)
      .send({ title: 'Quiz Course', description: 'Assessment test', price: 0 });
    courseId = course.body._id;
  });

  after(async () => {
  });

  it('Auto-provisions sanitized quiz questions without answer keys (200)', async () => {
    const res = await request(app)
      .get(`/api/quizzes/course/${courseId}`)
      .set('Authorization', `Bearer ${studentToken}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.questions[0].correctOptionIndex, undefined);
    quizId = res.body._id;
    questions = res.body.questions;
  });

   it('Grades quiz submission and unlocks A4 PDF certificate download (200)', async () => {
    const answers = questions.map(() => 0);
    const submit = await request(app)
      .post('/api/quizzes/submit')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ quizId, courseId, answers });

    if (submit.status !== 200) {
      console.error('Quiz submit error details:', submit.body);
    }
    assert.equal(submit.status, 200);
    assert.equal(submit.body.passed, true);

    const cert = await request(app)
      .get(`/api/courses/${courseId}/certificate`)
      .set('Authorization', `Bearer ${studentToken}`);
    assert.equal(cert.status, 200);
    assert.equal(cert.headers['content-type'], 'application/pdf');
  });
});
