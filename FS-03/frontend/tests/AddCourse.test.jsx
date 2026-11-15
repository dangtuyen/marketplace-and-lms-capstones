import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AddCourse from '../src/features/courses/AddCourse';

describe('AddCourse.jsx', () => {
  it('Renders course blueprint form and Publish button', () => {
    render(
      <MemoryRouter>
        <AddCourse />
      </MemoryRouter>
    );
    expect(screen.getByText(/Publish Course Blueprint/i)).toBeInTheDocument();
  });
});
