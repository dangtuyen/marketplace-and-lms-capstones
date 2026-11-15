import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AddLesson from '../src/features/courses/AddLesson';

describe('AddLesson.jsx', () => {
  it('Renders lesson upload form and submit button', () => {
    render(<AddLesson courseId="c1" onLessonAdded={vi.fn()} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
