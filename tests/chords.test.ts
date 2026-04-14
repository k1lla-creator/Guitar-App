import { describe, expect, it } from 'vitest';
import { simplifyChord, simplifyProgression } from '@/lib/utils/chords';

describe('chord simplification', () => {
  it('simplifies mapped advanced chords', () => {
    expect(simplifyChord('Cadd9')).toBe('C');
    expect(simplifyChord('Bm')).toBe('Bm7');
  });

  it('keeps unknown chords unchanged', () => {
    expect(simplifyChord('E')).toBe('E');
  });

  it('simplifies full progressions', () => {
    expect(simplifyProgression(['Cadd9', 'Dsus4', 'Em'])).toEqual(['C', 'D', 'Em']);
  });
});
