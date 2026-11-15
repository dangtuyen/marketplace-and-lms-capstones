import { describe, it, expect } from 'vitest';
import { API_BASE_URL, LIVEKIT_URL } from '../src/config/api';

describe('src/config/api.js', () => {
  it('Exports valid HTTP(S) API_BASE_URL and WS(S) LIVEKIT_URL', () => {
    expect(API_BASE_URL).toMatch(/^https?:\/\//);
    expect(LIVEKIT_URL).toMatch(/^wss?:\/\//);
  });
});
