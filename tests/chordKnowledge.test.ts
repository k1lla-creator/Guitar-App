import { afterEach, describe, expect, it, vi } from 'vitest';
import { getChordVoicings } from '@/lib/chords/knowledge';

describe('chord knowledge lookup', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('uses local library first without internet lookup', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch');
    const voicings = await getChordVoicings('G');

    expect(voicings.length).toBeGreaterThan(0);
    expect(voicings[0].source.provider).toContain('Local chord library');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('normalizes internet fallback results when local chord is missing', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        chords: {
          C: [
            {
              suffix: 'major',
              positions: [
                {
                  frets: [-1, 3, 2, 0, 1, 0],
                  fingers: [0, 3, 2, 0, 1, 0],
                  baseFret: 1,
                  barres: []
                }
              ]
            }
          ]
        }
      })
    } as Response);

    const voicings = await getChordVoicings('Cmaj');
    expect(voicings.length).toBeGreaterThan(0);
    expect(voicings[0].frets).toEqual(['x', 3, 2, 0, 1, 0]);
    expect(voicings[0].source.provider).toContain('chords-db');
  });
});
