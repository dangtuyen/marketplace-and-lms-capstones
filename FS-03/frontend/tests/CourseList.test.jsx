import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CourseList from '../src/features/courses/CourseList';

describe('src/features/courses/CourseList.jsx', () => {
  it('Renders paginated course cards from API', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        courses: [{ _id: '1', title: 'Fullstack MERN', description: 'Desc', price: 30 }],
        pagination: { total: 1, page: 1, pages: 1 }
      })
    });
    render(<MemoryRouter><CourseList /></MemoryRouter>);
    await waitFor(() => expect(screen.getByText('Fullstack MERN')).toBeInTheDocument());
  });
});
