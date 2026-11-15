import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RevenueDashboard from '../src/features/courses/RevenueDashboard';

describe('RevenueDashboard.jsx', () => {
  it('Renders wallet summary, bar chart, and paginated ledger counter', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        summary: { currentBalance: 100, lifetimeEarnings: 100, totalSalesCount: 2 },
        transactions: [],
        pagination: { total: 2, page: 1, limit: 10, pages: 1 },
        chartData: []
      })
    });
    render(
      <MemoryRouter>
        <RevenueDashboard />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByText(/Showing 0 of 2 records/i)).toBeInTheDocument());
  });
});
