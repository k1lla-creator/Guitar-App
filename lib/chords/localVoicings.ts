import type { ChordVoicing } from '@/lib/types/song';

const localSource = {
  provider: 'Local chord library',
  url: 'local://chord-library'
};

export const localChordVoicingLibrary: Record<string, ChordVoicing[]> = {
  C: [
    { chord: 'C', label: 'Open C major', frets: ['x', 3, 2, 0, 1, 0], fingers: [null, 3, 2, null, 1, null], difficulty: 'easy', neckPosition: 'Open position', styleTags: ['pop', 'folk', 'acoustic'], source: localSource },
    { chord: 'C', label: 'A-shape barre', frets: ['x', 3, 5, 5, 5, 3], fingers: [null, 1, 3, 4, 2, 1], difficulty: 'hard', neckPosition: '3rd fret', styleTags: ['rock', 'soul'], baseFret: 3, source: localSource }
  ],
  G: [
    { chord: 'G', label: 'Open G major', frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, null, null, null, 3], difficulty: 'easy', neckPosition: 'Open position', styleTags: ['pop', 'folk', 'acoustic'], source: localSource },
    { chord: 'G', label: 'E-shape barre', frets: [3, 5, 5, 4, 3, 3], fingers: [1, 3, 4, 2, 1, 1], difficulty: 'hard', neckPosition: '3rd fret', styleTags: ['rock'], baseFret: 3, source: localSource }
  ],
  D: [
    { chord: 'D', label: 'Open D major', frets: ['x', 'x', 0, 2, 3, 2], fingers: [null, null, null, 1, 3, 2], difficulty: 'easy', neckPosition: 'Open position', styleTags: ['pop', 'folk'], source: localSource },
    { chord: 'D', label: 'A-shape barre', frets: ['x', 5, 7, 7, 7, 5], fingers: [null, 1, 3, 4, 2, 1], difficulty: 'hard', neckPosition: '5th fret', styleTags: ['rock'], baseFret: 5, source: localSource }
  ],
  Em: [
    { chord: 'Em', label: 'Open Em', frets: [0, 2, 2, 0, 0, 0], fingers: [null, 2, 3, null, null, null], difficulty: 'easy', neckPosition: 'Open position', styleTags: ['pop', 'folk', 'ambient'], source: localSource },
    { chord: 'Em', label: '7th-fret voicing', frets: ['x', 7, 9, 9, 8, 7], fingers: [null, 1, 3, 4, 2, 1], difficulty: 'hard', neckPosition: '7th fret', styleTags: ['soul', 'jazz'], baseFret: 7, source: localSource }
  ],
  Am: [
    { chord: 'Am', label: 'Open Am', frets: ['x', 0, 2, 2, 1, 0], fingers: [null, null, 2, 3, 1, null], difficulty: 'easy', neckPosition: 'Open position', styleTags: ['pop', 'folk', 'ballad'], source: localSource },
    { chord: 'Am', label: 'E-shape barre', frets: [5, 7, 7, 5, 5, 5], fingers: [1, 3, 4, 1, 1, 1], difficulty: 'hard', neckPosition: '5th fret', styleTags: ['rock', 'soul'], baseFret: 5, source: localSource }
  ],
  A: [
    { chord: 'A', label: 'Open A major', frets: ['x', 0, 2, 2, 2, 0], fingers: [null, null, 1, 2, 3, null], difficulty: 'easy', neckPosition: 'Open position', styleTags: ['pop', 'country'], source: localSource }
  ],
  E: [
    { chord: 'E', label: 'Open E major', frets: [0, 2, 2, 1, 0, 0], fingers: [null, 2, 3, 1, null, null], difficulty: 'easy', neckPosition: 'Open position', styleTags: ['blues', 'rock', 'folk'], source: localSource }
  ],
  F: [
    { chord: 'F', label: 'Easy Fmaj7', frets: ['x', 'x', 3, 2, 1, 0], fingers: [null, null, 3, 2, 1, null], difficulty: 'easy', neckPosition: 'Open position', styleTags: ['ballad', 'acoustic'], source: localSource },
    { chord: 'F', label: 'Full barre F', frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], difficulty: 'hard', neckPosition: '1st fret', styleTags: ['rock', 'soul'], baseFret: 1, source: localSource }
  ],
  Fmaj7: [
    { chord: 'Fmaj7', label: 'Open Fmaj7', frets: ['x', 'x', 3, 2, 1, 0], fingers: [null, null, 3, 2, 1, null], difficulty: 'easy', neckPosition: 'Open position', styleTags: ['ballad'], source: localSource }
  ],
  Bm7: [
    { chord: 'Bm7', label: 'Bm7 barre', frets: ['x', 2, 4, 2, 3, 2], fingers: [null, 1, 3, 1, 2, 1], difficulty: 'medium', neckPosition: '2nd fret', styleTags: ['pop', 'soul'], baseFret: 2, source: localSource }
  ]
};
