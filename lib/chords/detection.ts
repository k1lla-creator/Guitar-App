export type ParsedChord = {
  original: string;
  root: string;
  quality: string;
  bassNote?: string;
};

const rootPattern = /^([A-G])(b|#)?/;

export function parseChordSymbol(symbol: string): ParsedChord {
  const normalized = symbol.trim();
  const slashParts = normalized.split('/');
  const base = slashParts[0];
  const bassNote = slashParts.length > 1 ? slashParts[1] : undefined;

  const rootMatch = base.match(rootPattern);
  if (!rootMatch) {
    return { original: symbol, root: normalized, quality: 'major', bassNote };
  }

  const root = `${rootMatch[1]}${rootMatch[2] ?? ''}`;
  const qualityRaw = base.slice(root.length).trim();
  const quality = qualityRaw.length ? qualityRaw : 'major';

  return { original: symbol, root, quality, bassNote };
}

export function rootToDatasetKey(root: string): string {
  const map: Record<string, string> = {
    'C#': 'Csharp',
    Db: 'Csharp',
    'D#': 'Eb',
    'E#': 'F',
    Fb: 'E',
    'F#': 'Fsharp',
    Gb: 'Fsharp',
    'G#': 'Ab',
    'A#': 'Bb',
    Bb: 'Bb',
    B: 'B',
    C: 'C',
    D: 'D',
    E: 'E',
    F: 'F',
    G: 'G',
    Ab: 'Ab',
    A: 'A',
    Eb: 'Eb'
  };

  return map[root] ?? root;
}

export function normalizeQuality(quality: string, bassNote?: string): string {
  const cleaned = quality.replace(/\s+/g, '').toLowerCase();

  const map: Record<string, string> = {
    '': 'major',
    maj: 'major',
    m: 'minor',
    min: 'minor',
    m7: 'm7',
    min7: 'm7',
    maj7: 'maj7',
    ma7: 'maj7',
    sus: 'sus4',
    sus4: 'sus4',
    sus2: 'sus2',
    add9: 'add9',
    '7': '7',
    '9': '9',
    '6': '6',
    '5': '5',
    dim: 'dim',
    dim7: 'dim7',
    aug: 'aug'
  };

  const base = map[cleaned] ?? cleaned;
  if (bassNote) return `${base}/${bassNote}`;
  return base;
}
