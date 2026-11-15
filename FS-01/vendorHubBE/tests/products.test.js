const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

describe('FS-01 Backend: Product Catalog & Vendor Inventory', () => {
  let vendorToken = '';
  let customerToken = '';

  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nexmall_test');
    }

    const vRes = await request(app).post('/api/auth/signup').send({
      name: 'Store Owner',
      email: `v_prod_${Date.now()}@nexmall.com`,
      password: 'Password123!',
      role: 'vendor',
      storeName: 'Owner Electronics'
    });
    vendorToken = vRes.body.token;

    const cRes = await request(app).post('/api/auth/signup').send({
      name: 'Buyer User',
      email: `c_prod_${Date.now()}@nexmall.com`,
      password: 'Password123!',
      role: 'customer'
    });
    customerToken = cRes.body.token;
  });

  it('TC-05: Should allow an authenticated Vendor to create a new product', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${vendorToken}`)
      .send({
        name: 'Mechanical Keyboard RGB',
        description: 'Hot-swappable wireless mechanical keyboard',
        price: 89.99,
        category: 'Electronics',
        stock: 25
      });
    assert.ok([200, 201].includes(res.status), `Got ${res.status}: ${JSON.stringify(res.body)}`);
  });

  it('TC-06: Should block a Customer account from creating products (401/403)', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        name: 'Unauthorized Item',
        price: 10,
        stock: 5
      });
    assert.ok([401, 403].includes(res.status));
  });

  it('TC-07: Should return public product listings for storefront browsing (200)', async () => {
    const res = await request(app).get('/api/products');
    assert.equal(res.status, 200);
    const items = Array.isArray(res.body) ? res.body : res.body.products;
    assert.ok(Array.isArray(items), 'Expected products to be returned as an array');
  });
});
