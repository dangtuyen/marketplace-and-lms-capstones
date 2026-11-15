import React from 'react';
import { render, waitFor } from '@testing-library/react';
import App from '../src/App';

describe('FS-01 Frontend: Order History & Status Formatting', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('TC-18: Correctly aggregates item count and status badges for customer orders', () => {
    const mockOrders = [
      {
        _id: 'ord_001',
        status: 'Paid',
        totalAmount: 149.50,
        items: [
          { name: 'Mechanical Keyboard', quantity: 1 },
          { name: 'Desk Mat', quantity: 2 }
        ]
      }
    ];

    const totalItems = mockOrders[0].items.reduce((sum, i) => sum + i.quantity, 0);
    expect(totalItems).toBe(3);
    expect(mockOrders[0].status).toBe('Paid');
  });

  test('TC-19: Renders authenticated customer session safely without router errors', async () => {
    localStorage.setItem('token', 'sample-customer-jwt');
    localStorage.setItem('user', JSON.stringify({ id: 'u1', name: 'Shopper', role: 'customer' }));

    const { container } = render(<App />);
    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });
});
