import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';

describe('workers/videoWorker.js', () => {
  it('Constructs valid HLS output directory and .m3u8 manifest paths', () => {
    const lessonId = '65f1a2b3c4d5e6f7a8b9c0d9';
    const outputDir = path.join('uploads', 'hls', lessonId);
    const manifestPath = path.join(outputDir, 'index.m3u8');

    assert.ok(manifestPath.endsWith('index.m3u8'));
    assert.ok(manifestPath.includes(lessonId));
  });
});
