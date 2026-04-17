import { describe, expect, it } from 'vitest';
import { SongSeekerAgent } from '@/lib/agents/songSeeker';
import { TabTranslatorAgent } from '@/lib/agents/tabTranslator';

describe('agent outputs', () => {
  it('returns ranked source candidates from provider', async () => {
    const seeker = new SongSeekerAgent();
    const result = await seeker.run('Wonderwall', 'Oasis');
    expect(result.chosen?.artist).toBe('Oasis');
    expect(result.candidates.length).toBeGreaterThan(0);
    expect((result.candidates[0].confidenceScore ?? 0)).toBeGreaterThanOrEqual(result.candidates[1].confidenceScore ?? 0);
  });

  it('handles misspelled search queries with fuzzy matching', async () => {
    const seeker = new SongSeekerAgent();
    const result = await seeker.run('Wnderwall', 'Oaisis');
    expect(result.candidates[0].songTitle).toBe('Wonderwall');
    expect(result.candidates[0].confidenceScore).toBeGreaterThan(0.6);
  });

  it('parses fallback tab translation with no key', async () => {
    const translator = new TabTranslatorAgent();
    const output = await translator.run('[Verse] G D Em C');
    expect(output.uniqueChords).toContain('G');
    expect(output.sections.length).toBeGreaterThan(0);
  });
});
