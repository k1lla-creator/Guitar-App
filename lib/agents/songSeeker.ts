import { getAllMockCandidates, mockKey } from '@/lib/mock/songMocks';
import type { SongSeekerResult, SourceCandidate } from '@/lib/types/song';

export interface SongProvider {
  search(songTitle: string, artistName: string): Promise<SongSeekerResult>;
}

function normalizeForMatch(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function levenshteinDistance(a: string, b: string): number {
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const dp = Array.from({ length: a.length + 1 }, () => Array.from<number>({ length: b.length + 1 }).fill(0));
  for (let i = 0; i <= a.length; i += 1) dp[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) dp[0][j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  return dp[a.length][b.length];
}

function similarity(a: string, b: string): number {
  if (!a && !b) return 1;
  const dist = levenshteinDistance(a, b);
  return Math.max(0, 1 - dist / Math.max(a.length, b.length, 1));
}

function scoreCandidate(inputSong: string, inputArtist: string, candidate: SourceCandidate): { score: number; reason: string } {
  const songTarget = normalizeForMatch(candidate.songTitle ?? candidate.title);
  const artistTarget = normalizeForMatch(candidate.artist);

  const songScore = similarity(inputSong, songTarget);
  const artistScore = similarity(inputArtist, artistTarget);
  const combined = songScore * 0.68 + artistScore * 0.32;

  const hasTypoTolerance = songScore > 0.6 && inputSong !== songTarget;
  const reason =
    combined > 0.92
      ? 'Strong exact-style match for title and artist.'
      : hasTypoTolerance
        ? 'Recovered from likely typo using fuzzy title/artist match.'
        : 'Partial title/artist match from candidate search.';

  return { score: Number(combined.toFixed(3)), reason };
}

function withRanking(songTitle: string, artistName: string, candidates: SourceCandidate[]): SourceCandidate[] {
  const songInput = normalizeForMatch(songTitle);
  const artistInput = normalizeForMatch(artistName);

  return candidates
    .map((candidate) => {
      const ranking = scoreCandidate(songInput, artistInput, candidate);
      return {
        ...candidate,
        confidenceScore: ranking.score,
        matchReason: ranking.reason
      };
    })
    .sort((a, b) => (b.confidenceScore ?? 0) - (a.confidenceScore ?? 0));
}

function confidencePolicy(candidates: SourceCandidate[]): { requiresConfirmation: boolean; ambiguityReason?: string } {
  const top = candidates[0]?.confidenceScore ?? 0;
  const second = candidates[1]?.confidenceScore ?? 0;
  const gap = top - second;

  if (top < 0.86) {
    return {
      requiresConfirmation: true,
      ambiguityReason: 'Top match confidence is moderate, so user confirmation is required.'
    };
  }

  if (second > 0.8 && gap < 0.06) {
    return {
      requiresConfirmation: true,
      ambiguityReason: 'Multiple high-quality matches are very close in score.'
    };
  }

  return { requiresConfirmation: false };
}

export class MockSongProvider implements SongProvider {
  async search(songTitle: string, artistName: string): Promise<SongSeekerResult> {
    const rawCandidates = getAllMockCandidates();
    const ranked = withRanking(songTitle, artistName, rawCandidates).slice(0, 6);

    const fallbackFromKey = mockKey(songTitle, artistName).candidates[0];
    if (ranked.length === 0 && fallbackFromKey) {
      ranked.push({
        ...fallbackFromKey,
        confidenceScore: 0.61,
        matchReason: 'Fallback candidate from mock key mapping.'
      });
    }

    const policy = confidencePolicy(ranked);
    return {
      candidates: ranked,
      chosen: ranked[0],
      requiresConfirmation: policy.requiresConfirmation,
      ambiguityReason: policy.ambiguityReason,
      notes: 'Mock provider with fuzzy ranking, normalization, and typo-tolerant scoring.'
    };
  }
}

export class SongSeekerAgent {
  constructor(private readonly provider: SongProvider = new MockSongProvider()) {}

  async run(songTitle: string, artistName: string): Promise<SongSeekerResult> {
    return this.provider.search(songTitle, artistName);
  }
}
