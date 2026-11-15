import '@testing-library/jest-dom';
import { vi } from 'vitest';

// 1. Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, writable: true });

// 2. Mock global fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

// 3. Mock useNotification được export từ src/App.jsx
vi.mock('../src/App', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNotification: () => ({
      showNotification: vi.fn(),
    }),
  };
});
