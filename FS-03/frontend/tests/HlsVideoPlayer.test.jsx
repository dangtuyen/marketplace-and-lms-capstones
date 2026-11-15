import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import HlsVideoPlayer from '../src/features/courses/HlsVideoPlayer';

vi.mock('hls.js', () => {
  const HlsMock = vi.fn().mockImplementation(() => ({
    loadSource: vi.fn(),
    attachMedia: vi.fn(),
    on: vi.fn(),
    destroy: vi.fn()
  }));
  HlsMock.isSupported = () => true;
  HlsMock.Events = { MANIFEST_PARSED: 'hlsManifestParsed', ERROR: 'hlsError' };
  return { default: HlsMock };
});

describe('HlsVideoPlayer.jsx', () => {
  it('Mounts HTML5 video element for HLS streaming', () => {
    const { container } = render(<HlsVideoPlayer src="http://localhost:5000/uploads/hls/test/index.m3u8" />);
    const videoEl = container.querySelector('video');
    expect(videoEl).toBeTruthy();
  });
});
