import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CourseDetail from '../src/features/courses/CourseDetails';

describe('src/features/courses/CourseDetail.jsx', () => {
  it('Locks video theater and displays Sign In button for unauthenticated guests', async () => {
    localStorage.clear();
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ _id: '1', title: 'Locked Course', price: 50, isEnrolled: false, lessons: [] })
    });
    render(
      <MemoryRouter initialEntries={['/courses/1']}>
        <Routes><Route path="/courses/:id" element={<CourseDetail />} /></Routes>
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByText(/Sign In to Unlock Course/i)).toBeInTheDocument());
  });
});
