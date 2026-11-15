import React from 'react';
import { render } from '@testing-library/react';
import App from '../src/App';

describe('FS-01 Frontend: App Initialization & State Safety', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('TC-10: Should safely initialize App when localStorage contains "undefined"', () => {
    localStorage.setItem('user', 'undefined');
    expect(() => render(<App />)).not.toThrow();
  });

  test('TC-11: Should render the storefront cleanly for unauthenticated visitors', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });
});
