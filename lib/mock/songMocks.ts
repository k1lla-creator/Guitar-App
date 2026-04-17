import type { SourceCandidate } from '@/lib/types/song';

export type MockSong = {
  key: string;
  mood: string;
  aliases?: string[];
  candidates: SourceCandidate[];
};

export const mockSongs: MockSong[] = [
  {
    key: 'F# minor (likely)',
    mood: 'Nostalgic, driving, and open-voiced.',
    aliases: ['wonderwall oasis', 'wnderwall oasis', 'wonder wall oasis'],
    candidates: [
      {
        sourceName: 'Ultimate Guitar (Mock)',
        url: 'https://example.com/wonderwall-tabs',
        title: 'Wonderwall Chords',
        songTitle: 'Wonderwall',
        artist: 'Oasis',
        versionLabel: 'Acoustic original key',
        artistMatchConfidence: 0.97,
        extractedText: '[Verse] Em7 G Dsus4 A7sus4 ... [Chorus] Cadd9 Dsus4 Em7 ...'
      },
      {
        sourceName: 'Songsterr (Mock)',
        url: 'https://example.com/wonderwall-live',
        title: 'Wonderwall (Live 1996)',
        songTitle: 'Wonderwall',
        artist: 'Oasis',
        versionLabel: 'Live arrangement',
        artistMatchConfidence: 0.9,
        extractedText: '[Verse] Em7 G Dsus4 A7sus4 ... [Bridge] Cadd9 Dsus4 ...'
      },
      {
        sourceName: 'Community Tabs (Mock)',
        url: 'https://example.com/wonderworld',
        title: 'Wonderworld Chords',
        songTitle: 'Wonderworld',
        artist: 'Oasis Tribute',
        artistMatchConfidence: 0.58,
        extractedText: '[Verse] G D Em C ...'
      }
    ]
  },
  {
    key: 'C major (likely)',
    mood: 'Warm, reassuring, and hymn-like.',
    aliases: ['let it be beatles', 'letitbe the beatles', 'let it bee beatles'],
    candidates: [
      {
        sourceName: 'Chordify (Mock)',
        url: 'https://example.com/let-it-be-chords',
        title: 'Let It Be Chords',
        songTitle: 'Let It Be',
        artist: 'The Beatles',
        versionLabel: 'Album version',
        artistMatchConfidence: 0.95,
        extractedText: '[Verse] C G Am F ... [Chorus] Am G F C ...'
      },
      {
        sourceName: 'Ultimate Guitar (Mock)',
        url: 'https://example.com/let-it-be-piano-acoustic',
        title: 'Let It Be (Acoustic Adaptation)',
        songTitle: 'Let It Be',
        artist: 'The Beatles',
        versionLabel: 'Acoustic adaptation',
        artistMatchConfidence: 0.9,
        extractedText: '[Verse] C G Am F ... [Solo] C Dm G ...'
      },
      {
        sourceName: 'Community Tabs (Mock)',
        url: 'https://example.com/let-her-be',
        title: 'Let Her Be Chords',
        songTitle: 'Let Her Be',
        artist: 'Indie Cover Artist',
        artistMatchConfidence: 0.43,
        extractedText: '[Verse] G Em C D ...'
      }
    ]
  },
  {
    key: 'Unknown / inferred',
    mood: 'Balanced and approachable.',
    aliases: ['default'],
    candidates: [
      {
        sourceName: 'Community Tabs (Mock)',
        url: 'https://example.com/community-tab',
        title: 'User Submitted Chords',
        songTitle: 'Untitled Song',
        artist: 'Unknown',
        versionLabel: 'Crowd-sourced',
        artistMatchConfidence: 0.62,
        extractedText: '[Verse] G D Em C ... [Chorus] C D G Em ...'
      }
    ]
  }
];

export function mockKey(songTitle: string, artistName: string): MockSong {
  const combined = `${songTitle.toLowerCase()} ${artistName.toLowerCase()}`;
  const exact = mockSongs.find((entry) =>
    entry.candidates.some(
      (candidate) =>
        `${candidate.songTitle?.toLowerCase() ?? candidate.title.toLowerCase()} ${candidate.artist.toLowerCase()}` === combined
    )
  );

  if (exact) return exact;

  const aliasMatch = mockSongs.find((entry) => entry.aliases?.some((alias) => alias === combined));
  return aliasMatch ?? mockSongs[mockSongs.length - 1];
}

export function getAllMockCandidates(): SourceCandidate[] {
  return mockSongs.flatMap((song) => song.candidates);
}
