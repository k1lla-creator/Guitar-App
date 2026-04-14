import type { SourceCandidate } from '@/lib/types/song';

export type MockSong = {
  key: string;
  mood: string;
  candidates: SourceCandidate[];
};

export const mockSongs: Record<string, MockSong> = {
  'wonderwall::oasis': {
    key: 'F# minor (likely)',
    mood: 'Nostalgic, driving, and open-voiced.',
    candidates: [
      {
        sourceName: 'Ultimate Guitar (Mock)',
        url: 'https://example.com/wonderwall-tabs',
        title: 'Wonderwall Chords',
        artist: 'Oasis',
        artistMatchConfidence: 0.97,
        extractedText:
          '[Verse] Em7 G Dsus4 A7sus4 ... [Chorus] Cadd9 Dsus4 Em7 ...'
      }
    ]
  },
  'let it be::the beatles': {
    key: 'C major (likely)',
    mood: 'Warm, reassuring, and hymn-like.',
    candidates: [
      {
        sourceName: 'Chordify (Mock)',
        url: 'https://example.com/let-it-be-chords',
        title: 'Let It Be Chords',
        artist: 'The Beatles',
        artistMatchConfidence: 0.95,
        extractedText: '[Verse] C G Am F ... [Chorus] Am G F C ...'
      }
    ]
  },
  default: {
    key: 'Unknown / inferred',
    mood: 'Balanced and approachable.',
    candidates: [
      {
        sourceName: 'Community Tabs (Mock)',
        url: 'https://example.com/community-tab',
        title: 'User Submitted Chords',
        artist: 'Unknown',
        artistMatchConfidence: 0.62,
        extractedText: '[Verse] G D Em C ... [Chorus] C D G Em ...'
      }
    ]
  }
};

export function mockKey(songTitle: string, artistName: string): MockSong {
  const key = `${songTitle.toLowerCase()}::${artistName.toLowerCase()}`;
  return mockSongs[key] ?? mockSongs.default;
}
