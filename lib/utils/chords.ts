const beginnerMap: Record<string, string> = {
  Bm: 'Bm7',
  F: 'Fmaj7',
  Fm: 'Fm7',
  'A7sus4': 'A7',
  Dsus4: 'D',
  Cadd9: 'C'
};

export function simplifyChord(chord: string): string {
  return beginnerMap[chord] ?? chord;
}

export function simplifyProgression(progression: string[]): string[] {
  return progression.map(simplifyChord);
}
