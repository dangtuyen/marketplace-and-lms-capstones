import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import QuizView from '../src/features/quizzes/QuizView';

describe('src/features/quizzes/QuizView.jsx', () => {
  it('Renders fetched assessment questions', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        _id: 'q1',
        questions: [{ _id: '1', questionText: 'Sample Quiz Question?', options: ['A', 'B'] }]
      })
    });
    render(<QuizView courseId="1" />);
    await waitFor(() => expect(screen.getByText(/Sample Quiz Question\?/i)).toBeInTheDocument());
  });
});
