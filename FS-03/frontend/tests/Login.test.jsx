import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../src/features/auth/Login';

describe('src/features/auth/Login.jsx', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('Renders email and password inputs cleanly', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('name@example.com');
    const passInput = screen.getByPlaceholderText('••••••••');

    fireEvent.change(emailInput, { target: { value: 'student@test.com' } });
    fireEvent.change(passInput, { target: { value: '123456' } });

    expect(emailInput.value).toBe('student@test.com');
    expect(passInput.value).toBe('123456');
  });
});
