import { describe, expect, it } from 'vitest';
import { analyzeSong } from '@/lib/orchestrator/analyzeSong';

describe('mocked end-to-end song analysis flow', () => {
  it('runs full orchestrator and returns unified result', async () => {
    const result = await analyzeSong({
      songTitle: 'Let It Be',
      artistName: 'The Beatles',
      simplifyForBeginners: true
    });

    expect(result.source.sourceName).toContain('Mock');
    expect(result.tab.uniqueChords.length).toBeGreaterThan(0);
    expect(result.chordShapes.length).toBe(result.tab.uniqueChords.length);
    expect(result.theory.likelyKey.length).toBeGreaterThan(0);
  });
});
