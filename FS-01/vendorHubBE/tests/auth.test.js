const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

describe('FS-01 Backend: Authentication & Role-Based Access Control', () => {
  const customerEmail = `customer_${Date.now()}@nexmall.com`;
  const vendorEmail = `vendor_${Date.now()}@nexmall.com`;

  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nexmall_test');
    }
  });

  it('TC-01: Should register a new Customer account and return a JWT token', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      name: 'Test Customer',
      email: customerEmail,
      password: 'Password123!',
      role: 'customer'
    });
    assert.ok([200, 201].includes(res.status), `Got ${res.status}: ${JSON.stringify(res.body)}`);
    assert.ok(res.body.token, 'Expected JWT token in signup response');
  });

  it('TC-02: Should register a new Vendor account and return a JWT token', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      name: 'Test Vendor',
      email: vendorEmail,
      password: 'Password123!',
      role: 'vendor',
      storeName: 'Tech Gadgets Store'
    });
    assert.ok([200, 201].includes(res.status), `Got ${res.status}: ${JSON.stringify(res.body)}`);
    assert.ok(res.body.token, 'Expected JWT token in vendor signup response');
  });

  it('TC-03: Should authenticate valid user credentials and return a JWT token', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: customerEmail,
      password: 'Password123!'
    });
    assert.equal(res.status, 200);
    assert.ok(res.body.token, 'Expected JWT token on login');
  });

  it('TC-04: Should reject login attempts with an incorrect password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: customerEmail,
      password: 'WrongPassword!'
    });
    assert.ok([400, 401].includes(res.status));
  });
});
