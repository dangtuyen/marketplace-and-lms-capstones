import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from '../src/features/auth/Register';

describe('src/features/auth/Register.jsx', () => {
  it('Renders registration form and submit button', () => {
    render(<MemoryRouter><Register /></MemoryRouter>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
