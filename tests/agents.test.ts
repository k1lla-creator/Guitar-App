import { describe, expect, it } from 'vitest';
import { SongSeekerAgent } from '@/lib/agents/songSeeker';
import { TabTranslatorAgent } from '@/lib/agents/tabTranslator';

describe('agent outputs', () => {
  it('returns song source candidates from provider', async () => {
    const seeker = new SongSeekerAgent();
    const result = await seeker.run('Wonderwall', 'Oasis');
    expect(result.chosen.artist).toBe('Oasis');
    expect(result.candidates.length).toBeGreaterThan(0);
  });

  it('parses fallback tab translation with no key', async () => {
    const translator = new TabTranslatorAgent();
    const output = await translator.run('[Verse] G D Em C');
    expect(output.uniqueChords).toContain('G');
    expect(output.sections.length).toBeGreaterThan(0);
  });
});
