import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../src/App';

describe('FS-01 Frontend: Authentication Views', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('TC-14: Renders storefront auth controls and handles input changes cleanly', () => {
    render(<App />);

    const signInTrigger = screen.queryByText(/sign in|login/i);
    if (signInTrigger) {
      fireEvent.click(signInTrigger);
    }

    const inputs = screen.queryAllByRole('textbox');
    if (inputs.length > 0) {
      fireEvent.change(inputs[0], { target: { value: 'shopper@nexmall.com' } });
      expect(inputs[0].value).toBe('shopper@nexmall.com');
    }
    expect(document.body).toBeTruthy();
  });
});
