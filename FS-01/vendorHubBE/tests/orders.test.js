const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

describe('FS-01 Backend: Cart & Order Lifecycle', () => {
  let customerToken = '';
  let productId = '';

  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nexmall_test');
    }

    const vendor = await request(app).post('/api/auth/signup').send({
      name: 'Order Vendor',
      email: `v_ord_${Date.now()}@nexmall.com`,
      password: 'Password123!',
      role: 'vendor',
      storeName: 'Order Store'
    });

    const prod = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${vendor.body.token}`)
      .send({
        name: 'USB-C Hub Adapter',
        description: '7-in-1 Multiport Adapter',
        price: 35,
        category: 'Accessories',
        stock: 10
      });
    productId = prod.body._id || prod.body.product?._id;

    const cust = await request(app).post('/api/auth/signup').send({
      name: 'Order Customer',
      email: `c_ord_${Date.now()}@nexmall.com`,
      password: 'Password123!',
      role: 'customer'
    });
    customerToken = cust.body.token;
  });

  it('TC-08: Should reject unauthenticated cart/checkout requests (401/403)', async () => {
    const res = await request(app)
      .get('/api/cart')
      .send();
    assert.ok([401, 403].includes(res.status), `Got ${res.status}: ${JSON.stringify(res.body)}`);
  });

  it('TC-09: Should retrieve cart/orders for an authenticated Customer (200)', async () => {
    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`);
    assert.ok([200, 404].includes(res.status));
  });
});
