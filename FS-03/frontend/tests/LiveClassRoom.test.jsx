import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import LiveClassRoom from '../src/features/live/LiveClassRoom';

vi.mock('livekit-client', () => ({
  Room: vi.fn().mockImplementation(() => ({
    on: vi.fn(),
    connect: vi.fn().mockResolvedValue(true),
    disconnect: vi.fn(),
    localParticipant: { name: 'Host', setCameraEnabled: vi.fn(), setMicrophoneEnabled: vi.fn(), videoTrackPublications: new Map() }
  })),
  RoomEvent: { TrackSubscribed: 'a', TrackUnsubscribed: 'b', LocalTrackPublished: 'c', DataReceived: 'd' },
  VideoPresets: { h720: { resolution: {} } }
}));

describe('src/features/live/LiveClassRoom.jsx', () => {
  it('Renders Live Classroom Chat Room panel', async () => {
    localStorage.setItem('token', 'a.eyJfaWQiOiIxIiwicm9sZSI6Imluc3RydWN0b3IifQ.b');
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ token: 't', serverUrl: 'ws://localhost:7880' }) });
    render(
      <MemoryRouter initialEntries={['/live/room/1']}>
        <Routes><Route path="/live/room/:courseId" element={<LiveClassRoom />} /></Routes>
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByText(/Live Classroom Chat Room/i)).toBeInTheDocument());
  });
});
