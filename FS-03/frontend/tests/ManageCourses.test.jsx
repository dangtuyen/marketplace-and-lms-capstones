import { describe, it, expect, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ManageCourses from '../src/features/courses/ManageCourses';

describe('ManageCourses.jsx', () => {
  it('Fetches and renders instructor course listings', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ courses: [], pagination: { total: 0, page: 1, pages: 1 } })
    });
    render(
      <MemoryRouter>
        <ManageCourses />
      </MemoryRouter>
    );
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });
});
