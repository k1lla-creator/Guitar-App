import type { ChordShape } from '@/lib/types/song';

const chordLibrary: Record<string, ChordShape> = {
  C: { chord: 'C', frets: ['x', 3, 2, 0, 1, 0], fingers: [null, 3, 2, null, 1, null] },
  G: { chord: 'G', frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, null, null, null, 3] },
  D: { chord: 'D', frets: ['x', 'x', 0, 2, 3, 2], fingers: [null, null, null, 1, 3, 2] },
  Em: { chord: 'Em', frets: [0, 2, 2, 0, 0, 0], fingers: [null, 2, 3, null, null, null] },
  Am: { chord: 'Am', frets: ['x', 0, 2, 2, 1, 0], fingers: [null, null, 2, 3, 1, null] },
  Fmaj7: { chord: 'Fmaj7', frets: ['x', 'x', 3, 2, 1, 0], fingers: [null, null, 3, 2, 1, null] },
  Bm7: { chord: 'Bm7', frets: ['x', 2, 4, 2, 3, 2], fingers: [null, 1, 3, 1, 2, 1] }
};

export class ChordVisualizerAgent {
  run(chords: string[]): ChordShape[] {
    return chords.map((chord) => chordLibrary[chord] ?? { chord, frets: ['x', 'x', 0, 0, 0, 0], fingers: [null, null, null, null, null, null] });
  }
}
