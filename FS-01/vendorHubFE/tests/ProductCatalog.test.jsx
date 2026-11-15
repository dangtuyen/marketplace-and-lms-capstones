import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from '../src/App';

describe('FS-01 Frontend: Storefront Product Catalog', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('TC-15: Fetches and displays products on the storefront homepage', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          _id: 'prod_101',
          name: 'UltraWide Gaming Monitor',
          description: '34-inch curved IPS display',
          price: 399.99,
          category: 'Electronics',
          stock: 12
        }
      ]
    });

    render(<App />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
      expect(screen.getByText(/UltraWide Gaming Monitor/i)).toBeInTheDocument();
    });
  });
});
