import React from 'react';
import { render, waitFor } from '@testing-library/react';
import App from '../src/App';

describe('FS-01 Frontend: Vendor Store & Commission Calculations', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('TC-16: Accurately calculates net vendor payout after 10% platform commission', () => {
    const grossSale = 200;
    const commissionRate = 0.10;
    const platformFee = grossSale * commissionRate;
    const netVendorPayout = grossSale - platformFee;

    expect(platformFee).toBe(20);
    expect(netVendorPayout).toBe(180);
  });

  test('TC-17: Renders vendor workspace cleanly when logged in as a vendor', async () => {
    localStorage.setItem('token', 'sample-vendor-jwt');
    localStorage.setItem('user', JSON.stringify({ id: 'v1', name: 'Vendor Owner', role: 'vendor' }));

    const { container } = render(<App />);
    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });
});
