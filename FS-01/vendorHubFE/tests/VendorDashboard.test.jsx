import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import VendorDashboard from '../src/pages/VendorDashboard';

describe('FS-01 Frontend: VendorDashboard Component', () => {
  const mockVendorUser = {
    _id: 'vendor_01',
    name: 'Hoa Son',
    role: 'vendor'
  };

  const mockProducts = [
    {
      _id: 'prod_22',
      name: 'Iphone 22',
      description: 'Iphone 22',
      price: 2000,
      vendorId: 'vendor_01'
    }
  ];

  const mockOrders = [
    {
      _id: 'ord_999',
      customerId: { name: 'Buyer One', email: 'buyer@test.com' },
      status: 'placed',
      items: [
        {
          productId: 'prod_22',
          name: 'Iphone 22',
          price: 2000,
          quantity: 1
        }
      ]
    }
  ];

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('token', 'mock-vendor-jwt');
    jest.clearAllMocks();
  });

  test('TC-24: Renders Gross Store Sales ($2000.00), Net Payout ($1800.00), and customer order rows', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/api/products')) {
        return Promise.resolve({ data: mockProducts });
      }
      if (url.includes('/api/orders')) {
        return Promise.resolve({ data: mockOrders });
      }
      return Promise.resolve({ data: [] });
    });

    render(<VendorDashboard user={mockVendorUser} setPage={jest.fn()} />);

    await waitFor(() => {
      expect(screen.getByText(/Vendor Store Dashboard/i)).toBeInTheDocument();
      expect(screen.getAllByText('$2000.00').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('$1800.00')).toBeInTheDocument();
      expect(screen.getByText('Buyer One')).toBeInTheDocument();
      expect(screen.getAllByText('Iphone 22').length).toBeGreaterThan(0);
    });
  });

  test('TC-25: Dispatches PUT status update when vendor clicks Pack on a placed order', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/api/products')) {
        return Promise.resolve({ data: mockProducts });
      }
      if (url.includes('/api/orders')) {
        return Promise.resolve({ data: mockOrders });
      }
      return Promise.resolve({ data: [] });
    });
    axios.put.mockResolvedValueOnce({ data: { message: 'Order updated' } });

    render(<VendorDashboard user={mockVendorUser} setPage={jest.fn()} />);

    const packButton = await screen.findByRole('button', { name: /^Pack$/i });
    fireEvent.click(packButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining('/api/orders/ord_999/status'),
        { status: 'packed' },
        expect.any(Object)
      );
    });
  });
});
